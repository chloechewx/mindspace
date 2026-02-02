import React, { useState, useEffect } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuthModalStore } from '../store/authModalStore';
import { useUserStore } from '../store/userStore';

export const AuthModal: React.FC = () => {
  const { isOpen, mode, actionDescription, closeModal, setMode, completeAction } = useAuthModalStore();
  const { signUp, signIn, error, isLoading } = useUserStore();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [localError, setLocalError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      resetForm();
      setIsClosing(false);
      setIsSubmitting(false);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (mode === 'signup' && password) {
      let strength = 0;
      if (password.length >= 8) strength += 25;
      if (password.length >= 12) strength += 25;
      if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
      if (/[0-9]/.test(password)) strength += 15;
      if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
      setPasswordStrength(Math.min(strength, 100));
    } else {
      setPasswordStrength(0);
    }
  }, [password, mode]);

  const validateForm = (): boolean => {
    setLocalError('');

    if (!email.trim()) {
      setLocalError('Email is required');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return false;
    }

    if (!password) {
      setLocalError('Password is required');
      return false;
    }

    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long');
      return false;
    }

    if (mode === 'signup') {
      if (!name.trim()) {
        setLocalError('Name is required');
        return false;
      }

      if (name.trim().length < 2) {
        setLocalError('Name must be at least 2 characters long');
        return false;
      }

      if (!confirmPassword) {
        setLocalError('Please confirm your password');
        return false;
      }

      if (password !== confirmPassword) {
        setLocalError('Passwords do not match');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSubmitting || isLoading) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      let success = false;

      if (mode === 'signup') {
        success = await signUp(email, password, name);
      } else {
        success = await signIn(email, password);
      }

      if (success) {
        await new Promise(resolve => setTimeout(resolve, 100));
        completeAction();
        handleClose();
      }
    } catch (err: any) {
      setLocalError(err.message || 'An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setName('');
    setLocalError('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setPasswordStrength(0);
    setIsSubmitting(false);
  };

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      closeModal();
      resetForm();
    }, 200);
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setLocalError('');
    setIsSubmitting(false);
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality will be implemented soon!');
  };

  const displayError = localError || error;
  const isButtonDisabled = isSubmitting || isLoading;

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 40) return 'bg-red-500';
    if (passwordStrength < 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 40) return 'Weak';
    if (passwordStrength < 70) return 'Medium';
    return 'Strong';
  };

  if (!isOpen) return null;

  return (
    <div 
      className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${
        isClosing ? 'opacity-0' : 'opacity-100'
      }`}
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl max-w-[380px] w-full relative overflow-hidden transition-all duration-300 ${
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sage-500 via-lavender-500 to-blush-500" />
        
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors z-10 p-1 rounded-full hover:bg-gray-100"
          disabled={isButtonDisabled}
          aria-label="Close modal"
          type="button"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-5 pt-6">
          <div className="text-center mb-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-xl mb-2">
              <User className="w-5 h-5 text-sage-600" />
            </div>
            <h2 id="auth-modal-title" className="text-xl font-serif font-semibold text-gray-800 mb-0.5">
              {mode === 'login' ? 'Welcome Back' : 'Join MindSpace'}
            </h2>
            {actionDescription ? (
              <p className="text-xs text-gray-600 mt-2 px-4">
                {actionDescription}
              </p>
            ) : (
              <p className="text-xs text-gray-600">
                {mode === 'login' 
                  ? 'Sign in to continue your wellness journey' 
                  : 'Start your journey to better mental health'}
              </p>
            )}
          </div>

          <div className="flex gap-1.5 mb-4 p-0.5 bg-gray-100 rounded-lg">
            <button
              type="button"
              onClick={() => setMode('login')}
              disabled={isButtonDisabled}
              className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-all duration-300 ${
                mode === 'login'
                  ? 'bg-white text-sage-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-pressed={mode === 'login'}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => setMode('signup')}
              disabled={isButtonDisabled}
              className={`flex-1 py-1.5 rounded-md font-semibold text-xs transition-all duration-300 ${
                mode === 'signup'
                  ? 'bg-white text-sage-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
              aria-pressed={mode === 'signup'}
            >
              Sign Up
            </button>
          </div>

          {displayError && (
            <div 
              className="mb-3 p-2.5 bg-red-50 border border-red-200 rounded-lg flex items-start gap-1.5 animate-slide-up"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-3.5 h-3.5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-800">{displayError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3" noValidate>
            {mode === 'signup' && (
              <div className="animate-slide-up">
                <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-8 pr-2.5 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-sage-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                    placeholder="Enter your full name"
                    required={mode === 'signup'}
                    disabled={isButtonDisabled}
                    autoComplete="name"
                    aria-required={mode === 'signup'}
                    aria-invalid={localError.includes('Name') ? 'true' : 'false'}
                  />
                </div>
              </div>
            )}

            <div className={mode === 'signup' ? 'animate-slide-up' : ''}>
              <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-2.5 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-sage-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your email"
                  required
                  disabled={isButtonDisabled}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={localError.includes('email') ? 'true' : 'false'}
                />
              </div>
            </div>

            <div className={mode === 'signup' ? 'animate-slide-up' : ''}>
              <label htmlFor="password" className="block text-xs font-semibold text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-9 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-sage-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                  placeholder="Enter your password"
                  required
                  minLength={8}
                  disabled={isButtonDisabled}
                  autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
                  aria-required="true"
                  aria-invalid={localError.includes('Password') ? 'true' : 'false'}
                  aria-describedby={mode === 'signup' ? 'password-strength' : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                  disabled={isButtonDisabled}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
              
              {mode === 'signup' && password && (
                <div id="password-strength" className="mt-1 animate-slide-up">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium text-gray-600">Password Strength</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength < 40 ? 'text-red-600' : 
                      passwordStrength < 70 ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${passwordStrength}%` }}
                      role="progressbar"
                      aria-valuenow={passwordStrength}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              )}

              {mode === 'login' && (
                <div className="mt-1 text-right">
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-xs text-sage-600 hover:text-sage-700 font-semibold transition-colors"
                    disabled={isButtonDisabled}
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {mode === 'signup' && (
              <div className="animate-slide-up">
                <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-700 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" aria-hidden="true" />
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-8 pr-9 py-2 text-sm border-2 border-gray-200 rounded-lg focus:border-sage-400 focus:outline-none transition-all duration-300 hover:border-gray-300"
                    placeholder="Confirm your password"
                    required={mode === 'signup'}
                    minLength={8}
                    disabled={isButtonDisabled}
                    autoComplete="new-password"
                    aria-required={mode === 'signup'}
                    aria-invalid={localError.includes('match') ? 'true' : 'false'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-0.5"
                    disabled={isButtonDisabled}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
                {confirmPassword && password === confirmPassword && (
                  <div className="mt-1 flex items-center gap-1 text-green-600 animate-slide-up">
                    <CheckCircle2 className="w-3 h-3" />
                    <span className="text-xs font-medium">Passwords match</span>
                  </div>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={isButtonDisabled}
              className="w-full bg-gradient-to-r from-sage-500 to-lavender-500 text-white py-2.5 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mt-4"
            >
              {isButtonDisabled ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {isSubmitting ? 'Processing...' : 'Please wait...'}
                </span>
              ) : (
                mode === 'login' ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {mode === 'signup' && (
            <p className="mt-2.5 text-xs text-center text-gray-500 animate-slide-up">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-sage-600 hover:text-sage-700 font-semibold">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-sage-600 hover:text-sage-700 font-semibold">
                Privacy Policy
              </a>
            </p>
          )}

          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={switchMode}
              disabled={isButtonDisabled}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50 text-xs"
            >
              {mode === 'login' 
                ? "Don't have an account? " 
                : 'Already have an account? '}
              <span className="text-sage-600 hover:text-sage-700 font-semibold">
                {mode === 'login' ? 'Sign up' : 'Sign in'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
