export interface TherapyClinic {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  website: string;
  bookingUrl: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  therapyStyles: string[];
  sessionFormats: string[];
  comfortFeatures: string[];
  acceptsInsurance: boolean;
  languages: string[];
  priceRange: string;
  availability: string;
  sessionTypes: string[];
  formats: string[];
  animalTherapy: boolean;
  artTherapy: boolean;
  budgetRange: { min: number; max: number };
  struggleTypes: string[];
  therapistGender: string[];
  image: string;
  therapyTypes: string[];
}

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
  title: string;
  content: string;
  gratitude?: string;
  goals?: string;
  created_at: string;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  image: string;
  tags: string[];
  isPrivate: boolean;
}

export interface Booking {
  id: string;
  user_id: string;
  clinic_id: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  created_at: string;
}
