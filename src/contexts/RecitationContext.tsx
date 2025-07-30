import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface RecitationContextType {
  isReciting: boolean;
  currentSurah: number;
  currentVerse: number;
  isPlaying: boolean;
  startRecitation: (surah: number, verse?: number, audioPath?: string) => void;
  pauseRecitation: () => void;
  resumeRecitation: () => void;
  stopRecitation: () => void;
  nextVerse: () => void;
  previousVerse: () => void;
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
  const [maxVerses, setMaxVerses] = useState(7); // Default to Al-Fatihah
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudioUrl = (surahId: number, verseNumber: number) => {
    // Construct the path for audio files in Supabase storage
    // Expected structure: quran-audio/mishary/surah_001/verse_001.mp3
    const surahStr = surahId.toString().padStart(3, '0');
    const verseStr = verseNumber.toString().padStart(3, '0');
    const filePath = `mishary/surah_${surahStr}/verse_${verseStr}.mp3`;
    
    const { data } = supabase.storage
      .from('quran-audio')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  };

  const fetchSurahData = async (surahId: number) => {
    try {
      const { data, error } = await supabase
        .from('surahs')
        .select('verses_count')
        .eq('id', surahId)
        .single();

      if (error) throw error;
      return data?.verses_count || 7;
    } catch (error) {
      console.error('Error fetching surah data:', error);
      return 7; // Default to Al-Fatihah verse count
    }
  };

  const startRecitation = async (surah: number, verse: number = 1, audioPath?: string) => {
    setCurrentSurah(surah);
    setCurrentVerse(verse);
    setIsReciting(true);
    setIsPlaying(true);
    
    // Fetch max verses for this surah
    const verses = await fetchSurahData(surah);
    setMaxVerses(verses);
    
    let audioUrl;
    if (audioPath) {
      // Use direct audio file path from storage
      const { data } = supabase.storage
        .from('quran-audio')
        .getPublicUrl(audioPath);
      audioUrl = data.publicUrl;
    } else {
      // Use default structure
      audioUrl = getAudioUrl(surah, verse);
    }
    
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play().catch((error) => {
        console.log('Audio file not found:', audioUrl, error);
      });
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

  const nextVerse = async () => {
    if (currentVerse < maxVerses) {
      const nextVerseNum = currentVerse + 1;
      setCurrentVerse(nextVerseNum);
      if (isPlaying) {
        await startRecitation(currentSurah, nextVerseNum);
      }
    } else {
      // Move to next surah if available
      if (currentSurah < 30) { // We have 30 surahs in our database
        await startRecitation(currentSurah + 1, 1);
      } else {
        stopRecitation();
      }
    }
  };

  const previousVerse = async () => {
    if (currentVerse > 1) {
      const prevVerseNum = currentVerse - 1;
      setCurrentVerse(prevVerseNum);
      if (isPlaying) {
        await startRecitation(currentSurah, prevVerseNum);
      }
    } else if (currentSurah > 1) {
      // Move to previous surah
      const prevSurah = currentSurah - 1;
      const prevSurahVerses = await fetchSurahData(prevSurah);
      await startRecitation(prevSurah, prevSurahVerses);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleAudioEnd = () => {
      nextVerse();
    };

    const handleAudioError = () => {
      console.log('Audio error - moving to next verse');
      nextVerse();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
      audioRef.current.addEventListener('error', handleAudioError);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
        audioRef.current.removeEventListener('error', handleAudioError);
      }
    };
  }, [currentSurah, currentVerse, maxVerses]);

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
      previousVerse
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