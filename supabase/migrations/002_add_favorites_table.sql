/*
  # Add Favorites Table

  1. New Tables
    - favorites: Store user's favorite therapy clinics
  
  2. Security
    - Enable RLS on favorites table
    - Add policies for authenticated users to manage their favorites
*/

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  clinic_id text NOT NULL,
  clinic_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, clinic_id)
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own favorites"
  ON favorites FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON favorites FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON favorites FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS favorites_user_id_idx 
  ON favorites(user_id);

CREATE INDEX IF NOT EXISTS favorites_clinic_id_idx 
  ON favorites(clinic_id);
