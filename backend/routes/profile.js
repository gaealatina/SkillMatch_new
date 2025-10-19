import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();


router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        course: user.course,
        yearLevel: user.yearLevel,
        profilePicture: user.profilePicture,
      },
      skills: user.skills,
      projectHistory: user.projectHistory,
      recommendations: user.recommendations,
    });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.patch("/user", protect, async (req, res) => {
  try {
    const { firstName, lastName, email, course, yearLevel } = req.body;


    if (!firstName || !lastName || !email) {
      return res.status(400).json({ message: "First name, last name, and email are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }


    if (email !== user.email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase() });
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }


    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email.toLowerCase();
    user.course = course || null;
    user.yearLevel = yearLevel || null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        course: user.course,
        yearLevel: user.yearLevel,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.patch("/avatar", protect, async (req, res) => {
  try {
    const { profilePicture } = req.body;

    if (!profilePicture) {
      return res.status(400).json({ message: "Profile picture data is required" });
    }

 
    const allowedFormats = ["data:image/jpeg", "data:image/jpg", "data:image/png", "data:image/gif", "data:image/webp", "data:image/svg+xml"];
    const isValidFormat = allowedFormats.some(format => profilePicture.startsWith(format));
    
    if (!isValidFormat) {
      return res.status(400).json({ message: "Invalid image format. Supported formats: JPG, PNG, GIF, WEBP, SVG" });
    }

   
    const sizeInMB = Buffer.byteLength(profilePicture, 'utf8') / (1024 * 1024);
    if (sizeInMB > 1024) { // 1GB = 1024MB
      return res.status(400).json({ message: "Image size must be less than 1GB" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.profilePicture = profilePicture;
    await user.save();

    console.log("Profile picture saved successfully for user:", user._id);

    return res.status(200).json({
      success: true,
      message: "Profile picture updated successfully",
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/skills", protect, async (req, res) => {
  try {
    const { name, level, category } = req.body;

 
    if (!name || level === undefined || !category) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (level < 0 || level > 100) {
      return res.status(400).json({ message: "Level must be between 0 and 100" });
    }

    const user = await User.findById(req.user._id);

  
    const skillExists = user.skills.some((s) => s.name.toLowerCase() === name.toLowerCase());
    if (skillExists) {
      return res.status(400).json({ message: "Skill already exists" });
    }

    user.skills.push({
      name,
      level,
      category,
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Skill added successfully",
      skill: user.skills[user.skills.length - 1],
    });
  } catch (error) {
    console.error("Error adding skill:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.patch("/skills/:skillId", protect, async (req, res) => {
  try {
    const { skillId } = req.params;
    const { level, name } = req.body;

    if (level && (level < 0 || level > 100)) {
      return res.status(400).json({ message: "Level must be between 0 and 100" });
    }

    const user = await User.findById(req.user._id);
    const skill = user.skills.id(skillId);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    if (level !== undefined) skill.level = level;
    if (name !== undefined) skill.name = name;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      skill,
    });
  } catch (error) {
    console.error("Error updating skill:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.delete("/skills/:skillId", protect, async (req, res) => {
  try {
    const { skillId } = req.params;

    const user = await User.findById(req.user._id);
    const skill = user.skills.id(skillId);

    if (!skill) {
      return res.status(404).json({ message: "Skill not found" });
    }

    user.skills.pull(skillId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting skill:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/projects", protect, async (req, res) => {
  try {
    const { project, role, date, team, skills, score, description } = req.body;


    if (!project || !role || !date || !team || score === undefined) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    if (score < 0 || score > 100) {
      return res.status(400).json({ message: "Score must be between 0 and 100" });
    }

    const user = await User.findById(req.user._id);

    user.projectHistory.push({
      project,
      role,
      date,
      team,
      skills: skills || [],
      score,
      description: description || "",
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Project added successfully",
      project: user.projectHistory[user.projectHistory.length - 1],
    });
  } catch (error) {
    console.error("Error adding project:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.patch("/projects/:projectId", protect, async (req, res) => {
  try {
    const { projectId } = req.params;
    const { project, role, date, team, skills, score, description } = req.body;

    if (score && (score < 0 || score > 100)) {
      return res.status(400).json({ message: "Score must be between 0 and 100" });
    }

    const user = await User.findById(req.user._id);
    const projectItem = user.projectHistory.id(projectId);

    if (!projectItem) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project !== undefined) projectItem.project = project;
    if (role !== undefined) projectItem.role = role;
    if (date !== undefined) projectItem.date = date;
    if (team !== undefined) projectItem.team = team;
    if (skills !== undefined) projectItem.skills = skills;
    if (score !== undefined) projectItem.score = score;
    if (description !== undefined) projectItem.description = description;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      project: projectItem,
    });
  } catch (error) {
    console.error("Error updating project:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.delete("/projects/:projectId", protect, async (req, res) => {
  try {
    const { projectId } = req.params;

    const user = await User.findById(req.user._id);
    const project = user.projectHistory.id(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    user.projectHistory.pull(projectId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.post("/recommendations", protect, async (req, res) => {
  try {
    const { skillName, reason, suggestedAction, resourceLinks, priority } = req.body;

    if (!skillName || !reason || !suggestedAction) {
      return res.status(400).json({ message: "Please provide all required fields" });
    }

    const user = await User.findById(req.user._id);

    user.recommendations.push({
      skillName,
      reason,
      suggestedAction,
      resourceLinks: resourceLinks || [],
      priority: priority || "MEDIUM",
    });

    await user.save();

    return res.status(201).json({
      success: true,
      message: "Recommendation added successfully",
      recommendation: user.recommendations[user.recommendations.length - 1],
    });
  } catch (error) {
    console.error("Error adding recommendation:", error);
    return res.status(500).json({ message: "Server error" });
  }
});


router.delete("/recommendations/:recommendationId", protect, async (req, res) => {
  try {
    const { recommendationId } = req.params;

    const user = await User.findById(req.user._id);
    const recommendation = user.recommendations.id(recommendationId);

    if (!recommendation) {
      return res.status(404).json({ message: "Recommendation not found" });
    }

    user.recommendations.pull(recommendationId);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Recommendation deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting recommendation:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;