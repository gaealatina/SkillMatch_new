import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Enhanced skill resources database
const skillResources = {
  'JavaScript': [
    { title: 'JavaScript Modern Tutorial', url: 'https://javascript.info', type: 'document' },
    { title: 'MDN JavaScript Guide', url: 'https://developer.mozilla.org/javascript', type: 'document' },
    { title: 'JavaScript Practice Projects', url: 'https://github.com/javascript-projects', type: 'course' }
  ],
  'Git': [
    { title: 'Git Handbook', url: 'https://git-scm.com/book', type: 'document' },
    { title: 'Git Exercises', url: 'https://gitexercises.fracz.com', type: 'course' },
    { title: 'Advanced Git', url: 'https://github.com/git-advanced', type: 'course' }
  ],
  'React': [
    { title: 'React Official Tutorial', url: 'https://reactjs.org/tutorial', type: 'document' },
    { title: 'React Practice Projects', url: 'https://github.com/react-projects', type: 'course' },
    { title: 'Advanced React Patterns', url: 'https://reactpatterns.com', type: 'document' }
  ],
  'Node.js': [
    { title: 'Node.js Documentation', url: 'https://nodejs.org/docs', type: 'document' },
    { title: 'Express.js Guide', url: 'https://expressjs.com', type: 'document' },
    { title: 'Node.js Best Practices', url: 'https://github.com/goldbergyoni/nodebestpractices', type: 'document' }
  ],
  'CSS': [
    { title: 'CSS Tricks', url: 'https://css-tricks.com', type: 'document' },
    { title: 'Flexbox Guide', url: 'https://flexboxfroggy.com', type: 'course' },
    { title: 'Grid Guide', url: 'https://cssgridgarden.com', type: 'course' }
  ],
  'HTML': [
    { title: 'HTML Reference', url: 'https://developer.mozilla.org/HTML', type: 'document' },
    { title: 'HTML Best Practices', url: 'https://htmlbestpractices.com', type: 'document' },
    { title: 'Accessibility Guide', url: 'https://webaim.org', type: 'document' }
  ],
  'Python': [
    { title: 'Python Official Tutorial', url: 'https://docs.python.org/3/tutorial/', type: 'document' },
    { title: 'Real Python Courses', url: 'https://realpython.com', type: 'course' },
    { title: 'Python Exercises', url: 'https://exercism.org/tracks/python', type: 'course' }
  ]
};

// Generate personalized recommendations
const generatePersonalizedRecommendations = (user) => {
  const recommendations = [];
  const userSkills = user.skills || [];

  // If user has no skills, suggest some popular ones
  if (userSkills.length === 0) {
    return [
      {
        skillName: "JavaScript",
        reason: "Start with JavaScript - it's the foundation of modern web development.",
        suggestedAction: "Begin with basic concepts and build simple interactive websites.",
        resourceLinks: skillResources['JavaScript'] || [],
        priority: "HIGH",
        currentLevel: 0
      },
      {
        skillName: "HTML & CSS",
        reason: "Essential for building web pages and understanding web structure.",
        suggestedAction: "Learn semantic HTML and modern CSS layout techniques.",
        resourceLinks: [...(skillResources['HTML'] || []), ...(skillResources['CSS'] || [])],
        priority: "HIGH",
        currentLevel: 0
      }
    ];
  }

  // Analyze each skill for improvement
  userSkills.forEach(skill => {
    const currentLevel = skill.level;
    let priority = 'LOW';
    let reason = '';
    let suggestedAction = '';

    if (currentLevel < 40) {
      priority = 'HIGH';
      reason = `Your ${skill.name} skills are at beginner level (${currentLevel}%). Building strong fundamentals is crucial.`;
      suggestedAction = `Focus on core concepts and build basic projects to establish foundation.`;
    } else if (currentLevel < 70) {
      priority = 'MEDIUM';
      reason = `Your ${skill.name} skills are developing (${currentLevel}%). You're ready for intermediate concepts.`;
      suggestedAction = `Practice advanced features and work on real-world projects to reach proficiency.`;
    } else if (currentLevel < 90) {
      priority = 'MEDIUM';
      reason = `You have strong ${skill.name} skills (${currentLevel}%). Time to master advanced topics.`;
      suggestedAction = `Learn advanced patterns, optimize performance, and mentor others.`;
    } else {
      return; // Skip skills at 90% or higher
    }

    // Get resources for this specific skill
    const resources = skillResources[skill.name] || [
      { title: `${skill.name} Documentation`, url: `https://google.com/search?q=${skill.name}+tutorial`, type: 'document' },
      { title: `${skill.name} Practice`, url: `https://github.com/${skill.name}-practice`, type: 'course' },
      { title: `${skill.name} Community`, url: `https://stackoverflow.com/questions/tagged/${skill.name}`, type: 'document' }
    ];

    recommendations.push({
      skillName: skill.name,
      reason,
      suggestedAction,
      resourceLinks: resources,
      priority,
      currentLevel
    });
  });

  // Add recommendations for missing complementary skills
  const userSkillNames = userSkills.map(skill => skill.name);
  
  // Suggest complementary skills based on existing skills
  const complementarySkills = {
    'JavaScript': ['React', 'Node.js'],
    'React': ['Node.js', 'CSS'],
    'Node.js': ['JavaScript', 'Git'],
    'HTML': ['CSS', 'JavaScript'],
    'CSS': ['JavaScript', 'React']
  };

  Object.keys(complementarySkills).forEach(skill => {
    if (userSkillNames.includes(skill) && !recommendations.find(rec => complementarySkills[skill].includes(rec.skillName))) {
      complementarySkills[skill].forEach(compSkill => {
        if (!userSkillNames.includes(compSkill) && skillResources[compSkill]) {
          recommendations.push({
            skillName: compSkill,
            reason: `Your ${skill} skills would be complemented by learning ${compSkill}.`,
            suggestedAction: `Start with fundamentals and integrate with your ${skill} knowledge.`,
            resourceLinks: skillResources[compSkill] || [],
            priority: 'MEDIUM',
            currentLevel: 0
          });
        }
      });
    }
  });

  // Sort by priority and current level (lower levels first)
  return recommendations.sort((a, b) => {
    const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return a.currentLevel - b.currentLevel;
  });
};

// Get personalized suggestions for logged-in user
router.get("/", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const recommendations = generatePersonalizedRecommendations(user);

    return res.status(200).json({
      success: true,
      recommendations: recommendations,
      user: {
        firstName: user.firstName,
        lastName: user.lastName,
        skills: user.skills
      }
    });
  } catch (error) {
    console.error("Error generating suggestions:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;