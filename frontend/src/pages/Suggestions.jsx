import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Lightbulb, 
  TrendingUp, 
  BookOpen, 
  ExternalLink, 
  Video, 
  FileText,
  CheckCircle,
  Plus,
  X,
  User
} from 'lucide-react';
import { toast } from 'sonner';
import DashboardNav from '../components/dashboardNav.jsx';
import { useTheme } from '../contexts/ThemeContext';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const proTips = [
  {
    icon: TrendingUp,
    title: 'Practice Consistently',
    description: 'Dedicate 30 minutes daily to skill development for best results'
  },
  {
    icon: BookOpen,
    title: 'Apply in Real Projects',
    description: 'Join group projects to apply new skills in practical scenarios'
  },
  {
    icon: Lightbulb,
    title: 'Track Your Progress',
    description: 'Regular self-assessment helps identify areas for improvement'
  },
  {
    icon: Video,
    title: 'Learn From Experts',
    description: 'Follow industry leaders and join learning communities'
  }
];

export default function Suggestions() {
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [recommendations, setRecommendations] = useState([]);
  const [goals, setGoals] = useState([]);
  const [hiddenRecommendations, setHiddenRecommendations] = useState(new Set());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userSkills, setUserSkills] = useState([]);

  // Fetch user data and recommendations
  useEffect(() => {
    const fetchUserDataAndRecommendations = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/');
          return;
        }

        // Fetch user profile data
        const profileResponse = await axios.get(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUserData(profileResponse.data.user);
        setUserSkills(profileResponse.data.skills || []);

        // Fetch personalized recommendations
        const suggestionsResponse = await axios.get(`${API_BASE_URL}/suggestions`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setRecommendations(suggestionsResponse.data.recommendations || []);
        
      } catch (err) {
        console.error('Error fetching data:', err);
        toast.error('Failed to load recommendations');
        
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserDataAndRecommendations();
  }, [navigate]);

  const visibleRecommendations = recommendations.filter(
    rec => !hiddenRecommendations.has(rec.skillName)
  );

  const totalResources = visibleRecommendations.reduce(
    (total, rec) => total + rec.resourceLinks.length, 0
  );

  const handleStartLearning = (skillName) => {
    toast.success(`Started learning ${skillName}!`, {
      description: 'Keep track of your progress in the Profile section'
    });
  };

  const handleAddToGoals = (skillName) => {
    if (goals.includes(skillName)) {
      toast.info(`${skillName} is already in your goals`, {
        description: 'Check your goals in the Settings section'
      });
      return;
    }

    setGoals([...goals, skillName]);
    toast.success(`Added ${skillName} to your goals!`, {
      description: 'View your goals in the Settings section'
    });
  };

  const handleNotInterested = (skillName) => {
    setHiddenRecommendations(prev => new Set([...prev, skillName]));
    toast.info(`Hidden recommendation for ${skillName}`, {
      description: 'You can adjust your preferences in Settings'
    });
  };

  const handleViewResource = (title, url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    toast.success(`Opening: ${title}`, {
      description: 'Resource opened in new tab'
    });
  };

  const getResourceIcon = (type) => {
    switch (type) {
      case 'course':
        return <BookOpen size={16} className="text-primary" />;
      case 'video':
        return <Video size={16} className="text-secondary" />;
      case 'document':
        return <FileText size={16} className="text-success" />;
      default:
        return <BookOpen size={16} className="text-primary" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading personalized recommendations...</p>
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
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
              <Lightbulb size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Personalized Skill Recommendations</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">
                Based on your current skills and progress, we've identified these growth opportunities.
                {userSkills.length > 0 && ` You have ${userSkills.length} skills in your profile.`}
              </p>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Active Recommendations */}
          <div className="bg-gradient-to-r from-primary to-secondary rounded-xl p-6 text-white hover:shadow-lg transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Active Recommendations</p>
                <p className="text-3xl font-bold">{visibleRecommendations.length}</p>
              </div>
              <TrendingUp size={24} className="opacity-80" />
            </div>
          </div>

          {/* Your Skills */}
          <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Your Skills</p>
                <p className="text-3xl font-bold text-primary">{userSkills.length}</p>
              </div>
              <User size={24} className="text-primary" />
            </div>
          </div>

          {/* Learning Resources */}
          <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Learning Resources</p>
                <p className="text-3xl font-bold text-success">{totalResources}</p>
              </div>
              <BookOpen size={24} className="text-success" />
            </div>
          </div>

          {/* Average Skill Level */}
          <div className="bg-card rounded-xl p-6 border border-border hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Avg. Skill Level</p>
                <p className="text-2xl font-bold text-warning">
                  {userSkills.length > 0 
                    ? Math.round(userSkills.reduce((sum, skill) => sum + skill.level, 0) / userSkills.length) + '%'
                    : '0%'
                  }
                </p>
              </div>
              <Lightbulb size={24} className="text-warning" />
            </div>
          </div>
        </div>

        {/* Recommendation Cards */}
        <div className="space-y-6 mb-8">
          {visibleRecommendations.length === 0 ? (
            <div className="bg-card rounded-xl border border-border p-8 text-center">
              <Lightbulb size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-bold text-card-foreground mb-2">No Recommendations Yet</h3>
              <p className="text-muted-foreground mb-4">
                {userSkills.length === 0 
                  ? "Add some skills to your profile to get personalized recommendations!"
                  : "Your skills are well-developed! Keep up the great work."
                }
              </p>
              {userSkills.length === 0 && (
                <button
                  onClick={() => navigate('/profile')}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[12px] hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} />
                  Add Your First Skill
                </button>
              )}
            </div>
          ) : (
            visibleRecommendations.map((rec, index) => (
              <div key={rec.skillName} className="bg-card rounded-xl border border-border overflow-hidden hover:shadow-md transition-all duration-200">
                {/* Card Header */}
                <div className="pt-6 px-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                        <Lightbulb size={24} className="text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-card-foreground">{rec.skillName}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(rec.priority)}`}>
                            {rec.priority} Priority
                          </span>
                          {rec.currentLevel > 0 && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                              Current: {rec.currentLevel}%
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Analysis Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-primary rounded-full"></div>
                        <h4 className="font-semibold text-card-foreground">Why This Matters</h4>
                      </div>
                      <p className="text-muted-foreground pl-3">{rec.reason}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-1 h-6 bg-secondary rounded-full"></div>
                        <h4 className="font-semibold text-card-foreground">Suggested Action</h4>
                      </div>
                      <p className="text-muted-foreground pl-3">{rec.suggestedAction}</p>
                    </div>
                  </div>

                  {/* Learning Resources */}
                  <div className="mb-6">
                    <h4 className="font-semibold text-card-foreground mb-4">Recommended Learning Resources</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {rec.resourceLinks.map((resource, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors border border-border">
                          {getResourceIcon(resource.type)}
                          <div className="flex-1">
                            <p className="font-medium text-card-foreground">{resource.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{resource.type}</p>
                          </div>
                          <button
                            onClick={() => handleViewResource(resource.title, resource.url)}
                            className="flex items-center gap-1 text-sm text-primary hover:text-primary/80 transition-colors"
                          >
                            View
                            <ExternalLink size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-3 pb-6">
                    <button
                      onClick={() => handleStartLearning(rec.skillName)}
                      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[12px] hover:bg-primary/90 transition-colors"
                    >
                      <CheckCircle size={16} />
                      Start Learning
                    </button>
                    <button
                      onClick={() => handleAddToGoals(rec.skillName)}
                      className="flex items-center gap-2 px-4 py-2 border border-border text-card-foreground rounded-[12px] hover:bg-secondary transition-colors"
                    >
                      <Plus size={16} />
                      Add to My Goals
                    </button>
                    <button
                      onClick={() => handleNotInterested(rec.skillName)}
                      className="flex items-center gap-2 px-4 py-2 text-muted-foreground hover:text-card-foreground hover:bg-muted outline-2px outline-border rounded-[12px] transition-colors"
                    >
                      <X size={16} />
                      Not Interested
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pro Tips Section */}
        <div className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Lightbulb size={20} className="text-warning" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground">Pro Tips for Skill Development</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {proTips.map((tip, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-muted/30 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <tip.icon size={16} className="text-primary" />
                </div>
                <div>
                  <h4 className="font-semibold text-card-foreground mb-1">{tip.title}</h4>
                  <p className="text-sm text-muted-foreground">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}