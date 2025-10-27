import React from 'react';
import { BookOpen, Brain, TrendingUp, Calendar, Building2, Heart, Sparkles, Users, ArrowRight, Shield, Clock, Smile } from 'lucide-react';
import { SectionDivider } from './SectionDivider';

interface LandingPageProps {
  onNavigate: (tab: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    {
      icon: BookOpen,
      title: 'Personal Diary',
      description: 'Express yourself freely in a safe, private space. Track your thoughts, feelings, and daily experiences.',
      color: 'from-sage-400 to-sage-600',
      action: () => onNavigate('diary'),
    },
    {
      icon: Brain,
      title: 'AI-Powered Insights',
      description: 'Receive personalized reflections and patterns from your journal entries to deepen self-awareness.',
      color: 'from-lavender-400 to-lavender-600',
      action: () => onNavigate('diary'),
    },
    {
      icon: Building2,
      title: 'Find Professional Support',
      description: 'Connect with licensed therapists and clinics tailored to your specific needs and preferences.',
      color: 'from-blush-400 to-blush-600',
      action: () => onNavigate('therapy'),
    },
    {
      icon: TrendingUp,
      title: 'Track Your Growth',
      description: 'Visualize your emotional wellness journey with meaningful analytics and progress indicators.',
      color: 'from-sage-400 to-lavender-500',
      action: () => onNavigate('diary'),
    },
  ];

  const benefits = [
    {
      icon: Shield,
      title: 'Private & Secure',
      description: 'Your data stays on your device. No cloud storage, complete privacy.',
    },
    {
      icon: Clock,
      title: 'Always Available',
      description: 'Access your wellness tools anytime, anywhere, at your own pace.',
    },
    {
      icon: Smile,
      title: 'Judgment-Free Space',
      description: 'Express yourself authentically without fear of judgment or criticism.',
    },
    {
      icon: Heart,
      title: 'Holistic Approach',
      description: 'Combine self-reflection, professional support, and community connection.',
    },
  ];

  return (
    <div className="space-y-20 animate-fade-in">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-sage-100 to-lavender-100 rounded-full mb-6">
          <Sparkles className="w-5 h-5 text-sage-700" />
          <span className="text-sage-800 font-semibold">Your Journey to Emotional Wellness Starts Here</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-serif font-semibold text-gray-800 leading-tight">
          Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-sage-600 to-lavender-600">MindSpace</span>
        </h1>

        <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-3xl mx-auto">
          A gentle companion for emotional wellness, mindful reflection, and personal growth. 
          Combine the power of journaling, AI insights, and professional therapy support—all in one place.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-6">
          <button
            onClick={() => onNavigate('diary')}
            className="btn-warm flex items-center gap-2 text-lg px-8 py-4"
          >
            <BookOpen className="w-6 h-6" />
            <span>Start Journaling</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => onNavigate('therapy')}
            className="btn-soft flex items-center gap-2 text-lg px-8 py-4"
          >
            <Building2 className="w-6 h-6" />
            <span>Find a Therapist</span>
          </button>
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Core Features */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800 mb-4">
            Everything You Need for Wellness
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            MindSpace brings together powerful tools to support your mental health journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="soft-card p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 cursor-pointer group animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={feature.action}
              >
                <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-3xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed mb-4">
                  {feature.description}
                </p>
                <div className="flex items-center gap-2 text-sage-700 font-semibold group-hover:gap-3 transition-all">
                  <span>Explore</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <SectionDivider variant="curve" />

      {/* How It Works */}
      <section className="soft-card p-12 bg-gradient-to-br from-lavender-50 via-sage-50 to-blush-50">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800 mb-4">
            Your Wellness Journey
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Simple steps to start your path toward emotional well-being
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-sage-400 to-sage-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl font-serif font-bold text-white">1</span>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800">Reflect Daily</h3>
            <p className="text-gray-700 leading-relaxed">
              Write in your private diary, track your mood, and express your thoughts freely
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl font-serif font-bold text-white">2</span>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800">Gain Insights</h3>
            <p className="text-gray-700 leading-relaxed">
              Receive AI-powered reflections and track patterns in your emotional wellness
            </p>
          </div>

          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blush-400 to-blush-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <span className="text-3xl font-serif font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800">Get Support</h3>
            <p className="text-gray-700 leading-relaxed">
              Connect with professional therapists when you're ready for additional guidance
            </p>
          </div>
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Benefits */}
      <section className="space-y-12">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800 mb-4">
            Why Choose MindSpace?
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Built with your privacy, comfort, and growth in mind
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <div
                key={benefit.title}
                className="soft-card p-6 text-center hover:shadow-[0_8px_30px_rgba(0,0,0,0.1)] transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-14 h-14 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-sage-700" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-700 leading-relaxed text-sm">
                  {benefit.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="soft-card p-12 md:p-16 text-center bg-gradient-to-br from-sage-50 via-lavender-50 to-blush-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            Take the first step toward emotional wellness today. Your thoughts, your space, your growth.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('diary')}
              className="btn-warm flex items-center gap-2 text-lg px-8 py-4"
            >
              <Heart className="w-6 h-6" />
              <span>Start Your Diary</span>
            </button>
            <button
              onClick={() => onNavigate('therapy')}
              className="btn-soft flex items-center gap-2 text-lg px-8 py-4"
            >
              <Users className="w-6 h-6" />
              <span>Explore Therapy Options</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
