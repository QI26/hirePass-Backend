const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, 
  auth: {
    user: "qadrshah26@gmail.com",
    pass: "wubt ltse gjzw uzhj", 
  },
});

async function sendForgotPasswordCode(toEmail, code) {
  try {
    const info = await transporter.sendMail({
      from: `"HirePass Support" <${transporter.options.auth.user}>`,
      to: toEmail,
      subject: "HirePass Password Reset Code",
      text: `We received a request to reset your password. Your verification code is: ${code}. This code will expire in 15 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; font-size: 16px; line-height: 1.5;">
          <p>Hello 👋,</p>
          <p>We received a request to reset your <strong>HirePass</strong> account password.</p>
          <p>Please use the verification code below to proceed:</p>
          <h2 style="background: #f9f9f9; padding: 12px; width: fit-content; border-radius: 5px; border: 1px solid #ddd;">
            ${code}
          </h2>
          <p>This code will expire in <strong>15 minutes</strong>.</p>
          <p>If you did not request a password reset, you can safely ignore this email.</p>
          <br/>
          <p>— The HirePass Team</p>
        </div>
      `,
    });

    console.log("Password reset email sent: %s", info.messageId);
    return true;
  } catch (err) {
    console.error("Email sending error:", err);
    throw new Error("Failed to send password reset code.");
  }
}

module.exports = {
  sendForgotPasswordCode,
};
