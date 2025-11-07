const express = require("express");
const router = express.Router();
const {
    updateStage,
    getUserStageHistory,  
} = require("../controllers/stageHistory.controller");
const { updateStageValidationSchema } = require("../validators/stageHistory.validator");
const { authMiddleware } = require("../middlewares/auth.middleware");

const validate = require("../middlewares/validate.middleware");

router.post("/update-stage/:userId", authMiddleware, validate(updateStageValidationSchema), updateStage);
router.get("/user-history",  authMiddleware, getUserStageHistory);

module.exports = router;
