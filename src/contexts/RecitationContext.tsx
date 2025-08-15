import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface RecitationContextType {
  isReciting: boolean;
  currentSurah: number;
  currentVerse: number;
  isPlaying: boolean;
  startRecitation: (surah: number, verse?: number) => void;
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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const startRecitation = (surah: number, verse: number = 1) => {
    setCurrentSurah(surah);
    setCurrentVerse(verse);
    setIsReciting(true);
    setIsPlaying(true);
    
    // Using Abdul Basit recitation - verse by verse audio
    const audioPath = `https://cdn.islamic.network/quran/audio/ayah/ar.abdulbasitmurattal/${surah}:${verse}.mp3`;
    
    if (audioRef.current) {
      audioRef.current.src = audioPath;
      audioRef.current.play().catch(() => {
        console.log('Audio file not found:', audioPath);
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

  useEffect(() => {
    audioRef.current = new Audio();
    
    const handleAudioEnd = () => {
      nextVerse();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnd);
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnd);
      }
    };
  }, []);

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