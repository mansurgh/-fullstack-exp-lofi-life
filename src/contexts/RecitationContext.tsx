import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

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
  const canPlayRef = useRef<(() => void) | null>(null);
  const errorRef = useRef<((e: Event) => void) | null>(null);

  const startRecitation = useCallback((surah: number, verse: number = 1) => {
    setCurrentSurah(surah);
    setCurrentVerse(verse);
    setIsReciting(true);
    setIsPlaying(true);

    // Локально → CDN
    const audioSources = [
      `/quran-audio/basit/${surah}/${verse}.mp3`,
      `https://cdn.islamic.network/quran/audio/ayah/ar.abdulbasitmurattal/${surah}:${verse}.mp3`,
      `https://server8.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${verse.toString().padStart(3, '0')}.mp3`,
      `https://www.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${verse.toString().padStart(3, '0')}.mp3`
    ];

    if (audioRef.current) {
      const audio = audioRef.current;

      // Remove previous listeners properly
      if (canPlayRef.current) audio.removeEventListener('canplay', canPlayRef.current);
      if (errorRef.current) audio.removeEventListener('error', errorRef.current);

      audio.src = audioSources[0];

      const handleCanPlay = () => {
        audio.play().then(() => {
        }).catch(() => {
          if (audioSources[1]) {
            audio.src = audioSources[1];
            audio.play().catch(() => {
              setIsPlaying(false);
            });
          } else {
            setIsPlaying(false);
          }
        });
      };

      const handleError = () => {
        setIsPlaying(false);
        if (audioSources[1] && audioRef.current) {
          audioRef.current.src = audioSources[1];
          audioRef.current.play().catch(() => { });
        }
      };

      canPlayRef.current = handleCanPlay;
      errorRef.current = handleError;

      audio.addEventListener('canplay', handleCanPlay);
      audio.addEventListener('error', handleError);
      audio.load();
    } else {
      setIsPlaying(false);
    }
  }, []);

  const pauseRecitation = useCallback(() => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  }, []);

  const resumeRecitation = useCallback(() => {
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Could not resume audio:', error);
        setIsPlaying(false);
      });
    }
  }, []);

  const stopRecitation = useCallback(() => {
    setIsReciting(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const nextVerse = useCallback(() => {
    setCurrentVerse(prevVerse => {
      const nextVerseNum = prevVerse + 1;
      if (nextVerseNum <= 7) { // Для суры Аль-Фатиха (7 аятов)
        return nextVerseNum;
      } else {
        setIsPlaying(false);
        setIsReciting(false);
        return prevVerse;
      }
    });
  }, []);

  const previousVerse = useCallback(() => {
    setCurrentVerse(prev => {
      if (prev > 1) {
        return prev - 1;
      }
      return prev;
    });
  }, []);

  useEffect(() => {
    audioRef.current = new Audio();

    const handleAudioEnd = () => {
      // Автоматически переходим к следующему аяту
      setCurrentVerse(prevVerse => {
        const nextVerseNum = prevVerse + 1;
        if (nextVerseNum <= 7) {
          return nextVerseNum;
        } else {
          setIsPlaying(false);
          setIsReciting(false);
          return prevVerse;
        }
      });
    };

    const handleAudioError = () => {
      setIsPlaying(false);
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
  }, []);

  // Автоматически запускаем следующий аят при изменении currentVerse
  useEffect(() => {
    if (isReciting && isPlaying && currentVerse > 1) {
      // Небольшая задержка для плавного перехода
      const timer = setTimeout(() => {
        startRecitation(currentSurah, currentVerse);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentVerse, isReciting, isPlaying, currentSurah]);

  return (
    <RecitationContext.Provider value={useMemo(() => ({
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
    }), [isReciting, currentSurah, currentVerse, isPlaying, startRecitation, pauseRecitation, resumeRecitation, stopRecitation, nextVerse, previousVerse])}>
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