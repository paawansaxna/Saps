import { User } from "../models/user.model.js"
import { ApiResponse } from "../utils/ApiResponse.js"

const generateTokens = async (userId) => {
  const user = await User.findById(userId)
  const accessToken = user.generateAccessToken()
  const refreshToken = user.generateRefreshToken()
  user.refreshToken = refreshToken
  await user.save({ validateBeforeSave: false })
  return { accessToken, refreshToken }
}

const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, semester, branch } = req.body

    if (!name || !email || !password) {
      return res.status(400).json(
        new ApiResponse(400, null, "Name, email and password are required")
      )
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json(
        new ApiResponse(409, null, "User with this email already exists")
      )
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || "student",
      semester: semester || "",
      branch: branch || "",
    })

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    return res.status(201).json(
      new ApiResponse(201, createdUser, "User registered successfully")
    )
  } catch (error) {
    console.error("Register error:", error)
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json(
        new ApiResponse(400, null, "Email and password are required")
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json(
        new ApiResponse(404, null, "User not found")
      )
    }

    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
      return res.status(401).json(
        new ApiResponse(401, null, "Invalid credentials")
      )
    }

    const { accessToken, refreshToken } = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select(
      "-password -refreshToken"
    )

    const cookieOptions = {
      httpOnly: true,
      secure: false,
    }

    return res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", refreshToken, cookieOptions)
      .json(
        new ApiResponse(200, { user: loggedInUser, accessToken }, "Login successful")
      )
  } catch (error) {
    console.error("Login error:", error)
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { returnDocument: 'after' }
    )

    const cookieOptions = {
      httpOnly: true,
      secure: false,
    }

    return res
      .status(200)
      .clearCookie("accessToken", cookieOptions)
      .clearCookie("refreshToken", cookieOptions)
      .json(new ApiResponse(200, null, "Logged out successfully"))
  } catch (error) {
    console.error("Logout error:", error)
    return res.status(500).json(
      new ApiResponse(500, null, error.message)
    )
  }
}

export { registerUser, loginUser, logoutUser }