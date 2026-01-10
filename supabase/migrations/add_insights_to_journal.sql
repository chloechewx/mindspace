/*
  # Add AI Insights to Journal Entries

  1. Changes
    - Add `insights` column to `journal_entries` table to store AI-generated insights
    - Column is optional (nullable) to support existing entries
    - Uses text type for flexible content length

  2. Notes
    - Existing entries will have NULL insights
    - New entries will populate insights after AI generation
*/

ALTER TABLE journal_entries 
ADD COLUMN IF NOT EXISTS insights text;
