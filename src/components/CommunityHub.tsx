import React from 'react';
import { Users, MessageCircle, Heart, Sparkles, Lock, Shield } from 'lucide-react';
import { SectionDivider } from './SectionDivider';

export const CommunityHub: React.FC = () => {
  return (
    <div className="space-y-12 animate-fade-in">
      {/* Coming Soon Header */}
      <section className="soft-card p-12 text-center bg-gradient-to-br from-lavender-50 via-blush-50 to-sage-50">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-lavender-100 to-blush-100 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-lavender-700" />
            <span className="text-lavender-800 font-semibold">Coming Soon</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-serif font-semibold text-gray-800 leading-tight">
            MindSpace Community
          </h1>
          
          <p className="text-xl text-gray-700 leading-relaxed">
            A safe, supportive space to connect with others on similar wellness journeys. 
            Share experiences, find encouragement, and grow together.
          </p>
        </div>
      </section>

      <SectionDivider variant="wave" />

      {/* Planned Features */}
      <section className="space-y-8">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-4">
            What's Coming
          </h2>
          <p className="text-xl text-gray-700 leading-relaxed">
            We're building features designed to foster genuine connection and mutual support
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="soft-card p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-lavender-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
              Support Groups
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Join moderated groups focused on specific topics like anxiety, grief, or life transitions. 
              Connect with others who understand your journey.
            </p>
          </div>

          <div className="soft-card p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-blush-400 to-blush-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
              Peer Support
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Share your experiences and receive encouragement from others. 
              Offer support and learn from diverse perspectives in a judgment-free environment.
            </p>
          </div>

          <div className="soft-card p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-sage-600 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
              Wellness Challenges
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Participate in community challenges focused on gratitude, mindfulness, self-care, and personal growth. 
              Celebrate progress together.
            </p>
          </div>

          <div className="soft-card p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-sage-500 rounded-3xl flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-3">
              Resource Library
            </h3>
            <p className="text-gray-700 leading-relaxed">
              Access community-curated resources, coping strategies, and wellness tips. 
              Learn from shared experiences and expert contributions.
            </p>
          </div>
        </div>
      </section>

      <SectionDivider variant="curve" />

      {/* Safety & Privacy */}
      <section className="soft-card p-12 bg-gradient-to-br from-sage-50 to-lavender-50">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center">
            <h2 className="text-4xl font-serif font-semibold text-gray-800 mb-4">
              Your Safety is Our Priority
            </h2>
            <p className="text-xl text-gray-700 leading-relaxed">
              We're designing community features with robust safety and privacy protections
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex gap-4 p-6 bg-white/80 rounded-2xl">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center">
                  <Shield className="w-6 h-6 text-sage-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                  Moderated Spaces
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  All community spaces will be actively moderated by trained professionals to ensure respectful, supportive interactions.
                </p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white/80 rounded-2xl">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-lavender-100 rounded-xl flex items-center justify-center">
                  <Lock className="w-6 h-6 text-lavender-700" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                  Privacy Controls
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Choose your level of anonymity, control what you share, and manage your visibility within the community.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notification Signup */}
      <section className="soft-card p-12 text-center bg-gradient-to-br from-blush-50 to-lavender-50">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-3xl font-serif font-semibold text-gray-800">
            Be the First to Know
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We're working hard to bring you these community features. 
            Want to be notified when they launch?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-full border-2 border-sage-200 focus:border-lavender-400 focus:ring-4 focus:ring-lavender-100 transition-all duration-300 bg-white shadow-sm text-gray-800"
            />
            <button className="btn-warm whitespace-nowrap">
              Notify Me
            </button>
          </div>
          <p className="text-sm text-gray-600">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </section>
    </div>
  );
};
