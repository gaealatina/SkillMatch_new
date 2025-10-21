import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  TrendingUp, 
  Lightbulb, 
  CheckCircle2, 
  AlertCircle, 
  GraduationCap,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardNav from '../components/dashboardNAv.jsx';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Mock user skills data
const mockUserSkills = [
  { skillId: '1', skillName: 'JavaScript', proficiency: 85, category: 'Programming' },
  { skillId: '2', skillName: 'React', proficiency: 80, category: 'Web Development' },
  { skillId: '3', skillName: 'CSS/Tailwind', proficiency: 90, category: 'Web Development' },
  { skillId: '4', skillName: 'TypeScript', proficiency: 75, category: 'Programming' },
  { skillId: '5', skillName: 'Git/GitHub', proficiency: 70, category: 'Tools' },
  { skillId: '6', skillName: 'Problem Solving', proficiency: 75, category: 'Soft Skills' },
  { skillId: '7', skillName: 'UI/UX Design', proficiency: 0, category: 'Design' },
  { skillId: '8', skillName: 'Node.js', proficiency: 0, category: 'Backend' },
  { skillId: '9', skillName: 'Python', proficiency: 0, category: 'Programming' },
  { skillId: '10', skillName: 'SQL', proficiency: 0, category: 'Database' },
  { skillId: '11', skillName: 'Database Design', proficiency: 0, category: 'Database' },
  { skillId: '12', skillName: 'Java', proficiency: 0, category: 'Programming' },
  { skillId: '13', skillName: 'Agile/Scrum', proficiency: 0, category: 'Methodology' },
  { skillId: '14', skillName: 'Team Leadership', proficiency: 0, category: 'Soft Skills' },
  { skillId: '15', skillName: 'Communication', proficiency: 0, category: 'Soft Skills' },
];

// Career paths data
const careerPaths = [
  {
    id: '1',
    title: 'Frontend Developer',
    description: 'Build user interfaces and interactive web experiences',
    icon: '💻',
    requiredSkills: [
      { name: 'JavaScript', importance: 'critical' },
      { name: 'React', importance: 'critical' },
      { name: 'CSS/Tailwind', importance: 'critical' },
      { name: 'TypeScript', importance: 'important' },
      { name: 'Git/GitHub', importance: 'important' },
      { name: 'Problem Solving', importance: 'important' },
      { name: 'UI/UX Design', importance: 'nice-to-have' },
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
      { name: 'UI/UX Design', importance: 'critical' },
      { name: 'Communication', importance: 'critical' },
      { name: 'Problem Solving', importance: 'critical' },
      { name: 'CSS/Tailwind', importance: 'important' },
      { name: 'JavaScript', importance: 'nice-to-have' },
      { name: 'React', importance: 'nice-to-have' },
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
      { name: 'Node.js', importance: 'critical' },
      { name: 'Python', importance: 'critical' },
      { name: 'Database Design', importance: 'critical' },
      { name: 'SQL', importance: 'critical' },
      { name: 'Git/GitHub', importance: 'important' },
      { name: 'Problem Solving', importance: 'important' },
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
      { name: 'JavaScript', importance: 'critical' },
      { name: 'React', importance: 'critical' },
      { name: 'Node.js', importance: 'critical' },
      { name: 'Database Design', importance: 'critical' },
      { name: 'TypeScript', importance: 'important' },
      { name: 'Git/GitHub', importance: 'important' },
      { name: 'Problem Solving', importance: 'important' },
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
      { name: 'Python', importance: 'critical' },
      { name: 'SQL', importance: 'critical' },
      { name: 'Database Design', importance: 'critical' },
      { name: 'Problem Solving', importance: 'important' },
      { name: 'Communication', importance: 'important' },
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
      { name: 'JavaScript', importance: 'critical' },
      { name: 'Git/GitHub', importance: 'critical' },
      { name: 'Problem Solving', importance: 'critical' },
      { name: 'Python', importance: 'important' },
      { name: 'Java', importance: 'important' },
      { name: 'Agile/Scrum', importance: 'important' },
      { name: 'Team Leadership', importance: 'nice-to-have' },
    ],
    averageSalary: '$90,000 - $150,000',
    demandLevel: 'high',
    growthRate: '+16% annually',
  },
];

