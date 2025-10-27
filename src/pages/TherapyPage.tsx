import React, { useEffect } from 'react';
import { ClinicCard } from '../components/therapy/ClinicCard';
import { TherapyFilters } from '../components/therapy/TherapyFilters';
import { useTherapyStore } from '../store/therapyStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { useUserStore } from '../store/userStore';

export const TherapyPage: React.FC = () => {
  const { filteredClinics, initializeClinics } = useTherapyStore();
  const { loadFavorites, clearFavorites } = useFavoritesStore();
  const { user, isAuthenticated } = useUserStore();

  useEffect(() => {
    console.log('🏥 TherapyPage mounted');
    // Initialize clinics from data
    initializeClinics();
  }, [initializeClinics]);

  useEffect(() => {
    console.log('🔐 Auth state changed:', { isAuthenticated, userId: user?.id });
    
    // Load favorites when user is authenticated
    if (isAuthenticated && user) {
      console.log('👤 Loading favorites for user:', user.id);
      loadFavorites(user.id);
    } else {
      console.log('🧹 User not authenticated, clearing favorites');
      clearFavorites();
    }
  }, [isAuthenticated, user?.id, loadFavorites, clearFavorites]);

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
