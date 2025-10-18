import DashboardNav from '../components/dashboardNAv';
import { Edit3, Plus, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const categories = [
  {
    title: 'PROGRAMMING',
    skills: [
      { name: 'JavaScript', level: 85 },
      { name: 'TypeScript', level: 75 },
      { name: 'Python', level: 65 },
    ],
  },
  {
    title: 'WEB DEVELOPMENT',
    skills: [
      { name: 'React', level: 80 },
      { name: 'CSS/Tailwind', level: 90 },
    ],
  },
  {
    title: 'BACKEND',
    skills: [
      { name: 'Node.js', level: 70 },
    ],
  },
  {
    title: 'TOOLS',
    skills: [],
  },
];

const roleHistory = [
  {
    id: 1,
    project: 'E-Commerce Platform',
    role: 'Frontend Developer',
    date: 'Dec 2024',
    team: '3 members',
    skills: ['React', 'JavaScript', 'CSS/Tailwind', 'Git/GitHub'],
    score: 92,
  },
  {
    id: 2,
    project: 'Student Portal System',
    role: 'Full Stack Developer',
    date: 'Sep 2024',
    team: '2 members',
    skills: ['React', 'Node.js', 'Database Design', 'Python'],
    score: 88,
  },
  {
    id: 3,
    project: 'Mobile App Prototype',
    role: 'UI/UX Designer',
    date: 'Jun 2024',
    team: '4 members',
    skills: ['UI/UX Design', 'Communication', 'Problem Solving'],
    score: 85,
  },
  {
    id: 4,
    project: 'Data Analytics Dashboard',
    role: 'Backend Developer',
    date: 'Mar 2024',
    team: '2 members',
    skills: ['Python', 'SQL', 'Database Design', 'Git/GitHub'],
    score: 78,
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState('skills');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userName="Alex Rivera" isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Card */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-start justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-semibold grid place-items-center text-xl">
                AR
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Alex Rivera</h1>
                <div className="text-sm text-gray-600">alex.rivera@university.edu</div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge>BS Information Technology</Badge>
                  <Badge>3rd Year</Badge>
                </div>
              </div>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Edit3 size={16} /> Edit Profile
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-6">
            <div className="inline-flex bg-gray-100 rounded-lg p-1">
              <Tab active={activeTab === 'skills'} onClick={() => setActiveTab('skills')}>Skills</Tab>
              <Tab active={activeTab === 'roleHistory'} onClick={() => setActiveTab('roleHistory')}>Role History</Tab>
              <Tab active={activeTab === 'growthPlan'} onClick={() => setActiveTab('growthPlan')}>Growth Plan</Tab>
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {activeTab === 'skills' && (
            <>
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
                <div>
                  <h2 className="text-sm font-semibold text-gray-900">My Skills</h2>
                  <p className="text-sm text-gray-500">Click on any skill to update proficiency or log practice time</p>
                </div>
                <button onClick={() => setShowAddSkill(true)} className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 border border-emerald-200">
                  <Plus size={16} /> Add Skill
                </button>
              </div>

              <div className="p-4 sm:p-6">
                {categories.map((cat) => (
                  <div key={cat.title} className="mb-6">
                    <div className="text-[11px] font-semibold tracking-wide text-gray-500 mb-2">{cat.title}</div>
                    <div className="space-y-4">
                      {cat.skills.length === 0 && (
                        <div className="text-sm text-gray-500">No skills added yet.</div>
                      )}
                      {cat.skills.map((s) => (
                        <SkillRow key={s.name} name={s.name} level={s.level} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {activeTab === 'roleHistory' && (
            <>
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Project Timeline</h2>
                <p className="text-sm text-gray-500">Your journey through different roles and projects</p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {roleHistory.map((project, index) => (
                    <ProjectCard key={project.id} project={project} isLast={index === roleHistory.length - 1} />
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === 'growthPlan' && (
            <>
              <div className="p-4 sm:p-5 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-900">Growth Plan</h2>
                <p className="text-sm text-gray-500">Your personalized development roadmap</p>
              </div>

              <div className="p-4 sm:p-6">
                <div className="text-center py-8">
                  <div className="text-gray-500 text-sm">Growth plan content coming soon...</div>
                </div>
              </div>
            </>
          )}
        </section>

        {/* Footer action */}
        <div className="flex justify-end mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            View Full History <ChevronRight size={16} />
          </button>
        </div>
      </main>
      {showAddSkill && (
        <AddSkillModal onClose={() => setShowAddSkill(false)} onAdd={() => setShowAddSkill(false)} />
      )}
    </div>
  );
}

function Badge({ children }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-gray-100 text-gray-700 border border-gray-200">
      {children}
    </span>
  );
}

function Tab({ children, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={
        `px-3 py-1.5 text-sm rounded-md transition ` +
        (active ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900')
      }
    >
      {children}
    </button>
  );
}

function SkillRow({ name, level }) {
  return (
    <div className="group">
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm text-gray-900">{name}</div>
        <div className="text-xs text-gray-500">{level}%</div>
      </div>
      <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
        <div className="h-full rounded-full bg-emerald-500" style={{ width: `${level}%` }} />
      </div>
    </div>
  );
}

function ProjectCard({ project, isLast }) {
  const getScoreColor = (score) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="flex items-start gap-4">
      {/* Timeline indicator */}
      <div className="flex flex-col items-center">
        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-semibold grid place-items-center text-xs">
          S
        </div>
        {!isLast && (
          <div className="w-0.5 h-16 bg-gray-200 mt-2"></div>
        )}
      </div>

      {/* Project content */}
      <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-200">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{project.project}</h3>
            <div className="text-xs text-gray-600 mt-1">
              <span className="font-medium">Role:</span> {project.role} • 
              <span className="font-medium ml-1">Date:</span> {project.date} • 
              <span className="font-medium ml-1">Team:</span> {project.team}
            </div>
          </div>
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(project.score)}`}>
            {project.score}
          </div>
        </div>
        
        <div className="flex flex-wrap gap-1 mt-2">
          {project.skills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-0.5 bg-white text-gray-700 text-xs rounded border border-gray-200"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}


function AddSkillModal({ onClose, onAdd }) {
  const [selectedSkill, setSelectedSkill] = useState('');
  const [level, setLevel] = useState(50);

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop 75% darkness */}
      <div className="absolute inset-0 bg-black/75" onClick={onClose}></div>

      {/* Modal */}
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
            <button onClick={onAdd} className="px-4 py-2 rounded-lg text-sm text-white bg-blue-600 hover:bg-blue-700">Add Skill</button>
          </div>
        </div>
      </div>
    </div>
  );
}
