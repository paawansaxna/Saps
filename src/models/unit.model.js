import mongoose from "mongoose"

const unitSchema = new mongoose.Schema(
  {
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Unit title is required"],
      trim: true,
    },
    weightage: {
      type: Number,
      default: 0,
    },
    totalTopics: {
      type: Number,
      required: [true, "Total topics is required"],
      min: [1, "At least 1 topic is required"],
    },
    order: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true }
)

export const Unit = mongoose.model("Unit", unitSchema)