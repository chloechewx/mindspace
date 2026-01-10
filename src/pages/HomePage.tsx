import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Heart, Users, TrendingUp, Shield, Zap, BookOpen, MessageCircle, Brain, ArrowRight } from 'lucide-react';
import { useAuthModalStore } from '../store/authModalStore';
import { useUserStore } from '../store/userStore';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { openModal } = useAuthModalStore();
  const { isAuthenticated } = useUserStore();

  const features = [
    {
      icon: BookOpen,
      title: 'AI-Powered Journaling',
      description: 'Track your mood, discover patterns, and gain personalized insights from your daily reflections',
      action: () => navigate('/journal'),
      gradient: 'from-rose-400 to-pink-500',
    },
    {
      icon: Sparkles,
      title: 'AI Companion',
      description: 'Chat with your personal wellness companion who reads your journal and provides empathetic support',
      action: () => navigate('/ai-companion'),
      gradient: 'from-lavender-400 to-purple-500',
      badge: 'NEW',
    },
    {
      icon: Heart,
      title: 'Find Your Therapist',
      description: 'Search therapists by specialty, budget, and location with transparent pricing',
      action: () => navigate('/therapy'),
      gradient: 'from-sage-400 to-emerald-500',
    },
    {
      icon: Users,
      title: 'Community Connection',
      description: 'Join wellness activities, groups, and find your support buddy',
      action: () => navigate('/community'),
      gradient: 'from-blush-400 to-rose-500',
    },
  ];

  const benefits = [
    { icon: TrendingUp, text: 'Track your emotional growth over time' },
    { icon: Shield, text: 'Your data is encrypted and private' },
    { icon: Zap, text: 'Access advice and insights instantly' },
  ];

  const handleGetStarted = () => {
    console.log('🚀 Get Started clicked');
    openModal('signup');
  };

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="inline-block">
          <div className="flex items-center gap-3 bg-gradient-to-r from-sage-100 to-lavender-100 px-6 py-3 rounded-full">
            <Sparkles className="w-5 h-5 text-sage-600" />
            <span className="text-sage-700 font-semibold">Your Personal Wellness Companion</span>
          </div>
        </div>

        <h1 className="text-6xl md:text-7xl font-serif font-bold text-gray-800 leading-tight">
          Welcome to
          <span className="block mt-2 bg-gradient-to-r from-sage-600 via-lavender-600 to-blush-600 bg-clip-text text-transparent">
            MindSpace
          </span>
        </h1>

        <p className="text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed">
          A safe, supportive space to journal your thoughts, connect with professional therapists,
          and build meaningful community connections—all designed to support your mental wellness journey.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <button
            onClick={() => navigate('/journal')}
            className="px-8 py-4 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-full font-semibold text-lg shadow-[0_4px_14px_rgba(90,146,90,0.4)] hover:shadow-[0_6px_20px_rgba(90,146,90,0.5)] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
          >
            Start Journaling
          </button>
          <button
            onClick={() => navigate('/therapy')}
            className="px-8 py-4 bg-white text-sage-700 rounded-full font-semibold text-lg shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300 border-2 border-sage-200 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
          >
            Find a Therapist
          </button>
        </div>
      </section>

      {/* AI Companion Spotlight */}
      <section className="soft-card p-12 bg-gradient-to-br from-lavender-50 via-purple-50 to-pink-50 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-lavender-200 to-purple-200 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full blur-3xl opacity-30"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <span className="px-4 py-1 bg-gradient-to-r from-lavender-500 to-purple-500 text-white text-sm font-bold rounded-full">
              NEW FEATURE
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800 text-center mb-4">
            Meet Your AI Companion
          </h2>
          
          <p className="text-xl text-gray-700 text-center mb-8 leading-relaxed">
            A compassionate AI that reads your journal entries and provides personalized support, 
            insights, and guidance tailored to your unique wellness journey.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-lavender-600" />
              </div>
              <h3 className="font-serif font-semibold text-gray-800 mb-2">Reads Your Journal</h3>
              <p className="text-sm text-gray-600">
                Understands your emotional patterns and experiences from your journal entries
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-serif font-semibold text-gray-800 mb-2">Personalized Support</h3>
              <p className="text-sm text-gray-600">
                Provides empathetic responses and actionable suggestions based on your journey
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-sm">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="font-serif font-semibold text-gray-800 mb-2">Tracks Patterns</h3>
              <p className="text-sm text-gray-600">
                Identifies mood trends and helps you understand your emotional growth
              </p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={() => navigate('/ai-companion')}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-lavender-500 to-purple-500 text-white rounded-full font-semibold text-lg shadow-[0_4px_14px_rgba(139,92,246,0.4)] hover:shadow-[0_6px_20px_rgba(139,92,246,0.5)] hover:scale-105 transition-all duration-300"
            >
              <Sparkles className="w-6 h-6" />
              <span>Try AI Companion</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 gap-8">
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <div
              key={index}
              className="soft-card p-8 hover:scale-105 transition-all duration-300 cursor-pointer group relative"
              onClick={feature.action}
            >
              {feature.badge && (
                <span className="absolute top-4 right-4 px-3 py-1 bg-gradient-to-r from-lavender-500 to-purple-500 text-white text-xs font-bold rounded-full">
                  {feature.badge}
                </span>
              )}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {feature.description}
              </p>
            </div>
          );
        })}
      </section>

      {/* Benefits Section */}
      <section className="soft-card p-12 text-center">
        <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-8">
          Why Choose MindSpace?
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div key={index} className="flex flex-col items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage-100 to-lavender-100 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-sage-600" />
                </div>
                <p className="text-gray-700 font-medium">{benefit.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section - Only show for non-authenticated users */}
      {!isAuthenticated && (
        <section className="soft-card p-12 text-center bg-gradient-to-br from-sage-50 to-lavender-50">
          <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-4">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
            Join thousands of people taking control of their mental wellness with MindSpace.
          </p>
          <button
            onClick={handleGetStarted}
            className="px-10 py-5 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-full font-semibold text-lg shadow-[0_4px_14px_rgba(90,146,90,0.4)] hover:shadow-[0_6px_20px_rgba(90,146,90,0.5)] hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sage-500 focus:ring-offset-2"
          >
            Get Started Free
          </button>
        </section>
      )}
    </div>
  );
};
