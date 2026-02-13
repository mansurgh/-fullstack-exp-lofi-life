import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

interface SoundTrack {
  id: string;
  name: string;
  url: string;
  volume: number;
  isPlaying: boolean;
  isMuted: boolean;
  loop: boolean;
}

interface SoundContextType {
  // Global ambient sounds (available in all rooms)
  ambientSounds: SoundTrack[];

  // Controls for ambient sounds
  playAmbientSound: (soundId: string) => void;
  stopAmbientSound: (soundId: string) => void;
  setAmbientSoundVolume: (soundId: string, volume: number) => void;
  muteAmbientSound: (soundId: string, muted: boolean) => void;

  // Master controls
  masterVolume: number;
  setMasterVolume: (volume: number) => void;
  isMasterMuted: boolean;
  setMasterMuted: (muted: boolean) => void;

  // Stop all sounds
  stopAllSounds: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Global ambient sounds available in all rooms
const ambientSoundConfigs = [
  { name: 'Crickets', url: '/sounds/crickets.wav' },
  { name: 'Wind', url: '/sounds/wind.wav' },
  { name: 'Forest Birds', url: '/sounds/birds.wav' },
  { name: 'Ocean Waves', url: '/sounds/waves.wav' },
  { name: 'Rain', url: '/sounds/rain.wav' },
  { name: 'Fireplace', url: '/sounds/fire.wav' }
];

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ambientSounds, setAmbientSounds] = useState<SoundTrack[]>([]);
  const [masterVolume, setMasterVolume] = useState(50);
  const [isMasterMuted, setIsMasterMuted] = useState(false);

  const audioElements = useRef<Record<string, HTMLAudioElement>>({});
  const ambientSoundsRef = useRef<SoundTrack[]>([]);
  const masterVolumeRef = useRef(masterVolume);
  const isMasterMutedRef = useRef(isMasterMuted);

  // Keep refs in sync
  ambientSoundsRef.current = ambientSounds;
  masterVolumeRef.current = masterVolume;
  isMasterMutedRef.current = isMasterMuted;

  // Initialize sounds
  useEffect(() => {
    // Initialize ambient sounds
    const initialAmbientSounds = ambientSoundConfigs.map((sound, index) => ({
      id: `ambient-${index}`,
      name: sound.name,
      url: sound.url,
      volume: 30,
      isPlaying: false,
      isMuted: false,
      loop: true
    }));
    setAmbientSounds(initialAmbientSounds);

    // Load saved settings
    const savedMasterVolume = localStorage.getItem('masterVolume');
    if (savedMasterVolume) {
      setMasterVolume(parseInt(savedMasterVolume));
    }

    const savedMasterMuted = localStorage.getItem('isMasterMuted');
    if (savedMasterMuted) {
      setIsMasterMuted(savedMasterMuted === 'true');
    }
  }, []);

  // Save master volume to localStorage (debounced)
  useEffect(() => {
    const t = setTimeout(() => localStorage.setItem('masterVolume', masterVolume.toString()), 300);
    return () => clearTimeout(t);
  }, [masterVolume]);

  // Save master muted state to localStorage
  useEffect(() => {
    localStorage.setItem('isMasterMuted', isMasterMuted.toString());
  }, [isMasterMuted]);

  // Update all active sounds when master volume or mute state changes
  useEffect(() => {
    // Read from ref to avoid depending on ambientSounds state
    ambientSoundsRef.current.forEach(sound => {
      if (sound.isPlaying) {
        const audio = audioElements.current[sound.id];
        if (audio) {
          const finalVolume = sound.isMuted || isMasterMuted ? 0 : (sound.volume / 100) * (masterVolume / 100);
          audio.volume = finalVolume;
        }
      }
    });
  }, [masterVolume, isMasterMuted]);

  const createAudioElement = useCallback((soundId: string, url: string): HTMLAudioElement => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';

    audioElements.current[soundId] = audio;
    return audio;
  }, []);

  const getAudioElement = useCallback((soundId: string): HTMLAudioElement | undefined => {
    if (!audioElements.current[soundId]) {
      const sound = ambientSoundsRef.current.find(s => s.id === soundId);
      if (sound) {
        return createAudioElement(soundId, sound.url);
      }
    }
    return audioElements.current[soundId];
  }, [createAudioElement]);

  const updateAudioVolume = useCallback((soundId: string, volume: number, isMuted: boolean) => {
    const audio = audioElements.current[soundId];
    if (audio) {
      const finalVolume = isMuted || isMasterMutedRef.current ? 0 : (volume / 100) * (masterVolumeRef.current / 100);
      audio.volume = finalVolume;
    }
  }, []);

  const playAmbientSound = useCallback((soundId: string) => {
    const audio = getAudioElement(soundId);
    if (audio) {
      // Устанавливаем громкость ДО воспроизведения
      const sound = ambientSoundsRef.current.find(s => s.id === soundId);
      if (sound) {
        const finalVolume = sound.isMuted || isMasterMutedRef.current ? 0 : (sound.volume / 100) * (masterVolumeRef.current / 100);
        audio.volume = finalVolume;
      }

      audio.play().catch(console.error);

      setAmbientSounds(prev =>
        prev.map(sound =>
          sound.id === soundId ? { ...sound, isPlaying: true } : sound
        )
      );
    }
  }, [getAudioElement]);

  const stopAmbientSound = useCallback((soundId: string) => {
    const audio = getAudioElement(soundId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }

    setAmbientSounds(prev =>
      prev.map(sound =>
        sound.id === soundId ? { ...sound, isPlaying: false } : sound
      )
    );
  }, [getAudioElement]);

  const setAmbientSoundVolume = useCallback((soundId: string, volume: number) => {
    setAmbientSounds(prev =>
      prev.map(sound =>
        sound.id === soundId ? { ...sound, volume } : sound
      )
    );

    const sound = ambientSoundsRef.current.find(s => s.id === soundId);
    if (sound) {
      updateAudioVolume(soundId, volume, sound.isMuted);
    }
  }, [updateAudioVolume]);

  const muteAmbientSound = useCallback((soundId: string, muted: boolean) => {
    setAmbientSounds(prev =>
      prev.map(sound =>
        sound.id === soundId ? { ...sound, isMuted: muted } : sound
      )
    );

    const sound = ambientSoundsRef.current.find(s => s.id === soundId);
    if (sound) {
      updateAudioVolume(soundId, sound.volume, muted);
    }
  }, [updateAudioVolume]);

  const stopAllSounds = useCallback(() => {
    Object.values(audioElements.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });

    setAmbientSounds(prev =>
      prev.map(sound => ({ ...sound, isPlaying: false }))
    );
  }, []);

  const value = useMemo<SoundContextType>(() => ({
    ambientSounds,
    playAmbientSound,
    stopAmbientSound,
    setAmbientSoundVolume,
    muteAmbientSound,
    masterVolume,
    setMasterVolume,
    isMasterMuted,
    setMasterMuted: setIsMasterMuted,
    stopAllSounds
  }), [ambientSounds, playAmbientSound, stopAmbientSound, setAmbientSoundVolume, muteAmbientSound, masterVolume, isMasterMuted, stopAllSounds]);

  return (
    <SoundContext.Provider value={value}>
      {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (context === undefined) {
    throw new Error('useSound must be used within a SoundProvider');
  }
  return context;
};