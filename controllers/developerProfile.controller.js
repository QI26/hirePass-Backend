const {
  saveStepService,
  getProfileService,
  getAllUserProfileService,
  getUserProfileByIdService,
  updateUserProfileService,
} = require("../services/developerProfile.services");

async function saveStep(req, res) {
  try {
    const userId = req.user.id;
    console.log("Decoded user:", req.user);

    const { step, ...bodyData } = req.body;

    let resumePath;
    if (step == 6 && req.files && req.files.resume) {
      resumePath = `/uploads/resumes/${req.files.resume[0].filename}`;
    }

    let profilePicturePath;
    if (step == 2 && req.files && req.files.profilePicture) {
      profilePicturePath = `/uploads/${req.files.profilePicture[0].filename}`;
    }

    const data = {
      ...bodyData,
      ...(resumePath && { resume: resumePath }),
      ...(profilePicturePath && { profilePicture: profilePicturePath }),
    };

    const result = await saveStepService(userId, Number(step), data);

    return res.status(200).json({
      success: true,
      step: Number(step),
      profile: result,
    });
  } catch (err) {
    console.error("Save Step Controller Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getProfile(req, res) {
  try {
    const userId = req.user.id;
    const result = await getProfileService(userId);

    return res.status(200).json({
      success: true,
      profile: result,
    });
  } catch (err) {
    console.error("Get Profile Controller Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getAllUserProfile(req, res) {
  try {
    const result = await getAllUserProfileService();

    return res.status(200).json({
      success: true,
      profile: result,
    });
  } catch (err) {
    console.error("Get Profile Controller Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

async function getUserProfileById(req, res) {
  try {
    const userId = req.user.id;
    const result = await getUserProfileByIdService(userId);
    console.log("Finding profile for user ID:", req.user.id);
    console.log(result);

    return res.status(200).json({
      success: true,
      profile: result,
    });
  } catch (err) {
    console.error("Get Profile Controller Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}
async function getUserProfileByIdForAdmin(req, res) {
  try {
    const { id } = req.params; // userId from URL
    const profile = await getUserProfileByIdService(id);

    if (!profile.success) {
      return res.status(404).json(profile);
    }

    res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}

async function updateUserProfile(req, res) {
  console.log("Update user profile body:", req.body);
  console.log("Files received:", req.files);

  try {
    const userId = req.user.id; // logged-in user ID
    const updateData = { ...req.body };

    // Parse fields that are sent as JSON strings
    if (updateData.techStack) {
      try {
        updateData.techStack = JSON.parse(updateData.techStack);
      } catch (err) {
        updateData.techStack = [];
      }
    }

    if (updateData.bestFitRoles) {
      try {
        updateData.bestFitRoles = JSON.parse(updateData.bestFitRoles);
      } catch (err) {
        updateData.bestFitRoles = [];
      }
    }

    if (updateData.preferredRoles) {
      try {
        updateData.preferredRoles = JSON.parse(updateData.preferredRoles);
      } catch (err) {
        updateData.preferredRoles = [];
      }
    }

    // Parse salary fields if sent as FormData
    if (updateData.salary) {
      updateData.salary = {
        hourly: Number(updateData.salary.hourly) || 0,
        monthly: Number(updateData.salary.monthly) || 0,
      };
    } else if (updateData["salary[hourly]"] || updateData["salary[monthly]"]) {
      updateData.salary = {
        hourly: Number(updateData["salary[hourly]"]) || 0,
        monthly: Number(updateData["salary[monthly]"]) || 0,
      };
    }

    // Map uploaded files to correct fields
    if (req.files) {
      // Profile Picture
      if (req.files.profileImage && req.files.profileImage.length > 0) {
        updateData.profileImage =
          "/uploads/" + req.files.profileImage[0].filename;
      }

      // Resume
      if (req.files.resume && req.files.resume.length > 0) {
        updateData.resume = "/uploads/resumes/" + req.files.resume[0].filename;
      }
    }

    // Call service to update DB
    const result = await updateUserProfileService(userId, updateData);

    return res.status(200).json({
      success: true,
      profile: result,
    });
  } catch (err) {
    console.error("Update Profile Controller Error:", err);
    return res.status(500).json({ success: false, message: err.message });
  }
}

module.exports = {
  saveStep,
  getProfile,
  getAllUserProfile,
  getUserProfileById,
  updateUserProfile,
  getUserProfileByIdForAdmin
};
