/*
  # Create community members table

  1. New Tables
    - `community_members`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `community_id` (text)
      - `community_name` (text)
      - `joined_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users to manage their own memberships
*/

CREATE TABLE IF NOT EXISTS community_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  community_id text NOT NULL,
  community_name text NOT NULL,
  joined_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, community_id)
);

-- Enable RLS
ALTER TABLE community_members ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own memberships
CREATE POLICY "Users can read own memberships"
  ON community_members
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Users can create their own memberships
CREATE POLICY "Users can create own memberships"
  ON community_members
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own memberships
CREATE POLICY "Users can delete own memberships"
  ON community_members
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for faster queries
CREATE INDEX idx_community_members_user_id ON community_members(user_id);
CREATE INDEX idx_community_members_community_id ON community_members(community_id);
