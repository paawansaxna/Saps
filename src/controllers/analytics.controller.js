import { User } from "../models/user.model.js"
import { Task } from "../models/task.model.js"
import { StudyPlan } from "../models/studyPlan.model.js"
import { ReadinessScore } from "../models/readinessScore.model.js"
import { Skill } from "../models/skill.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// ─── STUDENT DASHBOARD ────────────────────────────────────────
const getStudentDashboard = async (req, res) => {
  try {
    const studentId = req.user._id

    // 1. Get all tasks
    const allTasks = await Task.find({ student: studentId })
    const completedTasks = allTasks.filter(t => t.isCompleted).length
    const missedTasks = allTasks.filter(t => t.isMissed).length
    const pendingTasks = allTasks.length - completedTasks - missedTasks
    const overallProgress = allTasks.length > 0
      ? Math.round((completedTasks / allTasks.length) * 100)
      : 0

    // 2. Get active study plans
    const activePlans = await StudyPlan.find({
      student: studentId,
      status: "active",
    }).populate("subject", "name code")

    // 3. Get readiness score
    const readiness = await ReadinessScore.findOne({ student: studentId })

    // 4. Get skills count
    const skillsCount = await Skill.countDocuments({ student: studentId })

    return res.status(200).json(
      new ApiResponse(200, {
        taskSummary: {
          total: allTasks.length,
          completed: completedTasks,
          missed: missedTasks,
          pending: pendingTasks,
          overallProgress,
        },
        activePlans,
        readinessScore: readiness ? readiness.totalScore : 0,
        skillsCount,
      }, "Student dashboard fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── FACULTY DASHBOARD ────────────────────────────────────────
const getFacultyDashboard = async (req, res) => {
  try {
    // 1. Get all students
    const students = await User.find({ role: "student" })
      .select("name email branch semester")

    // 2. For each student get their progress
    const studentProgress = await Promise.all(
      students.map(async (student) => {
        const tasks = await Task.find({ student: student._id })
        const completed = tasks.filter(t => t.isCompleted).length
        const progress = tasks.length > 0
          ? Math.round((completed / tasks.length) * 100)
          : 0

        return {
          student: {
            _id: student._id,
            name: student.name,
            email: student.email,
            branch: student.branch,
            semester: student.semester,
          },
          totalTasks: tasks.length,
          completedTasks: completed,
          progressPercentage: progress,
        }
      })
    )

    // 3. Calculate average progress
    const avgProgress = studentProgress.length > 0
      ? Math.round(
          studentProgress.reduce((sum, s) => sum + s.progressPercentage, 0) /
          studentProgress.length
        )
      : 0

    return res.status(200).json(
      new ApiResponse(200, {
        totalStudents: students.length,
        averageProgress: avgProgress,
        studentProgress,
      }, "Faculty dashboard fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── PLACEMENT CELL DASHBOARD ─────────────────────────────────
const getPlacementDashboard = async (req, res) => {
  try {
    // 1. Get all students
    const students = await User.find({ role: "student" })
      .select("name email branch semester")

    // 2. Get readiness scores for all students
    const scores = await ReadinessScore.find().populate(
      "student",
      "name email branch semester"
    )

    // 3. Calculate batch statistics
    const totalStudents = students.length
    const studentsWithScores = scores.length

    const avgScore = scores.length > 0
      ? Math.round(
          scores.reduce((sum, s) => sum + s.totalScore, 0) / scores.length
        )
      : 0

    // 4. Categorize students by readiness
    const highReadiness = scores.filter(s => s.totalScore >= 70).length
    const mediumReadiness = scores.filter(s => s.totalScore >= 40 && s.totalScore < 70).length
    const lowReadiness = scores.filter(s => s.totalScore < 40).length

    return res.status(200).json(
      new ApiResponse(200, {
        totalStudents,
        studentsWithScores,
        averageReadinessScore: avgScore,
        readinessBreakdown: {
          high: highReadiness,    // 70-100
          medium: mediumReadiness, // 40-69
          low: lowReadiness,      // 0-39
        },
        topStudents: scores
          .sort((a, b) => b.totalScore - a.totalScore)
          .slice(0, 5)
          .map(s => ({
            name: s.student.name,
            email: s.student.email,
            branch: s.student.branch,
            score: s.totalScore,
          })),
      }, "Placement dashboard fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

export { getStudentDashboard, getFacultyDashboard, getPlacementDashboard }