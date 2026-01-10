/*
  # Create event_bookings table for community event management

  1. New Tables
    - `event_bookings`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `event_id` (text)
      - `event_name` (text)
      - `event_date` (date)
      - `event_time` (text)
      - `location` (text)
      - `organizer` (text)
      - `status` (text, default 'confirmed')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `event_bookings` table
    - Add policies for authenticated users to manage their own event bookings
    
  3. Indexes
    - Index on `user_id` for faster user queries
    - Index on `event_date` for date-based queries
    - Index on `event_id` for event-based queries
    - Composite index on `user_id` and `event_date` for dashboard queries
*/

-- Create event_bookings table
CREATE TABLE IF NOT EXISTS event_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  event_id text NOT NULL,
  event_name text NOT NULL,
  event_date date NOT NULL,
  event_time text NOT NULL,
  location text NOT NULL,
  organizer text NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')) NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  updated_at timestamptz DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE event_bookings ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own event bookings
CREATE POLICY "Users can read own event bookings"
  ON event_bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own event bookings
CREATE POLICY "Users can create own event bookings"
  ON event_bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own event bookings
CREATE POLICY "Users can update own event bookings"
  ON event_bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own event bookings
CREATE POLICY "Users can delete own event bookings"
  ON event_bookings
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_event_bookings_user_id ON event_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_event_bookings_event_date ON event_bookings(event_date DESC);
CREATE INDEX IF NOT EXISTS idx_event_bookings_event_id ON event_bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_event_bookings_status ON event_bookings(status);
CREATE INDEX IF NOT EXISTS idx_event_bookings_user_date ON event_bookings(user_id, event_date DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_event_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
CREATE TRIGGER event_bookings_updated_at
  BEFORE UPDATE ON event_bookings
  FOR EACH ROW
  EXECUTE FUNCTION update_event_bookings_updated_at();

-- Add comment to table for documentation
COMMENT ON TABLE event_bookings IS 'Stores user bookings for community events';
COMMENT ON COLUMN event_bookings.status IS 'Booking status: confirmed or cancelled';
