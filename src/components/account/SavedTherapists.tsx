import React from 'react';
import { Heart, MapPin, Star, Calendar, Trash2 } from 'lucide-react';
import { useUserStore } from '../../store/userStore';

export const SavedTherapists: React.FC = () => {
  const savedTherapists = useUserStore((state) => state.savedTherapists);
  const removeSavedTherapist = useUserStore((state) => state.removeSavedTherapist);

  if (savedTherapists.length === 0) {
    return (
      <div className="soft-card p-12 text-center">
        <Heart className="w-16 h-16 text-blush-300 mx-auto mb-4" />
        <h3 className="text-2xl font-serif font-semibold text-gray-800 mb-2">
          No Saved Therapists
        </h3>
        <p className="text-gray-600 mb-6">
          Save your favorite therapists to easily book sessions later
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
          Saved Therapists
        </h2>
        <p className="text-gray-600">
          {savedTherapists.length} therapist{savedTherapists.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {savedTherapists.map((therapist) => (
          <div
            key={therapist.therapistId}
            className="soft-card p-6 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-serif font-semibold text-gray-800 mb-1">
                  {therapist.therapistName}
                </h3>
                <p className="text-gray-600 text-sm">{therapist.specialization}</p>
              </div>
              <button
                onClick={() => {
                  if (confirm('Remove this therapist from your saved list?')) {
                    removeSavedTherapist(therapist.therapistId);
                  }
                }}
                className="p-2 rounded-full hover:bg-blush-100 text-blush-600 transition-colors"
                aria-label="Remove from saved"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-semibold">{therapist.rating}</span>
                <span className="text-gray-500">({therapist.reviewCount} reviews)</span>
              </div>

              {therapist.location && (
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                  <MapPin className="w-4 h-4 text-sage-500 flex-shrink-0 mt-0.5" />
                  <span>{therapist.location}</span>
                </div>
              )}

              <div className="text-sm text-gray-600">
                Saved on {new Date(therapist.savedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>

            <button className="btn-warm w-full flex items-center justify-center gap-2">
              <Calendar className="w-5 h-5" />
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
