import React, { useState, useEffect } from 'react';
import { Users, MessageCircle, Heart, TrendingUp, Calendar, UserPlus } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useAuthModalStore } from '../store/authModalStore';
import { supabase } from '../lib/supabase';

interface Community {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  category: string;
  image: string;
}

const communities: Community[] = [
  {
    id: '1',
    name: 'Anxiety Support Circle',
    description: 'A safe space to share experiences and coping strategies for anxiety',
    members: 1247,
    posts: 3421,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '2',
    name: 'Mindfulness & Meditation',
    description: 'Daily practices and discussions on mindfulness techniques',
    members: 892,
    posts: 2156,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '3',
    name: 'Depression Warriors',
    description: 'Supporting each other through the journey of managing depression',
    members: 1534,
    posts: 4892,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '4',
    name: 'Self-Care Sunday',
    description: 'Weekly self-care tips, routines, and motivation',
    members: 2103,
    posts: 5234,
    category: 'Lifestyle',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '5',
    name: 'Stress Management Hub',
    description: 'Practical strategies for managing daily stress and pressure',
    members: 967,
    posts: 2789,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
  {
    id: '6',
    name: 'Positive Vibes Only',
    description: 'Spreading positivity and uplifting messages daily',
    members: 3421,
    posts: 8765,
    category: 'Lifestyle',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
  },
];

export const CommunityPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [joinedCommunities, setJoinedCommunities] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useUserStore();
  const { openModal } = useAuthModalStore();

  const categories = ['All', 'Mental Health', 'Wellness', 'Lifestyle'];

  useEffect(() => {
    console.log('👥 CommunityPage mounted, auth state:', { isAuthenticated, userId: user?.id });
    
    if (isAuthenticated && user) {
      loadJoinedCommunities();
    }
  }, [isAuthenticated, user]);

  const loadJoinedCommunities = async () => {
    if (!user) return;

    try {
      console.log('📥 Loading joined communities for user:', user.id);
      const { data, error } = await supabase
        .from('community_members')
        .select('community_id')
        .eq('user_id', user.id);

      if (error) throw error;

      const joined = new Set(data?.map(m => m.community_id) || []);
      setJoinedCommunities(joined);
      console.log('✅ Loaded joined communities:', joined.size, 'communities');
    } catch (error) {
      console.error('❌ Failed to load joined communities:', error);
    }
  };

  const handleJoinCommunity = async (community: Community) => {
    console.log('👥 Join clicked for:', community.name);
    console.log('🔐 Auth state:', { isAuthenticated, user: user?.email });
    
    if (!isAuthenticated || !user) {
      console.log('❌ User not authenticated, opening auth modal');
      openModal(`Login to join ${community.name}`);
      return;
    }

    setIsLoading(community.id);

    try {
      const isJoined = joinedCommunities.has(community.id);

      if (isJoined) {
        // Leave community
        console.log('🚪 Leaving community:', community.name);
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('user_id', user.id)
          .eq('community_id', community.id);

        if (error) throw error;

        const newJoined = new Set(joinedCommunities);
        newJoined.delete(community.id);
        setJoinedCommunities(newJoined);
        console.log('✅ Left community successfully');
      } else {
        // Join community
        console.log('🎉 Joining community:', community.name);
        const { error } = await supabase
          .from('community_members')
          .insert({
            user_id: user.id,
            community_id: community.id,
            community_name: community.name,
          });

        if (error) throw error;

        const newJoined = new Set(joinedCommunities);
        newJoined.add(community.id);
        setJoinedCommunities(newJoined);
        console.log('✅ Joined community successfully');
      }
    } catch (error: any) {
      console.error('❌ Failed to toggle community membership:', error);
      alert('Failed to update community membership. Please try again.');
    } finally {
      setIsLoading(null);
    }
  };

  const filteredCommunities = selectedCategory === 'All'
    ? communities
    : communities.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
          Join Our Community
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with others who understand your journey and share experiences
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Communities Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCommunities.map((community) => {
          const isJoined = joinedCommunities.has(community.id);
          const isProcessing = isLoading === community.id;
          
          return (
            <div
              key={community.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={community.image}
                  alt={community.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                    {community.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
                    {community.name}
                  </h3>
                  <p className="text-gray-600 text-sm line-clamp-2">
                    {community.description}
                  </p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{community.members.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    <span>{community.posts.toLocaleString()}</span>
                  </div>
                </div>

                {/* Join Button */}
                <button
                  onClick={() => handleJoinCommunity(community)}
                  disabled={isProcessing}
                  className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                    isJoined
                      ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : isJoined ? (
                    <>
                      <Heart className="w-5 h-5 fill-current" />
                      Joined!
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-5 h-5" />
                      Join Community
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* No Results */}
      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No communities found in this category.</p>
        </div>
      )}
    </div>
  );
};
