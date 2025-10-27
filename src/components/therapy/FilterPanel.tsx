import React from 'react';
import { ClinicFilters } from '../../types';
import { X, Sparkles, Users, Video, MapPin, DollarSign, Heart, User, Globe } from 'lucide-react';

interface FilterPanelProps {
  filters: ClinicFilters;
  onFiltersChange: (filters: ClinicFilters) => void;
  onClearAll: () => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onFiltersChange, onClearAll }) => {
  const sessionTypeOptions = [
    { value: '1v1', label: '1-on-1 Sessions', icon: Users },
    { value: 'group', label: 'Group Therapy', icon: Users },
    { value: 'creative', label: 'Creative Therapy', icon: Sparkles },
    { value: 'couples', label: 'Couples Therapy', icon: Heart },
    { value: 'family', label: 'Family Therapy', icon: Users },
  ];

  const formatOptions = [
    { value: 'online', label: 'Online', icon: Video },
    { value: 'in-person', label: 'In-Person', icon: MapPin },
    { value: 'hybrid', label: 'Hybrid', icon: Video },
  ];

  const struggleTypeOptions = [
    'Anxiety',
    'Depression',
    'Work Stress',
    'Career',
    'LGBTQ+',
    'Relationship',
    'Family',
    'Trauma',
    'Grief',
    'Identity',
    'Self-Expression',
    'Emotional Regulation',
    'Social Skills',
    'Parenting',
    'Personal Growth',
    'Existential',
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-Binary' },
    { value: 'any', label: 'Any Gender' },
  ];

  const languageOptions = [
    'English',
    'Spanish',
    'Mandarin',
    'French',
    'Arabic',
    'Korean',
    'Japanese',
    'German',
    'Italian',
    'Tagalog',
    'Vietnamese',
    'ASL',
  ];

  const toggleArrayFilter = (key: keyof ClinicFilters, value: string) => {
    const currentValues = filters[key] as string[];
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value];
    
    onFiltersChange({
      ...filters,
      [key]: newValues,
    });
  };

  const hasActiveFilters = 
    filters.sessionTypes.length > 0 ||
    filters.formats.length > 0 ||
    filters.animalTherapy !== null ||
    filters.struggleTypes.length > 0 ||
    filters.therapistGender.length > 0 ||
    filters.languages.length > 0 ||
    filters.budgetRange.min > 50 ||
    filters.budgetRange.max < 250;

  return (
    <div className="space-y-6">
      {/* Clear All Button */}
      {hasActiveFilters && (
        <div className="flex justify-end">
          <button
            onClick={onClearAll}
            className="flex items-center gap-2 px-4 py-2 bg-blush-100 text-blush-700 rounded-full hover:bg-blush-200 transition-colors font-semibold text-sm"
          >
            <X className="w-4 h-4" />
            Clear All Filters
          </button>
        </div>
      )}

      {/* Session Types */}
      <div className="soft-card p-6 bg-gradient-to-br from-sage-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-sage-600" />
          Session Type
        </h4>
        <div className="flex flex-wrap gap-2">
          {sessionTypeOptions.map(option => {
            const Icon = option.icon;
            const isActive = filters.sessionTypes.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('sessionTypes', option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-500 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-sage-300 hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Format */}
      <div className="soft-card p-6 bg-gradient-to-br from-lavender-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Video className="w-5 h-5 text-lavender-600" />
          Session Format
        </h4>
        <div className="flex flex-wrap gap-2">
          {formatOptions.map(option => {
            const Icon = option.icon;
            const isActive = filters.formats.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('formats', option.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-lavender-500 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-lavender-200 text-gray-700 hover:border-lavender-300 hover:scale-105'
                }`}
              >
                <Icon className="w-4 h-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Animal Therapy */}
      <div className="soft-card p-6 bg-gradient-to-br from-blush-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4">
          🐾 Animal Therapy
        </h4>
        <div className="flex gap-2">
          <button
            onClick={() => onFiltersChange({ ...filters, animalTherapy: true })}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filters.animalTherapy === true
                ? 'bg-blush-500 text-white shadow-md scale-105'
                : 'bg-white border-2 border-blush-200 text-gray-700 hover:border-blush-300'
            }`}
          >
            Yes, Please!
          </button>
          <button
            onClick={() => onFiltersChange({ ...filters, animalTherapy: null })}
            className={`flex-1 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              filters.animalTherapy === null
                ? 'bg-gray-500 text-white shadow-md scale-105'
                : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-gray-300'
            }`}
          >
            No Preference
          </button>
        </div>
      </div>

      {/* Budget Range */}
      <div className="soft-card p-6 bg-gradient-to-br from-sage-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-sage-600" />
          Budget Range (per session)
        </h4>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">Min: ${filters.budgetRange.min}</label>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={filters.budgetRange.min}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  budgetRange: { ...filters.budgetRange, min: parseInt(e.target.value) }
                })}
                className="w-full h-2 bg-sage-200 rounded-full appearance-none cursor-pointer accent-sage-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600 mb-1 block">Max: ${filters.budgetRange.max}</label>
              <input
                type="range"
                min="50"
                max="250"
                step="10"
                value={filters.budgetRange.max}
                onChange={(e) => onFiltersChange({
                  ...filters,
                  budgetRange: { ...filters.budgetRange, max: parseInt(e.target.value) }
                })}
                className="w-full h-2 bg-sage-200 rounded-full appearance-none cursor-pointer accent-sage-500"
              />
            </div>
          </div>
          <div className="text-center text-sm font-semibold text-sage-700">
            ${filters.budgetRange.min} - ${filters.budgetRange.max}
          </div>
        </div>
      </div>

      {/* Struggle Types */}
      <div className="soft-card p-6 bg-gradient-to-br from-lavender-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Heart className="w-5 h-5 text-lavender-600" />
          Areas of Focus
        </h4>
        <div className="flex flex-wrap gap-2">
          {struggleTypeOptions.map(type => {
            const isActive = filters.struggleTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleArrayFilter('struggleTypes', type)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-lavender-500 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-lavender-200 text-gray-700 hover:border-lavender-300 hover:scale-105'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Therapist Gender */}
      <div className="soft-card p-6 bg-gradient-to-br from-blush-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-blush-600" />
          Therapist Gender Preference
        </h4>
        <div className="flex flex-wrap gap-2">
          {genderOptions.map(option => {
            const isActive = filters.therapistGender.includes(option.value);
            return (
              <button
                key={option.value}
                onClick={() => toggleArrayFilter('therapistGender', option.value)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-blush-500 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-blush-200 text-gray-700 hover:border-blush-300 hover:scale-105'
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Languages */}
      <div className="soft-card p-6 bg-gradient-to-br from-sage-50 to-cream-50">
        <h4 className="text-lg font-serif font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Globe className="w-5 h-5 text-sage-600" />
          Languages
        </h4>
        <div className="flex flex-wrap gap-2">
          {languageOptions.map(language => {
            const isActive = filters.languages.includes(language);
            return (
              <button
                key={language}
                onClick={() => toggleArrayFilter('languages', language)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-sage-500 text-white shadow-md scale-105'
                    : 'bg-white border-2 border-sage-200 text-gray-700 hover:border-sage-300 hover:scale-105'
                }`}
              >
                {language}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
