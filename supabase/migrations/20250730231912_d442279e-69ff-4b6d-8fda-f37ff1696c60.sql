-- Create private bucket for user audio files
INSERT INTO storage.buckets (id, name, public) 
VALUES ('user-audio', 'user-audio', false)
ON CONFLICT (id) DO NOTHING;

-- Create table for user audio-surah mappings
CREATE TABLE IF NOT EXISTS public.user_surah_audio (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  surah_id INTEGER NOT NULL REFERENCES public.surahs(id),
  audio_file_path TEXT NOT NULL,
  audio_file_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, surah_id)
);

-- Enable RLS on user_surah_audio
ALTER TABLE public.user_surah_audio ENABLE ROW LEVEL SECURITY;

-- Create policies for user_surah_audio
CREATE POLICY "Users can view their own audio mappings" 
ON public.user_surah_audio 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own audio mappings" 
ON public.user_surah_audio 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own audio mappings" 
ON public.user_surah_audio 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own audio mappings" 
ON public.user_surah_audio 
FOR DELETE 
USING (auth.uid() = user_id);