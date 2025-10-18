import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import PasswordReset from '../models/PasswordReset.js';
import User from '../models/User.js';
import emailService from '../services/emailService.js';
import { 
  passwordResetLimiter, 
  otpVerificationLimiter, 
  passwordResetCompleteLimiter 
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Validation rules
const emailValidation = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .custom((value) => {
      const validDomains = ['@phinmaed.com', '@phinma.edu.com'];
      const hasValidDomain = validDomains.some(domain => value.endsWith(domain));
      if (!hasValidDomain) {
        throw new Error('Please use your PHINMA Education email address (@phinmaed.com for students or @phinma.edu.com for professors)');
      }
      return true;
    })
    .normalizeEmail()
];

const otpValidation = [
  body('email').isEmail().normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers')
];

const passwordValidation = [
  body('email').isEmail().normalizeEmail(),
  body('otp')
    .isLength({ min: 6, max: 6 })
    .withMessage('OTP must be exactly 6 digits')
    .isNumeric()
    .withMessage('OTP must contain only numbers'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    })
];

// POST /api/auth/forgot-password
router.post('/forgot-password', 
  passwordResetLimiter,
  emailValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email } = req.body;
      const ipAddress = req.ip;
      const userAgent = req.get('User-Agent');

      // Check if user exists
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'No account found with this email address'
        });
      }

      // Check if there's already an active OTP
      const hasActiveOTP = await PasswordReset.hasActiveOTP(email);
      if (hasActiveOTP) {
        return res.status(429).json({
          success: false,
          message: 'An OTP has already been sent to this email. Please check your inbox or wait 10 minutes before requesting a new one.'
        });
      }

      // Generate OTP (use fixed value for testing in development)
      const otpCode = process.env.NODE_ENV === 'development' ? '123456' : PasswordReset.generateOTP();
      const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

      // Save OTP to database
      const passwordReset = new PasswordReset({
        email,
        otpCode,
        otpExpiresAt,
        ipAddress,
        userAgent
      });

      await passwordReset.save();

      // Send OTP via email
      const emailResult = await emailService.sendOTP(email, otpCode);
      if (!emailResult.success) {
        // If email fails, remove the OTP from database
        await PasswordReset.findByIdAndDelete(passwordReset._id);
        return res.status(500).json({
          success: false,
          message: 'Failed to send OTP. Please try again later.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'OTP sent successfully to your email address',
        expiresIn: 600 // 10 minutes in seconds
      });

    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// POST /api/auth/verify-otp
router.post('/verify-otp',
  otpVerificationLimiter,
  otpValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, otp } = req.body;

      // Find the OTP record
      const passwordReset = await PasswordReset.findOne({
        email,
        otpCode: otp,
        isUsed: false,
        otpExpiresAt: { $gt: new Date() }
      });

      if (!passwordReset) {
        // Increment attempts
        await PasswordReset.findOneAndUpdate(
          { email, isUsed: false },
          { $inc: { attempts: 1 } }
        );

        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP code'
        });
      }

      // Check if too many attempts
      if (passwordReset.attempts >= 5) {
        return res.status(429).json({
          success: false,
          message: 'Too many failed attempts. Please request a new OTP.'
        });
      }

      res.status(200).json({
        success: true,
        message: 'OTP verified successfully'
      });

    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

// POST /api/auth/reset-password
router.post('/reset-password',
  passwordResetCompleteLimiter,
  passwordValidation,
  async (req, res) => {
    try {
      // Check validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: errors.array()
        });
      }

      const { email, otp, password } = req.body;

      // Find and verify OTP
      const passwordReset = await PasswordReset.findOne({
        email,
        otpCode: otp,
        isUsed: false,
        otpExpiresAt: { $gt: new Date() }
      });

      if (!passwordReset) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or expired OTP code'
        });
      }

      // Find user
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Update user password
      await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
        lastPasswordReset: new Date()
      });

      // Mark OTP as used
      await PasswordReset.findByIdAndUpdate(passwordReset._id, {
        isUsed: true
      });

      // Clean up expired OTPs
      await PasswordReset.cleanupExpired();

      // Send confirmation email
      await emailService.sendPasswordResetConfirmation(email, user.name);

      res.status(200).json({
        success: true,
        message: 'Password reset successfully'
      });

    } catch (error) {
      console.error('Password reset error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error'
      });
    }
  }
);

export default router;
