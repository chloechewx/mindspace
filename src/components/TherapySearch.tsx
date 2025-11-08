import React, { useState, useMemo } from 'react';
import { Search, MapPin, Phone, Mail, ExternalLink, Calendar, Star, Filter, X, ChevronDown } from 'lucide-react';
import { therapyClinics } from '../data/clinicsData';
import { ClinicFilters, TherapyClinic } from '../types';
import { SectionDivider } from './SectionDivider';

export const TherapySearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [zipCode, setZipCode] = useState('94102');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [filters, setFilters] = useState<ClinicFilters>({
    identifiedNeeds: [],
    comfortLevel: [],
    therapyStyle: [],
    sessionFormat: [],
    searchRadius: 25,
    zipCode: '94102',
  });

  const filterOptions = {
    identifiedNeeds: ['Anxiety', 'Depression', 'Trauma', 'Relationship Issues', 'Stress Management', 'Grief', 'Self-Esteem', 'Life Transitions'],
    comfortLevel: ['Beginner-Friendly', 'LGBTQ+ Affirming', 'Culturally Sensitive', 'Trauma-Informed', 'Multilingual Staff', 'Neurodivergent-Friendly'],
    therapyStyle: ['CBT', 'DBT', 'Psychodynamic', 'Humanistic', 'Solution-Focused', 'Art Therapy', 'Music Therapy', 'Movement Therapy'],
    sessionFormat: ['1:1 Individual', 'Group Therapy', 'Creative Therapy', 'Online Sessions', 'In-Person Sessions'],
  };

  const toggleFilter = (category: keyof Omit<ClinicFilters, 'searchRadius' | 'zipCode'>, value: string) => {
    setFilters(prev => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter(v => v !== value)
        : [...prev[category], value]
    }));
  };

  const clearFilters = () => {
    setFilters({
      identifiedNeeds: [],
      comfortLevel: [],
      therapyStyle: [],
      sessionFormat: [],
      searchRadius: 25,
      zipCode: zipCode,
    });
  };

  const filteredClinics = useMemo(() => {
    return therapyClinics.filter(clinic => {
      // Search query filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          clinic.name.toLowerCase().includes(query) ||
          clinic.description.toLowerCase().includes(query) ||
          clinic.specialties.some(s => s.toLowerCase().includes(query));
        if (!matchesSearch) return false;
      }

      // Identified needs filter
      if (filters.identifiedNeeds.length > 0) {
        const hasMatchingNeed = filters.identifiedNeeds.some(need =>
          clinic.specialties.includes(need)
        );
        if (!hasMatchingNeed) return false;
      }

      // Comfort level filter
      if (filters.comfortLevel.length > 0) {
        const hasMatchingComfort = filters.comfortLevel.some(comfort =>
          clinic.comfortFeatures.includes(comfort)
        );
        if (!hasMatchingComfort) return false;
      }

      // Therapy style filter
      if (filters.therapyStyle.length > 0) {
        const hasMatchingStyle = filters.therapyStyle.some(style =>
          clinic.therapyStyles.includes(style)
        );
        if (!hasMatchingStyle) return false;
      }

      // Session format filter
      if (filters.sessionFormat.length > 0) {
        const hasMatchingFormat = filters.sessionFormat.some(format =>
          clinic.sessionFormats.includes(format)
        );
        if (!hasMatchingFormat) return false;
      }

      return true;
    });
  }, [searchQuery, filters]);

  const activeFilterCount = 
    filters.identifiedNeeds.length + 
    filters.comfortLevel.length + 
    filters.therapyStyle.length + 
    filters.sessionFormat.length;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      {/* Header */}
      <section className="soft-card p-8 md:p-10 bg-gradient-to-br from-lavender-50 via-sage-50 to-blush-50">
        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-gray-800 mb-4">
          Find Your Therapy Clinic
        </h2>
        <p className="text-xl text-gray-700 leading-relaxed max-w-3xl">
          Discover local therapy clinics that match your needs, preferences, and comfort level. 
          Filter by specialties, therapy styles, and session formats to find the perfect fit for your wellness journey.
        </p>
      </section>

      {/* Search & Location */}
      <section className="soft-card p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-sage-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specialty, or keyword..."
              className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-sage-200 focus:border-sage-400 focus:ring-4 focus:ring-sage-100 transition-all duration-300 bg-white shadow-sm text-gray-800"
            />
          </div>
          
          <div className="relative">
            <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-blush-600" />
            <input
              type="text"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              placeholder="Enter zip code..."
              className="w-full pl-14 pr-6 py-4 rounded-full border-2 border-sage-200 focus:border-blush-400 focus:ring-4 focus:ring-blush-100 transition-all duration-300 bg-white shadow-sm text-gray-800"
            />
          </div>
        </div>

        {/* Filter Toggle */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-3 px-6 py-3 rounded-full bg-sage-100 hover:bg-sage-200 transition-all duration-300 shadow-sm hover:shadow-md text-sage-800 font-semibold"
          >
            <Filter className="w-5 h-5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="bg-sage-600 text-white text-sm px-2.5 py-0.5 rounded-full">
                {activeFilterCount}
              </span>
            )}
            <ChevronDown className={`w-5 h-5 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>

          {activeFilterCount > 0 && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 text-blush-700 hover:text-blush-800 font-semibold transition-colors"
            >
              <X className="w-4 h-4" />
              Clear all
            </button>
          )}
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <div className="mt-6 space-y-6 p-6 rounded-3xl bg-gradient-to-br from-cream-50 to-white border-2 border-sage-100 animate-slide-up">
            {/* Identified Needs */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lavender-500"></span>
                Identified Needs
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.identifiedNeeds.map(need => (
                  <button
                    key={need}
                    onClick={() => toggleFilter('identifiedNeeds', need)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      filters.identifiedNeeds.includes(need)
                        ? 'bg-lavender-500 text-white shadow-md scale-105'
                        : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-lavender-300 hover:scale-105'
                    }`}
                  >
                    {need}
                  </button>
                ))}
              </div>
            </div>

            <SectionDivider variant="wave" />

            {/* Comfort Level */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blush-500"></span>
                Comfort Level
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.comfortLevel.map(comfort => (
                  <button
                    key={comfort}
                    onClick={() => toggleFilter('comfortLevel', comfort)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      filters.comfortLevel.includes(comfort)
                        ? 'bg-blush-500 text-white shadow-md scale-105'
                        : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-blush-300 hover:scale-105'
                    }`}
                  >
                    {comfort}
                  </button>
                ))}
              </div>
            </div>

            <SectionDivider variant="curve" />

            {/* Therapy Style */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sage-500"></span>
                Therapy Style
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.therapyStyle.map(style => (
                  <button
                    key={style}
                    onClick={() => toggleFilter('therapyStyle', style)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      filters.therapyStyle.includes(style)
                        ? 'bg-sage-500 text-white shadow-md scale-105'
                        : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-sage-300 hover:scale-105'
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <SectionDivider variant="wave" />

            {/* Session Format */}
            <div>
              <h4 className="text-lg font-serif font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lavender-500"></span>
                Session Format
              </h4>
              <div className="flex flex-wrap gap-2">
                {filterOptions.sessionFormat.map(format => (
                  <button
                    key={format}
                    onClick={() => toggleFilter('sessionFormat', format)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                      filters.sessionFormat.includes(format)
                        ? 'bg-lavender-500 text-white shadow-md scale-105'
                        : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-lavender-300 hover:scale-105'
                    }`}
                  >
                    {format}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Results Count */}
      <div className="flex items-center justify-between px-4">
        <p className="text-gray-700 font-semibold">
          {filteredClinics.length} {filteredClinics.length === 1 ? 'clinic' : 'clinics'} found
        </p>
      </div>

      {/* Clinic Listings */}
      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block w-16 h-16 border-4 border-sage-200 border-t-sage-600 rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-700 font-semibold">Finding clinics near you...</p>
        </div>
      ) : filteredClinics.length === 0 ? (
        <section className="soft-card p-16 text-center bg-gradient-to-br from-blush-50 to-lavender-50">
          <div className="max-w-md mx-auto">
            <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-sage-600" />
            </div>
            <h3 className="text-3xl font-serif font-semibold text-gray-800 mb-4">No Clinics Found</h3>
            <p className="text-gray-700 leading-relaxed mb-6">
              We couldn't find any clinics matching your current filters. Try adjusting your search criteria or clearing some filters.
            </p>
            <button
              onClick={clearFilters}
              className="btn-warm"
            >
              Clear All Filters
            </button>
          </div>
        </section>
      ) : (
        <div className="grid gap-6">
          {filteredClinics.map((clinic, index) => (
            <section
              key={clinic.id}
              className="soft-card p-8 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Clinic Icon */}
                <div className="flex-shrink-0">
                  <div className="w-20 h-20 bg-gradient-to-br from-sage-400 to-lavender-400 rounded-3xl flex items-center justify-center shadow-lg">
                    <span className="text-4xl">🏥</span>
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex-grow space-y-4">
                  {/* Header */}
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-3xl font-serif font-semibold text-gray-800">{clinic.name}</h3>
                      <div className="flex items-center gap-2 bg-lavender-100 px-4 py-2 rounded-full">
                        <Star className="w-5 h-5 text-lavender-700 fill-lavender-700" />
                        <span className="font-semibold text-lavender-800">{clinic.rating}</span>
                        <span className="text-sm text-lavender-700">({clinic.reviewCount})</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{clinic.description}</p>
                  </div>

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-sage-600" />
                      <span>{clinic.address}, {clinic.city}, {clinic.state} {clinic.zipCode}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-blush-600" />
                      <span>{clinic.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Mail className="w-4 h-4 text-lavender-600" />
                      <span>{clinic.email}</span>
                    </div>
                  </div>

                  {/* Specialties */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Specialties</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.specialties.map(specialty => (
                        <span
                          key={specialty}
                          className="px-3 py-1 bg-lavender-100 text-lavender-800 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Therapy Styles */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Therapy Approaches</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.therapyStyles.map(style => (
                        <span
                          key={style}
                          className="px-3 py-1 bg-sage-100 text-sage-800 rounded-full text-sm font-medium"
                        >
                          {style}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Session Formats */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Available Formats</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.sessionFormats.map(format => (
                        <span
                          key={format}
                          className="px-3 py-1 bg-blush-100 text-blush-800 rounded-full text-sm font-medium"
                        >
                          {format}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Comfort Features */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Comfort Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {clinic.comfortFeatures.map(feature => (
                        <span
                          key={feature}
                          className="px-3 py-1 bg-cream-200 text-cream-900 rounded-full text-sm font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-4 pt-4">
                    <a
                      href={clinic.bookingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-warm flex items-center gap-2"
                    >
                      <Calendar className="w-5 h-5" />
                      <span>Book Appointment</span>
                    </a>
                    <a
                      href={clinic.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-soft flex items-center gap-2"
                    >
                      <ExternalLink className="w-5 h-5" />
                      <span>Visit Website</span>
                    </a>
                  </div>
                </div>
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};
