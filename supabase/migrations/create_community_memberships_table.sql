/*
  # Create community memberships table

  1. New Tables
    - `community_memberships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `group_id` (text)
      - `group_name` (text)
      - `group_category` (text)
      - `group_image` (text)
      - `joined_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own memberships
*/

CREATE TABLE IF NOT EXISTS community_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  group_id text NOT NULL,
  group_name text NOT NULL,
  group_category text NOT NULL,
  group_image text NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, group_id)
);

-- Enable RLS
ALTER TABLE community_memberships ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own memberships
CREATE POLICY "Users can read own memberships"
  ON community_memberships
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own memberships
CREATE POLICY "Users can create own memberships"
  ON community_memberships
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own memberships
CREATE POLICY "Users can delete own memberships"
  ON community_memberships
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_community_memberships_user_id ON community_memberships(user_id);
CREATE INDEX idx_community_memberships_group_id ON community_memberships(group_id);
