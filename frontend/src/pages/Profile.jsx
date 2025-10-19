import DashboardNav from '../components/dashboardNAv';
import { Edit3, Plus, ChevronRight, Target, Briefcase, TrendingUp, Award, Camera } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/profile';

export default function Profile() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('skills');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projectHistory, setProjectHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setError('No authentication token found');
          navigate('/');
          return;
        }

        const response = await axios.get(API_BASE_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data.user);
        setSkills(response.data.skills || []);
        setProjectHistory(response.data.projectHistory || []);
        setRecommendations(response.data.recommendations || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching profile:', err);
        setError(err.response?.data?.message || 'Failed to load profile');
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleEditProfile = async (editedData) => {
    try {
      const token = localStorage.getItem('token');
      
      if (editedData.profilePicture && editedData.profilePicture.startsWith('data:image')) {
        console.log('Uploading profile picture...');
        await axios.patch(
          `${API_BASE_URL}/avatar`,
          { profilePicture: editedData.profilePicture },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      console.log('Updating profile info...');
      await axios.patch(
        `${API_BASE_URL}/user`,
        {
          firstName: editedData.firstName,
          lastName: editedData.lastName,
          email: editedData.email,
          course: editedData.course,
          yearLevel: editedData.yearLevel,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Fetching latest profile data...');
      const latestResponse = await axios.get(API_BASE_URL, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUserData(latestResponse.data.user);
      setSkills(latestResponse.data.skills || []);
      setProjectHistory(latestResponse.data.projectHistory || []);
      setRecommendations(latestResponse.data.recommendations || []);
      
      toast.success('Profile updated successfully');
      setShowEditProfile(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleAddSkill = async (skillData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/skills`, skillData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSkills([...skills, response.data.skill]);
      toast.success('Skill added successfully');
      setShowAddSkill(false);
    } catch (err) {
      console.error('Error adding skill:', err);
      toast.error(err.response?.data?.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/skills/${skillId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSkills(skills.filter((s) => s._id !== skillId));
      toast.success('Skill deleted successfully');
    } catch (err) {
      console.error('Error deleting skill:', err);
      toast.error('Failed to delete skill');
    }
  };

  const handleAddProject = async (projectData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/projects`, projectData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjectHistory([...projectHistory, response.data.project]);
      toast.success('Project added successfully');
      setShowAddProject(false);
    } catch (err) {
      console.error('Error adding project:', err);
      toast.error(err.response?.data?.message || 'Failed to add project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/projects/${projectId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjectHistory(projectHistory.filter((p) => p._id !== projectId));
      toast.success('Project deleted successfully');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
            Retry
          </button>
        </div>
      </div>
    );
  }

  const skillsByCategory = skills.reduce((acc, skill) => {
    const cat = skill.category || 'OTHER';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userName={userData ? `${userData.firstName} ${userData.lastName}` : 'User'}
        user={userData}
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <section className="bg-card rounded-xl border border-border p-6 mb-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="relative group">
                {userData?.profilePicture ? (
                  <img 
                    src={userData.profilePicture} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground font-semibold grid place-items-center text-xl">
                    {userData?.firstName?.[0]}{userData?.lastName?.[0]}
                  </div>
                )}
              </div>
              <div>
                <h1 className="text-xl font-semibold text-card-foreground">
                  {userData?.firstName} {userData?.lastName}
                </h1>
                <div className="text-sm text-muted-foreground">{userData?.email}</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData?.course && <Badge>{userData.course}</Badge>}
                  {userData?.yearLevel && <Badge>{userData.yearLevel}</Badge>}
                </div>
              </div>
            </div>
           
            <button 
            onClick={() => setShowEditProfile(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-sm text-card-foreground border border-border rounded-[12px] hover:bg-muted transition-colors">
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="inline-flex bg-muted rounded-full p-1">
              <Tab active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>Skills</Tab>
              <Tab active={activeTab === 'roleHistory'} onClick={() => setActiveTab('roleHistory')}>Role History</Tab>
              <Tab active={activeTab === 'growthPlan'} onClick={() => setActiveTab('growthPlan')}>Growth Plan</Tab>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-card rounded-xl border border-border hover:shadow-md transition-all duration-200">
          {activeTab === 'skills' && (
            <>
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Target size={20} className="text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">My Skills</h2>
                    <p className="text-sm text-muted-foreground">Click on any skill to update proficiency or log practice time</p>
                  </div>
                </div>
                <button onClick={() => setShowAddSkill(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-success bg-success/10 rounded-[12px] hover:bg-success/20 border border-success/20 transition-colors">
                  <Plus size={16} /> Add Skill
                </button>
              </div>

              <div className="p-6">
                {Object.keys(skillsByCategory).length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">No skills added yet. Start by adding your first skill!</div>
                  </div>
                ) : (
                  Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                    <div key={category} className="mb-8">
                      <div className="text-xs font-semibold tracking-wide text-muted-foreground mb-4 uppercase">{category}</div>
                      <div className="space-y-4">
                        {categorySkills.map((skill) => (
                          <SkillRow 
                            key={skill._id} 
                            skill={skill} 
                            onDelete={() => handleDeleteSkill(skill._id)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </>
          )}

          {activeTab === 'roleHistory' && (
            <>
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                    <Briefcase size={20} className="text-secondary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">Project Timeline</h2>
                    <p className="text-sm text-muted-foreground">Your journey through different roles and projects</p>
                  </div>
                </div>
                <button onClick={() => setShowAddProject(true)} className="inline-flex items-center gap-2 px-4 py-2 text-sm text-success bg-success/10 rounded-lg hover:bg-success/20 border border-success/20 transition-colors">
                  <Plus size={16} /> Add Project
                </button>
              </div>

              <div className="p-6">
                {projectHistory.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">No projects yet. Add your first project to get started!</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {projectHistory.map((project, index) => (
                      <ProjectCard 
                        key={project._id} 
                        project={project} 
                        isLast={index === projectHistory.length - 1}
                        onDelete={() => handleDeleteProject(project._id)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'growthPlan' && (
            <>
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                    <TrendingUp size={20} className="text-warning" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-card-foreground">Personalized Growth Recommendations</h2>
                    <p className="text-sm text-muted-foreground">Strategic advice to advance your skills and career</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {recommendations.length === 0 ? (
                  <div className="text-center py-8 bg-muted/30 rounded-lg border border-border">
                    <div className="text-sm text-muted-foreground">No recommendations yet. Keep building your profile!</div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {recommendations.map((recommendation) => (
                      <RecommendationCard key={recommendation._id} recommendation={recommendation} />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Footer action */}
        <div className="flex justify-end mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-card-foreground border border-border rounded-lg hover:bg-muted transition-colors">
            View Full History <ChevronRight size={16} />
          </button>
        </div>
      </main>

      {showEditProfile && (
        <EditProfileModal 
          userData={userData}
          onClose={() => setShowEditProfile(false)} 
          onSave={handleEditProfile} 
        />
      )}

      {showAddSkill && (
        <AddSkillModal onClose={() => setShowAddSkill(false)} onAdd={handleAddSkill} />
      )}

      {showAddProject && (
        <AddProjectModal onClose={() => setShowAddProject(false)} onAdd={handleAddProject} />
      )}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
      {children}
    </span>
  );
}

function Tab({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        `px-3 py-1.5 text-sm rounded-full transition ` +
        (active ? 'bg-card text-card-foreground shadow-sm border border-border' : 'text-muted-foreground hover:text-card-foreground')
      }
    >
      {children}
    </button>
  );
}

function SkillRow({ skill, onDelete }) {
  return (
    <div className="group bg-muted/30 rounded-lg p-4 border border-border hover:bg-muted/50 transition-colors">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-card-foreground">{skill.name}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm font-semibold text-muted-foreground">{skill.level}%</div>
          <button 
            onClick={onDelete}
            className="opacity-0 group-hover:opacity-100 text-xs text-destructive hover:text-destructive/80 transition-opacity"
          >
            Delete
          </button>
        </div>
      </div>
      <div className="w-full bg-muted rounded-full h-2">
        <div className="h-2 rounded-full bg-success" style={{ width: `${skill.level}%` }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, isLast, onDelete }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-success/10 text-success border-success/20';
    if (score >= 80) return 'bg-primary/10 text-primary border-primary/20';
    if (score >= 70) return 'bg-warning/10 text-warning border-warning/20';
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <div className="flex items-start gap-4">
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold grid place-items-center text-xs">
          P
        </div>
        {!isLast && (
          <div className="w-0.5 h-16 bg-border mt-2"></div>
        )}
      </div>

      <div className="flex-1 bg-muted/30 rounded-xl p-6 border border-border hover:bg-muted/50 transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-card-foreground text-lg">{project.project}</h3>
            <div className="text-sm text-muted-foreground mt-1">
              <span className="font-medium">Role:</span> {project.role} • 
              <span className="font-medium ml-1">Date:</span> {project.date} • 
              <span className="font-medium ml-1">Team:</span> {project.team}
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getScoreColor(project.score)}`}>
              {project.score}
            </div>
            <button 
              onClick={onDelete}
              className="text-xs text-destructive hover:text-destructive/80 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {project.skills.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-card text-card-foreground text-sm rounded-lg border border-border"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function RecommendationCard({ recommendation }) {
  const handleResourceClick = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="bg-muted/30 rounded-xl border border-border p-6 hover:bg-muted/50 transition-all duration-200">
      <div className="flex items-start gap-4">
        <div className="p-2 rounded-lg bg-gradient-to-r from-[#2563EB] to-[#14B8A6] flex-shrink-0">
          <Award className="h-5 w-5 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-card-foreground mb-4">{recommendation.skillName}</h4>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Why this matters:
            </p>
            <p className="text-sm text-card-foreground">
              {recommendation.reason}
            </p>
          </div>
          
          <div className="mb-4">
            <p className="text-sm font-medium text-muted-foreground mb-1">
              Suggested action:
            </p>
            <p className="text-sm text-card-foreground">
              {recommendation.suggestedAction}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              Resources:
            </p>
            <div className="flex flex-wrap gap-2">
              {recommendation.resourceLinks.map((link, index) => (
                <button
                  key={index}
                  onClick={() => handleResourceClick(link.url)}
                  className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-card-foreground bg-card border border-border rounded-lg hover:bg-muted hover:shadow-md hover:scale-105 transition-all duration-200"
                >
                  {link.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EditProfileModal({ userData, onClose, onSave }) {
  const [firstName, setFirstName] = useState(userData?.firstName || '');
  const [lastName, setLastName] = useState(userData?.lastName || '');
  const [email, setEmail] = useState(userData?.email || '');
  const [course, setCourse] = useState(userData?.course || '');
  const [yearLevel, setYearLevel] = useState(userData?.yearLevel || '');
  const [profilePicture, setProfilePicture] = useState(userData?.profilePicture || null);
  const [previewPicture, setPreviewPicture] = useState(userData?.profilePicture || null);
  const [saving, setSaving] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1024 * 1024 * 1024) {
        toast.error('Image size must be less than 1GB');
        return;
      }

      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPG, PNG, GIF, WEBP, SVG)');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfilePicture(event.target.result);
        setPreviewPicture(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim() || !email.trim()) {
      toast.error('Please fill all required fields');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        firstName,
        lastName,
        email,
        course,
        yearLevel,
        profilePicture,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/75" onClick={onClose}></div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
              <p className="text-sm text-gray-500">Update your profile information</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
          </div>

          <div className="p-6 space-y-4">
            <div className="flex flex-col items-center">
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Profile Picture
              </label>
              
              <label className="cursor-pointer group relative">
                <input
                  type="file"
                  accept="image/*,.svg" 
                  onChange={handleImageChange}
                  className="hidden"
                />
                
                <div className="relative">
                  {previewPicture ? (
                    <img 
                      src={previewPicture} 
                      alt="Preview" 
                      className="w-24 h-24 rounded-full object-cover border-4 border-gray-200 group-hover:border-blue-500 transition-colors duration-200"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold grid place-items-center border-4 border-gray-200 group-hover:border-blue-500 transition-colors duration-200">
                      {firstName?.charAt(0)}{lastName?.charAt(0)}
                    </div>
                  )}
                  
                  <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200">
                    <div className="text-white text-center">
                      <Camera size={24} className="mx-auto mb-1" />
                      <span className="text-xs font-medium">Change Photo</span>
                    </div>
                  </div>
                </div>
              </label>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Tap the image to change. Max size: 1GB. JPG, PNG, GIF, WEBP, SVG supported.
              </p>
            </div>

            <hr className="my-4" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={firstName} 
                  onChange={(e) => setFirstName(e.target.value)} 
                  placeholder="First Name"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
                <input 
                  type="text" 
                  value={lastName} 
                  onChange={(e) => setLastName(e.target.value)} 
                  placeholder="Last Name"
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <input 
                type="text" 
                value={course} 
                onChange={(e) => setCourse(e.target.value)} 
                placeholder="e.g. BS Information Technology"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
              <select 
                value={yearLevel} 
                onChange={(e) => setYearLevel(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Year Level</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-100">
            <button 
              onClick={onClose} 
              className="px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-300 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSaveChanges}
              disabled={saving}
              className="px-6 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddSkillModal({ onClose, onAdd }) {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [level, setLevel] = useState(50);
  const [category, setCategory] = useState('PROGRAMMING');

  const handleAddSkill = () => {
    if (!selectedSkill) {
      toast.error('Please select a skill', {
        description: 'Choose a skill from the dropdown menu'
      });
      return;
    }

    onAdd({
      name: selectedSkill,
      level,
      category,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/75" onClick={onClose}></div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl">
          <div className="flex items-start justify-between p-5 border-b border-gray-100">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">Add New Skill</h3>
              <p className="text-sm text-gray-500">Select a skill and set your current proficiency level</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="p-5 space-y-5">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="PROGRAMMING">Programming</option>
                <option value="WEB DEVELOPMENT">Web Development</option>
                <option value="BACKEND">Backend</option>
                <option value="TOOLS">Tools</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Skill</label>
              <div className="relative">
                <select value={selectedSkill} onChange={(e) => setSelectedSkill(e.target.value)} className="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Select a skill</option>
                  <option>JavaScript</option>
                  <option>TypeScript</option>
                  <option>React</option>
                  <option>Node.js</option>
                  <option>Python</option>
                  <option>CSS/Tailwind</option>
                  <option>SQL</option>
                  <option>Git/GitHub</option>
                  <option>Other</option>
                </select>
                <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Proficiency Level</label>
                <div className="text-xs text-blue-600 font-medium">{level}</div>
              </div>
              <input type="range" min="0" max="100" value={level} onChange={(e) => setLevel(parseInt(e.target.value, 10))} className="w-full accent-blue-600" />
              <div className="flex justify-between text-[11px] text-gray-500 mt-2">
                <span>Beginner (0-40%)</span>
                <span>Intermediate (40-70%)</span>
                <span>Advanced (70-100%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddSkill} className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700">Add Skill</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AddProjectModal({ onClose, onAdd }) {
  const [projectName, setProjectName] = useState('');
  const [role, setRole] = useState('');
  const [date, setDate] = useState('');
  const [team, setTeam] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [score, setScore] = useState(75);
  const [description, setDescription] = useState('');

  const handleAddProject = () => {
    if (!projectName || !role || !date || !team) {
      toast.error('Please fill all required fields');
      return;
    }

    const skills = skillsInput.split(',').map(s => s.trim()).filter(s => s);

    onAdd({
      project: projectName,
      role,
      date,
      team,
      skills,
      score,
      description,
    });
  };

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/75" onClick={onClose}></div>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-start justify-between p-5 border-b border-gray-100">
            <div>
              <h3 className="text-[15px] font-semibold text-gray-900">Add New Project</h3>
              <p className="text-sm text-gray-500">Add a project to your timeline</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">✕</button>
          </div>

          <div className="p-5 space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Project Name *</label>
              <input 
                type="text" 
                value={projectName} 
                onChange={(e) => setProjectName(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="E-Commerce Platform"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Role *</label>
              <input 
                type="text" 
                value={role} 
                onChange={(e) => setRole(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="Frontend Developer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Date *</label>
                <input 
                  type="text" 
                  value={date} 
                  onChange={(e) => setDate(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="Dec 2024"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">Team Size *</label>
                <input 
                  type="text" 
                  value={team} 
                  onChange={(e) => setTeam(e.target.value)} 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  placeholder="3 members"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Skills Used (comma separated)</label>
              <input 
                type="text" 
                value={skillsInput} 
                onChange={(e) => setSkillsInput(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                placeholder="React, JavaScript, CSS/Tailwind"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-medium text-gray-700">Performance Score</label>
                <div className="text-xs text-blue-600 font-medium">{score}/100</div>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={score} 
                onChange={(e) => setScore(parseInt(e.target.value, 10))} 
                className="w-full accent-blue-600" 
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Description (optional)</label>
              <textarea 
                value={description} 
                onChange={(e) => setDescription(e.target.value)} 
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
                rows="3"
                placeholder="Brief description of the project..."
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-100">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-gray-700 border border-gray-300 hover:bg-gray-50">Cancel</button>
            <button onClick={handleAddProject} className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700">Add Project</button>
          </div>
        </div>
      </div>
    </div>
  );
}