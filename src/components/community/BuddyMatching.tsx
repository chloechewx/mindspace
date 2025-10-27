import React from 'react';
import { Users, Heart, MessageSquare, UserPlus } from 'lucide-react';

export const BuddyMatching: React.FC = () => {
  const potentialBuddies = [
    {
      id: '1',
      name: 'Sarah M.',
      sharedInterests: ['Journaling', 'Meditation', 'Yoga'],
      matchScore: 92,
      bio: 'Looking for a wellness buddy to share daily check-ins and support each other\'s growth journey.',
    },
    {
      id: '2',
      name: 'Alex K.',
      sharedInterests: ['Art Therapy', 'Mindfulness', 'Nature Walks'],
      matchScore: 87,
      bio: 'Creative soul seeking accountability partner for morning meditation and creative expression.',
    },
    {
      id: '3',
      name: 'Jordan L.',
      sharedInterests: ['Anxiety Support', 'Self-Care', 'Reading'],
      matchScore: 85,
      bio: 'On a healing journey and would love to connect with someone who understands the ups and downs.',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Find Your Wellness Buddy
        </h2>
        <p className="text-gray-600">
          Connect with someone who shares your wellness goals and interests
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {potentialBuddies.map((buddy) => (
          <div
            key={buddy.id}
            className="soft-card p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-sage-600">{buddy.matchScore}%</div>
                <div className="text-xs text-gray-600">Match</div>
              </div>
            </div>

            <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
              {buddy.name}
            </h3>

            <p className="text-gray-700 text-sm mb-4 leading-relaxed">
              {buddy.bio}
            </p>

            <div className="mb-4">
              <div className="text-sm font-semibold text-gray-700 mb-2">Shared Interests:</div>
              <div className="flex flex-wrap gap-2">
                {buddy.sharedInterests.map((interest) => (
                  <span
                    key={interest}
                    className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-semibold"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button className="btn-warm flex-1 flex items-center justify-center gap-2">
                <UserPlus className="w-4 h-4" />
                Connect
              </button>
              <button className="btn-soft flex items-center justify-center px-4">
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="soft-card p-6 bg-gradient-to-br from-lavender-50 to-cream-50">
        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-3">
          How Buddy Matching Works
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <Heart className="w-5 h-5 text-lavender-600 flex-shrink-0 mt-0.5" />
            <span>We match you based on shared interests, goals, and wellness journeys</span>
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-5 h-5 text-lavender-600 flex-shrink-0 mt-0.5" />
            <span>Your profile remains anonymous until you choose to connect</span>
          </li>
          <li className="flex items-start gap-2">
            <Heart className="w-5 h-5 text-lavender-600 flex-shrink-0 mt-0.5" />
            <span>Support each other through daily check-ins and encouragement</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
