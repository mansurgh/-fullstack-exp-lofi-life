-- Create storage bucket for Quran audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('quran-audio', 'quran-audio', true);

-- Create policy to allow public access to read audio files
CREATE POLICY "Public Access to Quran Audio" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'quran-audio');

-- Create policy to allow authenticated users to upload audio files
CREATE POLICY "Authenticated users can upload Quran audio" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'quran-audio' AND auth.role() = 'authenticated');

-- Create table for surah metadata
CREATE TABLE public.surahs (
  id INTEGER PRIMARY KEY,
  name_arabic TEXT NOT NULL,
  name_english TEXT NOT NULL,
  verses_count INTEGER NOT NULL,
  revelation_place TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on surahs table
ALTER TABLE public.surahs ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to surahs
CREATE POLICY "Public read access to surahs" 
ON public.surahs 
FOR SELECT 
USING (true);

-- Insert first 30 surahs with safe names
INSERT INTO public.surahs (id, name_arabic, name_english, verses_count, revelation_place) VALUES
(1, 'Al-Fatihah', 'Al-Fatihah', 7, 'Mecca'),
(2, 'Al-Baqarah', 'Al-Baqarah', 286, 'Medina'),
(3, 'Aal-E-Imran', 'Aal-E-Imran', 200, 'Medina'),
(4, 'An-Nisa', 'An-Nisa', 176, 'Medina'),
(5, 'Al-Maidah', 'Al-Maidah', 120, 'Medina'),
(6, 'Al-Anam', 'Al-Anam', 165, 'Mecca'),
(7, 'Al-Araf', 'Al-Araf', 206, 'Mecca'),
(8, 'Al-Anfal', 'Al-Anfal', 75, 'Medina'),
(9, 'At-Tawbah', 'At-Tawbah', 129, 'Medina'),
(10, 'Yunus', 'Yunus', 109, 'Mecca'),
(11, 'Hud', 'Hud', 123, 'Mecca'),
(12, 'Yusuf', 'Yusuf', 111, 'Mecca'),
(13, 'Ar-Rad', 'Ar-Rad', 43, 'Medina'),
(14, 'Ibrahim', 'Ibrahim', 52, 'Mecca'),
(15, 'Al-Hijr', 'Al-Hijr', 99, 'Mecca'),
(16, 'An-Nahl', 'An-Nahl', 128, 'Mecca'),
(17, 'Al-Isra', 'Al-Isra', 111, 'Mecca'),
(18, 'Al-Kahf', 'Al-Kahf', 110, 'Mecca'),
(19, 'Maryam', 'Maryam', 98, 'Mecca'),
(20, 'Taha', 'Taha', 135, 'Mecca'),
(21, 'Al-Anbya', 'Al-Anbya', 112, 'Mecca'),
(22, 'Al-Hajj', 'Al-Hajj', 78, 'Medina'),
(23, 'Al-Muminun', 'Al-Muminun', 118, 'Mecca'),
(24, 'An-Nur', 'An-Nur', 64, 'Medina'),
(25, 'Al-Furqan', 'Al-Furqan', 77, 'Mecca'),
(26, 'Ash-Shuara', 'Ash-Shuara', 227, 'Mecca'),
(27, 'An-Naml', 'An-Naml', 93, 'Mecca'),
(28, 'Al-Qasas', 'Al-Qasas', 88, 'Mecca'),
(29, 'Al-Ankabut', 'Al-Ankabut', 69, 'Mecca'),
(30, 'Ar-Rum', 'Ar-Rum', 60, 'Mecca');

-- Create table for recitation metadata
CREATE TABLE public.recitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  surah_id INTEGER REFERENCES public.surahs(id),
  verse_number INTEGER NOT NULL,
  reciter_name TEXT NOT NULL DEFAULT 'Mishary Al-Afasy',
  audio_file_path TEXT NOT NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(surah_id, verse_number, reciter_name)
);

-- Enable RLS on recitations table
ALTER TABLE public.recitations ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to recitations
CREATE POLICY "Public read access to recitations" 
ON public.recitations 
FOR SELECT 
USING (true);