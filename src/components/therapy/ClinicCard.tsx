import React, { useState } from 'react';
import { MapPin, Phone, Mail, Globe, Star, Heart, Calendar } from 'lucide-react';
import { TherapyClinic } from '../../types';
import { BookingModal } from './BookingModal';
import { useFavoritesStore } from '../../store/favoritesStore';
import { useUserStore } from '../../store/userStore';
import { useAuthModalStore } from '../../store/authModalStore';

interface ClinicCardProps {
  clinic: TherapyClinic;
}

export const ClinicCard: React.FC<ClinicCardProps> = ({ clinic }) => {
  const [showBooking, setShowBooking] = useState(false);
  const { isFavorite, toggleFavorite } = useFavoritesStore();
  const { user, isAuthenticated } = useUserStore();
  const { openModal } = useAuthModalStore();
  
  const isFav = isFavorite(clinic.id);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated || !user) {
      openModal('login', `Login to save ${clinic.name} to your favorites`);
      return;
    }

    try {
      await toggleFavorite(clinic.id, user.id, clinic.name);
    } catch (error: any) {
      alert(error.message || 'Failed to update favorite');
    }
  };

  const handleBookAppointment = () => {
    if (!isAuthenticated || !user) {
      openModal('login', `Login to book an appointment with ${clinic.name}`);
      return;
    }
    setShowBooking(true);
  };

  return (
    <>
      <div className="soft-card transition-shadow duration-300 overflow-hidden">
        {/* Single Column Layout: Image Left, Details Right */}
        <div className="flex flex-col lg:flex-row lg:h-[400px]">
          {/* Left Side: Image with Fixed Width */}
          <div className="relative w-full lg:w-[400px] h-64 lg:h-full flex-shrink-0 overflow-hidden border-l-8 border-sage-400">
            <img
              src={clinic.image}
              alt={clinic.name}
              className="w-full h-full object-cover"
            />
            
            {/* Favorite Button - Overlay on Image */}
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-4 right-4 p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 active:scale-95 ${
                isFav
                  ? 'bg-rose-500/90 text-white hover:bg-rose-600 shadow-lg'
                  : 'bg-white/90 text-gray-600 hover:bg-white hover:text-rose-600 shadow-md'
              }`}
              aria-label={isFav ? 'Remove from favorites' : 'Add to favorites'}
              type="button"
            >
              <Heart className={`w-5 h-5 transition-all duration-300 ${isFav ? 'fill-current' : ''}`} />
            </button>

            {/* Rating Overlay */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(clinic.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-gray-900">{clinic.rating}</span>
                <span className="text-xs text-gray-600">({clinic.reviewCount})</span>
              </div>
            </div>
          </div>

          {/* Right Side: Details */}
          <div className="flex-1 p-6 lg:p-8 flex flex-col">
            {/* Clinic Name */}
            <h3 className="text-2xl lg:text-3xl font-serif font-semibold text-gray-900 mb-2">
              {clinic.name}
            </h3>

            {/* Description - Increased from text-sm to text-base */}
            <p className="text-gray-600 text-base leading-relaxed mb-3 line-clamp-2">{clinic.description}</p>

            {/* Specialties - Increased from text-xs to text-sm */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Specialties</h4>
              <div className="flex flex-wrap gap-1.5">
                {clinic.specialties.slice(0, 3).map((specialty) => (
                  <span
                    key={specialty}
                    className="px-2.5 py-1 bg-sage-50 text-sage-700 rounded-full text-sm font-medium"
                  >
                    {specialty}
                  </span>
                ))}
                {clinic.specialties.length > 3 && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    +{clinic.specialties.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Therapy Styles - Increased from text-xs to text-sm */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-gray-700 mb-1.5">Therapy Approaches</h4>
              <div className="flex flex-wrap gap-1.5">
                {clinic.therapyStyles.slice(0, 3).map((style) => (
                  <span
                    key={style}
                    className="px-2.5 py-1 bg-lavender-50 text-lavender-700 rounded-full text-sm font-medium"
                  >
                    {style}
                  </span>
                ))}
                {clinic.therapyStyles.length > 3 && (
                  <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                    +{clinic.therapyStyles.length - 3} more
                  </span>
                )}
              </div>
            </div>

            {/* Contact Info - Increased icons from w-3.5 h-3.5 to w-4 h-4, text from text-xs to text-sm */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <span className="text-sm">
                  {clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Phone className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <a href={`tel:${clinic.phone}`} className="text-sm hover:text-sage-600 transition-colors">
                  {clinic.phone}
                </a>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="w-4 h-4 text-sage-600 flex-shrink-0" />
                <a href={`mailto:${clinic.email}`} className="text-sm hover:text-sage-600 transition-colors">
                  {clinic.email}
                </a>
              </div>
              {clinic.website && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe className="w-4 h-4 text-sage-600 flex-shrink-0" />
                  <a
                    href={clinic.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm hover:text-sage-600 transition-colors"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            {/* Spacer */}
            <div className="flex-grow"></div>

            {/* Bottom Row: Insurance, Price, and Book Button - Increased from text-xs to text-sm */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-gray-100">
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Insurance:</span>
                  {clinic.acceptsInsurance ? 'Accepted' : 'Not Accepted'}
                </span>
                <span className="flex items-center gap-1">
                  <span className="font-semibold">Price:</span>
                  {clinic.priceRange}
                </span>
              </div>

              <button
                onClick={handleBookAppointment}
                className="px-5 py-2.5 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                Book Appointment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          clinic={clinic}
          onClose={() => setShowBooking(false)}
        />
      )}
    </>
  );
};
