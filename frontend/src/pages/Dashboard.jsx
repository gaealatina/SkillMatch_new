import React, { useState, useEffect } from 'react';
import DashboardNav from '../components/dashboardNav';
import { 
  TrendingUp, 
  Users, 
  Plus, 
  ChevronDown, 
  ChevronRight, 
  Trash2,
  User,
  X,
  Briefcase
} from 'lucide-react';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const mockUserSkills = [
  { skillId: '1', skillName: 'JavaScript', proficiency: 85, category: 'Programming' },
  { skillId: '2', skillName: 'React', proficiency: 80, category: 'Web Development' },
  { skillId: '3', skillName: 'TypeScript', proficiency: 75, category: 'Programming' },
  { skillId: '4', skillName: 'Python', proficiency: 65, category: 'Programming' },
  { skillId: '5', skillName: 'CSS/Tailwind', proficiency: 90, category: 'Web Development' },
  { skillId: '6', skillName: 'Git/GitHub', proficiency: 70, category: 'Tools' },
  { skillId: '7', skillName: 'Communication', proficiency: 60, category: 'Soft Skills' },
  { skillId: '8', skillName: 'Problem Solving', proficiency: 75, category: 'Soft Skills' },
  { skillId: '9', skillName: 'Node.js', proficiency: 55, category: 'Backend' },
  { skillId: '10', skillName: 'Database Design', proficiency: 45, category: 'Backend' },
];

const mockRecommendations = [
  {
    id: '1',
    skillName: 'Team Leadership',
    reason: 'You have strong technical skills but limited leadership experience',
    suggestedAction: 'Try leading a group project as Team Lead or Project Manager',
    resourceLinks: [
      { title: 'Leadership Fundamentals Course', url: '#' },
      { title: 'Join Student Tech Committee', url: '#' }
    ]
  },
  {
    id: '2',
    skillName: 'SQL',
    reason: 'Database Design skills are developing, but SQL proficiency would complement them',
    suggestedAction: 'Complete an SQL fundamentals course and practice with real datasets',
    resourceLinks: [
      { title: 'SQL Crash Course', url: '#' },
      { title: 'Practice SQL Queries', url: '#' }
    ]
  },
  {
    id: '3',
    skillName: 'Agile/Scrum',
    reason: 'Modern development teams use agile methodologies extensively',
    suggestedAction: 'Learn Scrum basics and participate in sprint-based projects',
    resourceLinks: [
      { title: 'Agile Methodology Guide', url: '#' },
      { title: 'Scrum Master Certification Prep', url: '#' }
    ]
  }
];

const mockCareerMatches = [
  {
    id: '1',
    title: 'Frontend Developer',
    emoji: '💻',
    subtitle: 'Best match',
    matchScore: 88,
    color: 'text-green-600'
  },
  {
    id: '2',
    title: 'Full Stack Developer',
    emoji: '🚀',
    subtitle: 'Good match',
    matchScore: 72,
    color: 'text-teal-600'
  },
  {
    id: '3',
    title: 'UI/UX Designer',
    emoji: '🎨',
    subtitle: 'Potential match',
    matchScore: 45,
    color: 'text-orange-600'
  }
];

