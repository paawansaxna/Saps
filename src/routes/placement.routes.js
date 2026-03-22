import { Router } from "express"
import {
  addSkill,
  getSkills,
  deleteSkill,
  addProject,
  getProjects,
  deleteProject,
  getReadinessScore,
} from "../controllers/placement.controller.js"
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = Router()

// All routes are student only
router.post("/skill", verifyJWT, authorizeRoles("student"), addSkill)
router.get("/skills", verifyJWT, authorizeRoles("student"), getSkills)
router.delete("/skill/:skillId", verifyJWT, authorizeRoles("student"), deleteSkill)

router.post("/project", verifyJWT, authorizeRoles("student"), addProject)
router.get("/projects", verifyJWT, authorizeRoles("student"), getProjects)
router.delete("/project/:projectId", verifyJWT, authorizeRoles("student"), deleteProject)

router.get("/score", verifyJWT, authorizeRoles("student"), getReadinessScore)

export default router