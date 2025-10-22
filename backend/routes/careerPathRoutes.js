import express from 'express';
import { protect as authMiddleware } from '../middleware/auth.js';
import User from '../models/User.js';

const router = express.Router();

// Career paths data with required skills
const careerPathsData = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'Build user interfaces and interactive web experiences',
    icon: '💻',
    requiredSkills: [
      { name: 'JavaScript', importance: 'critical', minProficiency: 70 },
      { name: 'React', importance: 'critical', minProficiency: 70 },
      { name: 'CSS', importance: 'critical', minProficiency: 70 },
      { name: 'HTML', importance: 'critical', minProficiency: 70 },
      { name: 'TypeScript', importance: 'important', minProficiency: 60 },
      { name: 'Git', importance: 'important', minProficiency: 60 },
      { name: 'Problem Solving', importance: 'important', minProficiency: 65 },
      { name: 'UI/UX Design', importance: 'nice-to-have', minProficiency: 50 },
    ],
    averageSalary: '$75,000 - $120,000',
    demandLevel: 'high',
    growthRate: '+15% annually',
  },
  {
    id: '2',
    title: 'UI/UX Designer',
    description: 'Create intuitive and beautiful user experiences',
    icon: '🎨',
    requiredSkills: [
      { name: 'UI/UX Design', importance: 'critical', minProficiency: 75 },
      { name: 'Communication', importance: 'critical', minProficiency: 70 },
      { name: 'Problem Solving', importance: 'critical', minProficiency: 70 },
      { name: 'CSS', importance: 'important', minProficiency: 60 },
      { name: 'Figma', importance: 'important', minProficiency: 65 },
      { name: 'JavaScript', importance: 'nice-to-have', minProficiency: 50 },
      { name: 'React', importance: 'nice-to-have', minProficiency: 50 },
    ],
    averageSalary: '$70,000 - $110,000',
    demandLevel: 'high',
    growthRate: '+13% annually',
  },
  {
    id: '3',
    title: 'Backend Developer',
    description: 'Build server-side logic and database systems',
    icon: '⚙️',
    requiredSkills: [
      { name: 'Node.js', importance: 'critical', minProficiency: 70 },
      { name: 'Python', importance: 'critical', minProficiency: 70 },
      { name: 'Database Design', importance: 'critical', minProficiency: 70 },
      { name: 'SQL', importance: 'critical', minProficiency: 70 },
      { name: 'Git', importance: 'important', minProficiency: 60 },
      { name: 'Problem Solving', importance: 'important', minProficiency: 65 },
      { name: 'API Design', importance: 'important', minProficiency: 65 },
    ],
    averageSalary: '$80,000 - $130,000',
    demandLevel: 'high',
    growthRate: '+17% annually',
  },
  {
    id: '4',
    title: 'Full Stack Developer',
    description: 'Master both frontend and backend development',
    icon: '🚀',
    requiredSkills: [
      { name: 'JavaScript', importance: 'critical', minProficiency: 75 },
      { name: 'React', importance: 'critical', minProficiency: 70 },
      { name: 'Node.js', importance: 'critical', minProficiency: 70 },
      { name: 'Database Design', importance: 'critical', minProficiency: 65 },
      { name: 'TypeScript', importance: 'important', minProficiency: 60 },
      { name: 'Git', importance: 'important', minProficiency: 65 },
      { name: 'Problem Solving', importance: 'important', minProficiency: 70 },
      { name: 'CSS', importance: 'important', minProficiency: 65 },
    ],
    averageSalary: '$85,000 - $140,000',
    demandLevel: 'high',
    growthRate: '+18% annually',
  },
  {
    id: '5',
    title: 'Data Analyst',
    description: 'Transform data into actionable insights',
    icon: '📊',
    requiredSkills: [
      { name: 'Python', importance: 'critical', minProficiency: 75 },
      { name: 'SQL', importance: 'critical', minProficiency: 75 },
      { name: 'Database Design', importance: 'critical', minProficiency: 70 },
      { name: 'Data Analysis', importance: 'critical', minProficiency: 70 },
      { name: 'Problem Solving', importance: 'important', minProficiency: 70 },
      { name: 'Communication', importance: 'important', minProficiency: 65 },
      { name: 'Statistics', importance: 'important', minProficiency: 65 },
    ],
    averageSalary: '$65,000 - $105,000',
    demandLevel: 'high',
    growthRate: '+20% annually',
  },
  {
    id: '6',
    title: 'Software Engineer',
    description: 'Design and develop software solutions',
    icon: '👨‍💻',
    requiredSkills: [
      { name: 'JavaScript', importance: 'critical', minProficiency: 70 },
      { name: 'Git', importance: 'critical', minProficiency: 70 },
      { name: 'Problem Solving', importance: 'critical', minProficiency: 75 },
      { name: 'Python', importance: 'important', minProficiency: 65 },
      { name: 'Java', importance: 'important', minProficiency: 65 },
      { name: 'Agile/Scrum', importance: 'important', minProficiency: 60 },
      { name: 'Team Leadership', importance: 'nice-to-have', minProficiency: 50 },
      { name: 'System Design', importance: 'important', minProficiency: 65 },
    ],
    averageSalary: '$90,000 - $150,000',
    demandLevel: 'high',
    growthRate: '+16% annually',
  },
];

