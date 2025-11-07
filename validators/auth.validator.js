const Joi = require("joi");

const signupStep1ValidationSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.empty": "Email is required",
    "string.email": "Invalid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password is required",
    "string.min": "Password must be at least 6 characters",
  }),
});

// const signupStep2ValidationSchema = Joi.object({
//   fullName: Joi.string().min(3).max(50).required().messages({
//     "string.empty": "Full name is required",
//     "string.min": "Full name must be at least 3 characters",
//   }),
//   country: Joi.string().required().messages({
//     "string.empty": "Country is required",
//   }),
//   dob: Joi.date().required().messages({
//     "date.base": "Date of birth must be a valid date",
//     "any.required": "Date of birth is required",
//   }),
//   mobileNumber: Joi.string().required().messages({
//     "string.empty": "Mobile number is required",
//   }),
// });



const loginValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const forgotPasswordValidationSchema = Joi.object({
    email: Joi.string().email().required()
  });
module.exports = {  signupStep1ValidationSchema, loginValidationSchema , forgotPasswordValidationSchema };
