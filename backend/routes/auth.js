import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../middleware/auth.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Signup route
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation
    if (!firstName?.trim() || !lastName?.trim() || !email?.trim() || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long'
      });
    }

    if (!/(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 1 number and 1 special character'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    // Validate Gmail format
    const gmailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please use a valid Gmail address'
      });
    }

    // Create user
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      password: password
    });

    if (user) {
      // Generate recommendations for new user
      user.recommendations = user.generateRecommendations();
      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'User created successfully',
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          course: user.course,
          yearLevel: user.yearLevel
        }
      });
    }
  } catch (error) {
    console.error('Signup error:', error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email'
      });
    }

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during signup'
    });
  }
});

// Login route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password'
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await user.matchPassword(password);
    
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate token
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        course: user.course,
        yearLevel: user.yearLevel,
        skills: user.skills,
        projectHistory: user.projectHistory,
        recommendations: user.recommendations
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Google OAuth login
router.post('/google', async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({
        success: false,
        message: 'Google credential is required'
      });
    }

    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });

    const payload = ticket.getPayload();
    
    if (!payload || !payload.email) {
      return res.status(400).json({
        success: false,
        message: 'Invalid Google token'
      });
    }

    // Validate Gmail
    if (!payload.email.endsWith('@gmail.com')) {
      return res.status(400).json({
        success: false,
        message: 'Please use a Gmail account'
      });
    }

    let user = await User.findOne({ email: payload.email });

    if (user) {
      // Existing user - login
      const token = generateToken(user._id);
      
      return res.json({
        success: true,
        message: 'Google login successful',
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          course: user.course,
          yearLevel: user.yearLevel,
          skills: user.skills,
          projectHistory: user.projectHistory,
          recommendations: user.recommendations
        }
      });
    } else {
      // New user - create account
      const nameParts = payload.name.split(' ');
      const firstName = nameParts[0] || 'User';
      const lastName = nameParts.slice(1).join(' ') || 'Google';

      // Generate a random password for Google users
      const randomPassword = Math.random().toString(36).slice(-16) + 'A1!';

      user = await User.create({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: payload.email,
        password: randomPassword,
        profilePicture: payload.picture
      });

      // Generate initial recommendations
      user.recommendations = user.generateRecommendations();
      await user.save();

      const token = generateToken(user._id);

      res.status(201).json({
        success: true,
        message: 'Google account created successfully',
        token,
        user: {
          _id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture,
          course: user.course,
          yearLevel: user.yearLevel,
          skills: user.skills,
          projectHistory: user.projectHistory,
          recommendations: user.recommendations
        }
      });
    }
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during Google login'
    });
  }
});

// Get current user profile
router.get('/me', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
        course: user.course,
        yearLevel: user.yearLevel,
        skills: user.skills,
        projectHistory: user.projectHistory,
        recommendations: user.recommendations
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

export default router;