const mockRecentActivity = [
  { title: 'Welcome to SkillSync', desc: 'Start building your skills profile', time: 'Just now', icon: TrendingUp },
  { title: 'Add Your First Skill', desc: 'Begin your learning journey', time: 'Get started', icon: Users },
  { title: 'Explore Career Paths', desc: 'Discover your potential careers', time: 'Available', icon: Briefcase },
];

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          navigate('/');
          return;
        }

        const userResponse = await axios.get(`${API_BASE_URL}/settings/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setUserData(userResponse.data);

        const dashboardResponse = await axios.get(`${API_BASE_URL}/dashboard`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (dashboardResponse.data.success) {
          setDashboardData(dashboardResponse.data.data);
        } else {
          throw new Error('Failed to fetch dashboard data');
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        
        setDashboardData({
          summary: {
            skillsMastered: mockUserSkills.filter(s => s.proficiency >= 80).length,
            skillsInProgress: mockUserSkills.filter(s => s.proficiency >= 50 && s.proficiency < 80).length,
            skillGaps: mockRecommendations.length,
            projects: 4
          },
          skills: mockUserSkills.slice(0, 8),
          recommendations: mockRecommendations,
          careerMatches: mockCareerMatches,
          recentActivity: mockRecentActivity
        });
        
        toast.error('Using demo data - some features may be limited');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return 'bg-[#10B981]';
    if (proficiency >= 60) return 'bg-[#14B8A6]';
    if (proficiency >= 40) return 'bg-[#F59E0B]';
    return 'bg-[#64748B]';
  };

  const getProficiencyLabel = (proficiency) => {
    if (proficiency >= 80) return 'Expert';
    if (proficiency >= 60) return 'Advanced';
    if (proficiency >= 40) return 'Intermediate';
    return 'Beginner';
  };

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-teal-600';
    return 'text-orange-600';
  };

  const getMatchScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-teal-500';
    return 'bg-orange-500';
  };

  const handleLearnMore = (recommendation) => {
    navigate('/suggestions');
  };

  const handleExploreCareers = () => {
    navigate('/career-paths');
  };

  const handleViewAllSkills = () => {
    navigate('/profile');
  };

  const handleViewAllRecommendations = () => {
    navigate('/suggestions');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Failed to load dashboard data</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { summary, skills, recommendations, careerMatches, recentActivity } = dashboardData;
  const { skillsMastered, skillsInProgress, skillGaps, projects } = summary;

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userName={userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
        user={userData}
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back, {userData?.firstName || 'User'}!
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's your skill development overview</p>
        </header>

        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            label="Skills Mastered" 
            value={skillsMastered} 
            icon={TrendingUp} 
            color="text-success"
            bgColor="bg-success/10"
            onClick={() => navigate('/profile')}
          />
          <SummaryCard 
            label="In Progress" 
            value={skillsInProgress} 
            icon={Users} 
            color="text-warning"
            bgColor="bg-warning/10"
            onClick={() => navigate('/profile')}
          />
          <SummaryCard 
            label="Skill Gaps" 
            value={skillGaps} 
            icon={X} 
            color="text-primary"
            bgColor="bg-primary/10"
            onClick={() => navigate('/suggestions')}
          />
          <SummaryCard 
            label="Projects" 
            value={projects} 
            icon={Briefcase} 
            color="text-secondary"
            bgColor="bg-secondary/10"
            onClick={() => navigate('/roles')}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Skill Proficiency Map</h2>
                <p className="text-sm text-muted-foreground">Visual representation of your skill levels across different categories</p>
              </div>
            </div>

            <div className="space-y-5">
              {skills.map((skill) => (
                <div key={skill.skillId} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-card-foreground font-medium">{skill.skillName}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="hidden sm:inline font-medium">{getProficiencyLabel(skill.proficiency)}</span>
                      <span className="font-semibold">{skill.proficiency}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getProficiencyColor(skill.proficiency)}`} 
                      style={{ width: `${skill.proficiency}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button 
                onClick={handleViewAllSkills}
                className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-card-foreground border border-border rounded-[12px] hover:bg-muted transition-colors"
              >
                View All Skills <ChevronRight size={16} />
              </button>
            </div>
          </section>

          <aside className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Recent Activity</h2>
                <p className="text-sm text-muted-foreground">Your latest achievements</p>
              </div>
            </div>
            
            <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
              {recentActivity.map((r, idx) => {
                const IconComponent = r.icon === 'TrendingUp' ? TrendingUp : 
                                   r.icon === 'Users' ? Users : 
                                   r.icon === 'Briefcase' ? Briefcase : TrendingUp;
                return (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                    <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                      <IconComponent size={16} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-card-foreground">{r.title}</div>
                      <div className="text-xs text-muted-foreground">{r.desc}</div>
                      <div className="text-xs text-muted-foreground mt-1">{r.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </aside>
        </div>

        <section className="mt-8 bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Recommended for You</h3>
                <p className="text-sm text-muted-foreground">Personalized suggestions to enhance your skill set</p>
              </div>
            </div>
            <button 
              onClick={handleViewAllRecommendations}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm text-card-foreground border border-border rounded-[12px] hover:bg-muted transition-colors"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recommendations.map((recommendation) => (
              <div key={recommendation.id} className="bg-muted/30 rounded-xl border border-border p-6 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <TrendingUp size={20} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-card-foreground">{recommendation.skillName}</h4>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      Skill Gap
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{recommendation.reason}</p>
                
                <div className="bg-card rounded-lg p-4 mb-4 border border-border">
                  <p className="text-sm font-medium text-card-foreground mb-2">Suggested Action:</p>
                  <p className="text-sm text-muted-foreground">{recommendation.suggestedAction}</p>
                </div>
                
                <button 
                  onClick={() => handleLearnMore(recommendation)}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-card-foreground border border-border rounded-lg hover:bg-secondary transition-colors"
                >
                  Learn More <ChevronRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-2xl border-2 border-primary/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                <Briefcase size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Your Career Path Match</h3>
                <p className="text-sm text-muted-foreground">Discover careers that align with your skills</p>
              </div>
            </div>
            <button 
              onClick={handleExploreCareers}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-[12px] hover:bg-primary/90 transition-colors"
            >
              Explore Careers <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {careerMatches.map((career) => (
              <div key={career.id} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">{career.emoji}</span>
                  <div>
                    <h4 className="text-lg font-semibold text-card-foreground">{career.title}</h4>
                    <p className="text-sm text-muted-foreground">{career.subtitle}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-card-foreground">Match Score</span>
                    <span className={`text-lg font-bold ${getMatchScoreColor(career.matchScore)}`}>
                      {career.matchScore}%
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${getMatchScoreBg(career.matchScore)}`}
                      style={{ width: `${career.matchScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, icon: Icon, color, bgColor, onClick }) {
  return (
    <div 
      onClick={onClick}
      className={`bg-card rounded-xl border border-border p-6 flex items-center justify-between cursor-pointer hover:shadow-md transition-all duration-200 ${bgColor}`}
    >
      <div>
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="text-3xl font-bold text-card-foreground">{value}</div>
      </div>
      <div className={`w-12 h-12 rounded-xl ${bgColor} ${color} grid place-items-center`}>
        <Icon size={20} />
      </div>
    </div>
  );
}