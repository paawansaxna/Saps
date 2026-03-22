import { Router } from "express"
import {
  uploadSubject,
  getSubjects,
  getUnits,
  generateStudyPlan,
  getStudyPlan,
  getTasksForPlan,
} from "../controllers/planner.controller.js"
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = Router()

// Faculty only
router.post("/subject", verifyJWT, authorizeRoles("faculty"), uploadSubject)

// All logged in users
router.get("/subjects", verifyJWT, getSubjects)
router.get("/subjects/:subjectId/units", verifyJWT, getUnits)

// Student only
router.post("/plan", verifyJWT, authorizeRoles("student"), generateStudyPlan)
router.get("/plan", verifyJWT, authorizeRoles("student"), getStudyPlan)

router.get("/plan/:planId/tasks", verifyJWT, authorizeRoles("student"), getTasksForPlan)

export default router