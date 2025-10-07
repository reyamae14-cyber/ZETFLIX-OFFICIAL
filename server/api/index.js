import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import http from "http"
import mongoose from "mongoose"
import "dotenv/config"



import routes from "../src/routes/index.route.js"

const app = express()

// Trust proxy for Vercel deployment
app.set('trust proxy', 1)

app.use(cors({
  origin: [
    'https://zetflix-official.vercel.app',
    'https://zetflix-official-backend-lac.vercel.app',
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

const port = process.env.PORT || 5000

const server = http.createServer(app)

mongoose.connect(process.env.MONGODB_URL, {
  ssl: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
}).then(() => {
  console.log("MongoDB connected")
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
  })
}).catch((err) => {
  console.log({ err })
  process.exit(1)
})

export default app