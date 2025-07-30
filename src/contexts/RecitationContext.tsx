import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecitationContextType {
  isReciting: boolean;
  currentSurah: number;
  currentVerse: number;
  isPlaying: boolean;
  startRecitation: (surah: number, verse?: number) => Promise<void>;
  pauseRecitation: () => void;
  resumeRecitation: () => void;
  stopRecitation: () => void;
  nextVerse: () => void;
  previousVerse: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

const RecitationContext = createContext<RecitationContextType | undefined>(undefined);

interface RecitationProviderProps {
  children: ReactNode;
}

export const RecitationProvider = ({ children }: RecitationProviderProps) => {
  const [isReciting, setIsReciting] = useState(false);
  const [currentSurah, setCurrentSurah] = useState(1);
  const [currentVerse, setCurrentVerse] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [userMappings, setUserMappings] = useState<Record<number, string>>({});
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    loadUserMappings();
    audioRef.current = new Audio();
    
    const handleAudioEnd = () => {
      nextVerse();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
      audioRef.current.volume = volume;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []);

  const loadUserMappings = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: mappings, error } = await supabase
      .from('user_surah_audio')
      .select('surah_id, audio_file_path');

    if (error) {
      console.error('Error loading user mappings:', error);
      return;
    }

    const mappingDict: Record<number, string> = {};
    mappings?.forEach(mapping => {
      mappingDict[mapping.surah_id] = mapping.audio_file_path;
    });

    setUserMappings(mappingDict);
  };

  const getAudioUrl = async (surahId: number): Promise<string | null> => {
    // First check if user has a custom mapping for this surah
    if (userMappings[surahId]) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = supabase.storage
          .from('user-audio')
          .getPublicUrl(userMappings[surahId]);
        
        return data.publicUrl;
      }
    }

    // Fallback to default recitations from public bucket
    const { data: recitations, error } = await supabase
      .from('recitations')
      .select('audio_file_path')
      .eq('surah_id', surahId)
      .limit(1);

    if (error || !recitations || recitations.length === 0) {
      console.error('No recitation found for surah:', surahId);
      return null;
    }

    const { data } = supabase.storage
      .from('quran-audio')
      .getPublicUrl(recitations[0].audio_file_path);

    return data.publicUrl;
  };

  const startRecitation = async (surah: number, verse: number = 1) => {
    try {
      const audioUrl = await getAudioUrl(surah);
      
      if (!audioUrl) {
        console.error('No audio URL found for surah:', surah);
        return;
      }

      setCurrentSurah(surah);
      setCurrentVerse(verse);
      setIsReciting(true);
      setIsPlaying(true);
      
      if (audioRef.current) {
        audioRef.current.src = audioUrl;
        audioRef.current.volume = volume;
        
        audioRef.current.addEventListener('error', (e) => {
          console.error('Audio error:', e);
          setIsPlaying(false);
          setIsReciting(false);
        });

        await audioRef.current.play();
      }
    } catch (error) {
      console.error('Error starting recitation:', error);
      setIsPlaying(false);
      setIsReciting(false);
    }
  };

  const pauseRecitation = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeRecitation = () => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(() => {
        console.log('Could not resume audio');
      });
    }
  };

  const stopRecitation = () => {
    setIsReciting(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextVerse = () => {
    // Simple implementation - in real app, you'd need surah length data
    setCurrentVerse(prev => prev + 1);
    if (isPlaying) {
      startRecitation(currentSurah, currentVerse + 1);
    }
  };

  const previousVerse = () => {
    if (currentVerse > 1) {
      setCurrentVerse(prev => prev - 1);
      if (isPlaying) {
        startRecitation(currentSurah, currentVerse - 1);
      }
    }
  };

  const setVolume = (newVolume: number) => {
    setVolumeState(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  // Expose method to refresh user mappings when they change
  const refreshMappings = () => {
    loadUserMappings();
  };

  return (
    <RecitationContext.Provider value={{
      isReciting,
      currentSurah,
      currentVerse,
      isPlaying,
      startRecitation,
      pauseRecitation,
      resumeRecitation,
      stopRecitation,
      nextVerse,
      previousVerse,
      volume,
      setVolume,
    }}>
      {children}
    </RecitationContext.Provider>
  );
};

export const useRecitation = () => {
  const context = useContext(RecitationContext);
  if (context === undefined) {
    throw new Error('useRecitation must be used within a RecitationProvider');
  }
  return context;
};