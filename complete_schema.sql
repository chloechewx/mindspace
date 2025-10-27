-- ============================================================================
-- MINDSPACE COMPLETE DATABASE SCHEMA
-- ============================================================================
-- Copy this ENTIRE file and paste it into Supabase SQL Editor
-- This will create a fresh, working database with all tables and security
-- ============================================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- STEP 1: CLEAN SLATE (Drop everything)
-- ============================================================================

DROP TABLE IF EXISTS public.favorites CASCADE;
DROP TABLE IF EXISTS public.bookings CASCADE;
DROP TABLE IF EXISTS public.therapists CASCADE;
DROP TABLE IF EXISTS public.diary_entries CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- ============================================================================
-- STEP 2: CREATE PROFILES TABLE
-- ============================================================================

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  avatar_url text,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies - SUPER PERMISSIVE
CREATE POLICY "profiles_insert_policy"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "profiles_select_policy"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "profiles_update_policy"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_delete_policy"
  ON public.profiles
  FOR DELETE
  TO authenticated
  USING (auth.uid() = id);

-- Index
CREATE INDEX idx_profiles_email ON public.profiles(email);

-- ============================================================================
-- STEP 3: CREATE DIARY ENTRIES TABLE
-- ============================================================================

CREATE TABLE public.diary_entries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  mood integer NOT NULL CHECK (mood >= 1 AND mood <= 5),
  gratitude text DEFAULT '' NOT NULL,
  intentions text DEFAULT '' NOT NULL,
  thoughts text DEFAULT '' NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE public.diary_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "diary_entries_insert_policy"
  ON public.diary_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "diary_entries_select_policy"
  ON public.diary_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "diary_entries_update_policy"
  ON public.diary_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "diary_entries_delete_policy"
  ON public.diary_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_diary_entries_user_id ON public.diary_entries(user_id);
CREATE INDEX idx_diary_entries_date ON public.diary_entries(date DESC);
CREATE INDEX idx_diary_entries_user_date ON public.diary_entries(user_id, date DESC);

-- ============================================================================
-- STEP 4: CREATE THERAPISTS TABLE
-- ============================================================================

CREATE TABLE public.therapists (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  specialty text NOT NULL,
  location text NOT NULL,
  rating numeric(2,1) CHECK (rating >= 0 AND rating <= 5) NOT NULL,
  image_url text NOT NULL,
  description text DEFAULT '' NOT NULL,
  available_slots jsonb DEFAULT '[]'::jsonb NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.therapists ENABLE ROW LEVEL SECURITY;

-- RLS Policy - Public read
CREATE POLICY "therapists_select_policy"
  ON public.therapists
  FOR SELECT
  TO authenticated
  USING (true);

-- Indexes
CREATE INDEX idx_therapists_specialty ON public.therapists(specialty);
CREATE INDEX idx_therapists_location ON public.therapists(location);
CREATE INDEX idx_therapists_rating ON public.therapists(rating DESC);

-- ============================================================================
-- STEP 5: CREATE BOOKINGS TABLE
-- ============================================================================

CREATE TABLE public.bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid REFERENCES public.therapists(id) ON DELETE CASCADE NOT NULL,
  therapist_name text NOT NULL,
  appointment_date date NOT NULL,
  appointment_time text NOT NULL,
  notes text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "bookings_insert_policy"
  ON public.bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_select_policy"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "bookings_update_policy"
  ON public.bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "bookings_delete_policy"
  ON public.bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX idx_bookings_therapist_id ON public.bookings(therapist_id);
CREATE INDEX idx_bookings_appointment_date ON public.bookings(appointment_date DESC);
CREATE INDEX idx_bookings_status ON public.bookings(status);
CREATE INDEX idx_bookings_user_date ON public.bookings(user_id, appointment_date DESC);

-- ============================================================================
-- STEP 6: CREATE FAVORITES TABLE
-- ============================================================================

CREATE TABLE public.favorites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  therapist_id uuid REFERENCES public.therapists(id) ON DELETE CASCADE NOT NULL,
  therapist_name text NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, therapist_id)
);

