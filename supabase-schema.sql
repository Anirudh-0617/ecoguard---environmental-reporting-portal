-- EcoGuard Complaints Table
-- Run this in Supabase Dashboard > SQL Editor

-- Create the complaints table
CREATE TABLE IF NOT EXISTS complaints (
  id TEXT PRIMARY KEY,
  language TEXT NOT NULL,
  description TEXT NOT NULL,
  image_base64 TEXT,
  location_address TEXT,
  location_lat DOUBLE PRECISION,
  location_lng DOUBLE PRECISION,
  category TEXT,
  priority TEXT,
  status TEXT DEFAULT 'New',
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,
  rating INTEGER,
  feedback TEXT,
  ai_category TEXT,
  ai_priority TEXT,
  ai_department TEXT,
  ai_action_plan TEXT[],
  user_id UUID
);

-- Add user_id column if it doesn't exist (handle existing table case)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'complaints' AND column_name = 'user_id') THEN
        ALTER TABLE complaints ADD COLUMN user_id UUID;
    END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE complaints ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to allow re-creation (idempotent)
DROP POLICY IF EXISTS "Anyone can view complaints" ON complaints;
DROP POLICY IF EXISTS "Anyone can insert complaints" ON complaints;
DROP POLICY IF EXISTS "Anyone can update complaints" ON complaints;

-- Policy: Anyone can view complaints (for public tracking)
CREATE POLICY "Anyone can view complaints" 
  ON complaints 
  FOR SELECT 
  USING (true);

-- Policy: Anyone can insert complaints (citizens reporting)
CREATE POLICY "Anyone can insert complaints" 
  ON complaints 
  FOR INSERT 
  WITH CHECK (true);

-- Policy: Anyone can update complaints (officials updating status)
CREATE POLICY "Anyone can update complaints" 
  ON complaints 
  FOR UPDATE 
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_complaints_status ON complaints(status);
CREATE INDEX IF NOT EXISTS idx_complaints_created_at ON complaints(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_complaints_user_id ON complaints(user_id);
