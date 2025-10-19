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
    enum: ["PROGRAMMING", "WEB DEVELOPMENT", "BACKEND", "TOOLS", "OTHER"],
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
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Settings schema
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

// Hash password ONLY if it's modified and not already hashed
userSchema.pre("save", async function (next) {
  // Skip if password wasn't modified
  if (!this.isModified("password")) {
    return next();
  }

  // Skip if password is already hashed (starts with $2a$ or $2b$)
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

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    const match = await bcrypt.compare(enteredPassword, this.password);
    return match;
  } catch (error) {
    console.error("Password comparison error:", error);
    return false;
  }
};

// Remove password from JSON
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model("User", userSchema);

export default User;