import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

// Verify JWT and attach user to request
export const verifyJWT = async (req, res, next) => {
  try {
    // Get token from cookie or Authorization header
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "")

    if (!token) {
      return res.status(401).json(
        new ApiResponse(401, null, "Unauthorized request")
      )
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Find user from decoded token
    const user = await User.findById(decoded._id).select(
      "-password -refreshToken"
    )

    if (!user) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid access token")
      )
    }

    // Attach user to request object
    req.user = user
    next()
  } catch (error) {
    return res.status(401).json(
      new ApiResponse(401, null, "Invalid or expired token")
    )
  }
}

// Check if user has required role
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json(
        new ApiResponse(
          403,
          null,
          `Role '${req.user.role}' is not allowed to access this route`
        )
      )
    }
    next()
  }
}
