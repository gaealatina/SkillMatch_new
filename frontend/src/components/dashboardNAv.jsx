import { NavLink, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import logo from '../assets/logo.png';

const baseLinkClass =
  'text-sm text-gray-600 px-3 py-2 rounded-full transition-colors transition-bg hover:bg-[#14B8A6] hover:text-white';

const activeLinkClass =
  'text-sm text-white font-medium px-3 py-2 rounded-full bg-[#2563EB]';

function getInitials(name) {
  if (!name) return '';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map(p => p[0]?.toUpperCase()).join('');
}

export default function DashboardNav({
  userName = 'Alex Rivera',
  links = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/profile', label: 'Profile' },
    { to: '/roles', label: 'Role History' },
    { to: '/suggestions', label: 'Suggestions' },
  ],
}) {
  const initials = getInitials(userName);

  return (
    <div className="w-full bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Left: Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-blue-600 grid place-items-center">
            <img src={logo} alt="SkillMatch" className="w-5 h-5" />
          </div>
          <span className="text-lg font-semibold text-gray-900">SkillMatch</span>
        </Link>

        {/* Center: Nav links */}
        <nav className="hidden md:flex items-center gap-2">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => (isActive ? activeLinkClass : baseLinkClass)}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: Settings and User */}
        <div className="flex items-center gap-4">
          <Link to="/settings" className="text-gray-600 hover:text-[#14B8A6]">
            <Settings size={18} />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-semibold grid place-items-center">
              {initials || 'U'}
            </div>
            <span className="hidden sm:inline text-sm text-gray-800">{userName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}