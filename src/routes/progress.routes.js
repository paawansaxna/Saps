import { Router } from "express"
import {
  markTaskComplete,
  getSubjectProgress,
  markTaskIncomplete,
  getTodaysTasks
  ,
} from "../controllers/progress.controller.js"
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = Router()

// All routes are student only
router.patch("/task/:taskId", verifyJWT, authorizeRoles("student"), markTaskComplete)
router.get("/subject/:subjectId", verifyJWT, authorizeRoles("student"), getSubjectProgress)
router.get("/today", verifyJWT, authorizeRoles("student"), getTodaysTasks)
router.patch("/task/:taskId/undo", verifyJWT, authorizeRoles("student"), markTaskIncomplete)

export default router