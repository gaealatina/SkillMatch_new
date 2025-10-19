import DashboardNav from '../components/dashboardNAv';
import { ArrowRight, Gift, Award, Activity, Clock, History, Menu, AlertCircle, Briefcase, Lightbulb, Target, TrendingUp } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';

// Mock data for user skills
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

// Mock data for recommendations
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

// Mock data for career matches
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

const recent = [
  { title: 'JavaScript Mastery', desc: 'Reached 85% proficiency', time: '2 days ago', icon: Award },
  { title: 'Project Completed', desc: 'E-Commerce Platform', time: '1 week ago', icon: Gift },
  { title: 'New Skill Added', desc: 'TypeScript', time: '2 weeks ago', icon: Activity },
];

export default function Dashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { isDarkMode, toggleDarkMode } = useTheme();

  // Dynamic calculations
  const skillsMastered = mockUserSkills.filter(s => s.proficiency >= 80).length;
  const skillsInProgress = mockUserSkills.filter(s => s.proficiency >= 50 && s.proficiency < 80).length;
  const skillGaps = mockRecommendations.length;
  const projects = 4; // From mockRoleHistory

  // Helper functions
  const getProficiencyColor = (proficiency) => {
    if (proficiency >= 80) return 'bg-[#10B981]';  // Green - Expert
    if (proficiency >= 60) return 'bg-[#14B8A6]';  // Teal - Advanced
    if (proficiency >= 40) return 'bg-[#F59E0B]';  // Orange - Intermediate
    return 'bg-[#64748B]';                          // Gray - Beginner
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

  const handleStartLearning = (courseNumber) => {
    toast.success(`Started learning Suggested Course #${courseNumber}!`, {
      description: 'Redirecting to the course content...'
    });
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

  const handleViewHistory = () => {
    navigate('/roles');
  };

  const handleViewAllRecommendations = () => {
    navigate('/suggestions');
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userName="Alex Rivera" 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        onToggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, Alex Rivera!</h1>
          <p className="mt-1 text-sm text-muted-foreground">Here's your skill development overview</p>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <SummaryCard 
            label="Skills Mastered" 
            value={skillsMastered} 
            icon={<Award size={20} />} 
            color="text-success"
            bgColor="bg-success/10"
            onClick={() => navigate('/profile')}
          />
          <SummaryCard 
            label="In Progress" 
            value={skillsInProgress} 
            icon={<Activity size={20} />} 
            color="text-warning"
            bgColor="bg-warning/10"
            onClick={() => navigate('/profile')}
          />
          <SummaryCard 
            label="Skill Gaps" 
            value={skillGaps} 
            icon={<AlertCircle size={20} />} 
            color="text-primary"
            bgColor="bg-primary/10"
            onClick={() => navigate('/suggestions')}
          />
          <SummaryCard 
            label="Projects" 
            value={projects} 
            icon={<Briefcase size={20} />} 
            color="text-secondary"
            bgColor="bg-secondary/10"
            onClick={() => navigate('/roles')}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Skills map */}
          <section className="lg:col-span-2 bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Target size={20} className="text-primary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Skill Proficiency Map</h2>
                <p className="text-sm text-muted-foreground">Visual representation of your skill levels across different categories</p>
              </div>
            </div>

            <div className="space-y-5">
              {mockUserSkills.slice(0, 8).map((skill) => (
                <div key={skill.skillId} className="bg-muted/30 rounded-lg p-4 border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-card-foreground font-medium">{skill.skillName}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">{skill.category}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="hidden sm:inline font-medium" style={{ color: getProficiencyColor(skill.proficiency).replace('bg-', 'text-') }}>
                        {getProficiencyLabel(skill.proficiency)}
                      </span>
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
                className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors"
              >
                View All Skills <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Right: Recent Activity */}
          <aside className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Activity size={20} className="text-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Recent Activity</h2>
                <p className="text-sm text-muted-foreground">Your latest achievements</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {recent.map((r, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg border border-border">
                  <div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center flex-shrink-0">
                    <r.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-card-foreground">{r.title}</div>
                    <div className="text-xs text-muted-foreground">{r.desc}</div>
                    <div className="text-xs text-muted-foreground mt-1">{r.time}</div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleViewHistory}
              className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              View History <History size={16} />
            </button>
          </aside>
        </div>

        {/* Recommendations */}
        <section className="mt-8 bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <Lightbulb size={20} className="text-warning" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-card-foreground">Recommended for You</h3>
                <p className="text-sm text-muted-foreground">Personalized suggestions to enhance your skill set</p>
              </div>
            </div>
            <button 
              onClick={handleViewAllRecommendations}
              className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors"
            >
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRecommendations.map((recommendation) => (
              <div key={recommendation.id} className="bg-muted/30 rounded-xl border border-border p-6 hover:shadow-sm transition-all duration-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center">
                    <Lightbulb size={20} className="text-white" />
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
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors"
                >
                  Learn More <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Career Path Match Section */}
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
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Explore Careers <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockCareerMatches.map((career) => (
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

function SummaryCard({ label, value, icon, color, bgColor, onClick }) {
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
        {icon}
      </div>
    </div>
  );
}


