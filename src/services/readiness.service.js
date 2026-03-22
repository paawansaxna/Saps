import { Task } from "../models/task.model.js"
import { Skill } from "../models/skill.model.js"
import { Project } from "../models/project.model.js"
import { ReadinessScore } from "../models/readinessScore.model.js"

const calculateReadinessScore = async (studentId) => {
  // 1. Academic score (40 pts)
  const tasks = await Task.find({ student: studentId })
  const completedTasks = tasks.filter(t => t.isCompleted).length
  const academicScore = tasks.length > 0
    ? Math.round((completedTasks / tasks.length) * 40)
    : 0

  // 2. Skill score (30 pts)
  const skills = await Skill.find({ student: studentId })
  const proficiencyMap = { Beginner: 1, Intermediate: 2, Advanced: 3 }
  const rawSkill = skills.reduce((sum, s) => sum + proficiencyMap[s.proficiency], 0)
  const skillScore = Math.min(rawSkill, 30)

  // 3. Project score (30 pts)
  const projects = await Project.find({ student: studentId })
  const rawProject = projects.reduce((sum, p) => sum + (p.githubUrl ? 8 : 5), 0)
  const projectScore = Math.min(rawProject, 30)

  // 4. Total
  const totalScore = Math.round(academicScore + skillScore + projectScore)

  // 5. Save to DB (upsert — create if not exists, update if exists)
  await ReadinessScore.findOneAndUpdate(
    { student: studentId },
    { academicScore, skillScore, projectScore, totalScore, calculatedAt: new Date() },
    { upsert: true, new: true }
  )

  return { academicScore, skillScore, projectScore, totalScore }
}

export { calculateReadinessScore }