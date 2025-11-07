const User = require("../models/user.model");
const { sendForgotPasswordCode } = require("../middlewares/email.config");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
 async function signupStep1Service({  email, password }) {
  console.log("Signup Step 1 Service Called");

  // check if user already exists
  const existing = await User.findOne({ email });
  if (existing) throw new Error("User already exists");

  // hash password
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  // create initial user
  const user = new User({
    email,
    password: hashedPassword,
  });

  await user.save();
  return user;
}
 

async function signupStep2Service({ fullName, email, country, dob, mobileNumber }) {
  console.log("Signup Step 2 Service Called");
  console.log(`email: ${email}`);

  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found. Complete Step 1 first.");

  // update fields only if provided
  if (fullName) user.fullName = fullName;
  if (country) user.country = country;
  if (dob) user.dob = dob;
  if (mobileNumber) user.mobileNumber = mobileNumber;

  await user.save();

  // remove sensitive info before sending response
  const safeUser = user.toObject();
  delete safeUser.password;

  return safeUser;
}




async function loginService({ email, password }) {
  console.log("Login Service Called with email:", email);

  try {
    console.log("Looking for user with email:", email);
    const user = await User.findOne({ email });
    console.log("User found in DB:", user);
    if (!user) {
      return { success: false, message: "Invalid credentials" };
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return { success: false, message: "Invalid credentials" };
    }

    const payload = { id: user._id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

    return {
      success: true,
      message: "User logged in",
      token, 
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    };
  } catch (err) {
    console.error("Login Service Error:", err);
    return { success: false, message: "Internal server error" };
  }
}


async function forgotPasswordService({ email }) {
  const emailStr = typeof email === "string" ? email : email.email;

  console.log("Forgot Password Service CalleD for email:", emailStr);

  const user = await User.findOne({ email: emailStr });
  if (!user) {
    throw new Error("User not found");
  }

  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  user.resetPasswordCode = resetCode;
  user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
  await user.save();

  try {
    await sendForgotPasswordCode(emailStr, resetCode);
    return { message: "Password reset code sent to email" };
  } catch (err) {
    console.error("Error sending verification code:", err);
    throw new Error("Failed to send reset email");
  }
}

async function sendVerificationEmailService({ email }) {
  const emailStr = typeof email === "string" ? email : email.email;

  console.log("Send Verification Email Service called for email:", emailStr);

  const user = await User.findOne({ email: emailStr });
  if (!user) {
    throw new Error("User not found");
  }

  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString();

  user.resetPasswordCode = verificationCode;
  user.resetPasswordExpires = Date.now() + 10 * 60 * 1000;

  await user.save();

  return { message: "Verification code generated", code: verificationCode };
}

async function verifyEmailCodeService({ email, code }) {
  const emailStr = typeof email === "string" ? email : email.email;

  console.log("Verify Email Code Service called for email:", emailStr);

  const user = await User.findOne({ email: emailStr });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  if (!user.resetPasswordCode) {
    return { success: false, message: "No verification code found. Please request a new one." };
  }

  if (user.resetPasswordExpires < Date.now()) {
    return { success: false, message: "Verification code has expired. Please request a new one" };
  }

  if (user.resetPasswordCode !== code) {
    return { success: false, message: "Invalid verification code." };
  }

  user.isVerified = true;
  user.resetPasswordCode = null;
  user.resetPasswordExpires = null;
  await user.save();

  return { success: true, message: "Email verified successfully" };
}

async function resetPasswordService({ email, newPassword }) {
  console.log("Reset Password Service called for email:", email);
  const emailStr = typeof email === "string" ? email : email.email;

  const user = await User.findOne({ email: emailStr });
  if (!user) {
    return { success: false, message: "User not found" };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  user.password = hashedPassword;

  await user.save();

  return { message: "Password updated successfully" };
}

async function getAll() {
  try {
    console.log("Get All Users Service Called");

    // Exclude password and reset codes for security
    const users = await User.find({}, { password: 0, resetPasswordCode: 0, resetPasswordExpires: 0 });

    return {
      success: true,
      message: "Users fetched successfully",
      users,
    };
  } catch (err) {
    console.error("Get All Users Service Error:", err);
    return { success: false, message: "Internal server error" };
  }
}

async function getAllService() {
  try {
    console.log("Get All Users Service Called");

    const users = await User.find({}, "fullName email country mobileNumber");

    return {
      success: true,
      message: "Users fetched successfully",
      users,
    };
  } catch (err) {
    console.error("Get All Users Service Error:", err);
    return { success: false, message: "Internal server error" };
  }
}


module.exports = {
  signupStep1Service,
  signupStep2Service,
  loginService,
  forgotPasswordService,
  sendVerificationEmailService,
  verifyEmailCodeService,
  resetPasswordService,
  getAllService,
};
