import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { QuranReader } from './QuranReader';
import { Volume2, VolumeX, ArrowLeft, Moon, Sun, RotateCcw } from 'lucide-react';

interface RoomProps {
  roomId: string;
  onBack: () => void;
}

interface RoomConfig {
  name: string;
  description: string;
  ambientSound: string;
  backgroundClass: string;
  quranPosition: { x: string; y: string };
}

const roomConfigs: Record<string, RoomConfig> = {
  'rainy-study': {
    name: 'Rainy Study',
    description: 'Rain gently pattering against the window',
    ambientSound: 'rain',
    backgroundClass: 'bg-gradient-to-br from-muted via-secondary to-primary',
    quranPosition: { x: 'left-1/2', y: 'top-3/4' }
  },
  'sunny-garden': {
    name: 'Garden View',
    description: 'Birds chirping in the sunny garden',
    ambientSound: 'birds',
    backgroundClass: 'bg-gradient-to-br from-warm-glow via-accent to-secondary',
    quranPosition: { x: 'right-1/4', y: 'top-2/3' }
  },
  'fireplace-nook': {
    name: 'Fireplace Nook',
    description: 'Crackling fire warming the cozy space',
    ambientSound: 'fire',
    backgroundClass: 'bg-gradient-to-br from-firelight via-primary to-secondary',
    quranPosition: { x: 'left-1/3', y: 'top-1/2' }
  },
  'moonlit-corner': {
    name: 'Moonlit Corner',
    description: 'Peaceful moonlight through the window',
    ambientSound: 'night',
    backgroundClass: 'bg-gradient-to-br from-moonlight via-secondary to-muted',
    quranPosition: { x: 'right-1/3', y: 'top-3/5' }
  },
  'seaside-sanctuary': {
    name: 'Seaside Sanctuary',
    description: 'Ocean waves and distant seagulls',
    ambientSound: 'waves',
    backgroundClass: 'bg-gradient-to-br from-ocean-blue via-secondary to-muted',
    quranPosition: { x: 'left-1/4', y: 'top-1/2' }
  },
  'desert-mirage': {
    name: 'Desert Mirage',
    description: 'Gentle desert winds and sandy whispers',
    ambientSound: 'desert',
    backgroundClass: 'bg-gradient-to-br from-sandy-gold via-accent to-primary',
    quranPosition: { x: 'right-1/2', y: 'top-2/3' }
  },
  'tuscan-vista': {
    name: 'Tuscan Vista',
    description: 'Italian breeze and distant city murmurs',
    ambientSound: 'city',
    backgroundClass: 'bg-gradient-to-br from-tuscan-terracotta via-secondary to-warm-glow',
    quranPosition: { x: 'left-1/3', y: 'top-3/5' }
  },
  'stellar-meditation': {
    name: 'Stellar Meditation',
    description: 'Cosmic silence and ethereal space ambiance',
    ambientSound: 'space',
    backgroundClass: 'bg-gradient-to-br from-cosmic-purple via-primary to-muted',
    quranPosition: { x: 'right-1/4', y: 'top-1/2' }
  },
  'alpine-retreat': {
    name: 'Alpine Retreat',
    description: 'Mountain winds through peaceful peaks',
    ambientSound: 'wind',
    backgroundClass: 'bg-gradient-to-br from-alpine-white via-secondary to-primary',
    quranPosition: { x: 'left-1/2', y: 'top-3/4' }
  },
  'woodland-haven': {
    name: 'Woodland Haven',
    description: 'Forest sounds and rustling leaves',
    ambientSound: 'forest',
    backgroundClass: 'bg-gradient-to-br from-forest-green via-secondary to-primary',
    quranPosition: { x: 'right-1/3', y: 'top-1/3' }
  }
};

export const Room = ({ roomId, onBack }: RoomProps) => {
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuranOpen, setIsQuranOpen] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const roomConfig = roomConfigs[roomId];
  
  console.log('🏠 Room component rendering:', roomId);
  console.log('🏠 Room config:', roomConfig);

  useEffect(() => {
    console.log('🏠 Room component mounted successfully');
    return () => console.log('🏠 Room component unmounting');
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleQuranClick = () => {
    setIsQuranOpen(true);
  };

  if (!roomConfig) {
    console.log('❌ No room config found for:', roomId);
    return (
      <div className="min-h-screen flex items-center justify-center bg-destructive">
        <p className="text-xl text-destructive-foreground">Room not found: {roomId}</p>
      </div>
    );
  }

  console.log('✅ About to render room:', roomConfig.name);

  return (
    <div className="min-h-screen bg-primary text-primary-foreground p-8">
      <h1 className="text-4xl font-bold mb-4">🏠 {roomConfig.name}</h1>
      <p className="text-xl mb-8">{roomConfig.description}</p>
      
      <Button
        onClick={onBack}
        variant="secondary"
        className="mb-4"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Rooms
      </Button>

      <div className="bg-card p-4 rounded-lg">
        <p className="text-card-foreground">
          Room is working! ID: {roomId}
        </p>
      </div>

      {/* Qur'an Reader Modal */}
      {isQuranOpen && (
        <QuranReader onClose={() => setIsQuranOpen(false)} />
      )}
    </div>
  );
};