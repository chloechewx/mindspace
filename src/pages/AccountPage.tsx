import React, { useEffect, useState } from 'react';
import { User, Calendar, Users, Heart, Loader, X, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format, parseISO } from 'date-fns';

interface Booking {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

interface EventBooking {
  id: string;
  event_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  location: string;
  organizer: string;
  status: string;
  created_at: string;
}

interface FavoriteClinic {
  id: string;
  clinic_id: string;
  clinic_name: string;
  created_at: string;
}

type TabType = 'appointments' | 'events' | 'favorites';

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated } = useUserStore();
  const { loadFavorites, toggleFavorite } = useFavoritesStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('appointments');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [eventBookings, setEventBookings] = useState<EventBooking[]>([]);
  const [favoritesList, setFavoritesList] = useState<FavoriteClinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [cancellingEventId, setCancellingEventId] = useState<string | null>(null);
  const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
      return;
    }
    
    if (user) {
      loadUserData();
    }
  }, [user, isAuthenticated, navigate]);

  const loadUserData = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Load therapy bookings (including cancelled)
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (bookingsError) {
      } else {
        setBookings(bookingsData || []);
      }

      // Load event bookings (including cancelled)
      const { data: eventBookingsData, error: eventBookingsError } = await supabase
        .from('event_bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('event_date', { ascending: true });

      if (eventBookingsError) {
      } else {
        setEventBookings(eventBookingsData || []);
      }

      // Load favorites
      await loadFavorites(user.id);
      
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) {
      } else {
        setFavoritesList(favoritesData || []);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId: string, therapistName: string, date: string, time: string) => {
    const confirmMessage = `Are you sure you want to cancel your appointment with ${therapistName} on ${format(new Date(date), 'MMMM d, yyyy')} at ${time}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setCancellingBookingId(bookingId);

    try {
      const { error: cancelError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (cancelError) {
        throw cancelError;
      }

      setBookings(bookings.map(booking =>
        booking.id === bookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      alert('Appointment cancelled successfully');
    } catch (error: any) {
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleCancelEventBooking = async (eventBookingId: string, eventName: string, eventDate: string, eventTime: string) => {
    const confirmMessage = `Are you sure you want to cancel your booking for ${eventName} on ${format(parseISO(eventDate), 'MMMM d, yyyy')} at ${eventTime}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setCancellingEventId(eventBookingId);

    try {
      const { error: cancelError } = await supabase
        .from('event_bookings')
        .update({ status: 'cancelled' })
        .eq('id', eventBookingId);

      if (cancelError) {
        throw cancelError;
      }

      setEventBookings(eventBookings.map(booking =>
        booking.id === eventBookingId
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
      alert('Event booking cancelled successfully');
    } catch (error: any) {
      alert('Failed to cancel event booking. Please try again.');
    } finally {
      setCancellingEventId(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to permanently delete this cancelled appointment?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        throw deleteError;
      }

      setBookings(bookings.filter(booking => booking.id !== bookingId));
    } catch (error: any) {
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const handleDeleteEventBooking = async (eventBookingId: string) => {
    if (!confirm('Are you sure you want to permanently delete this cancelled event booking?')) {
      return;
    }

    try {
      const { error: deleteError } = await supabase
        .from('event_bookings')
        .delete()
        .eq('id', eventBookingId);

      if (deleteError) {
        throw deleteError;
      }

      setEventBookings(eventBookings.filter(booking => booking.id !== eventBookingId));
    } catch (error: any) {
      alert('Failed to delete event booking. Please try again.');
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, clinicId: string, clinicName: string) => {
    if (!confirm(`Remove ${clinicName} from your favorites?`)) {
      return;
    }

    if (!user) return;

    setRemovingFavoriteId(favoriteId);

    try {
      await toggleFavorite(clinicId, user.id, clinicName);
      
      setFavoritesList(favoritesList.filter(f => f.id !== favoriteId));
    } catch (error: any) {
      alert('Failed to remove favorite. Please try again.');
    } finally {
      setRemovingFavoriteId(null);
    }
  };

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');
  const activeEventBookings = eventBookings.filter(b => b.status !== 'cancelled');
  const cancelledEventBookings = eventBookings.filter(b => b.status === 'cancelled');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <Loader className="w-12 h-12 text-sage-600 animate-spin mx-auto" />
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Error: {error}</p>
        <button
          onClick={() => loadUserData()}
          className="px-6 py-3 bg-sage-500 text-white rounded-2xl font-semibold hover:bg-sage-600 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Please log in to view your account.</p>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-sage-500 text-white rounded-2xl font-semibold hover:bg-sage-600 transition-colors"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Profile Header */}
      <section className="soft-card p-8">
        <div className="flex items-center gap-6">
          <div className="w-24 h-24 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-full flex items-center justify-center shadow-lg">
            <User className="w-12 h-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
              {user.name || user.email}
            </h1>
            <p className="text-gray-600">{user.email}</p>
            {user.createdAt && (
              <p className="text-sm text-gray-500 mt-1">
                Member since {format(new Date(user.createdAt), 'MMMM d, yyyy')}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="soft-card p-2">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('appointments')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
              activeTab === 'appointments'
                ? 'bg-gradient-to-r from-sage-500 to-lavender-500 text-white shadow-lg'
                : 'bg-transparent text-gray-600 hover:bg-sage-50'
            }`}
          >
            <Calendar className="w-5 h-5" />
            <span>Scheduled Appointments</span>
            {bookings.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'appointments'
                  ? 'bg-white/20 text-white'
                  : 'bg-sage-100 text-sage-700'
              }`}>
                {bookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('events')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
              activeTab === 'events'
                ? 'bg-gradient-to-r from-blush-500 to-lavender-500 text-white shadow-lg'
                : 'bg-transparent text-gray-600 hover:bg-blush-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Scheduled Events</span>
            {eventBookings.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'events'
                  ? 'bg-white/20 text-white'
                  : 'bg-blush-100 text-blush-700'
              }`}>
                {eventBookings.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${
              activeTab === 'favorites'
                ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                : 'bg-transparent text-gray-600 hover:bg-red-50'
            }`}
          >
            <Heart className="w-5 h-5" />
            <span>Favorite Therapists</span>
            {favoritesList.length > 0 && (
              <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                activeTab === 'favorites'
                  ? 'bg-white/20 text-white'
                  : 'bg-red-100 text-red-700'
              }`}>
                {favoritesList.length}
              </span>
            )}
          </button>
        </div>
      </section>

      {/* Tab Content */}
      <section className="soft-card p-8">
        {/* Scheduled Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-2xl">
                <Calendar className="w-6 h-6 text-sage-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-gray-800">
                Therapy Appointments
              </h2>
            </div>

            {bookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-sage-200 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No appointments scheduled.</p>
                <button
                  onClick={() => navigate('/therapy')}
                  className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  Book an Appointment
                </button>
              </div>
            ) : (
              <>
                {/* Active Appointments */}
                {activeBookings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Active Appointments ({activeBookings.length})
                    </h3>
                    {activeBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-sage-50 rounded-2xl gap-4 group hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-800">{booking.therapist_name}</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                              Confirmed
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{booking.type}</p>
                          {booking.notes && (
                            <p className="text-xs text-gray-600 mt-2 italic">Note: {booking.notes}</p>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCancelBooking(booking.id, booking.therapist_name, booking.date, booking.time)}
                            disabled={cancellingBookingId === booking.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingBookingId === booking.id ? (
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

                {/* Cancelled Appointments */}
                {cancelledBookings.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Cancelled Appointments ({cancelledBookings.length})
                    </h3>
                    {cancelledBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-red-50 rounded-2xl gap-4 opacity-75"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{booking.therapist_name}</h4>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{booking.type}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                            Cancelled
                          </span>
                          
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Scheduled Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-blush-100 to-lavender-100 rounded-2xl">
                <Users className="w-6 h-6 text-blush-600" />
              </div>
              <h2 className="text-2xl font-serif font-semibold text-gray-800">
                Event Bookings
              </h2>
            </div>

            {eventBookings.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-blush-200 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No event bookings yet.</p>
                <button
                  onClick={() => navigate('/community')}
                  className="px-6 py-3 bg-gradient-to-r from-blush-500 to-lavender-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <>
                {/* Active Event Bookings */}
                {activeEventBookings.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Active Bookings ({activeEventBookings.length})
                    </h3>
                    {activeEventBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-lavender-50 rounded-2xl gap-4 group hover:shadow-md transition-all"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-gray-800">{booking.event_name}</h4>
                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500 text-white shadow-sm">
                              Confirmed
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {format(parseISO(booking.event_date), 'EEEE, MMMM d, yyyy')} at {booking.event_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{booking.location}</p>
                          <p className="text-xs text-gray-500">Organized by {booking.organizer}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleCancelEventBooking(booking.id, booking.event_name, booking.event_date, booking.event_time)}
                            disabled={cancellingEventId === booking.id}
                            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingEventId === booking.id ? (
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

                {/* Cancelled Event Bookings */}
                {cancelledEventBookings.length > 0 && (
                  <div className="space-y-4 mt-8">
                    <h3 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Cancelled Bookings ({cancelledEventBookings.length})
                    </h3>
                    {cancelledEventBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-red-50 rounded-2xl gap-4 opacity-75"
                      >
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{booking.event_name}</h4>
                          <p className="text-sm text-gray-600">
                            {format(parseISO(booking.event_date), 'EEEE, MMMM d, yyyy')} at {booking.event_time}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{booking.location}</p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <span className="px-4 py-2 rounded-full text-sm font-semibold bg-red-100 text-red-700">
                            Cancelled
                          </span>
                          
                          <button
                            onClick={() => handleDeleteEventBooking(booking.id)}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow-md hover:shadow-lg transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Favorite Therapists Tab */}
        {activeTab === 'favorites' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-2xl font-serif font-semibold text-gray-800">
                  Saved Therapies
                </h2>
              </div>
              {favoritesList.length > 0 && (
                <span className="text-sm text-gray-500">
                  {favoritesList.length} {favoritesList.length === 1 ? 'therapy' : 'therapies'}
                </span>
              )}
            </div>

            {favoritesList.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-red-200 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No saved therapies yet.</p>
                <button
                  onClick={() => navigate('/therapy')}
                  className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
                >
                  Browse Therapies
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {favoritesList.map((favorite) => (
                  <div
                    key={favorite.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-2xl group hover:shadow-md transition-all"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="p-2 bg-gradient-to-br from-red-400 to-pink-400 rounded-xl">
                        <Heart className="w-5 h-5 text-white fill-current" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{favorite.clinic_name}</h4>
                        <p className="text-xs text-gray-500">
                          Saved {format(new Date(favorite.created_at), 'MMM d, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate('/therapy')}
                        className="px-3 py-1.5 bg-white text-sage-600 rounded-lg text-sm font-semibold hover:bg-sage-50 transition-colors"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleRemoveFavorite(favorite.id, favorite.clinic_id, favorite.clinic_name)}
                        disabled={removingFavoriteId === favorite.id}
                        className="px-3 py-1.5 bg-red-100 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {removingFavoriteId === favorite.id ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          'Remove'
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};
