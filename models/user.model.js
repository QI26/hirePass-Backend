const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  country: { type: String },
  dob: { type: Date },
  mobileNumber: { type: String },
  isVerified: { type: Boolean, default: false },
  resetPasswordCode: { type: String },
  resetPasswordExpires: { type: Date },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});


const User = mongoose.model("User", userSchema);

module.exports = User;
