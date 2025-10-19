import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import ThemeToggle from '../components/ThemeToggle';
import { 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle, 
  AlertCircle,
  Eye,
  EyeOff,
  Menu
} from 'lucide-react';
import logo from '../assets/logo.png';

// Custom OTP Input Component
const OTPInput = ({ value, onChange, length = 6, error }) => {
  const { isDarkMode } = useTheme();
  const handleChange = (index, digit) => {
    const newValue = value.split('');
    newValue[index] = digit;
    const newOTP = newValue.join('').slice(0, length);
    onChange(newOTP);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const newValue = value.split('');
      newValue[index - 1] = '';
      onChange(newValue.join(''));
    }
  };

  return (
    <div className="flex gap-2 justify-center">
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          type="text"
          maxLength="1"
          value={value[index] || ''}
          onChange={(e) => {
            const digit = e.target.value.replace(/\D/g, '');
            if (digit) {
              handleChange(index, digit);
              // Auto-focus next input
              if (index < length - 1) {
                const nextInput = e.target.parentElement.children[index + 1];
                if (nextInput) nextInput.focus();
              }
            }
          }}
          onKeyDown={(e) => handleKeyDown(index, e)}
          className={`w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
            error 
              ? 'border-red-500 bg-red-50 dark:bg-red-900/20 dark:border-red-400' 
              : value[index] 
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20 dark:border-green-400' 
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
          }`}
        />
      ))}
    </div>
  );
};

