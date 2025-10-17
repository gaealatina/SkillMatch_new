import { useState } from 'react';
import { BookOpen, Users, Zap } from 'lucide-react';
import logo from '../assets/logo.png';


const Signup = () => {
  const [userType, setUserType] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    id: '',
    password: '',
    confirmPassword: '',
    course: '',
    yearLevel: ''
  });
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateFirstName = (value) => /^[a-zA-Z\s]*$/.test(value);
  const validateLastName = (value) => /^[a-zA-Z\s]*$/.test(value);
  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  const validateID = (value) => /^\d{2}-\d{4}-\d{6}$/.test(value);
  const validatePassword = (value) => {
    const hasMinLength = value.length >= 8;
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value);
    return hasMinLength && hasNumber && hasSpecialChar;
  };

  const getYearOptions = () => {
    if (formData.course === 'BSIT') {
      return ['1', '2'];
    } else if (formData.course === 'BSCS' || formData.course === 'BSDA' || formData.course === 'BSSD' || formData.course === 'BSBI') {
      return ['3', '4'];
    }
    return [];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    let finalValue = value;

    if (name === 'firstName' || name === 'lastName') {
      finalValue = value.replace(/[^a-zA-Z\s]/g, '');
    }

    if (name === 'id') {
      finalValue = value.replace(/[^0-9-]/g, '');
      if (finalValue.length > 14) finalValue = finalValue.slice(0, 14);
    }

    if (name === 'course') {
      setFormData(prev => ({
        ...prev,
        [name]: finalValue,
        yearLevel: ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    else if (!validateFirstName(formData.firstName)) newErrors.firstName = 'First name must contain only letters';

    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (!validateLastName(formData.lastName)) newErrors.lastName = 'Last name must contain only letters';

    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email';

    if (!formData.id) newErrors.id = 'ID is required';
    else if (!validateID(formData.id)) newErrors.id = 'ID format must be XX-XXXX-XXXXXX';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be minimum 8 characters with at least 1 number and 1 special character';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';

    if (userType === 'student') {
      if (!formData.course) newErrors.course = 'Course is required';
      if (!formData.yearLevel) newErrors.yearLevel = 'Year level is required';
    }

    if (!userType) newErrors.userType = 'Please select a user type';
    if (!termsAccepted) newErrors.terms = 'You must accept the terms and privacy policy';

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', { ...formData, userType, termsAccepted });
      alert('Account created successfully!');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center relative">
          <div className='flex items-center gap-2'>
            <img src={logo} alt="logo" className='w-10' h-10/>
            <span className="text-xl font-semibold text-gray-900">SkillMatch</span>
            
            <div className='mr-auto absolute right-2 -translate-x-1/2 flex gap-8'>
              <a href="/" className="mt-2 text-black hover:text-gray-400 text-sm">Back</a>
              <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm">Sign In</a>
            </div>
          </div>  
        </div>
      </nav>

      <div className='flex justify-center items-center min-h-screen px-4 py-8 bg-gray-50'>
        <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-2xl'>
          <h2 className='text-2xl font-bold mb-2 text-center text-gray-900'>Create your account</h2>
          <p className='text-center text-gray-600 mb-8'>Join SkillMatch to start mapping your skills and tracking your progress</p>

          <div className='space-y-6'>
            <div>
              <p className='text-sm font-medium text-gray-900 mb-4'>I am a:</p>
              <div className='grid grid-cols-2 gap-4'>
                <button
                  onClick={() => {
                    setUserType('student');
                    setFormData(prev => ({ ...prev, course: '', yearLevel: '' }));
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    userType === 'student'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <BookOpen className={`w-8 h-8 mx-auto mb-3 ${userType === 'student' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <p className='font-semibold text-gray-900'>Student</p>
                  <p className='text-xs text-gray-600 mt-1'>Join & track skills</p>
                </button>

                <button
                  onClick={() => {
                    setUserType('educator');
                    setFormData(prev => ({ ...prev, course: '', yearLevel: '' }));
                  }}
                  className={`p-6 rounded-lg border-2 transition-all ${
                    userType === 'educator'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Users className={`w-8 h-8 mx-auto mb-3 ${userType === 'educator' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <p className='font-semibold text-gray-900'>Educator</p>
                  <p className='text-xs text-gray-600 mt-1'>Join & track skills</p>
                </button>
              </div>
              {errors.userType && <p className='text-red-500 text-xs mt-2'>{errors.userType}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>First Name*</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Juan'
                />
                {errors.firstName && <p className='text-red-500 text-xs mt-1'>{errors.firstName}</p>}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='Dela Cruz'
                />
                {errors.lastName && <p className='text-red-500 text-xs mt-1'>{errors.lastName}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Email *</label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='example@gmail.com'
                />
                {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
              </div>

              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>ID *</label>
                <input
                  type="text"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  maxLength="14"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.id ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='00-0000-000000'
                />
                {errors.id && <p className='text-red-500 text-xs mt-1'>{errors.id}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Password *</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='••••••••'
                />
                {errors.password && <p className='text-red-500 text-xs mt-1'>{errors.password}</p>}
              </div>
              <div>
                <label className='block text-sm font-medium text-gray-900 mb-2'>Confirm Password *</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder='••••••••'
                />
                {errors.confirmPassword && <p className='text-red-500 text-xs mt-1'>{errors.confirmPassword}</p>}
              </div>
            </div>

            {userType === 'student' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>Course *</label>
                  <select
                    name="course"
                    value={formData.course}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                      errors.course ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select course</option>
                    <option value="BSIT">BS Information Technology</option>
                    <option value="BSCS">Computer Security</option>
                    <option value="BSDA">Digital Arts</option>
                    <option value="BSSD">System Development</option>
                    <option value="BSBI">Business Informatics</option>
                  </select>
                  {errors.course && <p className='text-red-500 text-xs mt-1'>{errors.course}</p>}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-900 mb-2'>Year Level *</label>
                  <select
                    name="yearLevel"
                    value={formData.yearLevel}
                    onChange={handleInputChange}
                    disabled={!formData.course}
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 ${
                      errors.yearLevel ? 'border-red-500' : 'border-gray-300'
                    } ${!formData.course ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <option value="">Select year</option>
                    {formData.course === 'BSIT' && (
                      <>
                        <option value="1">1st Year</option>
                        <option value="2">2nd Year</option>
                      </>
                    )}
                    {(formData.course === 'BSCS' || formData.course === 'BSDA' || formData.course === 'BSSD' || formData.course === 'BSBI') && (
                      <>
                        <option value="3">3rd Year</option>
                        <option value="4">4th Year</option>
                      </>
                    )}
                  </select>
                  {errors.yearLevel && <p className='text-red-500 text-xs mt-1'>{errors.yearLevel}</p>}
                </div>
              </div>
            )}

            <div className='flex items-center gap-3'>
              <input
                type="checkbox"
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className='w-4 h-4 accent-blue-600 cursor-pointer'
              />
              <label htmlFor="terms" className='text-sm text-gray-600'>
                I agree to the <a href="#" className='text-blue-600 hover:underline'>Terms of Service</a> and <a href="#" className='text-blue-600 hover:underline'>Privacy Policy</a>
              </label>
            </div>
            {errors.terms && <p className='text-red-500 text-xs'>{errors.terms}</p>}

            <button
              onClick={handleSubmit}
              className='w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors duration-200 mt-8'
            >
              Create account
            </button>

            <div className='text-center text-gray-600'>
              Already have an account? <a href='/login' className='text-blue-600 hover:underline font-medium'>Sign in</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;