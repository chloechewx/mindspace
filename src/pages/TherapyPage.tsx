import React, { useEffect, useState } from 'react';
import { ClinicCard } from '../components/therapy/ClinicCard';
import { TherapyFilters } from '../components/therapy/TherapyFilters';
import { useTherapyStore } from '../store/therapyStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useUserStore } from '../store/userStore';
import { supabase } from '../lib/supabase';
import { Calendar, Clock, Video, Phone, User as UserIcon, ChevronDown, ChevronUp, X, Loader } from 'lucide-react';
import { format } from 'date-fns';

interface UserAppointment {
  id: string;
  therapist_id: string;
  therapist_name: string;
  date: string;
  time: string;
  type: 'video' | 'phone' | 'in-person';
  status: string;
  notes: string | null;
}

export const TherapyPage: React.FC = () => {
  const { filteredClinics, initializeClinics } = useTherapyStore();
  const { loadFavorites, clearFavorites } = useFavoritesStore();
  const { user, isAuthenticated } = useUserStore();
  const [userAppointments, setUserAppointments] = useState<UserAppointment[]>([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [showAppointments, setShowAppointments] = useState(true);
  const [cancellingAppointmentId, setCancellingAppointmentId] = useState<string | null>(null);

  useEffect(() => {
    console.log('🏥 TherapyPage mounted');
    initializeClinics();
  }, [initializeClinics]);

  useEffect(() => {
    console.log('🔐 Auth state changed:', { isAuthenticated, userId: user?.id });
    
    if (isAuthenticated && user) {
      console.log('👤 Loading favorites for user:', user.id);
      loadFavorites(user.id);
    } else {
      console.log('🧹 User not authenticated, clearing favorites');
      clearFavorites();
    }
  }, [isAuthenticated, user?.id, loadFavorites, clearFavorites]);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!user) {
        setLoadingAppointments(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('bookings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'scheduled')
          .gte('date', new Date().toISOString().split('T')[0])
          .order('date', { ascending: true })
          .order('time', { ascending: true });

        if (error) throw error;

        setUserAppointments(data || []);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoadingAppointments(false);
      }
    };

    fetchUserAppointments();
  }, [user]);

  const handleCancelAppointment = async (appointmentId: string, therapistName: string, date: string, time: string) => {
    const formattedDate = format(new Date(date), 'MMMM d, yyyy');
    const confirmMessage = `Are you sure you want to cancel your appointment with ${therapistName} on ${formattedDate} at ${time}?`;
    
    if (!confirm(confirmMessage)) {
      return;
    }

    setCancellingAppointmentId(appointmentId);
    console.log('🚫 Cancelling appointment (soft delete):', appointmentId);

    try {
      // Soft delete: Update status to 'cancelled' instead of deleting
      const { error: updateError } = await supabase
        .from('bookings')
        .update({ 
          status: 'cancelled',
          updated_at: new Date().toISOString()
        })
        .eq('id', appointmentId);

      if (updateError) {
        console.error('❌ Update appointment error:', updateError);
        throw updateError;
      }

      // Remove from local state (since we only show scheduled appointments here)
      setUserAppointments(userAppointments.filter(apt => apt.id !== appointmentId));

      console.log('✅ Appointment cancelled successfully (soft delete)');
      alert('Appointment cancelled successfully. You can view it in your Account page under "Cancelled Appointments".');
    } catch (error: any) {
      console.error('💥 Failed to cancel appointment:', error);
      alert('Failed to cancel appointment. Please try again.');
    } finally {
      setCancellingAppointmentId(null);
    }
  };

  const formatAppointmentDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const formatAppointmentTime = (timeStr: string): string => {
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

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="w-4 h-4 text-sage-600 flex-shrink-0" />;
      case 'phone':
        return <Phone className="w-4 h-4 text-lavender-600 flex-shrink-0" />;
      case 'in-person':
        return <UserIcon className="w-4 h-4 text-sage-600 flex-shrink-0" />;
      default:
        return <Calendar className="w-4 h-4 text-sage-600 flex-shrink-0" />;
    }
  };

  const getSessionTypeLabel = (type: string): string => {
    switch (type) {
      case 'video':
        return 'Video Session';
      case 'phone':
        return 'Phone Session';
      case 'in-person':
        return 'In-Person Session';
      default:
        return 'Session';
    }
  };

  console.log('🔍 Filtered clinics:', filteredClinics?.length || 0);

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="text-center space-y-4 animate-fade-in">
        <h1 className="text-5xl font-serif font-semibold text-gray-800">
          Find Your Perfect Therapy Match
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Connect with licensed therapists and mental health professionals who understand your unique needs
        </p>
      </section>

      {/* My Upcoming Appointments Section */}
      {user && (
        <div className="soft-card p-6 space-y-4">
          <button
            onClick={() => setShowAppointments(!showAppointments)}
            className="w-full flex items-center justify-between mb-4 hover:opacity-80 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-sage-600" />
              <h2 className="text-2xl font-serif font-semibold text-gray-800">
                My Upcoming Appointments
              </h2>
              {!loadingAppointments && userAppointments.length > 0 && (
                <span className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-sm font-semibold">
                  {userAppointments.length}
                </span>
              )}
            </div>
            {showAppointments ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </button>

          <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
              showAppointments ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            {loadingAppointments ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-sage-200 border-t-sage-600"></div>
                <p className="text-gray-600 mt-2">Loading your appointments...</p>
              </div>
            ) : userAppointments.length === 0 ? (
              <div className="text-center py-8 bg-sage-50 rounded-2xl border-2 border-sage-100">
                <Calendar className="w-12 h-12 text-sage-300 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">You don't have any upcoming appointments</p>
                <p className="text-sm text-gray-500 mb-6">
                  Browse therapists below and book your first session
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {userAppointments.map((appointment) => (
                  <div
                    key={appointment.id}
                    className="bg-gradient-to-br from-sage-50 to-lavender-50 rounded-2xl p-5 border-2 border-sage-100 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-gray-800 flex-1 pr-2">
                        {appointment.therapist_name}
                      </h3>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold border-2 bg-green-100 text-green-800 border-green-200 flex-shrink-0">
                        Scheduled
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-4 h-4 text-sage-600 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {formatAppointmentDate(appointment.date)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        <Clock className="w-4 h-4 text-lavender-600 flex-shrink-0" />
                        <span className="text-sm font-medium">
                          {formatAppointmentTime(appointment.time)}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-gray-700">
                        {getSessionTypeIcon(appointment.type)}
                        <span className="text-sm font-medium">
                          {getSessionTypeLabel(appointment.type)}
                        </span>
                      </div>

                      {appointment.notes && (
                        <div className="mt-3 p-3 bg-white/50 rounded-lg border border-sage-200">
                          <p className="text-xs text-gray-600 font-semibold mb-1">Notes:</p>
                          <p className="text-sm text-gray-700">{appointment.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-4 border-t border-sage-200">
                      <button
                        onClick={() => handleCancelAppointment(appointment.id, appointment.therapist_name, appointment.date, appointment.time)}
                        disabled={cancellingAppointmentId === appointment.id}
                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-semibold hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                      >
                        {cancellingAppointmentId === appointment.id ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            <span>Cancelling...</span>
                          </>
                        ) : (
                          <>
                            <X className="w-4 h-4" />
                            <span>Cancel Appointment</span>
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

      {/* Filters */}
      <TherapyFilters />

      {/* Results */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-serif font-semibold text-gray-800">
            Available Therapists
          </h2>
          <span className="text-gray-600">
            {filteredClinics?.length || 0} {filteredClinics?.length === 1 ? 'result' : 'results'}
          </span>
        </div>

        {!filteredClinics || filteredClinics.length === 0 ? (
          <div className="soft-card p-12 text-center">
            <p className="text-gray-600 text-lg">
              No therapists match your current filters. Try adjusting your search criteria.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredClinics.map((clinic) => (
              <ClinicCard key={clinic.id} clinic={clinic} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
