import React, { useState } from 'react';
import { Users, Lock, Globe, MessageSquare, TrendingUp, Search } from 'lucide-react';
import { useCommunityStore } from '../../store/communityStore';

export const CommunityGroups: React.FC = () => {
  const { groups, joinedGroups, joinGroup, leaveGroup } = useCommunityStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Sample community groups data
  const communityGroups = [
    {
      id: '1',
      name: 'Mindful Journaling Circle',
      description: 'A supportive space for daily journaling practice, sharing insights, and building consistency in self-reflection.',
      category: 'Journaling',
      memberCount: 1247,
      isPrivate: false,
      imageUrl: 'https://images.pexels.com/photos/6373305/pexels-photo-6373305.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Sarah M.', 'James K.'],
      tags: ['journaling', 'mindfulness', 'self-reflection'],
      activityLevel: 'high',
    },
    {
      id: '2',
      name: 'Self-Love & Compassion',
      description: 'Learn and practice self-compassion techniques, share your journey, and support others in building self-love.',
      category: 'Personal Growth',
      memberCount: 892,
      isPrivate: false,
      imageUrl: 'https://images.pexels.com/photos/3760607/pexels-photo-3760607.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Emma L.'],
      tags: ['self-love', 'compassion', 'healing'],
      activityLevel: 'high',
    },
    {
      id: '3',
      name: 'Anxiety Support Network',
      description: 'A safe, moderated community for sharing experiences, coping strategies, and mutual support for anxiety management.',
      category: 'Mental Health',
      memberCount: 2156,
      isPrivate: true,
      imageUrl: 'https://images.pexels.com/photos/4101143/pexels-photo-4101143.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Dr. Lisa R.', 'Michael T.'],
      tags: ['anxiety', 'support', 'coping-strategies'],
      activityLevel: 'very-high',
    },
    {
      id: '4',
      name: 'Cozy Creatives',
      description: 'Express yourself through art, writing, music, and creative projects. Share your work and find inspiration.',
      category: 'Creativity',
      memberCount: 634,
      isPrivate: false,
      imageUrl: 'https://images.pexels.com/photos/1109541/pexels-photo-1109541.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Alex P.'],
      tags: ['art', 'creativity', 'expression'],
      activityLevel: 'medium',
    },
    {
      id: '5',
      name: 'Morning Meditation Crew',
      description: 'Start your day with guided meditations, breathing exercises, and mindful morning routines.',
      category: 'Mindfulness',
      memberCount: 1523,
      isPrivate: false,
      imageUrl: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Zen Master Kim'],
      tags: ['meditation', 'morning-routine', 'mindfulness'],
      activityLevel: 'high',
    },
    {
      id: '6',
      name: 'Therapy Journey Buddies',
      description: 'Connect with others in therapy, share experiences, celebrate progress, and support each other\'s healing journey.',
      category: 'Therapy',
      memberCount: 1089,
      isPrivate: true,
      imageUrl: 'https://images.pexels.com/photos/7176026/pexels-photo-7176026.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Rachel S.', 'Tom W.'],
      tags: ['therapy', 'healing', 'support'],
      activityLevel: 'high',
    },
    {
      id: '7',
      name: 'Gratitude Practice',
      description: 'Daily gratitude sharing, appreciation exercises, and cultivating a positive mindset together.',
      category: 'Positivity',
      memberCount: 756,
      isPrivate: false,
      imageUrl: 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['Grace H.'],
      tags: ['gratitude', 'positivity', 'mindfulness'],
      activityLevel: 'medium',
    },
    {
      id: '8',
      name: 'Work-Life Balance Warriors',
      description: 'Strategies for managing stress, setting boundaries, and finding harmony between work and personal life.',
      category: 'Lifestyle',
      memberCount: 1342,
      isPrivate: false,
      imageUrl: 'https://images.pexels.com/photos/4050315/pexels-photo-4050315.jpeg?auto=compress&cs=tinysrgb&w=800',
      moderators: ['David M.'],
      tags: ['work-life-balance', 'stress-management', 'boundaries'],
      activityLevel: 'high',
    },
  ];

  const categories = ['all', ...Array.from(new Set(communityGroups.map(g => g.category)))];

  const filteredGroups = communityGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         group.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getActivityColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'text-green-600';
      case 'high': return 'text-sage-600';
      case 'medium': return 'text-amber-600';
      default: return 'text-gray-600';
    }
  };

  const getActivityLabel = (level: string) => {
    switch (level) {
      case 'very-high': return 'Very Active';
      case 'high': return 'Active';
      case 'medium': return 'Moderate';
      default: return 'Quiet';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Community Groups
        </h2>
        <p className="text-gray-600">
          Join supportive communities and connect with others on similar wellness journeys
        </p>
      </div>

      {/* Search and Filters */}
      <div className="soft-card p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search groups by name, description, or tags..."
              className="w-full pl-12 pr-4 py-3 rounded-full border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all"
              aria-label="Search community groups"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-6 py-3 rounded-full border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all font-semibold"
            aria-label="Filter by category"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Groups Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredGroups.map((group) => {
          const isJoined = joinedGroups.includes(group.id);
          
          return (
            <div
              key={group.id}
              className="soft-card overflow-hidden hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
            >
              {/* Group Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={group.imageUrl}
                  alt={group.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                
                {/* Privacy Badge */}
                <div className="absolute top-4 right-4">
                  {group.isPrivate ? (
                    <div className="flex items-center gap-2 bg-lavender-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                      <Lock className="w-4 h-4" />
                      Private
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 bg-sage-600 text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                      <Globe className="w-4 h-4" />
                      Public
                    </div>
                  )}
                </div>

                {/* Activity Level */}
                <div className="absolute top-4 left-4">
                  <div className={`flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm font-semibold ${getActivityColor(group.activityLevel)}`}>
                    <TrendingUp className="w-4 h-4" />
                    {getActivityLabel(group.activityLevel)}
                  </div>
                </div>

                {/* Group Name Overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-serif font-semibold text-white mb-1">
                    {group.name}
                  </h3>
                  <div className="flex items-center gap-2 text-white/90 text-sm">
                    <Users className="w-4 h-4" />
                    <span>{group.memberCount.toLocaleString()} members</span>
                  </div>
                </div>
              </div>

              {/* Group Content */}
              <div className="p-6 space-y-4">
                <div>
                  <div className="inline-block px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-semibold mb-3">
                    {group.category}
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {group.description}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {group.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-lavender-50 text-lavender-700 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Moderators */}
                <div className="text-sm text-gray-600">
                  <span className="font-semibold">Moderated by:</span> {group.moderators.join(', ')}
                </div>

                {/* Action Button */}
                <div className="pt-2">
                  {isJoined ? (
                    <div className="space-y-3">
                      <button className="btn-warm w-full flex items-center justify-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        View Discussions
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Leave ${group.name}?`)) {
                            leaveGroup(group.id);
                          }
                        }}
                        className="w-full px-6 py-3 rounded-full border-2 border-blush-300 text-blush-700 hover:bg-blush-50 transition-colors font-semibold"
                      >
                        Leave Group
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => joinGroup(group.id)}
                      className="btn-warm w-full flex items-center justify-center gap-2"
                    >
                      <Users className="w-5 h-5" />
                      {group.isPrivate ? 'Request to Join' : 'Join Group'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredGroups.length === 0 && (
        <div className="soft-card p-12 text-center">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
            No Groups Found
          </h3>
          <p className="text-gray-600 mb-6">
            Try adjusting your search or filters
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="btn-soft"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Community Guidelines */}
      <div className="soft-card p-6 bg-gradient-to-br from-sage-50 to-cream-50">
        <h3 className="text-xl font-serif font-semibold text-gray-800 mb-3">
          Community Guidelines
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-1">•</span>
            <span>Be respectful, kind, and supportive to all members</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-1">•</span>
            <span>Maintain confidentiality and respect privacy</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-1">•</span>
            <span>No medical advice - share experiences, not diagnoses</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-1">•</span>
            <span>Report concerning content to moderators</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sage-600 mt-1">•</span>
            <span>If you're in crisis, contact emergency services immediately</span>
          </li>
        </ul>
      </div>
    </div>
  );
};
