const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middlewares/auth.middleware");
const uploadCombined = require("../middlewares/uploadCombined.middleware");
const {
  saveStep,
  getProfile,
  getAllUserProfile,
  getUserProfileById,
  updateUserProfile,
  getUserProfileByIdForAdmin
} = require("../controllers/developerProfile.controller");
const validate  = require("../middlewares/validate.middleware");
const { developerProfileValidationSchema } = require("../validators/developerProfile.validator");
const checkOnboarding = require("../middlewares/onboarding.middleware");

router.post(
    "/onboarding/save-step",
    authMiddleware,
    //checkOnboarding("onboarding"),
    uploadCombined.fields([
      { name: "profilePicture", maxCount: 1 },
      { name: "resume", maxCount: 1 }
    ]),
    saveStep
  );
router.get("/developer-profile", authMiddleware, getProfile);
router.get("/user-profiles", getAllUserProfile);
router.get("/detail-user-profile", authMiddleware, checkOnboarding("dashboard"), getUserProfileById);
router.get("/admin-detail-user-profile/:id", getUserProfileByIdForAdmin);

router.post(
  "/update-user-profile",
  authMiddleware,
  uploadCombined.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "resume", maxCount: 1 }
  ]),
  updateUserProfile
);
module.exports = router;
