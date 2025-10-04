// Simple server starter with explicit logging
console.log('=== Starting Simple Server ===');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

console.log('Environment loaded');
console.log('MongoDB URL:', process.env.MONGODB_URL ? 'Set' : 'Not set');
console.log('Port:', process.env.PORT || 5000);

// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';

console.log('Modules imported successfully');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: [
    'https://newbackend-mu.vercel.app',
    'https://zetflix-tv.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

console.log('Middleware configured');

// Simple test route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running', timestamp: new Date().toISOString() });
});

console.log('Routes configured');

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URL, {
  ssl: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
}).then(() => {
  console.log('✓ MongoDB connected successfully');
  
  app.listen(port, () => {
    console.log(`✓ Server is running on port ${port}`);
    console.log(`✓ Health check: http://localhost:${port}/health`);
    console.log('=== Server Started Successfully ===');
  });
}).catch((err) => {
  console.error('✗ MongoDB connection failed:', err.message);
  process.exit(1);
});