// Match calculation algorithm
const calculateMatch = (careerPath, userSkills) => {
  let totalWeight = 0;
  let matchedWeight = 0;

  careerPath.requiredSkills.forEach(skill => {
    const weight = skill.importance === 'critical' ? 3 
                 : skill.importance === 'important' ? 2 
                 : 1;
    
    totalWeight += weight;
    
    const userSkill = userSkills.find(us => us.skillName === skill.name);
    if (userSkill) {
      const contribution = (userSkill.proficiency / 100) * weight;
      matchedWeight += contribution;
    }
  });

  return Math.round((matchedWeight / totalWeight) * 100);
};

// Get skill details for a career path
const getSkillDetails = (careerPath, userSkills) => {
  return careerPath.requiredSkills.map(skill => {
    const userSkill = userSkills.find(us => us.skillName === skill.name);
    return {
      name: skill.name,
      importance: skill.importance,
      userProficiency: userSkill ? userSkill.proficiency : 0,
      hasSkill: userSkill && userSkill.proficiency >= 60,
    };
  });
};

// Color helpers
const getMatchColor = (percentage) => {
  if (percentage >= 80) return 'text-success';
  if (percentage >= 60) return 'text-secondary';
  if (percentage >= 40) return 'text-warning';
  return 'text-muted-foreground';
};

const getMatchBgColor = (percentage) => {
  if (percentage >= 80) return 'bg-success';
  if (percentage >= 60) return 'bg-secondary';
  if (percentage >= 40) return 'bg-warning';
  return 'bg-muted';
};

const getImportanceBadgeColor = (importance) => {
  switch (importance) {
    case 'critical':
      return 'bg-destructive text-destructive-foreground';
    case 'important':
      return 'bg-primary text-primary-foreground';
    case 'nice-to-have':
      return 'border border-border text-muted-foreground';
    default:
      return 'bg-muted text-muted-foreground';
  }
};

const getImportanceLabel = (importance) => {
  switch (importance) {
    case 'critical':
      return 'Critical';
    case 'important':
      return 'Important';
    case 'nice-to-have':
      return 'Nice to have';
    default:
      return importance;
  }
};

