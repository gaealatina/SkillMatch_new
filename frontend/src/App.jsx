import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import ThemeContext from "./contexts/ThemeContext.jsx";
import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import Profile from "./pages/Profile.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import RoleHistory from "./pages/RoleHistory.jsx";
import Settings from "./pages/Settings.jsx";
import Suggestions from "./pages/Suggestions.jsx";
import CareerPath from "./pages/CareerPath.jsx";
import ThemeTransition from "./components/ThemeTransition.jsx";

function App() {
  console.log('App rendering');
  
  // Dark mode state management
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('isDarkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [isThemeTransitioning, setIsThemeTransitioning] = useState(false);

  // Save dark mode preference to localStorage
  useEffect(() => {
    localStorage.setItem('isDarkMode', JSON.stringify(isDarkMode));
    
    // Apply dark mode class to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Theme toggle function with animation
  const toggleDarkMode = () => {
    setIsThemeTransitioning(true);
    
    // Small delay to show animation
    setTimeout(() => {
      setIsDarkMode(!isDarkMode);
    }, 100);
    
    // Hide animation after theme transition completes
    setTimeout(() => {
      setIsThemeTransitioning(false);
    }, 600);
  };

  // Provide theme context to all components
  const themeContext = {
    isDarkMode,
    toggleDarkMode,
    isThemeTransitioning
  };

  return (
    <ThemeContext.Provider value={themeContext}>
      <Router>
        <div className={isDarkMode ? 'dark' : ''}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/roles" element={<RoleHistory />} />
            <Route path="/suggestions" element={<Suggestions />} />
            <Route path="/career-paths" element={<CareerPath />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Toaster position="bottom-right" richColors />
          
          {/* Theme Transition Animation */}
          <AnimatePresence>
            {isThemeTransitioning && (
              <ThemeTransition isDarkMode={!isDarkMode} />
            )}
          </AnimatePresence>
        </div>
      </Router>
    </ThemeContext.Provider>
  );
}

export default App;