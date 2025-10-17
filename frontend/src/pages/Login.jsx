import { useState, useEffect, useRef } from 'react';
import girl2 from '../assets/girl2.png';
import logo from '../assets/logo.png';
import googleLogo from '../assets/googleLogo.png'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google || !clientId) return;
    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: async (response) => {
        try {
          const res = await fetch('/api/users/google', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ credential: response.credential })
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Google login failed');
          console.log('Google login success', data);
        } catch (e) {
          console.error(e);
        }
      }
    });
    if (googleButtonRef.current) {
      window.google.accounts.id.renderButton(googleButtonRef.current, { theme: 'outline', size: 'large', width: '100%' });
    }
  }, []);

  const handleSubmit = () => {
    console.log('Login submitted:', { email, password });
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 relative">
      {/* Top Navigation */}
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4 z-20">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="SkillMatch Logo"
              className="w-10 h-10 mr-2"
            />
            <span className="text-xl font-semibold text-gray-900">
              SkillMatch
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              className="text-gray-600 hover:text-gray-900 text-sm"
            >
              Back
            </a>
            <a
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm"
            >
              Sign up
            </a>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl overflow-hidden flex mt-24">
        {/* Left Side - Login Form */}
        <div className="w-full lg:w-5/12 p-8 lg:p-12 flex flex-col justify-center">
          {/* Welcome Back */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back
            </h1>
            <p className="text-gray-600 text-sm">
              Sign in to your account to continue your learning journey
            </p>
          </div>

          {/* Login Form */}
          <div className="space-y-5">
            {/* Email / Student ID */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email / Student ID
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you.name@example.edu"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="······"
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
              />
            </div>

            {/* Forgot Password */}
            <div className="flex justify-end">
              <a href="#" className="text-sm text-blue-600 hover:text-blue-700">
                Forgot Password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition text-sm"
            >
              Login
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-600 text-sm">Don't have an account? </span>
              <a
                href="/signup"
                className="text-blue-600 hover:text-blue-700 font-medium text-sm"
              >
                Sign up
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 text-xs">
                Or continue with
              </span>
            </div>
          </div>

          {/* OAuth Options */}
          <div className="space-y-3">
            <div ref={googleButtonRef} className="w-full flex items-center justify-center"></div>
          </div>
        </div>

        {/* Right Side - Hero Image */}
        <div className="hidden lg:flex lg:w-7/12 bg-gradient-to-br from-blue-600 via-blue-500 to-teal-400 items-center justify-center p-12 relative">
          <div className="text-center text-white max-w-md z-10">
            <h2 className="text-3xl font-bold mb-4">Discover Your Potential</h2>
            <p className="text-lg text-blue-50 mb-8">
              Map your skills, track your progress, and unlock new opportunities with SkillMatch.
            </p>

            {/* Image Container */}
            <div className="w-full flex justify-center">
              <img
                src={girl2}
                alt="Students studying together"
                className="max-w-sm w-full h-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
