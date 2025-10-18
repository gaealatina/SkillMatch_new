import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Zap, X, CheckCircle, Shield, Eye, Lock, Database, Mail, Menu } from 'lucide-react';
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
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  // Terms of Service Modal
  const TermsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-screen-xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Terms of Service</h2>
          <button
            onClick={() => setShowTermsModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                1. Acceptance of Terms
              </h3>
              <p className="text-gray-700 leading-relaxed">
                By accessing and using SkillMatch, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                2. User Accounts
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Maintaining the confidentiality of your account and password</li>
                <li>All activities that occur under your account</li>
                <li>Notifying us immediately of any unauthorized use of your account</li>
                <li>Using only PHINMA Education email addresses (@phinmaed.com or @phinma.edu.com)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                3. Prohibited Uses
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You may not use our service:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                <li>To violate any international, federal, provincial, or state regulations, rules, laws, or local ordinances</li>
                <li>To infringe upon or violate our intellectual property rights or the intellectual property rights of others</li>
                <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                <li>To submit false or misleading information</li>
                <li>To upload or transmit viruses or any other type of malicious code</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                4. Content
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Our service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material ("Content"). You are responsible for the Content that you post to the service, including its legality, reliability, and appropriateness.
              </p>
              <p className="text-gray-700 leading-relaxed">
                By posting Content to the service, you grant us the right and license to use, modify, publicly perform, publicly display, reproduce, and distribute such Content on and through the service.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                5. Termination
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We may terminate or suspend your account and bar access to the service immediately, without prior notice or liability, under our sole discretion, for any reason whatsoever and without limitation, including but not limited to a breach of the Terms.
              </p>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="text-green-600" size={20} />
                6. Contact Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> support@skillmatch.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +63 (2) 1234-5678</p>
                <p className="text-gray-700"><strong>Address:</strong> PHINMA Education, Manila, Philippines</p>
              </div>
            </section>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setShowTermsModal(false)}
            className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              setTermsAccepted(true);
              setShowTermsModal(false);
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );

  // Privacy Policy Modal
  const PrivacyModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-[95%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[75%] max-w-screen-xl max-h-[85vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 sm:p-6 border-b flex-shrink-0">
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="text-blue-600" size={20} />
                1. Information We Collect
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We collect information you provide directly to us, such as when you create an account, use our services, or contact us for support.
              </p>
              
              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Users className="text-green-600" size={18} />
                Personal Information
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4 mb-4">
                <li>Name and contact information (email address, phone number)</li>
                <li>PHINMA Education email address (@phinmaed.com or @phinma.edu.com)</li>
                <li>Profile information (role, department, skills, experience)</li>
                <li>Project history and performance data</li>
                <li>Account credentials and preferences</li>
              </ul>

              <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Database className="text-purple-600" size={18} />
                Usage Information
              </h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Log data (IP address, browser type, pages visited)</li>
                <li>Device information (device type, operating system)</li>
                <li>Cookies and similar tracking technologies</li>
                <li>Usage patterns and preferences</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Eye className="text-blue-600" size={20} />
                2. How We Use Your Information
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We use the information we collect to provide, maintain, and improve our services:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Provide and maintain the SkillMatch platform</li>
                <li>Process transactions and send related information</li>
                <li>Send technical notices, updates, and support messages</li>
                <li>Respond to your comments and questions</li>
                <li>Improve our services and develop new features</li>
                <li>Monitor and analyze usage and trends</li>
                <li>Personalize your experience</li>
                <li>Ensure platform security and prevent fraud</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Lock className="text-green-600" size={20} />
                3. Data Security
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Encryption of data in transit and at rest</li>
                <li>Regular security assessments and updates</li>
                <li>Access controls and authentication measures</li>
                <li>Employee training on data protection</li>
                <li>Incident response procedures</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="text-green-600" size={20} />
                4. Your Rights and Choices
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                You have certain rights regarding your personal information:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Access:</strong> Request access to your personal information</li>
                <li><strong>Correction:</strong> Request correction of inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Portability:</strong> Request a copy of your data in a portable format</li>
                <li><strong>Objection:</strong> Object to processing of your personal information</li>
                <li><strong>Withdrawal:</strong> Withdraw consent where processing is based on consent</li>
              </ul>
            </section>

            <section className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Mail className="text-blue-600" size={20} />
                5. Contact Us
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700"><strong>Email:</strong> privacy@skillmatch.com</p>
                <p className="text-gray-700"><strong>Phone:</strong> +63 (2) 1234-5678</p>
                <p className="text-gray-700"><strong>Address:</strong> PHINMA Education, Manila, Philippines</p>
              </div>
            </section>
          </div>
        </div>
        <div className="flex justify-end gap-3 p-4 sm:p-6 border-t bg-gray-50 flex-shrink-0">
          <button
            onClick={() => setShowPrivacyModal(false)}
            className="px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              setTermsAccepted(true);
              setShowPrivacyModal(false);
            }}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            I Accept
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white border-b border-gray-200 px-4 sm:px-6 py-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className='flex items-center gap-2'>
            <img src={logo} alt="logo" className='w-8 h-8 sm:w-10 sm:h-10'/>
            <span className="text-lg sm:text-xl font-semibold text-gray-900">SkillMatch</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm font-medium">Back</Link>
            <Link to="/login" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">Sign In</Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3 pt-4">
              <Link 
                to="/" 
                className="text-gray-600 hover:text-gray-900 text-sm font-medium py-2 px-2 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Back
              </Link>
              <Link 
                to="/login" 
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium text-center"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </div>
          </div>
        )}
      </nav>

      <div className='flex justify-center items-center min-h-screen px-4 py-4 sm:py-8 bg-gray-50'>
        <div className='bg-white p-4 sm:p-8 rounded-2xl shadow-lg w-full max-w-2xl'>
          <h2 className='text-xl sm:text-2xl font-bold mb-2 text-center text-gray-900'>Create your account</h2>
          <p className='text-center text-sm sm:text-base text-gray-600 mb-6 sm:mb-8'>Join SkillMatch to start mapping your skills and tracking your progress</p>

          <div className='space-y-6'>
            <div>
              <p className='text-sm font-medium text-gray-900 mb-4'>I am a:</p>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                <button
                  onClick={() => {
                    setUserType('student');
                    setFormData(prev => ({ ...prev, course: '', yearLevel: '' }));
                  }}
                  className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                    userType === 'student'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <BookOpen className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${userType === 'student' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <p className='font-semibold text-gray-900 text-sm sm:text-base'>Student</p>
                  <p className='text-xs text-gray-600 mt-1'>Join & track skills</p>
                </button>

                <button
                  onClick={() => {
                    setUserType('educator');
                    setFormData(prev => ({ ...prev, course: '', yearLevel: '' }));
                  }}
                  className={`p-4 sm:p-6 rounded-lg border-2 transition-all ${
                    userType === 'educator'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <Users className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${userType === 'educator' ? 'text-blue-600' : 'text-gray-600'}`} />
                  <p className='font-semibold text-gray-900 text-sm sm:text-base'>Educator</p>
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
                I agree to the <button type="button" onClick={() => setShowTermsModal(true)} className='text-blue-600 hover:underline'>Terms of Service</button> and <button type="button" onClick={() => setShowPrivacyModal(true)} className='text-blue-600 hover:underline'>Privacy Policy</button>
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
              Already have an account? <Link to='/login' className='text-blue-600 hover:underline font-medium'>Sign in</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showTermsModal && <TermsModal />}
      {showPrivacyModal && <PrivacyModal />}
    </div>
  );
};

export default Signup;