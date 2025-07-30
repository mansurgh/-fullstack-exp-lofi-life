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

-- Create policy to allow authenticated users to update audio files
CREATE POLICY "Authenticated users can update Quran audio" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'quran-audio' AND auth.role() = 'authenticated');

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

-- Insert the 114 surahs data
INSERT INTO public.surahs (id, name_arabic, name_english, verses_count, revelation_place) VALUES
(1, 'الفاتحة', 'Al-Fatihah', 7, 'Mecca'),
(2, 'البقرة', 'Al-Baqarah', 286, 'Medina'),
(3, 'آل عمران', 'Aal-E-Imran', 200, 'Medina'),
(4, 'النساء', 'An-Nisa', 176, 'Medina'),
(5, 'المائدة', 'Al-Ma\'idah', 120, 'Medina'),
(6, 'الأنعام', 'Al-An\'am', 165, 'Mecca'),
(7, 'الأعراف', 'Al-A\'raf', 206, 'Mecca'),
(8, 'الأنفال', 'Al-Anfal', 75, 'Medina'),
(9, 'التوبة', 'At-Tawbah', 129, 'Medina'),
(10, 'يونس', 'Yunus', 109, 'Mecca'),
(11, 'هود', 'Hud', 123, 'Mecca'),
(12, 'يوسف', 'Yusuf', 111, 'Mecca'),
(13, 'الرعد', 'Ar-Ra\'d', 43, 'Medina'),
(14, 'ابراهيم', 'Ibrahim', 52, 'Mecca'),
(15, 'الحجر', 'Al-Hijr', 99, 'Mecca'),
(16, 'النحل', 'An-Nahl', 128, 'Mecca'),
(17, 'الإسراء', 'Al-Isra', 111, 'Mecca'),
(18, 'الكهف', 'Al-Kahf', 110, 'Mecca'),
(19, 'مريم', 'Maryam', 98, 'Mecca'),
(20, 'طه', 'Taha', 135, 'Mecca'),
(21, 'الأنبياء', 'Al-Anbya', 112, 'Mecca'),
(22, 'الحج', 'Al-Hajj', 78, 'Medina'),
(23, 'المؤمنون', 'Al-Mu\'minun', 118, 'Mecca'),
(24, 'النور', 'An-Nur', 64, 'Medina'),
(25, 'الفرقان', 'Al-Furqan', 77, 'Mecca'),
(26, 'الشعراء', 'Ash-Shu\'ara', 227, 'Mecca'),
(27, 'النمل', 'An-Naml', 93, 'Mecca'),
(28, 'القصص', 'Al-Qasas', 88, 'Mecca'),
(29, 'العنكبوت', 'Al-\'Ankabut', 69, 'Mecca'),
(30, 'الروم', 'Ar-Rum', 60, 'Mecca');

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