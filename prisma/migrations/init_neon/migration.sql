-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for student status (if needed, though we're using boolean in Prisma)
-- CREATE TYPE public.student_status AS ENUM ('active', 'inactive');

-- Create students table
CREATE TABLE IF NOT EXISTS public.students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone_number TEXT,
  codeforces_handle TEXT UNIQUE NOT NULL,
  current_rating INTEGER DEFAULT 0,
  max_rating INTEGER DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  reminder_count INTEGER DEFAULT 0,
  email_enabled BOOLEAN DEFAULT true,
  last_submission_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create contests table
CREATE TABLE IF NOT EXISTS public.contests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  contest_id INTEGER NOT NULL,
  contest_name TEXT NOT NULL,
  contest_date TIMESTAMP WITH TIME ZONE NOT NULL,
  rating INTEGER,
  rating_change INTEGER,
  rank INTEGER,
  problems_solved INTEGER DEFAULT 0,
  total_problems INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create problems table
CREATE TABLE IF NOT EXISTS public.problems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  problem_id TEXT NOT NULL,
  problem_name TEXT NOT NULL,
  contest_id INTEGER,
  problem_index TEXT,
  rating INTEGER,
  tags TEXT[],
  solved_at TIMESTAMP WITH TIME ZONE NOT NULL,
  verdict TEXT,
  programming_language TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sync_logs table
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
  sync_type TEXT NOT NULL, -- 'scheduled', 'manual', 'handle_update'
  status TEXT NOT NULL, -- 'success', 'error', 'partial'
  message TEXT,
  contests_fetched INTEGER DEFAULT 0,
  problems_fetched INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create app_settings table for cron configuration
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  full_name TEXT,
  email TEXT,
  username TEXT UNIQUE,
  first_name TEXT,
  last_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_codeforces_handle ON public.students(codeforces_handle);
CREATE INDEX IF NOT EXISTS idx_contests_student_id ON public.contests(student_id);
CREATE INDEX IF NOT EXISTS idx_contests_contest_date ON public.contests(contest_date);
CREATE INDEX IF NOT EXISTS idx_problems_student_id ON public.problems(student_id);
CREATE INDEX IF NOT EXISTS idx_problems_solved_at ON public.problems(solved_at);
CREATE INDEX IF NOT EXISTS idx_sync_logs_student_id ON public.sync_logs(student_id);
CREATE INDEX IF NOT EXISTS idx_sync_logs_created_at ON public.sync_logs(created_at);

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for students table
DROP TRIGGER IF EXISTS update_students_updated_at ON public.students;
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for profiles table
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles 
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function to detect inactive students
CREATE OR REPLACE FUNCTION public.get_inactive_students(days_threshold INTEGER DEFAULT 7)
RETURNS TABLE (
  student_id UUID,
  name TEXT,
  email TEXT,
  codeforces_handle TEXT,
  last_submission_date TIMESTAMP WITH TIME ZONE,
  days_since_last_submission INTEGER
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    s.id,
    s.name,
    s.email,
    s.codeforces_handle,
    s.last_submission_date,
    EXTRACT(DAY FROM NOW() - s.last_submission_date)::INTEGER as days_since_last_submission
  FROM public.students s
  WHERE s.email_enabled = true
    AND s.is_active = true
    AND (s.last_submission_date IS NULL OR s.last_submission_date < NOW() - (days_threshold || ' days')::INTERVAL)
  ORDER BY s.last_submission_date ASC NULLS FIRST;
END;
$$;

-- Insert default cron settings (if they don't exist)
INSERT INTO public.app_settings (setting_key, setting_value) 
VALUES 
  ('cron_schedule', '{"hour": 2, "minute": 0, "frequency": "daily"}'),
  ('last_global_sync', '{"timestamp": null}')
ON CONFLICT (setting_key) DO NOTHING;

