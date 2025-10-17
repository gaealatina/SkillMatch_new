import DashboardNav from '../components/dashboardNAv';
import { ArrowRight, Gift, Award, Activity, Clock, History } from 'lucide-react';

const skills = [
  { name: 'JavaScript', tag: 'Programming', level: 85, label: 'Expert' },
  { name: 'React', tag: 'Web Development', level: 80, label: 'Expert' },
  { name: 'TypeScript', tag: 'Programming', level: 75, label: 'Advanced' },
  { name: 'Python', tag: 'Programming', level: 65, label: 'Advanced' },
  { name: 'CSS/Tailwind', tag: 'Web Development', level: 90, label: 'Expert' },
  { name: 'Git/GitHub', tag: 'Tools', level: 70, label: 'Advanced' },
  { name: 'Communication', tag: 'Soft Skills', level: 60, label: 'Advanced' },
  { name: 'Problem Solving', tag: 'Soft Skills', level: 75, label: 'Advanced' },
];

const recent = [
  { title: 'JavaScript Mastery', desc: 'Reached 85% proficiency', time: '2 days ago', icon: Award },
  { title: 'Project Completed', desc: 'E-Commerce Platform', time: '1 week ago', icon: Gift },
  { title: 'New Skill Added', desc: 'TypeScript', time: '2 weeks ago', icon: Activity },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav userName="Alex Rivera" />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Welcome back, Alex Rivera!</h1>
          <p className="mt-1 text-sm text-gray-600">Here’s your skill development overview</p>
        </header>

        {/* Summary cards */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <SummaryCard label="Skills Mastered" value={3} icon={<Award size={16} />} />
          <SummaryCard label="In Progress" value={7} icon={<Activity size={16} />} />
          <SummaryCard label="Skill Gaps" value={4} icon={<Clock size={16} />} />
          <SummaryCard label="Projects" value={4} icon={<Gift size={16} />} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Skills map */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900 mb-1">Skill Proficiency Map</h2>
            <p className="text-sm text-gray-500 mb-6">Visual representation of your skill levels across different categories</p>

            <div className="space-y-5">
              {skills.map((s) => (
                <div key={s.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-900 font-medium">{s.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 border border-gray-200">{s.tag}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span className="hidden sm:inline text-green-600 font-medium">{s.label}</span>
                      <span>{s.level}</span>
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div className="h-full rounded-full bg-emerald-500" style={{ width: `${s.level}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <button className="w-full sm:w-auto inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
                View All Skills <ArrowRight size={16} />
              </button>
            </div>
          </section>

          {/* Right: Recent Activity */}
          <aside className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-sm font-semibold text-gray-900">Recent Activity</h2>
            <p className="text-sm text-gray-500 mb-4">Your latest achievements</p>
            <div className="divide-y divide-gray-100">
              {recent.map((r, idx) => (
                <div key={idx} className="py-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 grid place-items-center">
                    <r.icon size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{r.title}</div>
                    <div className="text-xs text-gray-600">{r.desc}</div>
                    <div className="text-[11px] text-gray-400 mt-1">{r.time}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              View History <History size={16} />
            </button>
          </aside>
        </div>

        {/* Recommendations */}
        <section className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Recommended for You</h3>
              <p className="text-sm text-gray-500">Personalized suggestions to enhance your skill set</p>
            </div>
            <button className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50">
              View All <ArrowRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition">
                <div className="text-sm font-medium text-gray-900">Suggested Course #{i}</div>
                <div className="text-xs text-gray-600 mt-1">Improve proficiency with curated content</div>
                <button className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 text-xs text-emerald-700 bg-emerald-50 rounded-md hover:bg-emerald-100">
                  Start Learning <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function SummaryCard({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex items-center justify-between">
      <div>
        <div className="text-sm text-gray-600">{label}</div>
        <div className="mt-1 text-2xl font-semibold text-gray-900">{value}</div>
      </div>
      <div className="w-9 h-9 rounded-xl bg-gray-100 text-gray-700 grid place-items-center">
        {icon}
      </div>
    </div>
  );
}


