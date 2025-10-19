import React, { useState } from 'react';
import DashboardNav from '../components/dashboardNAv';
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

const projectData = [
  {
    id: 1,
    title: "E-Commerce Platform",
    role: "Frontend Developer",
    teamSize: 3,
    skills: ["React", "JavaScript", "CSS/Tailwind", "Git/GitHub"],
    performance: 92,
    date: "Dec 15, 2024",
    teamMembers: ["Sarah Chen", "Mike Johnson", "Lisa Wong"],
    notes: "This project helped develop strong collaboration skills and improved technical proficiency in frontend technologies.",
    expanded: false
  },
  {
    id: 2,
    title: "Student Portal System",
    role: "Full Stack Developer",
    teamSize: 2,
    skills: ["React", "Node.js", "MongoDB", "Express"],
    performance: 88,
    date: "Sep 20, 2024",
    teamMembers: ["John Smith", "Emily Davis"],
    notes: "Led the development of a comprehensive student management system with real-time notifications.",
    expanded: false
  },
  {
    id: 3,
    title: "Mobile App Prototype",
    role: "UI/UX Designer",
    teamSize: 4,
    skills: ["UI/UX Design", "Communication", "Figma", "Prototyping"],
    performance: 85,
    date: "Jun 10, 2024",
    teamMembers: ["Alex Kim", "Maria Garcia", "David Lee", "Sophie Wilson"],
    notes: "Designed intuitive user interfaces for a mobile application focused on accessibility and user experience.",
    expanded: false
  },
  {
    id: 4,
    title: "Data Analytics Dashboard",
    role: "Backend Developer",
    teamSize: 2,
    skills: ["Python", "SQL", "Django", "PostgreSQL"],
    performance: 78,
    date: "Mar 5, 2024",
    teamMembers: ["Tom Brown", "Anna Taylor"],
    notes: "Built robust data processing pipelines and created interactive dashboards for business intelligence.",
    expanded: false
  }
];

// This will be calculated dynamically in the component

