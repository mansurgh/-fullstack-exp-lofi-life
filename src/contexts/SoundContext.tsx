import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

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
  // Room-specific sounds
  roomSounds: Record<string, SoundTrack[]>;
  
  // Global ambient sounds
  ambientSounds: SoundTrack[];
  
  // Controls
  playRoomSound: (roomId: string, soundId: string) => void;
  stopRoomSound: (roomId: string, soundId: string) => void;
  setRoomSoundVolume: (roomId: string, soundId: string, volume: number) => void;
  muteRoomSound: (roomId: string, soundId: string, muted: boolean) => void;
  
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

// Sound configurations for each room
const roomSoundConfigs: Record<string, { name: string; url: string }[]> = {
  'rainy-study': [
    { name: 'Rain', url: '/sounds/rain.wav' },
    { name: 'Thunder', url: '/sounds/thunder.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'sunny-garden': [
    { name: 'Birds', url: '/sounds/birds.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'Leaves', url: '/sounds/leaves.wav' }
  ],
  'fireplace-nook': [
    { name: 'Fire', url: '/sounds/fire.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'Crackling', url: '/sounds/crackling.wav' }
  ],
  'moonlit-corner': [
    { name: 'Night', url: '/sounds/night.wav' },
    { name: 'Crickets', url: '/sounds/crickets.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'seaside-sanctuary': [
    { name: 'Waves', url: '/sounds/waves.wav' },
    { name: 'Seagulls', url: '/sounds/seagulls.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'desert-mirage': [
    { name: 'Desert Wind', url: '/sounds/wind.wav' },
    { name: 'Sand', url: '/sounds/sand.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'tuscan-vista': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'stellar-meditation': [
    { name: 'Space', url: '/sounds/space.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'alpine-retreat': [
    { name: 'Mountain Wind', url: '/sounds/wind.wav' },
    { name: 'Echo', url: '/sounds/echo.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'woodland-haven': [
    { name: 'Forest', url: '/sounds/forest.wav' },
    { name: 'Leaves', url: '/sounds/leaves.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'russian-winter': [
    { name: 'Snow', url: '/sounds/snow.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'Silence', url: '/sounds/silence.wav' }
  ],
  'chechen-tower': [
    { name: 'Mountain', url: '/sounds/mountain.wav' },
    { name: 'Echo', url: '/sounds/echo.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'french-eiffel': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'norwegian-landscape': [
    { name: 'Mountain Wind', url: '/sounds/wind.wav' },
    { name: 'Echo', url: '/sounds/echo.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'tokyo-neon': [
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'belgian-grey': [
    { name: 'Rain', url: '/sounds/rain.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'City', url: '/sounds/city.wav' }
  ],
  'german-brown': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'dutch-farm': [
    { name: 'Nature', url: '/sounds/nature.wav' },
    { name: 'Birds', url: '/sounds/birds.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'chinese-lake': [
    { name: 'Water', url: '/sounds/water.wav' },
    { name: 'Birds', url: '/sounds/birds.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'circus-tent': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'mosque-interior': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'library-room': [
    { name: 'Pages', url: '/sounds/pages.wav' },
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'rgb-room': [
    { name: 'Electronic', url: '/sounds/electronic.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'poland-snow': [
    { name: 'Snow', url: '/sounds/snow.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'Silence', url: '/sounds/silence.wav' }
  ],
  'antarctic-igloo': [
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'Ice', url: '/sounds/ice.wav' },
    { name: 'Silence', url: '/sounds/silence.wav' }
  ],
  'space-ship': [
    { name: 'Space', url: '/sounds/space.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'pink-candy': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'prison-cell': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'skyscraper-view': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'submarine-view': [
    { name: 'Underwater', url: '/sounds/underwater.wav' },
    { name: 'Water', url: '/sounds/water.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'tetris-room': [
    { name: 'Electronic', url: '/sounds/electronic.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'clicker-arcade': [
    { name: 'Electronic', url: '/sounds/electronic.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'spongebob-pineapple': [
    { name: 'Underwater', url: '/sounds/underwater.wav' },
    { name: 'Water', url: '/sounds/water.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'minecraft-room': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'pirate-deck-view': [
    { name: 'Waves', url: '/sounds/waves.wav' },
    { name: 'Seagulls', url: '/sounds/seagulls.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'naruto-room': [
    { name: 'Japanese', url: '/sounds/japanese.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'ghibli-forest': [
    { name: 'Forest', url: '/sounds/forest.wav' },
    { name: 'Leaves', url: '/sounds/leaves.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'titan-wall': [
    { name: 'Wind', url: '/sounds/wind.wav' },
    { name: 'Echo', url: '/sounds/echo.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' }
  ],
  'demon-slayer-dojo': [
    { name: 'Japanese', url: '/sounds/japanese.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'hero-academy': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'dragon-ball-training': [
    { name: 'Waves', url: '/sounds/waves.wav' },
    { name: 'Seagulls', url: '/sounds/seagulls.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'hospital-waiting': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'jail-cell': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'train-station': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'bus-stop': [
    { name: 'City', url: '/sounds/city.wav' },
    { name: 'Traffic', url: '/sounds/traffic.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'doctors-office': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'gym': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'bird-shop': [
    { name: 'Birds', url: '/sounds/birds.wav' },
    { name: 'Nature', url: '/sounds/nature.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'room-with-cat': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'cat-eating': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'dog-eating': [
    { name: 'Silence', url: '/sounds/silence.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'kitchen-cockatiel': [
    { name: 'Birds', url: '/sounds/birds.wav' },
    { name: 'Nature', url: '/sounds/nature.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'moonlit-room': [
    { name: 'Night', url: '/sounds/night.wav' },
    { name: 'Crickets', url: '/sounds/crickets.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'rain-hideout': [
    { name: 'Rain', url: '/sounds/rain.wav' },
    { name: 'Thunder', url: '/sounds/thunder.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'park-trees': [
    { name: 'Nature', url: '/sounds/nature.wav' },
    { name: 'Birds', url: '/sounds/birds.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  // Sports rooms
  'football-field': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'tennis-court': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'basketball-court': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'volleyball-court': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'bowling-alley': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'american-football': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'hockey-rink': [
    { name: 'Sports', url: '/sounds/sports.wav' },
    { name: 'Crowd', url: '/sounds/crowd.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'indoor-pool': [
    { name: 'Water', url: '/sounds/water.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ],
  'the-concept': [
    { name: 'Night', url: '/sounds/night.wav' },
    { name: 'Ambient', url: '/sounds/ambient.wav' },
    { name: 'Wind', url: '/sounds/wind.wav' }
  ]
};

// Global ambient sounds available in all rooms
const ambientSoundConfigs = [
  { name: 'Rain', url: '/sounds/rain.wav' },
  { name: 'Fire', url: '/sounds/fire.wav' },
  { name: 'Waves', url: '/sounds/waves.wav' },
  { name: 'Forest', url: '/sounds/forest.wav' },
  { name: 'Wind', url: '/sounds/wind.wav' }
];

export const SoundProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [roomSounds, setRoomSounds] = useState<Record<string, SoundTrack[]>>({});
  const [ambientSounds, setAmbientSounds] = useState<SoundTrack[]>([]);
  const [masterVolume, setMasterVolume] = useState(50);
  const [isMasterMuted, setIsMasterMuted] = useState(false);
  
  const audioElements = useRef<Record<string, HTMLAudioElement>>({});

  // Initialize sounds
  useEffect(() => {
    // Initialize room sounds
    const initialRoomSounds: Record<string, SoundTrack[]> = {};
    Object.keys(roomSoundConfigs).forEach(roomId => {
      initialRoomSounds[roomId] = roomSoundConfigs[roomId].map((sound, index) => ({
        id: `room-${roomId}-${index}`,
        name: sound.name,
        url: sound.url,
        volume: 50,
        isPlaying: false,
        isMuted: false,
        loop: true
      }));
    });
    setRoomSounds(initialRoomSounds);

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

  // Save master settings
  useEffect(() => {
    localStorage.setItem('masterVolume', masterVolume.toString());
  }, [masterVolume]);

  useEffect(() => {
    localStorage.setItem('isMasterMuted', isMasterMuted.toString());
  }, [isMasterMuted]);

  const createAudioElement = (soundId: string, url: string): HTMLAudioElement => {
    const audio = new Audio(url);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    
    audioElements.current[soundId] = audio;
    return audio;
  };

  const getAudioElement = (soundId: string): HTMLAudioElement => {
    if (!audioElements.current[soundId]) {
      const sound = [...Object.values(roomSounds).flat(), ...ambientSounds].find(s => s.id === soundId);
      if (sound) {
        return createAudioElement(soundId, sound.url);
      }
    }
    return audioElements.current[soundId];
  };

  const updateAudioVolume = (soundId: string, volume: number, isMuted: boolean) => {
    const audio = getAudioElement(soundId);
    if (audio) {
      const finalVolume = isMuted || isMasterMuted ? 0 : (volume / 100) * (masterVolume / 100);
      audio.volume = finalVolume;
    }
  };

  const playRoomSound = (roomId: string, soundId: string) => {
    const audio = getAudioElement(soundId);
    if (audio) {
      audio.play().catch(console.error);
      
      setRoomSounds(prev => ({
        ...prev,
        [roomId]: prev[roomId]?.map(sound => 
          sound.id === soundId ? { ...sound, isPlaying: true } : sound
        ) || []
      }));
    }
  };

  const stopRoomSound = (roomId: string, soundId: string) => {
    const audio = audioElements.current[soundId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setRoomSounds(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.map(sound => 
        sound.id === soundId ? { ...sound, isPlaying: false } : sound
      ) || []
    }));
  };

  const setRoomSoundVolume = (roomId: string, soundId: string, volume: number) => {
    setRoomSounds(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.map(sound => 
        sound.id === soundId ? { ...sound, volume } : sound
      ) || []
    }));
    
    const sound = roomSounds[roomId]?.find(s => s.id === soundId);
    if (sound) {
      updateAudioVolume(soundId, volume, sound.isMuted);
    }
  };

  const muteRoomSound = (roomId: string, soundId: string, muted: boolean) => {
    setRoomSounds(prev => ({
      ...prev,
      [roomId]: prev[roomId]?.map(sound => 
        sound.id === soundId ? { ...sound, isMuted: muted } : sound
      ) || []
    }));
    
    const sound = roomSounds[roomId]?.find(s => s.id === soundId);
    if (sound) {
      updateAudioVolume(soundId, sound.volume, muted);
    }
  };

  const playAmbientSound = (soundId: string) => {
    const audio = getAudioElement(soundId);
    if (audio) {
      audio.play().catch(console.error);
      
      setAmbientSounds(prev => 
        prev.map(sound => 
          sound.id === soundId ? { ...sound, isPlaying: true } : sound
        )
      );
    }
  };

  const stopAmbientSound = (soundId: string) => {
    const audio = audioElements.current[soundId];
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    
    setAmbientSounds(prev => 
      prev.map(sound => 
        sound.id === soundId ? { ...sound, isPlaying: false } : sound
      )
    );
  };

  const setAmbientSoundVolume = (soundId: string, volume: number) => {
    setAmbientSounds(prev => 
      prev.map(sound => 
        sound.id === soundId ? { ...sound, volume } : sound
      )
    );
    
    const sound = ambientSounds.find(s => s.id === soundId);
    if (sound) {
      updateAudioVolume(soundId, volume, sound.isMuted);
    }
  };

  const muteAmbientSound = (soundId: string, muted: boolean) => {
    setAmbientSounds(prev => 
      prev.map(sound => 
        sound.id === soundId ? { ...sound, isMuted: muted } : sound
      )
    );
    
    const sound = ambientSounds.find(s => s.id === soundId);
    if (sound) {
      updateAudioVolume(soundId, sound.volume, muted);
    }
  };

  const stopAllSounds = () => {
    Object.values(audioElements.current).forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
    
    setRoomSounds(prev => {
      const newRoomSounds = { ...prev };
      Object.keys(newRoomSounds).forEach(roomId => {
        newRoomSounds[roomId] = newRoomSounds[roomId].map(sound => ({ ...sound, isPlaying: false }));
      });
      return newRoomSounds;
    });
    
    setAmbientSounds(prev => 
      prev.map(sound => ({ ...sound, isPlaying: false }))
    );
  };

  // Update all audio volumes when master volume changes
  useEffect(() => {
    Object.keys(audioElements.current).forEach(soundId => {
      const sound = [...Object.values(roomSounds).flat(), ...ambientSounds].find(s => s.id === soundId);
      if (sound) {
        updateAudioVolume(soundId, sound.volume, sound.isMuted);
      }
    });
  }, [masterVolume, isMasterMuted]);

  const value: SoundContextType = {
    roomSounds,
    ambientSounds,
    playRoomSound,
    stopRoomSound,
    setRoomSoundVolume,
    muteRoomSound,
    playAmbientSound,
    stopAmbientSound,
    setAmbientSoundVolume,
    muteAmbientSound,
    masterVolume,
    setMasterVolume,
    isMasterMuted,
    setMasterMuted: setIsMasterMuted,
    stopAllSounds
  };

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