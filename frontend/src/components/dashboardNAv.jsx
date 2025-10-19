import { NavLink, Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInFromRight {
    0% {
      opacity: 0;
      transform: translateX(20px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;
document.head.appendChild(style);

const baseLinkClass =
  'text-sm text-muted-foreground px-3 py-2 rounded-full transition-colors transition-bg hover:bg-secondary hover:text-secondary-foreground';

const activeLinkClass =
  'text-sm text-primary-foreground font-medium px-3 py-2 rounded-full bg-primary';

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
    { to: '/career-paths', label: 'Career Paths' },
  ],
  isMobileMenuOpen = false,
  setIsMobileMenuOpen = () => {},
}) {
  const initials = getInitials(userName);

  return (
    <div className="w-full bg-card border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/dashboard" className="flex items-center gap-2 shrink-0">
          {/* Left: Logo and Brand */}
          <div className="flex items-center gap-2">
            <div>
              <img
                src={logo}
                alt="SkillMatch Logo"
                className="w-8 h-8 sm:w-10 sm:h-10 mr-1 sm:mr-2 inline-block"
              />
            </div>
            <span className="text-base sm:text-xl font-semibold text-foreground">SkillMatch</span>
          </div>
        </Link>

        {/* Center: Nav links - Desktop */}
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

        {/* Right: Desktop Settings, User, and Mobile Menu Button */}
        <div className="flex items-center gap-4">
          {/* Desktop Settings and User - Hidden on mobile */}
          <div className="hidden md:flex items-center gap-4">
            <Link to="/settings" className="text-muted-foreground hover:text-secondary">
              <Settings size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold grid place-items-center">
                {initials || 'U'}
              </div>
              <span className="text-sm text-foreground">{userName}</span>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all duration-300 ease-in-out"
          >
            <div className="relative w-5 h-5">
              <span className={`absolute top-0 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : 'translate-y-0'}`}></span>
              <span className={`absolute top-2 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`absolute top-4 left-0 w-5 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : 'translate-y-0'}`}></span>
            </div>
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 animate-in fade-in duration-300">
          {/* Dark Background Overlay */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-75 animate-in fade-in duration-300"
            onClick={() => setIsMobileMenuOpen(false)}
          ></div>
          
          {/* Mobile Menu Content */}
          <div className="relative bg-card shadow-xl animate-in slide-in-from-top-4 duration-300">
            <div className="px-4 py-4">
              <div className="flex flex-col space-y-3">
                {/* Navigation Links */}
                {links.map((link, index) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => 
                      `text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 ${
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`
                    }
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: 'slideInFromRight 0.3s ease-out forwards'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </NavLink>
                ))}
                
                {/* Divider */}
                <div className="border-t border-border my-3 animate-in fade-in duration-500" style={{ animationDelay: '200ms' }}></div>
                
                {/* Settings and User Account */}
                <div className="space-y-2">
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 text-sm font-medium py-3 px-4 rounded-lg transition-all duration-200 hover:scale-105 text-muted-foreground hover:text-foreground hover:bg-muted"
                    style={{
                      animationDelay: '250ms',
                      animation: 'slideInFromRight 0.3s ease-out forwards'
                    }}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings size={18} />
                    Settings
                  </Link>
                  
                  <div 
                    className="flex items-center gap-3 py-3 px-4"
                    style={{
                      animationDelay: '300ms',
                      animation: 'slideInFromRight 0.3s ease-out forwards'
                    }}
                  >
                    <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-xs font-semibold grid place-items-center">
                      {initials || 'U'}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-foreground">{userName}</span>
                      <span className="text-xs text-muted-foreground">Account</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}