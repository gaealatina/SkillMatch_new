import DashboardNav from '../components/dahsboardNav';
import { Edit3, Plus, ChevronRight } from 'lucide-react';

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

export default function Profile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userName="Alex Rivera" />

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
              <Tab active>Skills</Tab>
              <Tab>Role History</Tab>
              <Tab>Growth Plan</Tab>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">My Skills</h2>
              <p className="text-sm text-gray-500">Click on any skill to update proficiency or log practice time</p>
            </div>
            <button className="inline-flex items-center gap-2 px-3 py-2 text-sm text-emerald-700 bg-emerald-50 rounded-lg hover:bg-emerald-100 border border-emerald-200">
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
        </section>

        {/* Footer action */}
        <div className="flex justify-end mt-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
            View Full History <ChevronRight size={16} />
          </button>
        </div>
      </main>
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

function Tab({ children, active }) {
  return (
    <button
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


