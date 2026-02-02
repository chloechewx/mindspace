import React, { useState } from 'react';
import { X, Calendar, Clock, Video, Phone, User as UserIcon, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useUserStore } from '../../store/userStore';

interface BookingModalProps {
  clinic: {
    id: string;
    name: string;
    phone: string;
  };
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ 
  clinic,
  onClose 
}) => {
  const { user } = useUserStore();
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [sessionType, setSessionType] = useState<'video' | 'phone' | 'in-person'>('video');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('Please log in to book an appointment');
      return;
    }

    if (!selectedDate || !selectedTime) {
      setError('Please select a date and time');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const { data, error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: user.id,
          therapist_id: clinic.id,
          therapist_name: clinic.name,
          date: selectedDate,
          time: selectedTime,
          type: sessionType,
          status: 'scheduled',
          notes: notes || null,
        })
        .select();

      if (bookingError) {
        throw bookingError;
      }

      // Show success state
      setSuccess(true);
      
      // Wait a moment then close
      setTimeout(() => {
        onClose();
        // Reset form
        setSelectedDate('');
        setSelectedTime('');
        setSessionType('video');
        setNotes('');
        setSuccess(false);
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to book appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-[400px] w-full p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">
            Booking Confirmed!
          </h3>
          <p className="text-gray-600">
            Your appointment has been scheduled successfully.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-[400px] w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-3.5 flex items-center justify-between rounded-t-2xl">
          <div>
            <h2 className="text-lg font-serif font-semibold text-gray-800">Book Appointment</h2>
            <p className="text-xs text-gray-600 mt-0.5">{clinic.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {/* Date Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              <Calendar className="w-3 h-3 inline mr-1" />
              Preferred Date
            </label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              required
            />
          </div>

          {/* Time Selection */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              <Clock className="w-3 h-3 inline mr-1" />
              Preferred Time
            </label>
            <select
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500"
              required
            >
              <option value="">Select a time</option>
              <option value="09:00 AM">09:00 AM</option>
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:00 AM">11:00 AM</option>
              <option value="01:00 PM">01:00 PM</option>
              <option value="02:00 PM">02:00 PM</option>
              <option value="03:00 PM">03:00 PM</option>
              <option value="04:00 PM">04:00 PM</option>
              <option value="05:00 PM">05:00 PM</option>
              <option value="06:00 PM">06:00 PM</option>
            </select>
          </div>

          {/* Session Type */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Session Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSessionType('video')}
                className={`p-2 rounded-lg border-2 transition-all ${
                  sessionType === 'video'
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Video className="w-3.5 h-3.5 mx-auto mb-0.5" />
                <div className="text-xs font-semibold">Video</div>
              </button>
              <button
                type="button"
                onClick={() => setSessionType('phone')}
                className={`p-2 rounded-lg border-2 transition-all ${
                  sessionType === 'phone'
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <Phone className="w-3.5 h-3.5 mx-auto mb-0.5" />
                <div className="text-xs font-semibold">Phone</div>
              </button>
              <button
                type="button"
                onClick={() => setSessionType('in-person')}
                className={`p-2 rounded-lg border-2 transition-all ${
                  sessionType === 'in-person'
                    ? 'border-sage-500 bg-sage-50 text-sage-700'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <UserIcon className="w-3.5 h-3.5 mx-auto mb-0.5" />
                <div className="text-xs font-semibold">In-Person</div>
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any specific concerns or preferences..."
              className="w-full px-2.5 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sage-500 resize-none"
              rows={2}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-2.5 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs text-red-600">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2.5 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-lg font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Booking...
              </span>
            ) : (
              'Confirm Booking'
            )}
          </button>

          {/* Contact Info */}
          <div className="text-center text-xs text-gray-600">
            Questions? Call us at <span className="font-semibold">{clinic.phone}</span>
          </div>
        </form>
      </div>
    </div>
  );
};
