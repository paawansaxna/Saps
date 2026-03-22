import { Router } from "express"
import {
  getStudentDashboard,
  getFacultyDashboard,
  getPlacementDashboard,
} from "../controllers/analytics.controller.js"
import { verifyJWT, authorizeRoles } from "../middlewares/auth.middleware.js"

const router = Router()

router.get(
  "/student",
  verifyJWT,
  authorizeRoles("student"),
  getStudentDashboard
)

router.get(
  "/faculty",
  verifyJWT,
  authorizeRoles("faculty"),
  getFacultyDashboard
)

router.get(
  "/placement",
  verifyJWT,
  authorizeRoles("placement"),
  getPlacementDashboard
)

export default router