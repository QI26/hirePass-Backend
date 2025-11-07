const {
  changeStageService,
  getStageHistoryService,
} = require("../services/stageHistory.services");

const updateStage = async (req, res) => {
  try {
    const { fromStage, toStage, reason } = req.body;
    const { userId } = req.params; // ✅ Get userId from route param
    const adminId = req.user.id; // admin ID from JWT

    const history = await changeStageService(
      userId,
      fromStage,
      toStage,
      reason
    );

    res.status(200).json({
      success: true,
      message: "Stage updated",
      history,
    });
  } catch (error) {
    console.error("Update Stage Controller Error:", error);
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message,
    });
  }
};

async function getUserStageHistory(req, res) {
  try {
    const userId = req.query.userId; // ✅ always use query for GET
    if (!userId) throw new Error("userId is required");

    const history = await getStageHistoryService(userId);

    return res.status(200).json({
      success: true,
      history,
    });
  } catch (err) {
    console.error("Get Stage History Controller Error:", err);
    return res.status(err.statusCode || 500).json({
      success: false,
      message: err.message,
    });
  }
}

module.exports = {
  updateStage,
  getUserStageHistory,
};
