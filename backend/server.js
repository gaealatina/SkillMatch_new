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

// Load environment variables FIRST
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

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', authRoutes);
app.use('/api/password-reset', passwordResetRoutes); // Changed from /api/auth to /api/password-reset
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
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    emailConfigured: !!(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD),
    jwtConfigured: !!process.env.JWT_SECRET
  });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'SkillMatch API',
    version: '1.0.0',
    endpoints: {
      auth: {
        signup: 'POST /api/users/signup/send-otp',
        signupVerify: 'POST /api/users/signup/verify-otp',
        login: 'POST /api/users/login/send-otp',
        loginVerify: 'POST /api/users/login/verify-otp',
        google: 'POST /api/users/google',
        me: 'GET /api/users/me'
      },
      passwordReset: {
        request: 'POST /api/password-reset/request-reset',
        verify: 'POST /api/password-reset/verify-otp',
        reset: 'POST /api/password-reset/reset-password',
        resend: 'POST /api/password-reset/resend-otp'
      },
      profile: '/api/profile',
      roleHistory: '/api/role-history',
      settings: '/api/settings',
      suggestions: '/api/suggestions',
      careerPath: '/api/career-path',
      dashboard: '/api/dashboard'
    }
  });
});

// 404 handler - Must be after all routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('❌ Error:', err.stack);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Main startup function
const startServer = async () => {
  try {
    // Validate required environment variables
    const requiredEnvVars = ['MONGODB_URI', 'JWT_SECRET', 'EMAIL_USER', 'EMAIL_PASSWORD'];
    const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingEnvVars.length > 0) {
      console.warn('⚠️  Warning: Missing environment variables:', missingEnvVars.join(', '));
      console.warn('⚠️  Email functionality will not work without EMAIL_USER and EMAIL_PASSWORD');
    }

    // Connect to MongoDB first
    await connectDB();

    // Only start the server after DB connection succeeds
    app.listen(PORT, () => {
      console.log('\n🚀 ========================================');
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📝 Health check: http://localhost:${PORT}/health`);
      console.log(`📚 API docs: http://localhost:${PORT}/api`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📧 Email service: ${process.env.EMAIL_USER ? '✅ Configured' : '❌ Not configured'}`);
      console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
      console.log(`🔑 Google OAuth: ${process.env.GOOGLE_CLIENT_ID ? '✅ Configured' : '❌ Not configured'}`);
      console.log('🚀 ========================================\n');
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err);
  // Close server & exit process
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n👋 SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

startServer();