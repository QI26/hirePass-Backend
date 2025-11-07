const Joi = require("joi");
const stages = [
  "Not Selected",
  "Screening Step",
  "Technical Interview",
  "Coding Interview",
  "HR Interview",
  "Final Interview",
  "HIRED",
  "REJECTED",
];

const updateStageValidationSchema = Joi.object({
  fromStage: Joi.string().valid(...stages).optional(),
  toStage: Joi.string().valid(...stages).required()
    .messages({ "any.only": "Invalid stage", "string.empty": "To stage is required" }),
  reason: Joi.string().allow(null, "")
    .when("toStage", { is: "REJECTED", then: Joi.required().messages({ "string.empty": "Reason is required for rejection" }) }),
});

module.exports = { updateStageValidationSchema };
