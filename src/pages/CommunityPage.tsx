import React, { useState, useEffect } from 'react';
import { Eye, Calendar, Clock, ChevronDown, ChevronUp, MapPin, User, X, Loader, DollarSign } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format, addDays } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useUserStore } from '../store/userStore';

interface Community {
  id: string;
  name: string;
  description: string;
  groupSize: number;
  posts: number;
  category: string;
  image: string;
  availableDates?: string[];
  price?: number | 'free' | 'varies';
  priceDisplay?: string;
}

interface UserEventBooking {
  id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer: string;
  status: string;
}

// Helper function to generate sample dates for the next 4 weeks
const generateSampleDates = (daysOfWeek: number[]): string[] => {
  const dates: string[] = [];
  const today = new Date();

  // Generate dates for the next 4 weeks
  for (let week = 0; week < 4; week++) {
    for (const dayOfWeek of daysOfWeek) {
      const date = addDays(today, (week * 7) + (dayOfWeek - today.getDay()));
      if (date >= today) {
        dates.push(format(date, 'yyyy-MM-dd'));
      }
    }
  }

  return dates.sort();
};

const communities: Community[] = [
  {
    id: '1',
    name: 'Mindfulness Meditation at Gardens by the Bay',
    description: 'Join us for a peaceful morning meditation session surrounded by nature at Singapore\'s iconic Gardens by the Bay',
    groupSize: 25,
    posts: 1245,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([0, 6]), // Sun, Sat
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '2',
    name: 'Anxiety Support Circle - Orchard Community Centre',
    description: 'A safe space to share experiences and coping strategies for anxiety with trained facilitators',
    groupSize: 15,
    posts: 892,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([2, 4]), // Tue, Thu
    price: 25,
    priceDisplay: 'S$25',
  },
  {
    id: '3',
    name: 'Art Therapy Workshop - National Gallery Singapore',
    description: 'Express yourself through art in this therapeutic workshop led by certified art therapists',
    groupSize: 20,
    posts: 567,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1269968/pexels-photo-1269968.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([6]), // Sat
    price: 45,
    priceDisplay: 'S$45',
  },
  {
    id: '4',
    name: 'Depression Warriors Support Group - Toa Payoh',
    description: 'Supporting each other through the journey of managing depression in a confidential setting',
    groupSize: 12,
    posts: 1834,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184338/pexels-photo-3184338.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([1, 3]), // Mon, Wed
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '5',
    name: 'Yoga & Mental Wellness - East Coast Park',
    description: 'Combine physical movement with mental wellness practices by the sea',
    groupSize: 30,
    posts: 2156,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([0, 3, 6]), // Sun, Wed, Sat
    price: 'varies',
    priceDisplay: 'Price may vary',
  },
  {
    id: '6',
    name: 'Stress Management Workshop - CBD Wellness Hub',
    description: 'Learn practical strategies for managing workplace stress and achieving work-life balance',
    groupSize: 18,
    posts: 743,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3759657/pexels-photo-3759657.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([2, 5]), // Tue, Fri
    price: 35,
    priceDisplay: 'S$35',
  },
  {
    id: '7',
    name: 'Teen Mental Health Support - Tampines Hub',
    description: 'A supportive space for teenagers to discuss mental health challenges with peers and counselors',
    groupSize: 15,
    posts: 456,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([6]), // Sat
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '8',
    name: 'Mindful Eating Workshop - Chinatown Complex',
    description: 'Explore the connection between food, culture, and mental wellness in Singapore\'s heritage district',
    groupSize: 20,
    posts: 328,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([0]), // Sun
    price: 50,
    priceDisplay: 'S$50',
  },
  {
    id: '9',
    name: 'LGBTQ+ Mental Health Circle - Pink Dot Community',
    description: 'A safe and affirming space for LGBTQ+ individuals to share experiences and support each other',
    groupSize: 12,
    posts: 967,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([4]), // Thu
    price: 'free',
    priceDisplay: 'Free',
  },
  {
    id: '10',
    name: 'Sound Healing Session - Sentosa Wellness Retreat',
    description: 'Experience the therapeutic power of sound bowls and gongs in a tranquil island setting',
    groupSize: 25,
    posts: 1523,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/3771069/pexels-photo-3771069.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([6, 0]), // Sat, Sun
    price: 'varies',
    priceDisplay: 'Price may vary',
  },
  {
    id: '11',
    name: 'Parenting & Mental Health - Bishan Community Club',
    description: 'Support group for parents navigating the challenges of raising children while maintaining mental wellness',
    groupSize: 16,
    posts: 634,
    category: 'Mental Health',
    image: 'https://images.pexels.com/photos/3184287/pexels-photo-3184287.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([3]), // Wed
    price: 20,
    priceDisplay: 'S$20',
  },
  {
    id: '12',
    name: 'Nature Walk & Talk - MacRitchie Reservoir',
    description: 'Combine the healing power of nature with peer support in Singapore\'s lush rainforest',
    groupSize: 20,
    posts: 1089,
    category: 'Wellness',
    image: 'https://images.pexels.com/photos/1051838/pexels-photo-1051838.jpeg?auto=compress&cs=tinysrgb&w=800',
    availableDates: generateSampleDates([0]), // Sun
    price: 'free',
    priceDisplay: 'Free',
  },
];

