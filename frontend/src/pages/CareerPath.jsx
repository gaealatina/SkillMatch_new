import { useState, useEffect } from 'react';
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

// Color helpers
const getMatchColor = (percentage) => {
  if (percentage >= 80) return 'text-green-600';
  if (percentage >= 60) return 'text-blue-600';
  if (percentage >= 40) return 'text-yellow-600';
  return 'text-gray-500';
};

const getMatchBgColor = (percentage) => {
  if (percentage >= 80) return 'bg-green-500';
  if (percentage >= 60) return 'bg-blue-500';
  if (percentage >= 40) return 'bg-yellow-500';
  return 'bg-gray-300';
};

const getImportanceBadgeColor = (importance) => {
  switch (importance) {
    case 'critical':
      return 'bg-red-100 text-red-800 border border-red-200';
    case 'important':
      return 'bg-blue-100 text-blue-800 border border-blue-200';
    case 'nice-to-have':
      return 'bg-gray-100 text-gray-800 border border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800';
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

const getDemandBadge = (demandLevel) => {
  switch (demandLevel) {
    case 'high':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
    case 'low':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function CareerPath() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [rankedPaths, setRankedPaths] = useState([]);
  const [topMatch, setTopMatch] = useState(null);
  const [loading, setLoading] = useState(true);
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
        setApiError(null);
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
        setApiError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRecommendations();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing your skills and career matches...</p>
          <p className="text-sm text-gray-500 mt-2">Checking your skills database</p>
        </div>
      </div>
    );
  }

  // Show error state or no data state
  if (apiError || !topMatch || rankedPaths.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <DashboardNav 
          userName={userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
          user={userData}
          isMobileMenuOpen={isMobileMenuOpen}
          setIsMobileMenuOpen={setIsMobileMenuOpen}
        />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Briefcase className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {apiError ? 'Career Recommendations' : 'Welcome to Career Paths'}
            </h2>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              {apiError === 'No skills found. Please add your skills to get career recommendations.' 
                ? "You haven't added any skills yet. Add your skills to discover career paths that match your expertise."
                : apiError || "We'll analyze your skills and show you the best career matches."
              }
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => navigate('/profile')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors block mx-auto"
              >
                {userSkills.length === 0 ? 'Add Your First Skill' : 'Manage Your Skills'}
              </button>
              
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors block mx-auto"
              >
                Refresh Recommendations
              </button>
            </div>
          </div>
        </main>
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
            Personalized career opportunities based on your {userSkills.length} skills
          </p>
          
          {/* Success Message */}
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-green-800 font-medium">
                  ✅ Using your {userSkills.length} skills for personalized recommendations
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Found {rankedPaths.length} career paths matching your skills
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Top Match Highlight Card */}
        <section className="mb-8 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border-2 border-blue-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-blue-600" />
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Best Match for You</h2>
                <p className="text-sm text-gray-600">Based on your current skill set and proficiency levels</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-4xl font-bold ${getMatchColor(topMatch.matchPercentage)}`}>
                {topMatch.matchPercentage}%
              </div>
              <p className="text-sm text-gray-600">Match Score</p>
            </div>
          </div>

          {/* Career Overview */}
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl">{topMatch.icon}</div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-900">{topMatch.title}</h3>
              <p className="text-gray-600 mb-3">{topMatch.description}</p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-sm">
                  <TrendingUp size={14} />
                  {topMatch.growthRate}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full border border-gray-300 text-gray-700 text-sm">
                  {topMatch.averageSalary}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${getDemandBadge(topMatch.demandLevel)}`}>
                  {topMatch.demandLevel === 'high' ? 'High Demand' : 'Medium Demand'}
                </span>
              </div>
            </div>
          </div>

          {/* Skill Match Summary */}
          {topMatch.criticalSkillsMet !== undefined && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
              <h4 className="font-semibold text-gray-900 mb-2">Skill Match Summary</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-gray-900">{topMatch.criticalSkillsMet}/{topMatch.totalCriticalSkills}</div>
                  <div className="text-sm text-gray-600">Critical Skills</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{topMatch.matchPercentage}%</div>
                  <div className="text-sm text-gray-600">Overall Match</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{topMatch.skillDetails?.filter(s => s.meetsRequirement).length || 0}</div>
                  <div className="text-sm text-gray-600">Requirements Met</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 capitalize">{topMatch.readinessLevel}</div>
                  <div className="text-sm text-gray-600">Readiness</div>
                </div>
              </div>
            </div>
          )}

          {/* Skill Analysis Grid */}
          <div>
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Skill Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topMatch.skillDetails && topMatch.skillDetails.map((skill, index) => (
                <div key={index} className={`bg-white rounded-lg border p-4 ${
                  skill.meetsRequirement ? 'border-green-200' : 'border-red-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {skill.meetsRequirement ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-red-500" />
                      )}
                      <span className="font-medium text-gray-900">{skill.name}</span>
                    </div>
                    <div className="flex gap-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${getImportanceBadgeColor(skill.importance)}`}>
                        {getImportanceLabel(skill.importance)}
                      </span>
                      {!skill.meetsRequirement && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800">
                          Need +{skill.gap}%
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        Your Level: {skill.userProficiency}%
                        {skill.minProficiency && ` (Required: ${skill.minProficiency}%)`}
                      </span>
                      <span className={`font-medium ${
                        skill.meetsRequirement ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {skill.meetsRequirement ? 'Meets Requirement' : 'Needs Improvement'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`h-3 rounded-full ${
                          skill.meetsRequirement ? 'bg-green-500' : 'bg-red-500'
                        }`}
                        style={{ width: `${Math.min(skill.userProficiency, 100)}%` }}
                      />
                      {skill.minProficiency && (
                        <div 
                          className="h-3 rounded-full bg-yellow-400 relative -top-3 opacity-50"
                          style={{ width: `${skill.minProficiency}%` }}
                        />
                      )}
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
              <div key={career.id} className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
                {/* Card Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl">{career.icon}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{career.title}</h3>
                      <p className="text-sm text-gray-600">{career.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-2xl font-bold ${getMatchColor(career.matchPercentage)}`}>
                      {career.matchPercentage}%
                    </div>
                    <p className="text-xs text-gray-600">Match</p>
                  </div>
                </div>

                {/* Market Data Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-800 text-xs">
                    <TrendingUp size={12} />
                    {career.growthRate}
                  </span>
                  <span className="inline-flex items-center px-2 py-1 rounded-full border border-gray-300 text-gray-700 text-xs">
                    {career.averageSalary}
                  </span>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${getDemandBadge(career.demandLevel)}`}>
                    {career.demandLevel === 'high' ? 'High Demand' : 'Medium Demand'}
                  </span>
                </div>

                {/* Overall Match Progress Bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900">Overall Match</span>
                    <span className="text-sm text-gray-600">{career.matchPercentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getMatchBgColor(career.matchPercentage)}`}
                      style={{ width: `${career.matchPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Critical Skills Progress */}
                {career.criticalSkillsMet !== undefined && (
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900">
                        Critical Skills: {career.criticalSkillsMet}/{career.totalCriticalSkills}
                      </span>
                      <span className="text-sm text-gray-600">
                        {Math.round((career.criticalSkillsMet / career.totalCriticalSkills) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="h-2 rounded-full bg-red-500"
                        style={{ width: `${(career.criticalSkillsMet / career.totalCriticalSkills) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Required Skills Preview */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-900 mb-2">Key Required Skills:</p>
                  <div className="flex flex-wrap gap-2">
                    {career.skillDetails && career.skillDetails.slice(0, 6).map((skill, index) => (
                      <span 
                        key={index}
                        className={`text-xs px-2 py-1 rounded-full ${
                          skill.meetsRequirement 
                            ? 'bg-green-100 text-green-800 border border-green-200' 
                            : 'border border-gray-300 text-gray-700'
                        }`}
                      >
                        {skill.name} {skill.meetsRequirement ? '✓' : '✗'}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Improvement Suggestion */}
                {career.matchPercentage < 80 && career.skillDetails && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-blue-600" />
                      <p className="text-sm text-gray-800">
                        Focus on: {career.skillDetails
                          .filter(s => !s.meetsRequirement && s.importance === 'critical')
                          .slice(0, 2)
                          .map(s => s.name)
                          .join(', ')}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Next Steps Card */}
        <section className="bg-gradient-to-br from-white to-gray-50 rounded-2xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-6">
            <Lightbulb className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Next Steps</h2>
          </div>
          <p className="text-gray-600 mb-6">
            Ready to advance your career? Here's what you can do
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Strengthen Critical Skills</h4>
                <p className="text-sm text-gray-600">
                  Focus on mastering the critical skills for your target role. Aim for 80%+ proficiency.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Build Your Portfolio</h4>
                <p className="text-sm text-gray-600">
                  Create projects that showcase your skills in real-world scenarios.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-white border border-gray-200">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900">Gain Experience</h4>
                <p className="text-sm text-gray-600">
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