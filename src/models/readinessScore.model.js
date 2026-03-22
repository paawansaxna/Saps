import mongoose from "mongoose"

const readinessScoreSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    academicScore: {
      type: Number,
      default: 0,
    },
    skillScore: {
      type: Number,
      default: 0,
    },
    projectScore: {
      type: Number,
      default: 0,
    },
    totalScore: {
      type: Number,
      default: 0,
    },
    calculatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
)

export const ReadinessScore = mongoose.model("ReadinessScore", readinessScoreSchema)