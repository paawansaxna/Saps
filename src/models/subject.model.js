import mongoose from "mongoose"

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: "",
    },
    semester: {
      type: String,
      required: [true, "Semester is required"],
    },
    branch: {
      type: String,
      required: [true, "Branch is required"],
    },
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
)

export const Subject = mongoose.model("Subject", subjectSchema)