// Calculate match percentage between user skills and career path requirements
const calculateMatch = (careerPath, userSkills) => {
  let totalWeight = 0;
  let matchedWeight = 0;

  careerPath.requiredSkills.forEach(requiredSkill => {
    // Assign weights based on importance
    const weight = requiredSkill.importance === 'critical' ? 3 
                 : requiredSkill.importance === 'important' ? 2 
                 : 1;
    
    totalWeight += weight;
    
    // Find matching user skill (case insensitive and partial matching)
    const userSkill = userSkills.find(us => {
      const skillName = us.name.toLowerCase();
      const requiredName = requiredSkill.name.toLowerCase();
      
      // Exact match or partial match
      return skillName === requiredName || 
             skillName.includes(requiredName) || 
             requiredName.includes(skillName);
    });
    
    if (userSkill && userSkill.level > 0) {
      // Calculate contribution based on proficiency and weight
      const contribution = (userSkill.level / 100) * weight;
      matchedWeight += contribution;
    }
  });

  // Calculate match percentage
  const matchPercentage = totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  return matchPercentage;
};

// Get detailed skill analysis for a career path
const getSkillDetails = (careerPath, userSkills) => {
  return careerPath.requiredSkills.map(requiredSkill => {
    // Find matching user skill (case insensitive and partial matching)
    const userSkill = userSkills.find(us => {
      const skillName = us.name.toLowerCase();
      const requiredName = requiredSkill.name.toLowerCase();
      
      return skillName === requiredName || 
             skillName.includes(requiredName) || 
             requiredName.includes(skillName);
    });
    
    const userProficiency = userSkill ? userSkill.level : 0;
    const hasSkill = userProficiency >= 60;
    const meetsRequirement = userProficiency >= requiredSkill.minProficiency;

    return {
      name: requiredSkill.name,
      importance: requiredSkill.importance,
      minProficiency: requiredSkill.minProficiency,
      userProficiency: userProficiency,
      hasSkill: hasSkill,
      meetsRequirement: meetsRequirement,
      gap: Math.max(0, requiredSkill.minProficiency - userProficiency),
      userSkillName: userSkill ? userSkill.name : null,
    };
  });
};