export default function RoleHistory() {
  const { isDarkMode, toggleDarkMode } = useTheme();
  const [projects, setProjects] = useState(projectData);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, projectId: null, projectTitle: '' });
  const [addModal, setAddModal] = useState({ isOpen: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    role: '',
    teamMembers: '',
    skills: '',
    performance: '',
    date: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});

  // Calculate summary statistics dynamically
  const calculateSummaryStats = () => {
    const totalProjects = projects.length;
    
    const avgPerformance = totalProjects > 0 
      ? Math.round(projects.reduce((sum, project) => sum + project.performance, 0) / totalProjects)
      : 0;
    
    const totalTeamMembers = projects.reduce((sum, project) => sum + project.teamSize, 0);
    
    const allSkills = projects.flatMap(project => project.skills);
    const uniqueSkills = [...new Set(allSkills)];
    const totalSkillsApplied = uniqueSkills.length;

    return [
      { label: "Total Projects", value: totalProjects, icon: TrendingUp, color: "text-blue-600" },
      { label: "Avg Performance", value: avgPerformance, icon: TrendingUp, color: "text-green-600" },
      { label: "Team Members", value: totalTeamMembers, icon: Users, color: "text-blue-600" },
      { label: "Skills Applied", value: totalSkillsApplied, icon: TrendingUp, color: "text-yellow-600" }
    ];
  };

  const summaryStats = calculateSummaryStats();

  const toggleExpanded = (projectId) => {
    console.log('Toggling project:', projectId);
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, expanded: !project.expanded }
        : project
    ));
  };

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "bg-success/10 text-success border-success/20";
    if (performance >= 80) return "bg-success/10 text-success border-success/20";
    if (performance >= 70) return "bg-warning/10 text-warning border-warning/20";
    return "bg-destructive/10 text-destructive border-destructive/20";
  };

  const handleDeleteClick = (projectId, projectTitle) => {
    console.log('Delete clicked for project:', projectId, projectTitle);
    setDeleteModal({ isOpen: true, projectId, projectTitle });
  };

  const handleDeleteConfirm = () => {
    console.log('Deleting project with ID:', deleteModal.projectId);
    console.log('Current projects before deletion:', projects.map(p => ({ id: p.id, title: p.title })));
    setProjects(projects.filter(project => project.id !== deleteModal.projectId));
    setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' });
    
    toast.success(`Project "${deleteModal.projectTitle}" deleted successfully!`, {
      description: 'The project has been removed from your history.'
    });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, projectId: null, projectTitle: '' });
  };

  const handleAddProjectClick = () => {
    setAddModal({ isOpen: true });
    setFormData({
      title: '',
      role: '',
      teamMembers: '',
      skills: '',
      performance: '',
      date: '',
      notes: ''
    });
    setFormErrors({});
  };

  const handleAddProjectCancel = () => {
    setAddModal({ isOpen: false });
    setFormData({
      title: '',
      role: '',
      teamMembers: '',
      skills: '',
      performance: '',
      date: '',
      notes: ''
    });
    setFormErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) errors.title = 'Project title is required';
    if (!formData.role.trim()) errors.role = 'Role is required';
    if (!formData.performance.trim()) errors.performance = 'Performance score is required';
    else if (isNaN(formData.performance) || formData.performance < 0 || formData.performance > 100) {
      errors.performance = 'Performance score must be between 0 and 100';
    }
    if (!formData.date.trim()) errors.date = 'Completion date is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProjectSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newProject = {
      id: projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1,
      title: formData.title.trim(),
      role: formData.role.trim(),
      teamSize: formData.teamMembers.trim() ? formData.teamMembers.split(',').length : 0,
      skills: formData.skills.trim() ? formData.skills.split(',').map(s => s.trim()) : [],
      performance: parseInt(formData.performance),
      date: formData.date.trim(),
      teamMembers: formData.teamMembers.trim() ? formData.teamMembers.split(',').map(m => m.trim()) : [],
      notes: formData.notes.trim(),
      expanded: false
    };

    setProjects([newProject, ...projects]);
    handleAddProjectCancel();
    
    toast.success(`Project "${newProject.title}" added successfully!`, {
      description: 'Your new project has been added to your history.'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav 
        userName="Alex Rivera" 
        isMobileMenuOpen={isMobileMenuOpen} 
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase size={24} className="text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Your Project History</h1>
              <p className="mt-1 text-muted-foreground">Track your roles, achievements, and skill development across projects.</p>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          {summaryStats.map((stat, index) => (
            <div key={index} className="bg-card rounded-xl border border-border p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                  <div className="text-3xl font-bold text-card-foreground">{stat.value}</div>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-primary/10 ${stat.color} grid place-items-center`}>
                  <stat.icon size={20} />
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Add Project Button - Only show when there are projects */}
        {projects.length > 0 && (
          <div className="flex justify-end mb-6">
            <button 
              onClick={handleAddProjectClick}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus size={16} />
              Add Project
            </button>
          </div>
        )}

        {/* Project Timeline */}
        <section className="bg-card rounded-xl border border-border hover:shadow-md transition-all duration-200">
          <div className="p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <TrendingUp size={20} className="text-secondary" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-card-foreground">Project Timeline</h2>
                <p className="text-sm text-muted-foreground">Detailed view of all your project contributions.</p>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {projects.length === 0 ? (
              <div className="text-center py-12">
                <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Plus size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-card-foreground mb-2">No Projects Yet</h3>
                <p className="text-muted-foreground mb-6">Start building your project portfolio by adding your first project.</p>
                <button 
                  onClick={handleAddProjectClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={16} />
                  Add Your First Project
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-8"></th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Project Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Team Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Skills Used</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Performance</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider w-12"></th>
                  </tr>
                </thead>
                <tbody className="bg-card divide-y divide-border">
                  {projects.map((project) => [
                    <tr key={project.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => toggleExpanded(project.id)}
                          className="text-muted-foreground hover:text-card-foreground transition-colors"
                        >
                          {project.expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-card-foreground">{project.title}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-card-foreground">{project.role}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-card-foreground">{project.teamSize}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-wrap gap-1">
                          {project.skills.slice(0, 2).map((skill, index) => (
                            <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                              {skill}
                            </span>
                          ))}
                          {project.skills.length > 2 && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                              +{project.skills.length - 2}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPerformanceColor(project.performance)}`}>
                          {project.performance}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-card-foreground">{project.date}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => handleDeleteClick(project.id, project.title)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>,
                    // Expanded Details Row
                    project.expanded && (
                      <tr key={`${project.id}-expanded`}>
                        <td colSpan="8" className="px-6 py-4 bg-muted/30">
                          <div className="space-y-6">
                            {/* Team Members */}
                            <div>
                              <h4 className="text-sm font-medium text-card-foreground mb-3">Team Members</h4>
                              <div className="flex flex-wrap gap-3">
                                {project.teamMembers.map((member, index) => (
                                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground bg-card px-3 py-2 rounded-lg border border-border">
                                    <User size={14} />
                                    <span>{member}</span>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* All Skills Applied */}
                            <div>
                              <h4 className="text-sm font-medium text-card-foreground mb-3">All Skills Applied</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.skills.map((skill, index) => (
                                  <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-success/10 text-success border border-success/20">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Project Notes */}
                            <div>
                              <h4 className="text-sm font-medium text-card-foreground mb-3">Project Notes</h4>
                              <p className="text-sm text-muted-foreground bg-card p-4 rounded-lg border border-border">{project.notes}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )
                  ].filter(Boolean))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 75% Black Background Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={handleDeleteCancel}></div>
          
          {/* Modal Dialog */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Project</h3>
              <p className="text-sm text-gray-600 mb-6">
                Are you sure you want to delete this project? This action cannot be undone and will permanently remove the project from your history.
              </p>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={handleDeleteCancel}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteConfirm}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {addModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* 75% Black Background Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-75" onClick={handleAddProjectCancel}></div>
          
          {/* Modal Dialog */}
          <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Add Past Project</h3>
                <button
                  onClick={handleAddProjectCancel}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleAddProjectSubmit} className="space-y-4">
                {/* Project Title and Role Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="E-Commerce Platform"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.title ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.title && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Your Role <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      placeholder="Frontend Developer"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.role ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.role && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.role}</p>
                    )}
                  </div>
                </div>

                {/* Team Members */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Team Members (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="teamMembers"
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                    placeholder="John Doe, Jane Smith"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Skills Used */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skills Used (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="React, JavaScript, CSS"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Performance Score and Completion Date Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Performance Score (0-100) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="performance"
                      value={formData.performance}
                      onChange={handleInputChange}
                      placeholder="85"
                      min="0"
                      max="100"
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.performance ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.performance && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.performance}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Completion Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        formErrors.date ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {formErrors.date && (
                      <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>
                    )}
                  </div>
                </div>

                {/* Project Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Notes (Optional)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional details about the project..."
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleAddProjectCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add Project
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
