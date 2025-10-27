import { create } from 'zustand';
import { TherapyClinic } from '../types';
import { therapyClinics } from '../data/clinicsData';

interface TherapyFilters {
  availability: string;
  sessionType: string;
  format: string;
  therapyType: string;
  budgetRange: [number, number];
  struggleType: string;
  therapistGender: string;
}

interface TherapyStore {
  clinics: TherapyClinic[];
  filteredClinics: TherapyClinic[];
  filters: TherapyFilters;
  initializeClinics: () => void;
  setFilters: (filters: Partial<TherapyFilters>) => void;
  resetFilters: () => void;
  applyFilters: () => void;
}

const defaultFilters: TherapyFilters = {
  availability: 'any',
  sessionType: 'any',
  format: 'any',
  therapyType: 'any',
  budgetRange: [0, 300],
  struggleType: 'any',
  therapistGender: 'any',
};

export const useTherapyStore = create<TherapyStore>((set, get) => ({
  clinics: [],
  filteredClinics: [],
  filters: defaultFilters,

  initializeClinics: () => {
    console.log('🏥 Initializing clinics:', therapyClinics.length);
    set({ 
      clinics: therapyClinics,
      filteredClinics: therapyClinics 
    });
  },

  setFilters: (newFilters) => {
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    }));
    get().applyFilters();
  },

  resetFilters: () => {
    set({ filters: defaultFilters });
    get().applyFilters();
  },

  applyFilters: () => {
    const { clinics, filters } = get();
    
    let filtered = [...clinics];

    // Availability filter
    if (filters.availability !== 'any') {
      filtered = filtered.filter(
        (clinic) => clinic.availability === filters.availability
      );
    }

    // Session type filter
    if (filters.sessionType !== 'any') {
      filtered = filtered.filter((clinic) =>
        clinic.sessionTypes.includes(filters.sessionType)
      );
    }

    // Format filter
    if (filters.format !== 'any') {
      filtered = filtered.filter((clinic) =>
        clinic.formats.includes(filters.format)
      );
    }

    // Therapy type filter
    if (filters.therapyType !== 'any') {
      filtered = filtered.filter((clinic) =>
        clinic.therapyTypes.some(type => 
          type.toLowerCase().includes(filters.therapyType.toLowerCase())
        )
      );
    }

    // Budget range filter
    filtered = filtered.filter(
      (clinic) =>
        clinic.budgetRange.min >= filters.budgetRange[0] &&
        clinic.budgetRange.max <= filters.budgetRange[1]
    );

    // Struggle type filter
    if (filters.struggleType !== 'any') {
      filtered = filtered.filter((clinic) =>
        clinic.struggleTypes.includes(filters.struggleType)
      );
    }

    // Therapist gender filter
    if (filters.therapistGender !== 'any') {
      filtered = filtered.filter((clinic) =>
        clinic.therapistGender.includes(filters.therapistGender)
      );
    }

    console.log('🔍 Filtered clinics:', filtered.length);
    set({ filteredClinics: filtered });
  },
}));
