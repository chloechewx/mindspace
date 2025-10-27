import React, { useEffect, useState } from 'react';
import { User, Calendar, Users, LogOut, Loader, Heart, RefreshCw, X, AlertCircle } from 'lucide-react';
import { useUserStore } from '../store/userStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { format } from 'date-fns';

interface Booking {
  id: string;
  therapist_name: string;
  date: string;
  time: string;
  type: string;
  status: string;
  notes?: string;
}

interface CommunityMembership {
  id: string;
  community_id: string;
  community_name: string;
  joined_at: string;
}

interface FavoriteClinic {
  id: string;
  clinic_id: string;
  clinic_name: string;
  created_at: string;
}

export const AccountPage: React.FC = () => {
  const { user, isAuthenticated, signOut } = useUserStore();
  const { loadFavorites, favorites, toggleFavorite } = useFavoritesStore();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [memberships, setMemberships] = useState<CommunityMembership[]>([]);
  const [favoritesList, setFavoritesList] = useState<FavoriteClinic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(null);
  const [removingFavoriteId, setRemovingFavoriteId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 AccountPage - Auth state:', { isAuthenticated, user: user?.email });
    
    if (!isAuthenticated) {
      console.log('❌ Not authenticated, redirecting to home');
      navigate('/');
      return;
    }
    
    if (user) {
      loadUserData();
    }
  }, [user, isAuthenticated, navigate]);

  const loadUserData = async (showRefresh = false) => {
    if (!user) {
      console.log('❌ No user found');
      return;
    }

    console.log('📥 Loading user data for:', user.id);
    if (showRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);

    try {
      // Load bookings
      console.log('📅 Fetching bookings...');
      const { data: bookingsData, error: bookingsError } = await supabase
        .from('bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true });

      if (bookingsError) {
        console.error('❌ Bookings error:', bookingsError);
      } else {
        console.log('✅ Bookings loaded:', bookingsData?.length || 0);
        setBookings(bookingsData || []);
      }

      // Load community memberships
      console.log('👥 Fetching community memberships...');
      const { data: membershipsData, error: membershipsError } = await supabase
        .from('community_members')
        .select('id, community_id, community_name, joined_at')
        .eq('user_id', user.id)
        .order('joined_at', { ascending: false });

      if (membershipsError) {
        console.error('❌ Memberships error:', membershipsError);
      } else {
        console.log('✅ Memberships loaded:', membershipsData?.length || 0);
        setMemberships(membershipsData || []);
      }

      // Load favorites
      console.log('💖 Fetching favorites...');
      await loadFavorites(user.id);
      
      const { data: favoritesData, error: favoritesError } = await supabase
        .from('favorites')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (favoritesError) {
        console.error('❌ Favorites error:', favoritesError);
      } else {
        console.log('✅ Favorites loaded:', favoritesData?.length || 0);
        setFavoritesList(favoritesData || []);
      }
    } catch (error: any) {
      console.error('💥 Failed to load user data:', error);
      setError(error.message || 'Failed to load data');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      console.log('✅ Data loading complete');
    }
  };

  const handleCancelBooking = async (bookingId: string, therapistName: string, date: string, time: string) => {
    const confirmMessage = `Are you sure you want to cancel your appointment with ${therapistName} on ${format(new Date(date), 'MMMM d, yyyy')} at ${time}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setCancellingBookingId(bookingId);
    console.log('🚫 Cancelling booking:', bookingId);

    try {
      const { error: cancelError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId);

      if (cancelError) {
        console.error('❌ Cancel booking error:', cancelError);
        throw cancelError;
      }

      setBookings(bookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));

      console.log('✅ Booking cancelled successfully');
      alert('Appointment cancelled successfully');
    } catch (error: any) {
      console.error('💥 Failed to cancel booking:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to permanently delete this cancelled appointment?')) {
      return;
    }

    try {
      console.log('🗑️ Deleting booking:', bookingId);
      
      const { error: deleteError } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);

      if (deleteError) {
        console.error('❌ Delete booking error:', deleteError);
        throw deleteError;
      }

      setBookings(bookings.filter(booking => booking.id !== bookingId));
      console.log('✅ Booking deleted successfully');
    } catch (error: any) {
      console.error('💥 Failed to delete booking:', error);
      alert('Failed to delete appointment. Please try again.');
    }
  };

  const handleRemoveFavorite = async (favoriteId: string, clinicId: string, clinicName: string) => {
    if (!confirm(`Remove ${clinicName} from your favorites?`)) {
      return;
    }

    if (!user) return;

    setRemovingFavoriteId(favoriteId);
    console.log('💔 Removing favorite from dashboard:', { favoriteId, clinicId, clinicName, userId: user.id });

    try {
      // ✅ FIXED: Correct parameter order (clinicId, userId, clinicName)
      console.log('🔄 Calling toggleFavorite with correct order...');
      await toggleFavorite(clinicId, user.id, clinicName);
      
      // Remove from local state
      setFavoritesList(favoritesList.filter(f => f.id !== favoriteId));
      console.log('✅ Favorite removed successfully from dashboard');
    } catch (error: any) {
      console.error('❌ Failed to remove favorite:', error);
      alert('Failed to remove favorite. Please try again.');
    } finally {
      setRemovingFavoriteId(null);
    }
  };

  const handleSignOut = async () => {
    console.log('🚪 Sign out initiated from Account page...');
    
    try {
      await signOut();
      console.log('✅ Sign out successful, redirecting...');
      
      // Force navigation to home
      navigate('/', { replace: true });
      
      // Force page reload to clear all state
      window.location.href = '/';
    } catch (error) {
      console.error('❌ Sign out error:', error);
      alert('Failed to sign out. Please try again.');
    }
  };

  const handleLeaveCommunity = async (membershipId: string, communityName: string) => {
    if (!confirm(`Are you sure you want to leave ${communityName}?`)) {
      return;
    }

    try {
      console.log('🚪 Leaving community:', communityName);
      const { error } = await supabase
        .from('community_members')
        .delete()
        .eq('id', membershipId);

      if (error) throw error;

      setMemberships(memberships.filter(m => m.id !== membershipId));
      console.log('✅ Left community successfully');
    } catch (error: any) {
      console.error('❌ Failed to leave community:', error);
      alert('Failed to leave community. Please try again.');
    }
  };

  const handleRefresh = () => {
    console.log('🔄 Manual refresh triggered');
    loadUserData(true);
  };

  const activeBookings = bookings.filter(b => b.status !== 'cancelled');
  const cancelledBookings = bookings.filter(b => b.status === 'cancelled');

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
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
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
          <div className="flex gap-3">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 bg-sage-50 text-sage-600 rounded-2xl font-semibold hover:bg-sage-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh'}
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-semibold hover:bg-red-100 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="soft-card p-6 text-center">
          <div className="inline-flex p-4 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-2xl mb-4">
            <Calendar className="w-8 h-8 text-sage-600" />
          </div>
          <div className="text-3xl font-serif font-semibold text-gray-800 mb-2">
            {activeBookings.length}
          </div>
          <div className="text-gray-600">Active Appointments</div>
        </div>

        <div className="soft-card p-6 text-center">
          <div className="inline-flex p-4 bg-gradient-to-br from-red-100 to-pink-100 rounded-2xl mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <div className="text-3xl font-serif font-semibold text-gray-800 mb-2">
            {favoritesList.length}
          </div>
          <div className="text-gray-600">Saved Therapies</div>
        </div>

        <div className="soft-card p-6 text-center">
          <div className="inline-flex p-4 bg-gradient-to-br from-blush-100 to-lavender-100 rounded-2xl mb-4">
            <Users className="w-8 h-8 text-blush-600" />
          </div>
          <div className="text-3xl font-serif font-semibold text-gray-800 mb-2">
            {memberships.length}
          </div>
          <div className="text-gray-600">Communities Joined</div>
        </div>
      </section>

      {/* Saved Therapies Section */}
      <section className="soft-card p-8">
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
          <div className="text-center py-8">
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
      </section>

      {/* Active Appointments Section */}
      <section className="soft-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-sage-100 to-lavender-100 rounded-2xl">
            <Calendar className="w-6 h-6 text-sage-600" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-gray-800">
            Active Appointments
          </h2>
        </div>

        {activeBookings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">No active appointments scheduled.</p>
            <button
              onClick={() => navigate('/therapy')}
              className="px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              Book an Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {activeBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-sage-50 rounded-2xl gap-4 group hover:shadow-md transition-all"
              >
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{booking.therapist_name}</h4>
                  <p className="text-sm text-gray-600">
                    {format(new Date(booking.date), 'MMMM d, yyyy')} at {booking.time}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{booking.type}</p>
                  {booking.notes && (
                    <p className="text-xs text-gray-600 mt-2 italic">Note: {booking.notes}</p>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`
                    px-4 py-2 rounded-full text-sm font-semibold
                    ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 
                      booking.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 
                      'bg-yellow-100 text-yellow-700'}
                  `}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                  
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
      </section>

      {/* Cancelled Appointments Section */}
      {cancelledBookings.length > 0 && (
        <section className="soft-card p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-gray-800">
              Cancelled Appointments
            </h2>
          </div>

          <div className="space-y-4">
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
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Communities Section */}
      <section className="soft-card p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-blush-100 to-lavender-100 rounded-2xl">
              <Users className="w-6 h-6 text-blush-600" />
            </div>
            <h2 className="text-2xl font-serif font-semibold text-gray-800">
              My Communities
            </h2>
          </div>
          {memberships.length > 0 && (
            <span className="text-sm text-gray-500">
              {memberships.length} {memberships.length === 1 ? 'community' : 'communities'}
            </span>
          )}
        </div>

        {memberships.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">You haven't joined any communities yet.</p>
            <button
              onClick={() => navigate('/community')}
              className="px-6 py-3 bg-gradient-to-r from-blush-500 to-lavender-500 text-white rounded-2xl font-semibold hover:shadow-lg transition-all"
            >
              Explore Communities
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {memberships.map((membership) => (
              <div
                key={membership.id}
                className="flex items-center justify-between p-4 bg-lavender-50 rounded-2xl group hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-br from-blush-400 to-lavender-400 rounded-xl">
                    <Heart className="w-5 h-5 text-white fill-current" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{membership.community_name}</h4>
                    <p className="text-xs text-gray-500">
                      Joined {format(new Date(membership.joined_at), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleLeaveCommunity(membership.id, membership.community_name)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                >
                  Leave
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
