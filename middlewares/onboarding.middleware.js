// middlewares/checkOnboarding.js
const DeveloperProfile = require("../models/developerProfile.model");

const checkOnboarding = (requiredStep) => {
  return async (req, res, next) => {
    try {
      const userId = req.user.id; // from JWT auth middleware
      const profile = await DeveloperProfile.findOne({ user: userId });

      if (!profile) {
        return res.status(403).json({ success: false, message: "Profile not found" });
      }

      // Onboarding route check
      if (requiredStep === "onboarding") {
        if (profile.lastCompletedStep < 6) {
          return next(); // allow onboarding
        } else {
          return res.status(403).json({ 
            success: false, 
            message: "You have already completed onboarding" 
          });
        }
      }

      // Dashboard route check
      if (requiredStep === "dashboard") {
        if (profile.lastCompletedStep >= 6) {
          return next(); // allow dashboard
        } else {
          return res.status(403).json({ 
            success: false, 
            message: "Complete onboarding first" 
          });
        }
      }

      next();
    } catch (err) {
      console.error("CheckOnboarding Middleware Error:", err);
      res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
  };
};

module.exports = checkOnboarding;
