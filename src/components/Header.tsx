import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Heart, BookOpen, Users, Phone, User, LogOut, Sparkles } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAuthModalStore } from '../store/authModalStore';

export const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, signOut } = useUserStore();
  const { openModal } = useAuthModalStore();

  const navItems = [
    { path: '/journal', label: 'Journal', icon: BookOpen },
    { path: '/ai-companion', label: 'AI Companion', icon: Sparkles },
    { path: '/therapy', label: 'Therapy', icon: Heart },
    { path: '/community', label: 'Community', icon: Users },
    { path: '/resources', label: 'Resources', icon: Phone },
  ];

  const handleSignOut = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    console.log('🔘 Sign out button clicked');
    
    // Close mobile menu immediately
    setIsMenuOpen(false);
    
    try {
      console.log('🔓 Calling signOut...');
      await signOut();
      
      console.log('✅ Sign out successful, redirecting...');
      
      // Navigate to home page
      navigate('/', { replace: true });
      
      // Force reload to clear any cached state
      setTimeout(() => {
        window.location.href = '/';
      }, 100);
      
    } catch (error) {
      console.error('❌ Sign out error in Header:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleSignInClick = () => {
    console.log('🔘 Sign in button clicked');
    openModal('login');
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-serif font-bold bg-gradient-to-r from-sage-600 to-lavender-600 bg-clip-text text-transparent">
              MindSpace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-sage-600 hover:bg-sage-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/account"
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-sage-600 font-semibold transition-colors"
                >
                  <User className="w-5 h-5" />
                  {user?.name}
                </Link>
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-red-600 font-semibold transition-colors"
                  type="button"
                >
                  <LogOut className="w-5 h-5" />
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignInClick}
                className="px-6 py-2 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-lg font-semibold hover:shadow-lg transition-all"
                type="button"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-sage-600 transition-colors"
            aria-label="Toggle menu"
            type="button"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-gray-200 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white'
                      : 'text-gray-600 hover:bg-sage-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-gray-200 space-y-2">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-sage-50 rounded-lg font-semibold"
                  >
                    <User className="w-5 h-5" />
                    {user?.name}
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                    type="button"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </>
              ) : (
                <button
                  onClick={handleSignInClick}
                  className="w-full px-4 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-lg font-semibold"
                  type="button"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
