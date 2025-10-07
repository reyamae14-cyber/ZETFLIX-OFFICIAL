import cors from "cors"
import cookieParser from "cookie-parser"
import express from "express"
import "dotenv/config"

const TOKEN_SECRET = process.env.TOKEN_SECRET;

import routes from "../src/routes/index.route.js"

import connectDB from "../src/utils/db.js"

const app = express()

// Connect to DB once
connectDB();

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

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

// Start server only if not running on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app