import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  category: {
    type: String,
    enum: ["PROGRAMMING", "WEB DEVELOPMENT", "UI/UX DESIGN", "FRONTEND", "BACKEND", "TOOLS", "OTHER"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema({
  project: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: String,
    required: true,
  },
  team: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    default: [],
  },
  score: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  description: {
    type: String,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const recommendationSchema = new mongoose.Schema({
  skillName: {
    type: String,
    required: true,
    trim: true,
  },
  reason: {
    type: String,
    required: true,
  },
  suggestedAction: {
    type: String,
    required: true,
  },
  resourceLinks: [
    {
      title: String,
      url: String,
    },
  ],
  priority: {
    type: String,
    enum: ["HIGH", "MEDIUM", "LOW"],
    default: "MEDIUM",
  },
  currentLevel: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const settingsSchema = new mongoose.Schema({
  appearance: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'system'],
      default: 'system'
    },
    darkMode: {
      type: Boolean,
      default: false
    }
  },
  notifications: {
    skillAlerts: {
      type: Boolean,
      default: true
    },
    projectUpdates: {
      type: Boolean,
      default: true
    },
    weeklyReports: {
      type: Boolean,
      default: false
    },
    recommendations: {
      type: Boolean,
      default: true
    }
  },
  privacy: {
    profileVisible: {
      type: Boolean,
      default: true
    },
    skillsVisible: {
      type: Boolean,
      default: true
    },
    projectsVisible: {
      type: Boolean,
      default: true
    }
  }
}, { _id: false });

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    id: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
      enum: ["student", "educator"],
      required: true,
    },
    course: {
      type: String,
      default: null,
      trim: true,
    },
    yearLevel: {
      type: String,
      default: null,
      trim: true,
    },
    profilePicture: {
      type: String,
      default: null,
    },
    skills: [skillSchema],
    projectHistory: [projectSchema],
    recommendations: [recommendationSchema],
    settings: {
      type: settingsSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Add generateRecommendations method AFTER userSchema is defined
userSchema.methods.generateRecommendations = function() {
  const recommendations = [];
  const skillLevels = {};

  // Analyze current skill levels
  this.skills.forEach(skill => {
    skillLevels[skill.name] = skill.level;
  });

  // Recommendation rules based on skill levels
  const recommendationRules = [
    {
      skillName: "JavaScript",
      minLevel: 0,
      maxLevel: 70,
      reason: "Essential for modern web development. Your current level indicates room for improvement.",
      suggestedAction: "Build interactive projects and master ES6+ features.",
      resourceLinks: [
        { title: "JavaScript Modern Tutorial", url: "https://javascript.info" },
        { title: "JavaScript Projects", url: "https://github.com/topics/javascript-projects" }
      ]
    },
    {
      skillName: "Git",
      minLevel: 0,
      maxLevel: 80,
      reason: "Essential for collaboration and professional development workflows.",
      suggestedAction: "Learn branching strategies and team collaboration.",
      resourceLinks: [
        { title: "Git Handbook", url: "https://guides.github.com/introduction/git-handbook/" },
        { title: "Git Practice", url: "https://learngitbranching.js.org" }
      ]
    },
    {
      skillName: "React",
      minLevel: 0,
      maxLevel: 60,
      reason: "Most popular frontend framework. High demand in job market.",
      suggestedAction: "Build component-based applications and learn state management.",
      resourceLinks: [
        { title: "React Official Tutorial", url: "https://reactjs.org/tutorial" },
        { title: "React Projects", url: "https://github.com/enaqx/awesome-react" }
      ]
    },
    {
      skillName: "Node.js",
      minLevel: 0,
      maxLevel: 65,
      reason: "Essential for backend development and full-stack applications.",
      suggestedAction: "Build REST APIs and learn about middleware and authentication.",
      resourceLinks: [
        { title: "Node.js Guide", url: "https://nodejs.org/en/docs/guides/" },
        { title: "Express Tutorial", url: "https://expressjs.com/en/starter/installing.html" }
      ]
    },
    {
      skillName: "CSS",
      minLevel: 0,
      maxLevel: 75,
      reason: "Fundamental for styling and creating responsive designs.",
      suggestedAction: "Master Flexbox, Grid, and modern CSS frameworks.",
      resourceLinks: [
        { title: "CSS Tricks", url: "https://css-tricks.com" },
        { title: "Flexbox Guide", url: "https://flexboxfroggy.com" }
      ]
    }
  ];

  // Generate recommendations based on current skills
  recommendationRules.forEach(rule => {
    const currentLevel = skillLevels[rule.skillName] || 0;
    
    if (currentLevel >= rule.minLevel && currentLevel <= rule.maxLevel) {
      recommendations.push({
        skillName: rule.skillName,
        currentLevel,
        reason: rule.reason,
        suggestedAction: rule.suggestedAction,
        resourceLinks: rule.resourceLinks,
        priority: rule.maxLevel - currentLevel // Higher gap = higher priority
      });
    }
  });

  // Sort by priority (skills needing most improvement first)
  return recommendations.sort((a, b) => b.priority - a.priority);
};

userSchema.pre("save", async function (next) {
  // Skip if password hasn't been modified
  if (!this.isModified("password")) {
    return next();
  }

  // Skip if password is already hashed
  if (this.password.startsWith("$2a$") || this.password.startsWith("$2b$")) {
    return next();
  }

  try {
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    const match = await bcrypt.compare(enteredPassword, this.password);
    return match;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;