export default function ForgotPassword() {
  const { isDarkMode } = useTheme();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Enter your email', description: 'Provide the email address linked to your account.' },
    { id: 2, title: 'Verify with OTP', description: 'Enter the code sent to your email.' },
    { id: 3, title: 'Create new password', description: 'Set up your new secure password.' },
    { id: 4, title: 'Success', description: 'Your password has been successfully reset.' }
  ];

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateUniversityEmail = (email) => {
    return email.endsWith('@phinmaed.com') || email.endsWith('@phinma.edu.com');
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    const newErrors = {};
    
    try {
      if (currentStep === 1) {
        if (!formData.email) {
          newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
          newErrors.email = 'Please enter a valid email address';
        } else if (!validateUniversityEmail(formData.email)) {
          newErrors.email = 'Please use your PHINMA Education email address (@phinmaed.com for students or @phinma.edu.com for professors)';
        }
        
        if (Object.keys(newErrors).length === 0) {
          // Simulate API call for testing
          console.log('🧪 TESTING: Sending OTP to', formData.email);
          console.log('🔑 TESTING OTP CODE: 123456');
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Always succeed for testing
          setCurrentStep(2);
        }
      } else if (currentStep === 2) {
        if (!formData.otp) {
          newErrors.otp = 'Verification code is required';
        } else if (formData.otp.length !== 6) {
          newErrors.otp = 'Please enter the complete 6-digit code';
        } else {
          // Simulate API call for testing
          console.log('🧪 TESTING: Verifying OTP', formData.otp);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Check if OTP is correct (for testing, accept 123456)
          if (formData.otp === '123456') {
            setCurrentStep(3);
          } else {
            newErrors.otp = 'Invalid verification code. Use 123456 for testing.';
          }
        }
      } else if (currentStep === 3) {
        if (!formData.password) {
          newErrors.password = 'Password is required';
        } else if (!validatePassword(formData.password)) {
          newErrors.password = 'Password must be at least 8 characters long';
        }
        
        if (!formData.confirmPassword) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
          newErrors.confirmPassword = 'Passwords do not match';
        }
        
        if (Object.keys(newErrors).length === 0) {
          // Simulate API call for testing
          console.log('🧪 TESTING: Resetting password for', formData.email);
          console.log('🔑 New password:', formData.password);
          
          // Simulate network delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Always succeed for testing
          setCurrentStep(4);
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      newErrors.general = 'Network error. Please check your connection and try again.';
    }
    
    setErrors(newErrors);
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      // Simulate API call for testing
      console.log('🧪 TESTING: Resending OTP to', formData.email);
      console.log('🔑 TESTING OTP CODE: 123456');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Always succeed for testing
      alert('New OTP sent successfully! Use 123456 for testing.');
    } catch (error) {
      console.error('Resend OTP Error:', error);
      alert('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  const getButtonText = () => {
    switch (currentStep) {
      case 1: return 'Send OTP';
      case 2: return 'Verify OTP';
      case 3: return 'Change Password';
      case 4: return 'Back to Login';
      default: return 'Continue';
    }
  };

  const getButtonIcon = () => {
    switch (currentStep) {
      case 1: return <Mail size={16} />;
      case 2: return <Lock size={16} />;
      case 3: return <Lock size={16} />;
      case 4: return <ArrowLeft size={16} />;
      default: return null;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="your.email@phinmaed.com"
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ${
                  errors.email ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.email}
                </p>
              )}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <OTPInput
                value={formData.otp}
                onChange={(value) => handleInputChange('otp', value)}
                error={errors.otp}
              />
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 text-center">
                Enter the 6-digit code sent to {formData.email}
              </p>
              {errors.otp && (
                <p className="text-red-500 text-sm mt-1 flex items-center justify-center gap-1">
                  <AlertCircle size={14} />
                  {errors.otp}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors"
              >
                Resend OTP
              </button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {formData.otp.split('').map((digit, index) => (
                  <div
                    key={index}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-green-500 dark:border-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg flex items-center justify-center text-gray-900 dark:text-white"
                  >
                    {digit}
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  placeholder="Enter your new password"
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ${
                    errors.password ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 8 characters long
              </p>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.password}
                </p>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  placeholder="Confirm your new password"
                  className={`w-full px-3 py-2 pr-10 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white bg-white dark:bg-gray-800 ${
                    errors.confirmPassword ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                  <AlertCircle size={14} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Password Reset Successful!</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Your password has been successfully changed! You can now log in with your new password.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col lg:flex-row transition-colors duration-300">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
        <div className="flex justify-between items-center p-4 sm:p-6">
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="SkillMatch Logo" className="w-8 h-8" />
            <span className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">SkillMatch</span>
          </Link>
          <div className="hidden sm:flex items-center gap-4">
            <ThemeToggle />
            <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              Login
            </Link>
            <Link
              to="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-2xl hover:bg-blue-700 transition-colors"
            >
              Sign Up
            </Link>
          </div>
          {/* Mobile Menu Button */}
          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-8 transition-colors duration-300">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <img src={logo} alt="SkillMatch Logo" className="w-8 h-8" />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">SkillMatch</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset your password</h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                {currentStep === 1 && 'Enter your email to receive a verification code.'}
                {currentStep === 2 && 'Enter the 6-digit code sent to your email.'}
                {currentStep === 3 && 'Create a new secure password.'}
                {currentStep === 4 && 'Your password has been successfully reset.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {renderStepContent()}

              {currentStep === 4 ? (
                <Link
                  to="/login"
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors bg-gray-600 text-white hover:bg-gray-700"
                >
                  {getButtonIcon()}
                  {getButtonText()}
                </Link>
              ) : (
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700 ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      {getButtonIcon()}
                      {getButtonText()}
                    </>
                  )}
                </button>
              )}

              {currentStep !== 4 && (
                <div className="text-center">
                  <Link
                    to="/login"
                    className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white flex items-center justify-center gap-1 transition-colors"
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              )}

              {/* Help Section */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Need help?</h3>
                <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2">
                  <li>• Make sure you're using your PHINMA Education email address (@phinmaed.com for students or @phinma.edu.com for professors)</li>
                  <li>• Contact IT support if you don't have access to your email</li>
                  <li>
                    • New users should{' '}
                    <Link to="/signup" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors">
                      create an account
                    </Link>
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right Side - Progress & Info - Desktop */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 to-teal-600 items-center justify-center p-8 relative overflow-hidden">
        <div className="relative z-10 text-white">
          <h2 className="text-4xl font-bold mb-4">Secure Account Recovery</h2>
          <p className="text-xl mb-12 text-blue-100">
            We'll help you regain access to your SkillMatch account quickly and securely.
          </p>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-colors ${
                    currentStep === step.id
                      ? 'bg-white text-blue-600'
                      : currentStep > step.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-blue-400 text-white'
                  }`}
                >
                  {currentStep > step.id ? <CheckCircle size={16} /> : step.id}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{step.title}</h3>
                  <p className="text-blue-100">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Background Image */}
          <div className="absolute bottom-0 right-0 opacity-20">
            <div className="w-64 h-48 bg-gray-800 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl font-bold text-blue-400 mb-2">React</div>
                <div className="text-sm text-gray-300">Edit src/App.js and save to reload</div>
                <div className="text-sm text-blue-400">Learn React</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Progress Indicator */}
      <div className="lg:hidden bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4">
        <div className="text-center mb-4">
          <h2 className="text-lg font-bold">Step {currentStep} of 4</h2>
          <p className="text-sm text-blue-100">{steps[currentStep - 1]?.title}</p>
        </div>
        <div className="flex justify-center space-x-2">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={`w-3 h-3 rounded-full transition-colors ${
                currentStep === step.id
                  ? 'bg-white'
                  : currentStep > step.id
                  ? 'bg-blue-400'
                  : 'bg-blue-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
