
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for student status
CREATE TYPE public.student_status AS ENUM ('active', 'inactive');

-- Create students table
CREATE TABLE public.students (
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
CREATE TABLE public.contests (
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
CREATE TABLE public.problems (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sync_logs table
CREATE TABLE public.sync_logs (
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
CREATE TABLE public.app_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  setting_key TEXT UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default cron settings
INSERT INTO public.app_settings (setting_key, setting_value) VALUES 
('cron_schedule', '{"hour": 2, "minute": 0, "frequency": "daily"}'),
('last_global_sync', '{"timestamp": null}');

-- Enable Row Level Security
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (allowing all operations for now - adjust based on your auth requirements)
CREATE POLICY "Allow all operations on students" ON public.students FOR ALL USING (true);
CREATE POLICY "Allow all operations on contests" ON public.contests FOR ALL USING (true);
CREATE POLICY "Allow all operations on problems" ON public.problems FOR ALL USING (true);
CREATE POLICY "Allow all operations on sync_logs" ON public.sync_logs FOR ALL USING (true);
CREATE POLICY "Allow all operations on app_settings" ON public.app_settings FOR ALL USING (true);

-- Create indexes for better performance
CREATE INDEX idx_students_codeforces_handle ON public.students(codeforces_handle);
CREATE INDEX idx_contests_student_id ON public.contests(student_id);
CREATE INDEX idx_contests_contest_date ON public.contests(contest_date);
CREATE INDEX idx_problems_student_id ON public.problems(student_id);
CREATE INDEX idx_problems_solved_at ON public.problems(solved_at);
CREATE INDEX idx_sync_logs_student_id ON public.sync_logs(student_id);
CREATE INDEX idx_sync_logs_created_at ON public.sync_logs(created_at);

-- Create function to update last_updated timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for students table
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students 
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
    AND (s.last_submission_date IS NULL OR s.last_submission_date < NOW() - INTERVAL '%d days', days_threshold)
  ORDER BY s.last_submission_date ASC NULLS FIRST;
END;
$$;

-- Enable realtime for tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.students;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contests;
ALTER PUBLICATION supabase_realtime ADD TABLE public.problems;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sync_logs;
