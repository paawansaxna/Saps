import { Subject } from "../models/subject.model.js"
import { Unit } from "../models/unit.model.js"
import { StudyPlan } from "../models/studyPlan.model.js"
import { Task } from "../models/task.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// ─── UPLOAD SUBJECT + UNITS (Faculty only) ───────────────────
const uploadSubject = async (req, res) => {
  try {
    const { name, code, semester, branch, units } = req.body

    // 1. Validate required fields
    if (!name || !semester || !branch || !units || units.length === 0) {
      return res.status(400).json(
        new ApiResponse(400, null, "Name, semester, branch and units are required")
      )
    }

    // 2. Create subject
    const subject = await Subject.create({
      name,
      code: code || "",
      semester,
      branch,
      uploadedBy: req.user._id,
    })

    // 3. Create units linked to this subject
    const unitDocs = await Unit.insertMany(
      units.map((unit, index) => ({
        subject: subject._id,
        title: unit.title,
        weightage: unit.weightage || 0,
        totalTopics: unit.totalTopics,
        order: index + 1,
      }))
    )

    return res.status(201).json(
      new ApiResponse(201, { subject, units: unitDocs }, "Subject uploaded successfully")
    )
  } catch (error) {
    console.error("Upload subject error:", error)
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET ALL SUBJECTS (Students can browse) ──────────────────
const getSubjects = async (req, res) => {
  try {
    const { semester, branch } = req.query

    const filter = {}
    if (semester) filter.semester = semester
    if (branch) filter.branch = branch

    const subjects = await Subject.find(filter)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 })

    return res.status(200).json(
      new ApiResponse(200, subjects, "Subjects fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET UNITS FOR A SUBJECT ──────────────────────────────────
const getUnits = async (req, res) => {
  try {
    const { subjectId } = req.params

    const units = await Unit.find({ subject: subjectId }).sort({ order: 1 })

    return res.status(200).json(
      new ApiResponse(200, units, "Units fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GENERATE STUDY PLAN (Student only) ──────────────────────
const generateStudyPlan = async (req, res) => {
  try {
    const { subjectId, startDate, endDate, dailyStudyHours } = req.body

    // 1. Validate fields
    if (!subjectId || !startDate || !endDate) {
      return res.status(400).json(
        new ApiResponse(400, null, "Subject, start date and end date are required")
      )
    }

    // 2. Check subject exists
    const subject = await Subject.findById(subjectId)
    if (!subject) {
      return res.status(404).json(
        new ApiResponse(404, null, "Subject not found")
      )
    }

    // 3. Check if plan already exists for this student + subject
    const existingPlan = await StudyPlan.findOne({
      student: req.user._id,
      subject: subjectId,
      status: "active",
    })
    if (existingPlan) {
      return res.status(409).json(
        new ApiResponse(409, null, "Active study plan already exists for this subject")
      )
    }

    // 4. Create study plan
    const plan = await StudyPlan.create({
      student: req.user._id,
      subject: subjectId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      dailyStudyHours: dailyStudyHours || 2,
    })

    // 5. Get all units for this subject
    const units = await Unit.find({ subject: subjectId }).sort({ order: 1 })

    // 6. Generate tasks — distribute topics across available days
    const start = new Date(startDate)
    const end = new Date(endDate)
    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    const tasks = []
    let dayIndex = 0

    for (const unit of units) {
      for (let topic = 1; topic <= unit.totalTopics; topic++) {
        const scheduledDate = new Date(start)
        scheduledDate.setDate(start.getDate() + dayIndex % totalDays)

        tasks.push({
          studyPlan: plan._id,
          student: req.user._id,
          unit: unit._id,
          title: `${unit.title} — Topic ${topic}`,
          scheduledDate,
        })

        dayIndex++
      }
    }

    // 7. Insert all tasks at once
    const createdTasks = await Task.insertMany(tasks)

    return res.status(201).json(
      new ApiResponse(
        201,
        { plan, totalTasks: createdTasks.length },
        "Study plan generated successfully"
      )
    )
  } catch (error) {
    console.error("Generate plan error:", error)
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET STUDY PLAN WITH TASKS ────────────────────────────────
const getStudyPlan = async (req, res) => {
  try {
    const plans = await StudyPlan.find({ student: req.user._id })
      .populate("subject", "name code semester")
      .sort({ createdAt: -1 })

    return res.status(200).json(
      new ApiResponse(200, plans, "Study plans fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

const getTasksForPlan = async (req, res) => {
  try {
    const { planId } = req.params

    const tasks = await Task.find({
      studyPlan: planId,
      student: req.user._id,
    }).populate("unit", "title order")
      .sort({ scheduledDate: 1 })

    return res.status(200).json(
      new ApiResponse(200, tasks, "Tasks fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

const deleteStudyPlan = async (req, res) => {
  try {
    const { planId } = req.params

    const plan = await StudyPlan.findOne({
      _id: planId,
      student: req.user._id,
    })

    if (!plan) {
      return res.status(404).json(
        new ApiResponse(404, null, "Study plan not found")
      )
    }

    // Delete all tasks for this plan
    await Task.deleteMany({ studyPlan: planId })

    // Delete the plan
    await StudyPlan.findByIdAndDelete(planId)

    return res.status(200).json(
      new ApiResponse(200, null, "Study plan deleted successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}
export { uploadSubject, getSubjects, getUnits, generateStudyPlan, getStudyPlan, getTasksForPlan, deleteStudyPlan }