-- Enable RLS
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "favorites_insert_policy"
  ON public.favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_select_policy"
  ON public.favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "favorites_delete_policy"
  ON public.favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_favorites_therapist_id ON public.favorites(therapist_id);

-- ============================================================================
-- STEP 7: CREATE FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_diary_entries_updated_at
  BEFORE UPDATE ON public.diary_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_therapists_updated_at
  BEFORE UPDATE ON public.therapists
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- STEP 8: GRANT PERMISSIONS (CRITICAL!)
-- ============================================================================

-- Grant to authenticated users
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.diary_entries TO authenticated;
GRANT ALL ON public.therapists TO authenticated;
GRANT ALL ON public.bookings TO authenticated;
GRANT ALL ON public.favorites TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- Grant to service_role
GRANT ALL ON SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO service_role;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO service_role;

-- Grant to anon (for public reads)
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT ON public.therapists TO anon;

-- ============================================================================
-- STEP 9: INSERT SAMPLE DATA
-- ============================================================================

INSERT INTO public.therapists (name, specialty, location, rating, image_url, description) VALUES
  ('Dr. Sarah Chen', 'Anxiety & Depression', 'Downtown', 4.9, 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg', 'Specializing in cognitive behavioral therapy with 10+ years experience'),
  ('Dr. Michael Torres', 'Trauma & PTSD', 'Westside', 4.8, 'https://images.pexels.com/photos/5327580/pexels-photo-5327580.jpeg', 'Expert in trauma-focused therapy and EMDR techniques'),
  ('Dr. Emily Watson', 'Relationship Counseling', 'Eastside', 4.7, 'https://images.pexels.com/photos/5327656/pexels-photo-5327656.jpeg', 'Couples therapy and family counseling specialist'),
  ('Dr. James Park', 'Stress Management', 'Northside', 4.9, 'https://images.pexels.com/photos/5327647/pexels-photo-5327647.jpeg', 'Mindfulness-based stress reduction expert'),
  ('Dr. Lisa Anderson', 'Teen & Youth', 'Southside', 4.8, 'https://images.pexels.com/photos/5327921/pexels-photo-5327921.jpeg', 'Adolescent psychology and family therapy'),
  ('Dr. David Kim', 'Career Counseling', 'Downtown', 4.6, 'https://images.pexels.com/photos/5327574/pexels-photo-5327574.jpeg', 'Career transitions and workplace stress management')
ON CONFLICT DO NOTHING;

-- ============================================================================
-- STEP 10: VERIFICATION
-- ============================================================================

DO $$
DECLARE
  profile_count INTEGER;
  diary_count INTEGER;
  therapist_count INTEGER;
  booking_count INTEGER;
  favorite_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO profile_count FROM public.profiles;
  SELECT COUNT(*) INTO diary_count FROM public.diary_entries;
  SELECT COUNT(*) INTO therapist_count FROM public.therapists;
  SELECT COUNT(*) INTO booking_count FROM public.bookings;
  SELECT COUNT(*) INTO favorite_count FROM public.favorites;
  
  RAISE NOTICE '';
  RAISE NOTICE '========================================';
  RAISE NOTICE '   MINDSPACE DATABASE SETUP COMPLETE';
  RAISE NOTICE '========================================';
  RAISE NOTICE '';
  RAISE NOTICE 'Tables Created:';
  RAISE NOTICE '  ✓ profiles (% rows)', profile_count;
  RAISE NOTICE '  ✓ diary_entries (% rows)', diary_count;
  RAISE NOTICE '  ✓ therapists (% rows)', therapist_count;
  RAISE NOTICE '  ✓ bookings (% rows)', booking_count;
  RAISE NOTICE '  ✓ favorites (% rows)', favorite_count;
  RAISE NOTICE '';
  RAISE NOTICE 'Security:';
  RAISE NOTICE '  ✓ RLS enabled on all tables';
  RAISE NOTICE '  ✓ Permissive policies created';
  RAISE NOTICE '  ✓ Permissions granted';
  RAISE NOTICE '';
  RAISE NOTICE 'Ready to use! 🚀';
  RAISE NOTICE '';
END $$;
