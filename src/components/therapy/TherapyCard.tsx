import React from 'react';
import { MapPin, Phone, Mail, Star, Clock, DollarSign, Globe, Calendar } from 'lucide-react';
import { TherapyClinic } from '../../types';

interface TherapyCardProps {
  clinic: TherapyClinic;
}

export const TherapyCard: React.FC<TherapyCardProps> = ({ clinic }) => {
  const getPriceDisplay = (range: string) => {
    return range;
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Clinic Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={clinic.image}
          alt={clinic.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg">
          <Star className="w-4 h-4 text-yellow-400" fill="currentColor" />
          <span className="font-semibold text-gray-800">{clinic.rating}</span>
          <span className="text-gray-500 text-sm">({clinic.reviewCount})</span>
        </div>

        {/* Price Badge */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-sage-500/90 backdrop-blur-sm text-white rounded-full text-sm font-semibold shadow-lg">
          {getPriceDisplay(clinic.priceRange)}
        </div>

        {/* Therapy Type Badges */}
        <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
          {clinic.therapyTypes.slice(0, 3).map((type) => (
            <span
              key={type}
              className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-800 rounded-full text-xs font-semibold shadow-md"
            >
              {type}
            </span>
          ))}
          {clinic.therapyTypes.length > 3 && (
            <span className="px-3 py-1 bg-white/95 backdrop-blur-sm text-gray-600 rounded-full text-xs font-semibold shadow-md">
              +{clinic.therapyTypes.length - 3} more
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-4">
        {/* Header */}
        <div>
          <h3 className="text-2xl font-serif font-semibold text-gray-800 group-hover:text-sage-600 transition-colors mb-2">
            {clinic.name}
          </h3>
        </div>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed line-clamp-3">
          {clinic.description}
        </p>

        {/* Contact Info */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4 text-sage-600 flex-shrink-0" />
            <span className="text-sm">{clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}</span>
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
        </div>

        {/* Specialties */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Specialties</h4>
          <div className="flex flex-wrap gap-2">
            {clinic.specialties.slice(0, 4).map((specialty) => (
              <span
                key={specialty}
                className="px-3 py-1 bg-lavender-100 text-lavender-700 rounded-full text-xs font-medium"
              >
                {specialty}
              </span>
            ))}
          </div>
        </div>

        {/* Comfort Features */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700">Comfort Features</h4>
          <div className="flex flex-wrap gap-2">
            {clinic.comfortFeatures.slice(0, 3).map((feature) => (
              <span
                key={feature}
                className="px-3 py-1 bg-sage-100 text-sage-700 rounded-full text-xs font-medium"
              >
                {feature}
              </span>
            ))}
          </div>
        </div>

        {/* Additional Info */}
        <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4 text-sage-600" />
            <span className="capitalize">{clinic.availability.replace('-', ' ')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <DollarSign className="w-4 h-4 text-sage-600" />
            <span>{clinic.acceptsInsurance ? 'Accepts Insurance' : 'Private Pay'}</span>
          </div>
        </div>

        {/* Languages */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Globe className="w-4 h-4 text-sage-600" />
          <span>Languages: {clinic.languages.join(', ')}</span>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-4">
          <a
            href={clinic.website}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-white border-2 border-sage-500 text-sage-600 rounded-xl font-semibold hover:bg-sage-50 transition-all text-center"
          >
            Learn More
          </a>
          <a
            href={clinic.bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 px-6 py-3 bg-gradient-to-r from-sage-500 to-lavender-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <Calendar className="w-5 h-5" />
            Book Appointment
          </a>
        </div>
      </div>
    </div>
  );
};
