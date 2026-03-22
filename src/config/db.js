import mongoose from "mongoose"

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB...")
    const conn = await mongoose.connect(process.env.MONGODB_URI)
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (error) {
    console.error("MongoDB connection failed!")
    console.error("Error name:", error.name)
    console.error("Error message:", error.message)
    process.exit(1)
  }
}

export default connectDB