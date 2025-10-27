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
    
    console.log('❤️ Favorite button clicked for:', clinic.name);
    console.log('🔐 Auth state:', { isAuthenticated, userId: user?.id });
    console.log('⭐ Current favorite state:', isFav);
    
    if (!isAuthenticated || !user) {
      console.log('❌ User not authenticated, opening auth modal');
      openModal('login', `Login to save ${clinic.name} to your favorites`);
      return;
    }

    try {
      console.log('🔄 Calling toggleFavorite...');
      await toggleFavorite(clinic.id, user.id, clinic.name);
      console.log('✅ Favorite toggled successfully');
    } catch (error: any) {
      console.error('💥 Error toggling favorite:', error);
      alert(error.message || 'Failed to update favorite');
    }
  };

  const handleBookAppointment = () => {
    console.log('📅 Book Appointment clicked for:', clinic.name);
    console.log('🔐 Auth state:', { isAuthenticated, user: user?.email });
    
    if (!isAuthenticated || !user) {
      console.log('❌ User not authenticated, opening auth modal');
      openModal('login', `Login to book an appointment with ${clinic.name}`);
      return;
    }

    console.log('✅ User authenticated, opening booking modal');
    setShowBooking(true);
  };

  return (
    <>
      <div className="soft-card hover:shadow-xl transition-all duration-300 overflow-hidden group">
        {/* Clinic Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={clinic.image}
            alt={clinic.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          
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

          {/* Clinic Name Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6">
            <h3 className="text-3xl font-serif font-semibold text-white mb-2 drop-shadow-lg">
              {clinic.name}
            </h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < Math.floor(clinic.rating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'text-white/50'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-white drop-shadow">{clinic.rating}</span>
              <span className="text-sm text-white/90 drop-shadow">({clinic.reviewCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-6 space-y-4">
          {/* Description */}
          <p className="text-gray-600 leading-relaxed">{clinic.description}</p>

          {/* Specialties */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Specialties</h4>
            <div className="flex flex-wrap gap-2">
              {clinic.specialties.map((specialty) => (
                <span
                  key={specialty}
                  className="px-3 py-1 bg-sage-50 text-sage-700 rounded-full text-sm font-medium"
                >
                  {specialty}
                </span>
              ))}
            </div>
          </div>

          {/* Therapy Styles */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Therapy Approaches</h4>
            <div className="flex flex-wrap gap-2">
              {clinic.therapyStyles.map((style) => (
                <span
                  key={style}
                  className="px-3 py-1 bg-lavender-50 text-lavender-700 rounded-full text-sm font-medium"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>

          {/* Session Formats */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Formats</h4>
            <div className="flex flex-wrap gap-2">
              {clinic.sessionFormats.map((format) => (
                <span
                  key={format}
                  className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                >
                  {format}
                </span>
              ))}
            </div>
          </div>

          {/* Comfort Features */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Comfort Features</h4>
            <div className="flex flex-wrap gap-2">
              {clinic.comfortFeatures.map((feature) => (
                <span
                  key={feature}
                  className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm font-medium"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-2 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="w-4 h-4 text-sage-600" />
              <span className="text-sm">
                {clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="w-4 h-4 text-sage-600" />
              <a href={`tel:${clinic.phone}`} className="text-sm hover:text-sage-600 transition-colors">
                {clinic.phone}
              </a>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Mail className="w-4 h-4 text-sage-600" />
              <a href={`mailto:${clinic.email}`} className="text-sm hover:text-sage-600 transition-colors">
                {clinic.email}
              </a>
            </div>
            {clinic.website && (
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4 text-sage-600" />
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

          {/* Additional Info */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600 pt-2">
            <span className="flex items-center gap-1">
              <span className="font-semibold">Insurance:</span>
              {clinic.acceptsInsurance ? 'Accepted' : 'Not Accepted'}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">Languages:</span>
              {clinic.languages.join(', ')}
            </span>
            <span className="flex items-center gap-1">
              <span className="font-semibold">Price Range:</span>
              {clinic.priceRange}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleBookAppointment}
              className="flex-1 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Calendar className="w-5 h-5" />
              Book Appointment
            </button>
            <a
              href={clinic.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-3 bg-white border-2 border-sage-500 text-sage-700 rounded-xl font-semibold hover:bg-sage-50 transition-all duration-300 text-center"
            >
              Learn More
            </a>
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
