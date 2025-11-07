
const Users = require("../models/user.model");
const DeveloperProfile = require("../models/developerProfile.model");
async function saveStepService(userId, step, data) {
  console.log(`Service called for step number ${step}`);
  console.log("data along onboarding service:", JSON.stringify(data, null, 2));

  // Make sure userId is valid
  if (!userId) throw new Error("User ID is missing");

  // Find existing profile or create a new one
  let profile = await DeveloperProfile.findOne({ user: userId });

  if (!profile) {
    profile = new DeveloperProfile({ user: userId });
  }

  // Apply step data
  switch (step) {
    case 1:
      profile.developerLevel = data.developerLevel || profile.developerLevel;
      break;

    case 2:
      profile.profilePicture = data.profilePicture || profile.profilePicture;
      profile.bio = data.bio || profile.bio;
      break;

      case 3:
        profile.bestFitRoles = Array.isArray(data.bestFitRoles)
          ? data.bestFitRoles
          : profile.bestFitRoles || [];
          profile.preferredRoles = Array.isArray(data.preferredRoles)
          ? data.preferredRoles
          : data.preferredRole
            ? [data.preferredRole] 
            : profile.preferredRoles || [];
        profile.techStack = Array.isArray(data.techStack)
          ? data.techStack
          : profile.techStack || [];
        break;
      

      case 4:
        profile.salaryInfo = {
          minHourlyRate: data.minHourlyRate ?? profile.salaryInfo?.minHourlyRate ?? 0,
          minMonthlyRate: data.minMonthlyRate ?? profile.salaryInfo?.minMonthlyRate ?? 0,
        };
        break;
      

        case 5:
          profile.links = {
            github: data.links?.github || data.github || "",
            other: data.links?.other || data.otherLink || "",
          };
          break;
        

    case 6:
      profile.resume = data.resume || profile.resume;
      break;

    default:
      throw new Error("Invalid step");
  }

  // Update last completed step
  profile.lastCompletedStep = Math.max(profile.lastCompletedStep || 0, step);

  await profile.save();
  return profile;
}

async function getProfileService(userId) {
  const profile = await DeveloperProfile.findOne({ user: userId });
  if (!profile) throw new Error("Profile not found");
  return profile;
}


async function getAllUserProfileService() {
  try {
    const profiles = await DeveloperProfile.find()
      .populate({
        path: "user",
        select: "fullName email country mobileNumber", 
      })
      .lean();

    console.log("Profiles fetched:", profiles.length);

    const result = profiles
      .filter((profile) => profile.user) // only keep valid user refs
      .map((profile) => ({
        profileId: profile._id,                   // keep DeveloperProfile ID
        userId: profile.user._id,                 // user ID
        fullName: profile.user.fullName || "N/A",
        email: profile.user.email || "N/A",
        country: profile.user.country || "N/A",
        mobileNumber: profile.user.mobileNumber || "N/A",
        devLevel: profile.developerLevel || "N/A",
        bio: profile.bio || "",
        roles: profile.preferredRoles || [],
        bestFitRoles: profile.bestFitRoles || [],
        salary: {
          hourly: profile.salaryInfo?.minHourlyRate || 0,
          monthly: profile.salaryInfo?.minMonthlyRate || 0,
        },
        techStack: profile.techStack || [],
        github: profile.links?.github || "",
        resume: profile.resume || "",
        profileImage: profile.profilePicture || "",
      }));

    return {
      success: true,
      message: "User profiles fetched successfully",
      users: result,
    };
  } catch (err) {
    console.error("Get All User Profiles Service Error:", err);
    return { success: false, message: "Internal server error" };
  }
}



async function getUserProfileByIdService(userId) {
  try {
    const user = await DeveloperProfile.find({user: userId});

    if (!user) {
      return { success: false, message: "User not found" };
    }

    return {
      success: true,
      message: "User profile fetched successfully",
      user,
    };
  } catch (error) {
    throw new Error(error.message);
}
}

async function updateUserProfileService(userId, updateData) {
  console.log("updation service call for user profile..");

  if (!updateData || typeof updateData !== "object") {
    console.error("No update data provided:", updateData);
    return { success: false, message: "No data provided for update" };
  }
  try {
    // Separate User attributes vs DeveloperProfile attributes
    const userAttrs = {};
    const profileAttrs = {};

    // Attributes that belong to the User model
    const userFields = ["fullName", "email", "country", "mobileNumber"];
    userFields.forEach((field) => {
      if (updateData[field] !== undefined) userAttrs[field] = updateData[field];
    });

    // Attributes that belong to DeveloperProfile model
    const profileFields = ["devLevel", "role", "bio", "techStack", "salary", "github", "resume", "profileImage"];
    profileFields.forEach((field) => {
      if (updateData[field] !== undefined) profileAttrs[field] = updateData[field];
    });

    // Update User
    if (Object.keys(userAttrs).length > 0) {
      await Users.findByIdAndUpdate(userId, userAttrs, { new: true });
    }

    // Update DeveloperProfile
    if (Object.keys(profileAttrs).length > 0) {
      // Map salary and github/profileImage fields to nested objects
      if (profileAttrs.salary) {
        profileAttrs.salaryInfo = {
          minHourlyRate: profileAttrs.salary.hourly || 0,
          minMonthlyRate: profileAttrs.salary.monthly || 0,
        };
        delete profileAttrs.salary;
      }

      if (profileAttrs.github) {
        profileAttrs.links = { ...(profileAttrs.links || {}), github: profileAttrs.github };
        delete profileAttrs.github;
      }

      if (profileAttrs.profileImage) {
        profileAttrs.profilePicture = profileAttrs.profileImage;
        delete profileAttrs.profileImage;
      }

      await DeveloperProfile.findOneAndUpdate(
        { user: userId },
        { $set: profileAttrs },
        { new: true, upsert: true } // upsert creates if not exists
      );
    }

    // Return updated profile
    return await getUserProfileByIdService(userId);
  } catch (err) {
    console.error("Update User Profile Service Error:", err);
    return { success: false, message: "Internal server error" };
  }
}

module.exports = {
  saveStepService,
  getProfileService,
  getAllUserProfileService,
  getUserProfileByIdService,
  updateUserProfileService,
};
