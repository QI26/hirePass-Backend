const mongoose = require("mongoose");

const developerProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    developerLevel: { type: String },
    profilePicture: { type: String },
    bio: { type: String },
    bestFitRoles: [{ type: String }],
    preferredRoles: [{ type: String }],
    techStack: { type: Object }, 
    salaryInfo: {
      minHourlyRate: { type: Number, default: 0 }, 
      minMonthlyRate: { type: Number, default: 0 }, 
    },
    links: {
      github: { type: String, default: "" }, 
      other: { type: String, default: "" }, 
    },
    resume: { type: String },
    lastCompletedStep: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const DeveloperProfile = mongoose.model(
  "DeveloperProfile",
  developerProfileSchema
);

module.exports = DeveloperProfile;
