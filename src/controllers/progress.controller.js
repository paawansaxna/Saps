import { Task } from "../models/task.model.js"
import { TaskLog } from "../models/taskLog.model.js"
import { StudyPlan } from "../models/studyPlan.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// ─── MARK TASK AS COMPLETE ────────────────────────────────────
const markTaskComplete = async (req, res) => {
  try {
    const { taskId } = req.params
    const { notes } = req.body

    // 1. Find task and verify it belongs to this student
    const task = await Task.findOne({
      _id: taskId,
      student: req.user._id,
    })

    if (!task) {
      return res.status(404).json(
        new ApiResponse(404, null, "Task not found")
      )
    }

    if (task.isCompleted) {
      return res.status(400).json(
        new ApiResponse(400, null, "Task already completed")
      )
    }

    // 2. Mark task as complete
    task.isCompleted = true
    task.isMissed = false
    task.completedAt = new Date()
    await task.save({ validateBeforeSave: false })

    // 3. Create a log entry
    const log = await TaskLog.create({
      task: task._id,
      student: req.user._id,
      notes: notes || "",
    })

    return res.status(200).json(
      new ApiResponse(200, { task, log }, "Task marked as complete")
    )
  } catch (error) {
    console.error("Mark task error:", error)
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET PROGRESS FOR A SUBJECT ───────────────────────────────
const getSubjectProgress = async (req, res) => {
  try {
    const { subjectId } = req.params

    // 1. Find active plan for this student + subject
    const plan = await StudyPlan.findOne({
      student: req.user._id,
      subject: subjectId,
    })

    if (!plan) {
      return res.status(404).json(
        new ApiResponse(404, null, "No study plan found for this subject")
      )
    }

    // 2. Get all tasks for this plan
    const allTasks = await Task.find({
      studyPlan: plan._id,
      student: req.user._id,
    }).populate("unit", "title order")

    const totalTasks = allTasks.length
    const completedTasks = allTasks.filter(t => t.isCompleted).length
    const missedTasks = allTasks.filter(t => t.isMissed).length
    const pendingTasks = totalTasks - completedTasks - missedTasks

    // 3. Calculate progress percentage
    const progressPercentage = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0

    // 4. Group tasks by unit
    const unitProgress = {}
    for (const task of allTasks) {
      const unitId = task.unit._id.toString()
      if (!unitProgress[unitId]) {
        unitProgress[unitId] = {
          unitTitle: task.unit.title,
          total: 0,
          completed: 0,
        }
      }
      unitProgress[unitId].total++
      if (task.isCompleted) unitProgress[unitId].completed++
    }

    return res.status(200).json(
      new ApiResponse(200, {
        plan,
        totalTasks,
        completedTasks,
        missedTasks,
        pendingTasks,
        progressPercentage,
        unitProgress: Object.values(unitProgress),
      }, "Progress fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET TODAY'S TASKS ────────────────────────────────────────
const getTodaysTasks = async (req, res) => {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)

    const tasks = await Task.find({
      student: req.user._id,
      scheduledDate: { $gte: today, $lt: tomorrow },
    }).populate("unit", "title")
      .populate("studyPlan", "subject")

    return res.status(200).json(
      new ApiResponse(200, tasks, "Today's tasks fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

export { markTaskComplete, getSubjectProgress, getTodaysTasks }