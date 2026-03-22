import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import connectDB from "./src/config/db.js"
import authRouter from "./src/routes/auth.routes.js"
import plannerRouter from "./src/routes/planner.routes.js"
import progressRouter from "./src/routes/progress.routes.js"
import placementRouter from "./src/routes/placement.routes.js"
import analyticsRouter from "./src/routes/analytics.routes.js"


dotenv.config()

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(cookieParser())

// Health check
app.get("/", (req, res) => {
  res.json({ message: "SAPS backend is running!" })
})

// Planner router
app.use("/api/v1/academic", plannerRouter)

//progress router
app.use("/api/v1/progress", progressRouter)

//Placement router
app.use("/api/v1/placement", placementRouter)

// Routes (we'll uncomment these as we build)
app.use("/api/v1/auth", authRouter)

// analytics router
app.use("/api/v1/analytics", analyticsRouter)

const PORT = process.env.PORT || 8000

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
})

export default app