export const CommunityPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [userEvents, setUserEvents] = useState<UserEventBooking[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [showEvents, setShowEvents] = useState(true);
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);

  const categories = ['All', 'Mental Health', 'Wellness'];

  useEffect(() => {
    const fetchUserEvents = async () => {
      if (!user) {
        setLoadingEvents(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('event_bookings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'confirmed')
          .gte('event_date', new Date().toISOString().split('T')[0])
          .order('event_date', { ascending: true })
          .order('event_time', { ascending: true });

        if (error) throw error;

        setUserEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchUserEvents();
  }, [user]);

  const handleCancelEventBooking = async (eventId: string, eventName: string, eventDate: string, eventTime: string) => {
    const formattedDate = format(new Date(eventDate), 'MMMM d, yyyy');
    const confirmMessage = `Are you sure you want to cancel your booking for "${eventName}" on ${formattedDate} at ${eventTime}?`;

    if (!confirm(confirmMessage)) {
      return;
    }

    setCancellingEventId(eventId);
    console.log('🚫 Cancelling event booking:', eventId);

    try {
      const { error: deleteError } = await supabase
        .from('event_bookings')
        .delete()
        .eq('id', eventId);

      if (deleteError) {
        console.error('❌ Delete event booking error:', deleteError);
        throw deleteError;
      }

      setUserEvents(userEvents.filter(event => event.id !== eventId));

      console.log('✅ Event booking cancelled successfully');
      alert('Event booking cancelled successfully');
    } catch (error: any) {
      console.error('💥 Failed to cancel event booking:', error);
      alert('Failed to cancel event booking. Please try again.');
    } finally {
      setCancellingEventId(null);
    }
  };

  const handleViewEvent = (communityId: string) => {
    navigate(`/community/event/${communityId}`);
  };

  const getNextAvailableDate = (dates?: string[]): string => {
    if (!dates || dates.length === 0) return 'No dates available';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const nextDate = dates
      .map(dateStr => new Date(dateStr))
      .filter(date => date >= today)
      .sort((a, b) => a.getTime() - b.getTime())[0];

    if (!nextDate) return 'No dates available';

    return format(nextDate, 'MMM d, yyyy');
  };

  const formatEventDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatEventTime = (timeStr: string): string => {
    const [time, period] = timeStr.split(' ');
    if (period) {
      return timeStr;
    }

    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const filteredCommunities = selectedCategory === 'All'
    ? communities
    : communities.filter(c => c.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-800">
          Community Events in Singapore
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Connect with others who understand your journey at events across Singapore
        </p>
      </div>

      {/* My Upcoming Events Section */}
      {user && (
        <div className="soft-card p-6 space-y-4">
          <button
            onClick={() => setShowEvents(!showEvents)}
            className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-sage-600" />
              <h2 className="text-2xl font-serif font-semibold text-gray-800">
                My Upcoming Events
              </h2>
              {!loadingEvents && userEvents.length > 0 && (
                <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-semibold">
                  {userEvents.length}
                </span>
              )}
            </div>
            {showEvents ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${showEvents ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
              }`}
          >
            {loadingEvents ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sage-200 border-t-sage-600"></div>
                <p className="text-gray-600 mt-2">Loading your events...</p>
              </div>
            ) : userEvents.length === 0 ? (
              <div className="text-center py-8 bg-sage-50 rounded-2xl border-2 border-sage-100">
                <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">You haven't joined any community events yet</p>
                <p className="text-sm text-gray-500 mb-6">
                  Browse events below and join one to connect with others
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {userEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl p-5 border-2 border-sage-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
                        {event.event_name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border-2 bg-green-100 text-green-800 border-green-200 flex-shrink-0">
                        Confirmed
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-sage-600 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {formatEventDate(event.event_date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {formatEventTime(event.event_time)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <MapPin className="w-4 h-4 text-sage-600 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {event.location}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <User className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          Organized by {event.organizer}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-sage-200 flex gap-2">
                      <button
                        onClick={() => handleViewEvent(event.event_id)}
                        className="flex-1 py-2 rounded-xl font-semibold transition-all duration-300 bg-gradient-to-r from-sage-500 to-lavender-500 text-white hover:shadow-lg hover:scale-105 text-sm"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleCancelEventBooking(event.id, event.event_name, event.event_date, event.event_time)}
                        disabled={cancellingEventId === event.id}
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {cancellingEventId === event.id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span className="hidden sm:inline">Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span className="hidden sm:inline">Cancel</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 justify-center">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${selectedCategory === category
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
        {filteredCommunities.map((community) => (
          <div
            key={community.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
          >
            {/* Image */}
            <div className="relative h-40 overflow-hidden">
              <img
                src={community.image}
                alt={community.name}
                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              />
              <div className="absolute bottom-4 left-4">
                <span className="inline-block px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold text-gray-800">
                  {community.category}
                </span>
              </div>
              {/* Price Badge */}
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-lg ${community.price === 'free'
                    ? 'bg-green-500 text-white'
                    : community.price === 'varies'
                      ? 'bg-amber-500 text-white'
                      : 'bg-blue-500 text-white'
                  }`}>
                  {community.price !== 'free' && community.price !== 'varies' && (
                    <DollarSign className="w-3 h-3" />
                  )}
                  {community.priceDisplay}
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
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar className="w-4 h-4 text-sage-600" />
                  <span className="font-semibold text-gray-700">
                    {getNextAvailableDate(community.availableDates)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <DollarSign className="w-4 h-4 text-lavender-600" />
                  <span className="font-semibold text-gray-700">
                    {community.priceDisplay}
                  </span>
                </div>
              </div>

              {/* View Event Button */}
              <button
                onClick={() => handleViewEvent(community.id)}
                className="w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 bg-gradient-to-r from-sage-500 to-lavender-500 text-white hover:shadow-lg hover:scale-105"
              >
                <Eye className="w-5 h-5" />
                View Event
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* No Results */}
      {filteredCommunities.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No events found in this category.</p>
        </div>
      )}
    </div>
  );
};
