const {
  signupStep1Service,
  signupStep2Service,
  loginService,
  forgotPasswordService,
  sendVerificationEmailService,
  verifyEmailCodeService,
  resetPasswordService,
  getAllService,
} = require("../services/user.services");

// Step 1 Controller
async function signupStep1(req, res) {
  try {
    const {  email, password } = req.body;

    // Call Step1 service
    const step1Result = await signupStep1Service({  email, password });

    res.status(200).json({
      success: true,
      message: "Step 1 completed successfully. Proceed to Step 2.",
      userId: step1Result._id, // return temp userId to continue signup
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
}


async function signupStep2(req, res) {
  try {
    console.log("Signup Step 2 Controller Called:", req.body);

    const response = await signupStep2Service(req.body);

    res.status(200).json({
      success: true,
      message: "Step 2 completed successfully",
      user: response,
    });
  } catch (error) {
    console.error("Signup Step 2 Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}




async function login(req, res) {
  try {
    const result = await loginService(req.body);

    // If login failed
    if (!result.success) {
      return res.status(401).json(result); // 401 Unauthorized
    }

    // Login successful
    return res.status(200).json(result); // 200 OK
  } catch (err) {
    console.error("Login controller error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
}

async function forgotPassword(req, res) {
  try {
    const result = await forgotPasswordService(req.body);
    res.json({ success: true, message: result.message });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}


async function verifyEmail(req, res) {
  try {
    const result = await sendVerificationEmailService(req.body);
    res.json({ message: result });
  } catch (err) {
    res.json({ error: err.message });
  }
}

async function verifyEmailCode(req, res) {
  try {
    const result = await verifyEmailCodeService(req.body);
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function resetPassword(req, res) {
  try {
    const result = await resetPasswordService(req.body);
    res.json(result );
  } catch (err) { 
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

async function getAll(req,res){
  try{
    const result = await getAllService(req.body);
    res.json(result );
  } catch (err) { 
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

module.exports = {
  signupStep1,
  signupStep2,
  login,
  verifyEmail,
  forgotPassword,
  verifyEmailCode,
  resetPassword,
  getAll
};
