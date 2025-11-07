import DeveloperProfile from "../models/DeveloperProfile.js";

export const getDeveloperProfile = async (req, res, next) => {
  try {
    const userId = req.user?.id; // ✅ safer access

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: No user ID in request" });
    }

    // Find developer profile by userId
    let profile = await DeveloperProfile.findOne({ user: userId });

    // If no profile exists, create a new one
    if (!profile) {
      profile = new DeveloperProfile({ user: userId });
      await profile.save();
    }

    // Attach profile to request for next middlewares/routes
    req.profile = profile;
    next();

  } catch (error) {
    console.error("Error in getDeveloperProfile middleware:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
