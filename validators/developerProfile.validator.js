const Joi = require("joi");

const developerProfileValidationSchema = Joi.object({
  // developerLevel: Joi.string().messages({
  //   "string.empty": "Developer level is required",
  // }),
  // profilePicture: Joi.string().optional(),
  // bio: Joi.string().optional(),
  // bestFitRoles: Joi.array().items(Joi.string()).optional(),
  // preferredRoles: Joi.array().items(Joi.string()).messages({
  //   "array.base": "Preferred roles must be an array",
  //   "any.required": "At least one preferred role is required",
  // }),
  // techStack: Joi.object().optional(),
  // salaryInfo: Joi.object({
  //   minHourlyRate: Joi.number().min(0),
  //   minMonthlyRate: Joi.number().min(0),
  // }),
  // links: Joi.object({
  //   github: Joi.string().uri().optional(),
  //   other: Joi.string().uri().optional(),
  // }).optional(),
  // resume: Joi.string().optional(),
  // lastCompletedStep: Joi.number().min(0).optional(),
});

module.exports = { developerProfileValidationSchema };
