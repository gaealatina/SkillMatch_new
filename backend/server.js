import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import passwordResetRoutes from './routes/passwordReset.js';
import profileRoutes from './routes/profile.js';
import roleHistoryRoutes from './routes/roleHistory.js';
import settingsRoutes from './routes/settings.js';
import suggestionsRoutes from './routes/suggestions.js';
import careerPathRoutes from './routes/careerPathRoutes.js';
import dashboardRoutes from './routes/dashboard.js';
import { connectDB } from './config/db.js';

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

// Routes
app.use('/api/users', authRoutes);
app.use('/api/auth', passwordResetRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/role-history', roleHistoryRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/suggestions', suggestionsRoutes);
app.use('/api/career-path', careerPathRoutes);
app.use('/api/dashboard', dashboardRoutes); 

// Health check endpoint
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

startServer();