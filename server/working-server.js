// Working server with explicit logging and status files
console.log('=== Starting Working Server ===');
console.log('Node version:', process.version);
console.log('Working directory:', process.cwd());

// Load environment variables
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

console.log('Environment loaded');

// Import required modules
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import routes from './src/routes/index.route.js';

console.log('Modules imported successfully');

const app = express();
const port = process.env.PORT || 5000;

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'OK', 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API routes
app.use("/api/v2", routes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

console.log('Routes configured');

const server = http.createServer(app);

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGODB_URL, {
  ssl: true,
  tlsAllowInvalidCertificates: true,
  tlsAllowInvalidHostnames: true
}).then(() => {
  console.log('✓ MongoDB connected successfully');
  fs.writeFileSync('working-server-db.txt', 'MongoDB connected at ' + new Date().toISOString());
  
  server.listen(port, () => {
    const message = `✓ Working server is running on port ${port} at ${new Date().toISOString()}`;
    console.log(message);
    console.log(`✓ Health check: http://localhost:${port}/health`);
    console.log(`✓ API base: http://localhost:${port}/api/v2`);
    console.log('=== Working Server Started Successfully ===');
    
    fs.writeFileSync('working-server-status.txt', message);
  });
}).catch((err) => {
  console.error('✗ MongoDB connection failed:', err.message);
  fs.writeFileSync('working-server-error.txt', 'MongoDB error: ' + err.message);
  process.exit(1);
});