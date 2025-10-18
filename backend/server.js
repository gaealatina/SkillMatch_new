import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import passwordResetRoutes from './routes/passwordReset.js';
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const app = express();

// CORS Configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use("/api/users", authRoutes);
app.use("/api/auth", passwordResetRoutes);

// Health check endpoint (test this first to verify server is running)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    message: 'Server is OK',
    timestamp: new Date().toISOString()
  });
});

// Main startup function
const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();
    
    // Only start the server after DB connection succeeds
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Start the server
startServer();