const mongoose = require("mongoose");
const { Schema, Types } = mongoose;

const stageHistorySchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    fromStage: {
      type: String,
      enum: [
        "Not Selected",
        "Screening Step",
        "Technical Interview",
        "Coding Interview",
        "HR Interview",
        "Final Interview",
        "HIRED",
        "REJECTED",
      ],
    },
    toStage: {
      type: String,
      enum: [
        "Not Selected",
        "Screening Step",
        "Technical Interview",
        "Coding Interview",
        "HR Interview",
        "Final Interview",
        "HIRED",
        "REJECTED",
      ],
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    reason: {
      type: String,
      required: function () {
        return this.toStage === "REJECTED";
      },
    },
  },
  { timestamps: true }
);

const StageHistory = mongoose.model("StageHistory", stageHistorySchema);
module.exports = StageHistory;