// Generate personalized recommendations
const generateRecommendations = (careerPath, skillDetails, matchPercentage) => {
  const recommendations = [];

  // Get critical skills that need improvement
  const criticalGaps = skillDetails.filter(
    skill => skill.importance === 'critical' && !skill.meetsRequirement
  );

  // Get important skills that need improvement
  const importantGaps = skillDetails.filter(
    skill => skill.importance === 'important' && !skill.meetsRequirement
  );

  if (matchPercentage >= 80) {
    recommendations.push({
      type: 'success',
      message: `Excellent match! You have the skills needed for ${careerPath.title}. Consider applying for entry to mid-level positions.`,
    });
  } else if (matchPercentage >= 60) {
    recommendations.push({
      type: 'info',
      message: `Good match! You're on the right track for ${careerPath.title}. Focus on strengthening a few key areas.`,
    });
  } else if (matchPercentage >= 40) {
    recommendations.push({
      type: 'warning',
      message: `Moderate match. With focused learning, you can become qualified for ${careerPath.title} within 6-12 months.`,
    });
  } else {
    recommendations.push({
      type: 'info',
      message: `${careerPath.title} requires significant skill development. Consider starting with a related foundational role.`,
    });
  }

  // Add specific skill recommendations
  if (criticalGaps.length > 0) {
    const skillNames = criticalGaps.slice(0, 3).map(s => s.name).join(', ');
    recommendations.push({
      type: 'action',
      message: `Priority: Master these critical skills - ${skillNames}`,
      skills: criticalGaps.map(s => s.name),
    });
  }

  if (importantGaps.length > 0 && criticalGaps.length === 0) {
    const skillNames = importantGaps.slice(0, 2).map(s => s.name).join(', ');
    recommendations.push({
      type: 'action',
      message: `Strengthen these important skills - ${skillNames}`,
      skills: importantGaps.map(s => s.name),
    });
  }

  return recommendations;
};

// GET /api/career-path/recommendations
router.get('/recommendations', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;

    // Fetch user with skills from MongoDB
    const user = await User.findById(userId).select('skills firstName lastName email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Transform skills data to match expected format
    const userSkills = user.skills.map(skill => ({
      name: skill.name,
      level: skill.level,
      category: skill.category
    }));

    // If no skills found, return empty recommendations with message
    if (userSkills.length === 0) {
      return res.json({
        message: 'No skills found. Please add your skills to get career recommendations.',
        careerPaths: [],
        topMatch: null,
        userSkillsCount: 0,
        userName: `${user.firstName} ${user.lastName}`,
      });
    }

    // Calculate matches for all career paths
    const rankedPaths = careerPathsData.map(path => {
      const matchPercentage = calculateMatch(path, userSkills);
      const skillDetails = getSkillDetails(path, userSkills);
      const recommendations = generateRecommendations(path, skillDetails, matchPercentage);

      // Calculate additional metrics
      const criticalSkillsMet = skillDetails.filter(
        s => s.importance === 'critical' && s.meetsRequirement
      ).length;
      const totalCriticalSkills = skillDetails.filter(
        s => s.importance === 'critical'
      ).length;

      return {
        ...path,
        matchPercentage,
        skillDetails,
        recommendations,
        criticalSkillsMet,
        totalCriticalSkills,
        readinessLevel: matchPercentage >= 80 ? 'ready' 
                       : matchPercentage >= 60 ? 'almost-ready'
                       : matchPercentage >= 40 ? 'developing'
                       : 'beginner',
      };
    });

    // Sort by match percentage (highest first)
    rankedPaths.sort((a, b) => b.matchPercentage - a.matchPercentage);

    // Get top match
    const topMatch = rankedPaths[0];

    res.json({
      message: 'Career recommendations generated successfully',
      careerPaths: rankedPaths,
      topMatch: topMatch,
      userSkillsCount: userSkills.length,
      userName: `${user.firstName} ${user.lastName}`,
      userEmail: user.email,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    res.status(500).json({ 
      error: 'Failed to generate career recommendations',
      details: error.message
    });
  }
});

// GET /api/career-path/debug-user
router.get('/debug-user', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userId = req.user._id;
    const user = await User.findById(userId).select('skills firstName lastName email');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        skills: user.skills,
        skillsCount: user.skills.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;