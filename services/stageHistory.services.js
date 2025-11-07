const StageHistory = require("../models/stageHistory.model");

async function changeStageService(userId, fromStage, toStage, reason = null) {
  console.log("Service call for stage updation..");

  if (!userId || !toStage) {
    throw new Error("userId and toStage are required");
  }

  if (toStage === "REJECTED" && !reason) {
    throw new Error("Reason is required when rejecting");
  }

  // 🔹 Check if user was rejected within the last 365 days
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  const recentRejection = await StageHistory.findOne({
    userId,
    toStage: "REJECTED",
    createdAt: { $gte: oneYearAgo },
  });

  if (recentRejection) {
    const error = new Error(
      "This user was rejected within the last 365 days. Stage cannot be changed."
    );
    error.statusCode = 400; // Bad request
    throw error;
  }

  // 🔹 Save stage change
  const stageRecord = new StageHistory({
    userId,
    fromStage,
    toStage,
    reason,
  });

  await stageRecord.save();
  return stageRecord;
}

async function getStageHistoryService(userId) {
  if (!userId) throw new Error("userId required");

  const history = await StageHistory.find({ userId }).sort({ date: 1 });

  return history.map((record) => ({
    from: record.fromStage,
    to: record.toStage,
    date: record.date,
    reason: record.toStage === "REJECTED" ? record.reason : undefined,
  }));
}


module.exports = { changeStageService, getStageHistoryService };
