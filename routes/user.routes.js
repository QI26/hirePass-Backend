const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const {
  signupStep1,
  signupStep2,
  login,
  forgotPassword,
  verifyEmail,
  verifyEmailCode,
  resetPassword,
  getAll
} = require("../controllers/user.controller");
const {  signupStep1ValidationSchema, loginValidationSchema , forgotPasswordValidationSchema} = require("../validators/auth.validator");
const validate = require("../middlewares/validate.middleware");

router.post("/signup-step1", validate(signupStep1ValidationSchema), signupStep1);
router.post("/signup-step2", signupStep2);


router.post("/login", validate(loginValidationSchema), login);
router.get("/getAll",getAll);
router.post("/forgot-password",validate(forgotPasswordValidationSchema), forgotPassword);
router.post("/verify-email", verifyEmail);
router.post("/verify-email-code", verifyEmailCode);
router.post("/reset-password", resetPassword);
router.post("/protected-route", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

module.exports = router;
