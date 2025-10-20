import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || "7d" });
};

// ===================== SIGNUP ROUTE =====================
router.post("/signup", async (req, res) => {
  try {
    console.log("Signup request received:", req.body);

    const { firstName, lastName, email, id, password, confirmPassword, userType, course, yearLevel } = req.body;

    // Validation - Check required fields
    if (!firstName || !lastName || !email || !id || !password || !confirmPassword || !userType) {
      return res.status(400).json({ message: "Please fill all required fields" });
    }

    // Check if passwords match
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // Check password length
    if (password.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email: email.toLowerCase() });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check if ID already exists
    const existingID = await User.findOne({ id });
    if (existingID) {
      return res.status(400).json({ message: "ID already registered" });
    }

    // Validate user type
    if (!["student", "educator"].includes(userType)) {
      return res.status(400).json({ message: "Invalid user type" });
    }

    // If student, validate course and year level
    if (userType === "student") {
      if (!course || !yearLevel) {
        return res.status(400).json({ message: "Course and year level are required for students" });
      }
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email: email.toLowerCase(),
      id,
      password,
      userType,
      course: userType === "student" ? course : null,
      yearLevel: userType === "student" ? yearLevel : null,
    });

    // Generate token
    const token = generateToken(user._id);

    console.log("User created successfully:", user._id);
    return res.status(201).json({
      success: true,
      message: "Account created successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error during signup", error: error.message });
  }
});

// ===================== LOGIN ROUTE (Email or Student ID) =====================
router.post("/login", async (req, res) => {
  try {
    console.log("Login request received:", { loginInput: req.body.email });

    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide your email or student ID and password" });
    }

    // Find user by email OR student ID
    const user = await User.findOne({
      $or: [
        { email: email.toLowerCase() },
        { id: email } // allows login using student ID
      ]
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Check password
    const isPasswordValid = await user.matchPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log("User logged in successfully:", user._id);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ message: "Server error during login" });
  }
});

// ===================== GET CURRENT USER =====================
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    return res.status(200).json({
      success: true,
      user: user.toJSON(),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error" });
  }
});

// ===================== GOOGLE SIGN-IN =====================
router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Missing credential" });
    }

    // Verify Google token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(401).json({ message: "Invalid Google token" });
    }

    const email = payload.email.toLowerCase();
    const firstName = payload.given_name || payload.name?.split(" ")[0] || "User";
    const lastName = payload.family_name || payload.name?.split(" ")[1] || "";

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      const randomID = `G-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      user = await User.create({
        firstName,
        lastName,
        email,
        id: randomID,
        password: Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2),
        userType: "student",
      });
    }

    // Generate token
    const token = generateToken(user._id);

    console.log("Google login successful:", user._id);
    return res.status(200).json({
      success: true,
      message: "Google login successful",
      user: user.toJSON(),
      token,
    });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({ message: "Server error during Google authentication" });
  }
});

export default router;
