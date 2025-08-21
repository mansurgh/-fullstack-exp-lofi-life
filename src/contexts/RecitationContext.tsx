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
    console.log('Starting recitation:', surah, verse);
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
    
    console.log('Trying audio sources:', audioSources);
    
    if (audioRef.current) {
      // Try first source
      audioRef.current.src = audioSources[0];
      
      // Add event listeners for better error handling
      const handleCanPlay = () => {
        console.log('Audio can play, starting...');
        audioRef.current?.play().then(() => {
          console.log('Audio started successfully');
        }).catch((error) => {
          console.error('Failed to play audio from first source:', error);
          // Try alternative source
          if (audioSources[1]) {
            console.log('Trying alternative source:', audioSources[1]);
            audioRef.current!.src = audioSources[1];
            audioRef.current!.play().then(() => {
              console.log('Alternative audio started successfully');
            }).catch((altError) => {
              console.error('Failed to play alternative audio:', altError);
              setIsPlaying(false);
              // Show user-friendly error message
              alert('Unable to play audio. Please check your internet connection or try again later.');
            });
          } else {
            setIsPlaying(false);
            alert('Unable to play audio. Please check your internet connection or try again later.');
          }
        });
      };
      
      const handleError = (error: Event) => {
        console.error('Audio error:', error);
        setIsPlaying(false);
        // Try alternative source on error
        if (audioSources[1] && audioRef.current) {
          console.log('Trying alternative source on error:', audioSources[1]);
          audioRef.current.src = audioSources[1];
          audioRef.current.play().catch((altError) => {
            console.error('Failed to play alternative audio on error:', altError);
            alert('Unable to play audio. Please check your internet connection or try again later.');
          });
        }
      };
      
      // Remove previous listeners
      audioRef.current.removeEventListener('canplay', handleCanPlay);
      audioRef.current.removeEventListener('error', handleError);
      
      // Add new listeners
      audioRef.current.addEventListener('canplay', handleCanPlay);
      audioRef.current.addEventListener('error', handleError);
      
      // Load audio
      audioRef.current.load();
    } else {
      console.error('Audio element not initialized');
      setIsPlaying(false);
    }
  };

  const pauseRecitation = () => {
    console.log('Pausing recitation');
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeRecitation = () => {
    console.log('Resuming recitation');
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Could not resume audio:', error);
        setIsPlaying(false);
      });
    }
  };

  const stopRecitation = () => {
    console.log('Stopping recitation');
    setIsReciting(false);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const nextVerse = () => {
    console.log('Next verse, current:', currentVerse);
    const nextVerseNum = currentVerse + 1;
    setCurrentVerse(nextVerseNum);
    if (isPlaying) {
      startRecitation(currentSurah, nextVerseNum);
    }
  };

  const previousVerse = () => {
    if (currentVerse > 1) {
      const prevVerseNum = currentVerse - 1;
      console.log('Previous verse, current:', currentVerse, 'going to:', prevVerseNum);
      setCurrentVerse(prevVerseNum);
      if (isPlaying) {
        startRecitation(currentSurah, prevVerseNum);
      }
    }
  };

  useEffect(() => {
    audioRef.current = new Audio();
    
    // Test audio capability
    const testAudio = async () => {
      try {
        // Create a simple test audio
        const testAudioElement = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
        testAudioElement.volume = 0;
        await testAudioElement.play();
        testAudioElement.pause();
        console.log('Audio playback is supported');
      } catch (error) {
        console.warn('Audio playback test failed:', error);
        console.log('This might be due to browser autoplay policy');
      }
    };
    
    testAudio();
    
    const handleAudioEnd = () => {
      console.log('Audio ended, moving to next verse');
      nextVerse();
    };

    const handleAudioError = (error: Event) => {
      console.error('Audio error:', error);
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