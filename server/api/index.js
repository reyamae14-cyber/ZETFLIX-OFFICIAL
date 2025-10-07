import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import "dotenv/config"



import routes from "../src/routes/index.route.js"

import connectDB from "../src/utils/db.js"

const app = express()

// Connect to DB before each request
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Trust proxy for Vercel deployment
app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'https://zetflix-official.vercel.app',
    'https://zetflix-official-backend-eight.vercel.app',
    'http://localhost:3000',
  ],
  credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

app.use("/api/v2", routes)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ message: 'Something went wrong!' })
})

export default app