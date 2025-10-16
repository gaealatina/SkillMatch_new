import { useState } from 'react';
import logo from '../assets/logo.png';

const Signup = () => {
  const [skills, setSkills] = useState({
    programming: false,
    webDev: false,
    mobileDev: false,
    database: false,
    uiux: false,
    dataSci: false,
    communication: false,
    teamLead: false,
    problemSolving: false
  });

  const handleSkillToggle = (skill) => {
    setSkills(prev => ({
      ...prev,
      [skill]: !prev[skill]
    }));
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <div className='flex items-center gap-2'>
            <div>
              <img src={logo} alt="SkillMatch Logo" className="h-10 w-10"/>
            </div>
            <span className="text-xl font-semibold text-gray-900">SkillMatch</span>
            
            <div className='mr-auto absolute right-2 -translate-x-1/2 flex gap-8'>
              <a href="/login" className="bg-blue-600 text-white hover:bg-blue-700 pt-0.5 pb-0.5 pl-3 pr-3 px-6 py-3 rounded-lg">Sign In</a>
            </div>
          </div>  
        </div>
      </nav>

      {/* Container */}
      <div className='flex justify-center items-center min-h-screen px-4 py-8 bg-gray-50'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl'>
          {/* Header */}
          <h2 className='text-2xl font-bold mb-2 text-center text-gray-900'>Create your account</h2>
          <p className='text-center text-gray-600 mb-8'>Join SkillMatch to start mapping your skills and tracking your progress</p>

          <div className='space-y-6'>
            {/* Full Name and Student ID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Full Name *</label>
                <input
                  type="text"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='Juan Dela Cruz'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Student ID *</label>
                <input
                  type="text"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='**-****-******'
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-2'>Email *</label>
              <input
                type="email"
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='example@gmail.com'
              />
            </div>

            {/* Password and Confirm Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Password *</label>
                <input
                  type="password"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='••••••••'
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Confirm Password *</label>
                <input
                  type="password"
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                  placeholder='••••••••'
                />
              </div>
            </div>

            {/* Course and Year Level */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Course *</label>
                <select
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                >
                  <option value="">Select course</option>
                  <option value="BSIT">BS Information Technology</option>
                  <option value="BSCS">BS Computer Security</option>
                  <option value="BSDA">BS Digital Arts</option>
                  <option value="BSSD">BS System Development</option>
                  <option value="BSBI">BS Business Informatics</option>
                </select>
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Year Level *</label>
                <select
                  className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900'
                >
                  <option value="">Select year</option>
                  <option value="1">1st Year</option>
                  <option value="2">2nd Year</option>
                  <option value="3">3rd Year</option>
                  <option value="4">4th Year</option>
                </select>
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className='block text-sm font-medium text-gray-900 mb-4'>Initial Skills (Select all that apply)</label>
              <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('programming')} />
                  <span className='text-gray-700'>Programming</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('webDev')} />
                  <span className='text-gray-700'>Web Development</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('mobileDev')} />
                  <span className='text-gray-700'>Mobile Development</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('database')} />
                  <span className='text-gray-700'>Database Design</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('uiux')} />
                  <span className='text-gray-700'>UI/UX Design</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('dataSci')} />
                  <span className='text-gray-700'>Data Science</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('communication')} />
                  <span className='text-gray-700'>Communication</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('teamLead')} />
                  <span className='text-gray-700'>Team Leadership</span>
                </label>
                <label className='flex items-center gap-3 cursor-pointer'>
                  <input type='checkbox' className='w-5 h-5 rounded' onChange={() => handleSkillToggle('problemSolving')} />
                  <span className='text-gray-700'>Problem Solving</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-8'>
              Create Account
            </button>

            {/* Sign In Link */}
            <div className='text-center text-gray-600'>
              Already have an account? <a href='/login' className='text-blue-600 hover:underline font-medium'>Sign In</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;