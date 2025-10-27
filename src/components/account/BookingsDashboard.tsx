import React from 'react';
import { Calendar, Clock, MapPin, Video, Phone, MessageSquare, X } from 'lucide-react';
import { useUserStore } from '../../store/userStore';
import { Booking } from '../../types';

export const BookingsDashboard: React.FC = () => {
  const bookings = useUserStore((state) => state.bookings);
  const updateBooking = useUserStore((state) => state.updateBooking);
  const cancelBooking = useUserStore((state) => state.cancelBooking);

  const upcomingBookings = bookings.filter(
    (b) => b.status === 'confirmed' && new Date(b.dateTime) > new Date()
  );

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getSessionIcon = (format: Booking['sessionFormat']) => {
    switch (format) {
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'phone':
        return <Phone className="w-5 h-5" />;
      case 'in-person':
        return <MapPin className="w-5 h-5" />;
      case 'chat':
        return <MessageSquare className="w-5 h-5" />;
    }
  };

  if (upcomingBookings.length === 0) {
    return (
      <div className="soft-card p-12 text-center">
        <Calendar className="w-16 h-16 text-sage-300 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
          No Upcoming Sessions
        </h3>
        <p className="text-gray-600 mb-6">
          You don't have any scheduled therapy sessions yet
        </p>
        <button className="btn-warm">
          Browse Therapists
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="soft-card p-6">
        <h2 className="text-3xl font-serif font-semibold text-gray-800 mb-2">
          Upcoming Sessions
        </h2>
        <p className="text-gray-600">
          You have {upcomingBookings.length} session{upcomingBookings.length !== 1 ? 's' : ''} scheduled
        </p>
      </div>

      <div className="grid gap-6">
        {upcomingBookings.map((booking) => (
          <div
            key={booking.id}
            className="soft-card p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
              {/* Session Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-1">
                    {booking.therapistName}
                  </h3>
                  <p className="text-gray-600">{booking.sessionType}</p>
                </div>

                <div className="flex flex-wrap gap-4 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-sage-500" />
                    <span>{formatDate(booking.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-sage-500" />
                    <span>{formatTime(booking.dateTime)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-lavender-700">
                    {getSessionIcon(booking.sessionFormat)}
                    <span className="capitalize">{booking.sessionFormat}</span>
                  </div>
                </div>

                {booking.location && (
                  <div className="flex items-start gap-2 text-gray-600">
                    <MapPin className="w-5 h-5 text-sage-500 flex-shrink-0 mt-0.5" />
                    <span>{booking.location}</span>
                  </div>
                )}

                {booking.notes && (
                  <div className="bg-sage-50 rounded-2xl p-4 border-2 border-sage-100">
                    <p className="text-sm text-gray-700">
                      <span className="font-semibold">Notes:</span> {booking.notes}
                    </p>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex md:flex-col gap-3">
                <button
                  className="btn-warm flex-1 md:flex-none"
                  aria-label="Join session"
                >
                  Join Session
                </button>
                <button
                  className="btn-soft flex-1 md:flex-none"
                  aria-label="Reschedule session"
                >
                  Reschedule
                </button>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to cancel this session?')) {
                      cancelBooking(booking.id);
                    }
                  }}
                  className="px-4 py-2 rounded-full border-2 border-blush-300 text-blush-700 hover:bg-blush-50 transition-colors font-semibold"
                  aria-label="Cancel session"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
