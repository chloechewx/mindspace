import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Mail, ArrowLeft, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';

export const ForgotPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsLoading(true);
    
    const { error: resetError } = await authService.resetPassword({ email });
    
    setIsLoading(false);
    
    if (resetError) {
      setError(resetError.message || 'Failed to send reset email. Please try again.');
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center animate-fade-in">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-2xl shadow-lg mb-4">
            <Heart className="w-9 h-9 text-white" fill="white" />
          </div>
          <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
            Reset Password
          </h1>
          <p className="text-gray-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <div className="soft-card p-8">
          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-2xl">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-sage-100 focus:border-sage-300 focus:outline-none focus:ring-2 focus:ring-sage-200 transition-all"
                    disabled={isLoading}
                    required
                    aria-label="Email address"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-2xl font-semibold hover:shadow-[0_6px_20px_rgba(90,146,90,0.4)] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending reset link...
                  </span>
                ) : (
                  'Send Reset Link'
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-2xl">
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-green-800 mb-1">
                    Reset link sent!
                  </p>
                  <p className="text-sm text-green-700">
                    Check your email for instructions to reset your password. The link will expire in 1 hour.
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="w-full py-4 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-2xl font-semibold hover:shadow-[0_6px_20px_rgba(90,146,90,0.4)] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
              >
                Back to Sign In
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/login')}
              className="inline-flex items-center gap-2 text-sm text-sage-600 hover:text-sage-700 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
