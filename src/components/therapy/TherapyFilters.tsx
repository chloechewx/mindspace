import React, { useState } from 'react';
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { useTherapyStore } from '../../store/therapyStore';

export const TherapyFilters: React.FC = () => {
  const { filters, setFilters, resetFilters } = useTherapyStore();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="soft-card overflow-hidden">
      {/* Header - Always Visible */}
      <div className="p-6 flex items-center justify-between border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-sage-600" />
          <h3 className="text-lg font-semibold text-gray-800">Filter Therapists</h3>
          <span className="text-sm text-gray-500 ml-2">
            ({useTherapyStore.getState().filteredClinics?.length || 0} results)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={resetFilters}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-sage-600 transition-colors rounded-lg hover:bg-sage-50"
          >
            <X className="w-4 h-4" />
            Reset
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:text-sage-600 transition-colors rounded-lg hover:bg-sage-50"
          >
            {isOpen ? (
              <>
                <ChevronUp className="w-4 h-4" />
                Hide Filters
              </>
            ) : (
              <>
                <ChevronDown className="w-4 h-4" />
                Show Filters
              </>
            )}
          </button>
        </div>
      </div>

      {/* Collapsible Filter Content */}
      {isOpen && (
        <div className="p-6 space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Therapy Type - PRIMARY FILTER */}
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <label className="block text-sm font-semibold text-gray-700">
                Therapy Type
              </label>
              <div className="relative">
                <select
                  value={filters.therapyType}
                  onChange={(e) => setFilters({ therapyType: e.target.value })}
                  className="w-full pl-4 pr-10 py-3 border-2 border-sage-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-sage-500 bg-white text-gray-800 font-medium appearance-none"
                >
                  <option value="any">All Therapy Types</option>
                  <optgroup label="Evidence-Based Therapies">
                    <option value="CBT">Cognitive Behavioral Therapy (CBT)</option>
                    <option value="DBT">Dialectical Behavior Therapy (DBT)</option>
                    <option value="ACT">Acceptance & Commitment Therapy (ACT)</option>
                    <option value="EMDR">EMDR (Eye Movement Desensitization)</option>
                  </optgroup>
                  <optgroup label="Depth & Insight Therapies">
                    <option value="Psychodynamic">Psychodynamic Therapy</option>
                    <option value="Jungian">Jungian Analysis</option>
                    <option value="Existential">Existential Therapy</option>
                  </optgroup>
                  <optgroup label="Relationship & Family">
                    <option value="Family Systems">Family Systems Therapy</option>
                    <option value="EFT">Emotionally Focused Therapy (EFT)</option>
                    <option value="Couples">Couples Therapy</option>
                  </optgroup>
                  <optgroup label="Creative & Expressive">
                    <option value="Art Therapy">Art Therapy</option>
                    <option value="Music Therapy">Music Therapy</option>
                    <option value="Movement Therapy">Movement/Dance Therapy</option>
                    <option value="Expressive Arts">Expressive Arts Therapy</option>
                  </optgroup>
                  <optgroup label="Body-Centered">
                    <option value="Somatic">Somatic Therapy</option>
                    <option value="Animal-Assisted">Animal-Assisted Therapy</option>
                    <option value="Equine">Equine Therapy</option>
                  </optgroup>
                  <optgroup label="Holistic & Mindfulness">
                    <option value="Mindfulness">Mindfulness-Based Therapy</option>
                    <option value="Humanistic">Humanistic Therapy</option>
                    <option value="Solution-Focused">Solution-Focused Brief Therapy</option>
                  </optgroup>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Availability
              </label>
              <div className="relative">
                <select
                  value={filters.availability}
                  onChange={(e) => setFilters({ availability: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="any">Any Time</option>
                  <option value="immediate">Immediate</option>
                  <option value="within-week">Within a Week</option>
                  <option value="within-month">Within a Month</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Session Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Session Type
              </label>
              <div className="relative">
                <select
                  value={filters.sessionType}
                  onChange={(e) => setFilters({ sessionType: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="any">Any Type</option>
                  <option value="1v1">1-on-1 Individual</option>
                  <option value="group">Group Therapy</option>
                  <option value="couples">Couples Therapy</option>
                  <option value="family">Family Therapy</option>
                  <option value="creative">Creative Therapy</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Format */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Format
              </label>
              <div className="relative">
                <select
                  value={filters.format}
                  onChange={(e) => setFilters({ format: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="any">Any Format</option>
                  <option value="online">Online Only</option>
                  <option value="in-person">In-Person Only</option>
                  <option value="hybrid">Hybrid (Both)</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Struggle Type */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                What You're Struggling With
              </label>
              <div className="relative">
                <select
                  value={filters.struggleType}
                  onChange={(e) => setFilters({ struggleType: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="any">Any Specialty</option>
                  <option value="Anxiety">Anxiety</option>
                  <option value="Depression">Depression</option>
                  <option value="Trauma">Trauma</option>
                  <option value="Relationship">Relationship Issues</option>
                  <option value="Work Stress">Work Stress</option>
                  <option value="LGBTQ+">LGBTQ+ Support</option>
                  <option value="Grief">Grief & Loss</option>
                  <option value="Identity">Identity Exploration</option>
                  <option value="PTSD">PTSD</option>
                  <option value="Self-Expression">Self-Expression</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Therapist Gender */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Therapist Gender Preference
              </label>
              <div className="relative">
                <select
                  value={filters.therapistGender}
                  onChange={(e) => setFilters({ therapistGender: e.target.value })}
                  className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sage-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="any">No Preference</option>
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="non-binary">Non-Binary</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            </div>

            {/* Budget Range */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                Budget Range: ${filters.budgetRange[0]} - ${filters.budgetRange[1]}
              </label>
              <input
                type="range"
                min="0"
                max="300"
                step="10"
                value={filters.budgetRange[1]}
                onChange={(e) =>
                  setFilters({
                    budgetRange: [filters.budgetRange[0], parseInt(e.target.value)],
                  })
                }
                className="w-full accent-sage-600"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