export default function CareerPath() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rankedPaths, setRankedPaths] = useState([]);
  const [topMatch, setTopMatch] = useState(null);
  const [userSkills, setUserSkills] = useState([]);
  const [apiError, setApiError] = useState(null);

  // Fetch user profile data for navbar
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/settings/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  // Fetch user data and career recommendations
  useEffect(() => {
    const fetchUserDataAndRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/');
          return;
        }

        // Fetch user profile first for navbar
        await fetchUserProfile();

        // Fetch career recommendations from API
        try {
          const careerResponse = await axios.get(`${API_BASE_URL}/career-path/recommendations`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 15000,
          });
          
          if (careerResponse.data.careerPaths && careerResponse.data.careerPaths.length > 0) {
            setRankedPaths(careerResponse.data.careerPaths);
            setTopMatch(careerResponse.data.topMatch);
            setUserSkills(careerResponse.data.userSkillsCount > 0 ? careerResponse.data.userSkillsCount : userSkills);
          } else {
            setApiError('No career recommendations available');
            toast.info('Add more skills to get better career recommendations');
          }

        } catch (careerError) {
          setApiError(careerError.response?.data?.error || careerError.message);
          
          if (careerError.response?.status === 401) {
            toast.error('Authentication failed. Please login again.');
            navigate('/');
            return;
          }
          
          if (careerError.response?.status === 404) {
            toast.info('No skills found. Please add your skills first.');
          } else {
            toast.error('Failed to load career recommendations');
          }
        }
      } catch (err) {
        console.error('Error fetching user:', err);
        toast.error('Failed to load user data');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRecommendations();
  }, [navigate]);

  // Calculate career matches and rank them
  const rankedPaths = useMemo(() => {
    return careerPaths
      .map(path => ({
        ...path,
        matchPercentage: calculateMatch(path, mockUserSkills),
        skillDetails: getSkillDetails(path, mockUserSkills),
      }))
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  }, []);

  const topMatch = rankedPaths[0];

  const handleExploreCareer = (career) => {
    toast.success(`Exploring ${career.title}`, {
      description: `${career.matchPercentage}% match - Great choice!`
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading career paths...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userName={userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
        user={userData}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Career Path Recommendations</h1>
          </div>
          <p className="text-muted-foreground">
            Discover career opportunities that match your skills and expertise
          </p>
        </div>

        {/* Top Match Highlight Card */}
        <section className="mb-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border-2 border-primary/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-xl font-semibold text-card-foreground">Best Match for You</h2>
                <p className="text-sm text-muted-foreground">Based on your current skill set and proficiency levels</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getMatchColor(topMatch.matchPercentage)}`}>
                {topMatch.matchPercentage}%
              </div>
              <p className="text-sm text-muted-foreground">Match</p>
            </div>
          </div>

          {/* Career Overview */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{topMatch.icon}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-card-foreground">{topMatch.title}</h3>
              <p className="text-muted-foreground mb-3">{topMatch.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm">
                  <TrendingUp size={14} />
                  {topMatch.growthRate}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full border border-border text-muted-foreground text-sm">
                  {topMatch.averageSalary}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full bg-success text-success-foreground text-sm">
                  High Demand
                </span>
              </div>
            </div>
          </div>

          {/* Encouragement Alert */}
          <div className="bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2">
              <Lightbulb className="h-4 w-4 text-primary" />
              <p className="text-sm text-card-foreground">
                You're a great fit for this role! Focus on strengthening your critical skills to maximize your potential.
              </p>
            </div>
          </div>

          {/* Skill Analysis Grid */}
          <div>
            <h4 className="text-lg font-semibold text-card-foreground mb-4">Skill Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topMatch.skillDetails.map((skill, index) => (
                <div key={index} className="bg-card rounded-lg border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {skill.hasSkill ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-warning" />
                      )}
                      <span className="font-medium text-card-foreground">{skill.name}</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getImportanceBadgeColor(skill.importance)}`}>
                      {getImportanceLabel(skill.importance)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Proficiency</span>
                      <span className="text-card-foreground">{skill.userProficiency}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${getMatchBgColor(skill.userProficiency)}`}
                        style={{ width: `${skill.userProficiency}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* All Career Paths Grid */}
        <section className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">All Career Paths</h2>
            <p className="text-muted-foreground">
              Explore other career opportunities and see how your skills align
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rankedPaths.map((career) => (
              <div key={career.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{career.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-card-foreground">{career.title}</h3>
                      <p className="text-sm text-muted-foreground">{career.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchColor(career.matchPercentage)}`}>
                      {career.matchPercentage}%
                    </div>
                    <p className="text-xs text-muted-foreground">Match</p>
                  </div>
                </div>

                {/* Market Data Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-secondary text-secondary-foreground text-xs">
                    <TrendingUp size={12} />
                    {career.growthRate}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full border border-border text-muted-foreground text-xs">
                    {career.averageSalary}
                  </span>
                </div>

                {/* Overall Match Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-card-foreground">Overall Match</span>
                    <span className="text-sm text-muted-foreground">{career.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getMatchBgColor(career.matchPercentage)}`}
                      style={{ width: `${career.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Required Skills Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-card-foreground mb-2">Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.skillDetails.slice(0, 4).map((skill, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          skill.hasSkill 
                            ? 'bg-success text-success-foreground' 
                            : 'border border-border text-muted-foreground'
                        }`}
                      >
                        {skill.name}
                      </span>
                    ))}
                    {career.skillDetails.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full border border-border text-muted-foreground">
                        +{career.skillDetails.length - 4} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Improvement Suggestion */}
                {career.matchPercentage < 60 && (
                  <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <p className="text-sm text-card-foreground">
                        Focus on developing {career.skillDetails
                          .filter(s => !s.hasSkill && s.importance === 'critical')
                          .slice(0, 2)
                          .map(s => s.name)
                          .join(' and ')} to improve your match
                      </p>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => handleExploreCareer(career)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Explore Career
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps Card */}
        <section className="bg-gradient-to-br from-card to-muted/20 rounded-2xl border border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-card-foreground">Next Steps</h2>
          </div>
          <p className="text-muted-foreground mb-6">
            Ready to advance your career? Here's what you can do
          </p>

          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground">Strengthen Critical Skills</h4>
                <p className="text-sm text-muted-foreground">
                  Focus on mastering the critical skills for your target role. Aim for 80%+ proficiency.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground">Build Your Portfolio</h4>
                <p className="text-sm text-muted-foreground">
                  Create projects that showcase your skills in real-world scenarios.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-card border border-border">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-card-foreground">Gain Experience</h4>
                <p className="text-sm text-muted-foreground">
                  Take on relevant project roles to gain practical experience and improve your skill ratings.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}