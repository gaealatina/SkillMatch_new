import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { OAuth2Client } from 'google-auth-library';

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// Improved unique ID generator
const generateUniqueID = async () => {
  let uniqueID;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;
  
  while (exists && attempts < maxAttempts) {
    uniqueID = `SM-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const existingUser = await User.findOne({ id: uniqueID });
    exists = !!existingUser;
    attempts++;
    
    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique ID after multiple attempts');
    }
  }
  
  return uniqueID;
};

// SIGNUP ROUTE - FIXED
router.post("/signup", async (req, res) => {
  try {
    console.log("SIGNUP REQUEST:", req.body);

    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validation - Check required fields
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Please fill all required fields" 
      });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ 
        success: false,
        message: "Passwords do not match" 
      });
    }

    // Check password strength
    if (password.length < 8) {
      return res.status(400).json({ 
        success: false,
        message: "Password must be at least 8 characters" 
      });
    }

    // Enhanced password validation
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);
    if (!hasNumber || !hasSpecialChar) {
      return res.status(400).json({ 
        success: false,
        message: "Password must contain at least 1 number and 1 special character" 
      });
    }

    // Validate email format (Gmail only)
    const gmailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!gmailRegex.test(email)) {
      return res.status(400).json({ 
        success: false,
        message: "Please use a valid Gmail address" 
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ 
        success: false,
        message: "Email already registered" 
      });
    }

    // Generate unique ID for user
    const uniqueID = await generateUniqueID();
    console.log("Generated unique ID:", uniqueID);

    // Create user with proper error handling
    const userData = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.toLowerCase().trim(),
      id: uniqueID,
      password: password,
      userType: "student",
      profilePicture: null
    };

    console.log("Creating user with data:", userData);

    const user = await User.create(userData);

    // Generate token
    const token = generateToken(user._id);

    console.log("USER CREATED SUCCESSFULLY:", { id: user._id, email: user.email });
    
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        userType: user.userType,
        profilePicture: user.profilePicture
      },
      token,
    });
  } catch (error) {
    console.error("SIGNUP ERROR:", error);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({ 
        success: false,
        message: "User with this ID already exists. Please try again.",
        error: "Duplicate ID error"
      });
    }
    
    return res.status(500).json({ 
      success: false,
      message: "Server error during signup", 
      error: error.message 
    });
  }
});

// ... rest of your routes remain the same (login, me, google, debug-users)

// LOGIN ROUTE
router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN ATTEMPT:", req.body);

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log("Missing email or password");
      return res.status(400).json({ 
        success: false,
        message: "Please provide both email and password" 
      });
    }

    // Clean the email
    const cleanEmail = email.toLowerCase().trim();
    console.log("Cleaned email:", cleanEmail);

    // Find user by email
    const user = await User.findOne({ email: cleanEmail }).select('+password');
    
    if (!user) {
      console.log("User not found for email:", cleanEmail);
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    console.log("User found:", {
      id: user._id,
      email: user.email,
      hasPassword: !!user.password
    });

    // Check if password is hashed
    const isPasswordHashed = user.password && user.password.startsWith('$2');
    console.log("Password is hashed:", isPasswordHashed);

    if (!isPasswordHashed) {
      console.log("Password is not hashed properly");
      return res.status(500).json({
        success: false,
        message: "Server configuration error. Please contact support."
      });
    }

    // Check password
    console.log("Starting password comparison...");
    const isPasswordValid = await user.matchPassword(password);
    console.log("Password comparison result:", isPasswordValid);

    if (!isPasswordValid) {
      console.log("Password incorrect");
      return res.status(401).json({ 
        success: false,
        message: "Invalid email or password" 
      });
    }

    // Generate token
    const token = generateToken(user._id);
    console.log("Token generated");

    console.log("LOGIN SUCCESSFUL for user:", user._id);
    
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        id: user.id,
        profilePicture: user.profilePicture,
        course: user.course,
        yearLevel: user.yearLevel,
        skills: user.skills,
        projectHistory: user.projectHistory,
        recommendations: user.recommendations
      },
      token
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ 
      success: false,
      message: "Server error during login",
      error: error.message 
    });
  }
});

// GET CURRENT USER
router.get("/me", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
    const user = await User.findById(decoded.id);

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
    console.error("Get user error:", error);
    return res.status(401).json({ 
      success: false,
      message: "Invalid token"
    });
  }
});

// DEBUG ROUTE - Check database status
router.get("/debug-db", async (req, res) => {
  try {
    const users = await User.find({});
    const usersWithNullId = await User.find({ id: null });
    
    console.log("DEBUG - Database status:");
    console.log("Total users:", users.length);
    console.log("Users with null ID:", usersWithNullId.length);
    console.log("Users with null IDs:", usersWithNullId.map(u => ({ _id: u._id, email: u.email })));
    
    res.json({
      success: true,
      totalUsers: users.length,
      usersWithNullId: usersWithNullId.length,
      usersWithNullIds: usersWithNullId.map(u => ({ _id: u._id, email: u.email }))
    });
  } catch (error) {
    console.error("Debug DB error:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
});

export default router;