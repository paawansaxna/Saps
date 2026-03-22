import { Skill } from "../models/skill.model.js"
import { Project } from "../models/project.model.js"
import { ReadinessScore } from "../models/readinessScore.model.js"
import { calculateReadinessScore } from "../services/readiness.service.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// ─── ADD SKILL ────────────────────────────────────────────────
const addSkill = async (req, res) => {
  try {
    const { name, category, proficiency } = req.body

    if (!name) {
      return res.status(400).json(
        new ApiResponse(400, null, "Skill name is required")
      )
    }

    const skill = await Skill.create({
      student: req.user._id,
      name,
      category: category || "Technical",
      proficiency: proficiency || "Beginner",
    })

    return res.status(201).json(
      new ApiResponse(201, skill, "Skill added successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET SKILLS ───────────────────────────────────────────────
const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find({ student: req.user._id })
      .sort({ createdAt: -1 })

    return res.status(200).json(
      new ApiResponse(200, skills, "Skills fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── DELETE SKILL ─────────────────────────────────────────────
const deleteSkill = async (req, res) => {
  try {
    const { skillId } = req.params

    const skill = await Skill.findOneAndDelete({
      _id: skillId,
      student: req.user._id,
    })

    if (!skill) {
      return res.status(404).json(
        new ApiResponse(404, null, "Skill not found")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Skill deleted successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── ADD PROJECT ──────────────────────────────────────────────
const addProject = async (req, res) => {
  try {
    const { title, description, techStack, githubUrl } = req.body

    if (!title) {
      return res.status(400).json(
        new ApiResponse(400, null, "Project title is required")
      )
    }

    const project = await Project.create({
      student: req.user._id,
      title,
      description: description || "",
      techStack: techStack || "",
      githubUrl: githubUrl || "",
    })

    return res.status(201).json(
      new ApiResponse(201, project, "Project added successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET PROJECTS ─────────────────────────────────────────────
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ student: req.user._id })
      .sort({ createdAt: -1 })

    return res.status(200).json(
      new ApiResponse(200, projects, "Projects fetched successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── DELETE PROJECT ───────────────────────────────────────────
const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params

    const project = await Project.findOneAndDelete({
      _id: projectId,
      student: req.user._id,
    })

    if (!project) {
      return res.status(404).json(
        new ApiResponse(404, null, "Project not found")
      )
    }

    return res.status(200).json(
      new ApiResponse(200, null, "Project deleted successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

// ─── GET READINESS SCORE ──────────────────────────────────────
const getReadinessScore = async (req, res) => {
  try {
    const scores = await calculateReadinessScore(req.user._id)

    return res.status(200).json(
      new ApiResponse(200, scores, "Readiness score calculated successfully")
    )
  } catch (error) {
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

export { addSkill, getSkills, deleteSkill, addProject, getProjects, deleteProject, getReadinessScore }