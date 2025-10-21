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
  Menu,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import logo from '../assets/logo.png';

// Custom OTP Input Component
const OTPInput = ({ value = '', onChange, length = 6, error }) => {
  const handleChange = (index, digit) => {
    const newValue = (value || '').split('');
    newValue[index] = digit;
    const newOTP = newValue.join('').slice(0, length);
    onChange(newOTP);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const newValue = (value || '').split('');
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
          aria-label={`OTP digit ${index + 1}`}
          aria-describedby={error ? `otp-error-${index}` : undefined}
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
  const [successMessage, setSuccessMessage] = useState('');
  const [showHelp, setShowHelp] = useState(false);

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
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
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
          const response = await fetch('/api/auth/forgot-password/send-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: formData.email }),
          });
          
          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            throw new Error('Invalid response from server');
          }
          
          if (response.ok) {
            setSuccessMessage('OTP sent successfully! Please check your email.');
            setCurrentStep(2);
          } else {
            newErrors.email = data.message || 'Failed to send OTP. Please try again.';
          }
        }
      } else if (currentStep === 2) {
        if (!formData.otp) {
          newErrors.otp = 'Verification code is required';
        } else if (formData.otp.length !== 6) {
          newErrors.otp = 'Please enter the complete 6-digit code';
        }
        
        if (Object.keys(newErrors).length === 0) {
          const response = await fetch('/api/auth/forgot-password/verify-otp', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: formData.email,
              otp: formData.otp 
            }),
          });
          
          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            throw new Error('Invalid response from server');
          }
          
          if (response.ok) {
            setSuccessMessage('OTP verified successfully!');
            setCurrentStep(3);
          } else {
            newErrors.otp = data.message || 'Invalid verification code. Please try again.';
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
          const response = await fetch('/api/auth/forgot-password/reset-password', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              email: formData.email,
              otp: formData.otp,
              newPassword: formData.password 
            }),
          });
          
          let data;
          try {
            data = await response.json();
          } catch (jsonError) {
            throw new Error('Invalid response from server');
          }
          
          if (response.ok) {
            setCurrentStep(4);
          } else {
            newErrors.password = data.message || 'Failed to reset password. Please try again.';
          }
        }
      }
    } catch (error) {
      console.error('API Error:', error);
      newErrors.general = error.message || 'Network error. Please check your connection and try again.';
    }
    
    setErrors(newErrors);
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    setErrors({});
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/auth/forgot-password/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: formData.email }),
      });
      
      let data;
      try {
        data = await response.json();
      } catch (jsonError) {
        throw new Error('Invalid response from server');
      }
      
      if (response.ok) {
        setSuccessMessage('New OTP sent successfully! Please check your email.');
      } else {
        setErrors({ otp: data.message || 'Failed to resend OTP. Please try again.' });
      }
    } catch (error) {
      console.error('Resend OTP Error:', error);
      setErrors({ otp: error.message || 'Network error. Please try again.' });
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
                aria-label="Email address"
                aria-describedby={errors.email ? 'email-error' : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
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
                aria-label="Email address (disabled)"
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
                <p id="otp-error" className="text-red-500 text-sm mt-1 flex items-center justify-center gap-1">
                  <AlertCircle size={14} />
                  {errors.otp}
                </p>
              )}
              {successMessage && (
                <p className="text-green-500 text-sm mt-1 flex items-center justify-center gap-1">
                  <CheckCircle size={14} />
                  {successMessage}
                </p>
              )}
            </div>
            
            <div className="text-center">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={isLoading}
                className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Resend OTP"
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
                aria-label="Email address (disabled)"
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
                    aria-label={`OTP digit ${index + 1}`}
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
                  aria-label="New password"
                  aria-describedby={errors.password ? 'password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Must be at least 8 characters long
              </p>
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
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
                  aria-label="Confirm password"
                  aria-describedby={errors.confirmPassword ? 'confirm-password-error' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p id="confirm-password-error" className="text-red-500 text-sm mt-1 flex items-center gap-1">
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
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <div className="absolute top-0 left-0 right-0 bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img src={logo} alt="SkillMatch Logo" className="w-10 h-10 mr-2" />
            <span className="text-xl font-semibold text-gray-900">SkillMatch</span>
          </div>
          <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm">
            Back
          </Link>
          
          <div className="sm:hidden flex items-center gap-2">
            <ThemeToggle />
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Open menu">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 mt-20">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">Reset your password</h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              {steps[currentStep - 1].description}
            </p>
          </div>

          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-600 dark:text-red-400 text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {errors.general}
              </p>
            </div>
          )}

          {successMessage && currentStep !== 4 && (
            <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                <CheckCircle size={16} />
                {successMessage}
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {renderStepContent()}

            {currentStep === 4 ? (
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-colors bg-blue-600 text-white hover:bg-blue-700"
                aria-label="Back to login"
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
                aria-label={getButtonText()}
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
                  aria-label="Back to login"
                >
                  <ArrowLeft size={16} />
                  Back to Login
                </Link>
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <button
                type="button"
                onClick={() => setShowHelp(!showHelp)}
                className="w-full flex items-center justify-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-200 py-2 px-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
                aria-expanded={showHelp}
                aria-controls="help-content"
              >
                Need help
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </button>
              
              {showHelp && (
                <div id="help-content" className="mt-4 overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 shadow-sm">
                  <div className="p-5">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">How can we help you?
                    </h4>
                    <ul className="space-y-3">
                      <li className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          Make sure you're using your PHINMA Education email address 
                          <span className="font-medium text-gray-900 dark:text-white"> (@phinmaed.com</span> for students or 
                          <span className="font-medium text-gray-900 dark:text-white"> @phinma.edu.com</span> for professors)
                        </span>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          Contact IT support if you don't have access to your email
                        </span>
                      </li>
                      <li className="flex items-start gap-3 group">
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mt-0.5">
                          <svg className="w-3 h-3 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                          New users should{' '}
                          <Link 
                            to="/signup" 
                            className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-2 underline-offset-2 transition-colors"
                          >
                            create an account
                          </Link>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}