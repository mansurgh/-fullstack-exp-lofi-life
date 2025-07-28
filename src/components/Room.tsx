import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { QuranReader } from './QuranReader';
import { Volume2, VolumeX, ArrowLeft, Moon, Sun, RotateCcw } from 'lucide-react';
import rainyStudyRoom from "@/assets/rainy-study-room.jpg";
import sunnyGardenRoom from "@/assets/sunny-garden-room.jpg";
import fireplaceNook from "@/assets/fireplace-nook.jpg";
import moonlitCorner from "@/assets/moonlit-corner.jpg";
import seasideSanctuary from "@/assets/seaside-sanctuary.jpg";
import desertMirage from "@/assets/desert-mirage.jpg";
import tuscanVista from "@/assets/tuscan-vista.jpg";
import stellarMeditation from "@/assets/stellar-meditation.jpg";
import alpineRetreat from "@/assets/alpine-retreat.jpg";
import woodlandHaven from "@/assets/woodland-haven.jpg";

interface RoomProps {
  roomId: string;
  onBack: () => void;
}

interface RoomConfig {
  name: string;
  description: string;
  ambientSound: string;
  backgroundImage: string;
  quranPosition: { x: string; y: string };
  interactiveElements: Array<{
    type: 'floating' | 'glow' | 'particles';
    className: string;
    animation: string;
  }>;
}

const roomConfigs: Record<string, RoomConfig> = {
  'rainy-study': {
    name: 'Rainy Study',
    description: 'Rain gently pattering against the window',
    ambientSound: 'rain',
    backgroundImage: rainyStudyRoom,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute top-0 left-0 w-full h-full opacity-30', animation: 'animate-pulse' }
    ]
  },
  'sunny-garden': {
    name: 'Garden View',
    description: 'Birds chirping in the sunny garden',
    ambientSound: 'birds',
    backgroundImage: sunnyGardenRoom,
    quranPosition: { x: 'right-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 left-10 w-8 h-8 text-yellow-400 text-2xl', animation: 'animate-bounce' }
    ]
  },
  'fireplace-nook': {
    name: 'Fireplace Nook',
    description: 'Crackling fire warming the cozy space',
    ambientSound: 'fire',
    backgroundImage: fireplaceNook,
    quranPosition: { x: 'left-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-1/4 w-32 h-16 bg-orange-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'moonlit-corner': {
    name: 'Moonlit Corner',
    description: 'Peaceful moonlight through the window',
    ambientSound: 'night',
    backgroundImage: moonlitCorner,
    quranPosition: { x: 'right-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-10 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'seaside-sanctuary': {
    name: 'Seaside Sanctuary',
    description: 'Ocean waves and distant seagulls',
    ambientSound: 'waves',
    backgroundImage: seasideSanctuary,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 right-10 w-6 h-6 text-blue-300 text-xl', animation: 'animate-bounce' }
    ]
  },
  'desert-mirage': {
    name: 'Desert Mirage',
    description: 'Gentle desert winds and sandy whispers',
    ambientSound: 'desert',
    backgroundImage: desertMirage,
    quranPosition: { x: 'right-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-t from-yellow-600/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'tuscan-vista': {
    name: 'Tuscan Vista',
    description: 'Italian breeze and distant city murmurs',
    ambientSound: 'city',
    backgroundImage: tuscanVista,
    quranPosition: { x: 'left-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 right-20 w-20 h-20 bg-orange-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'stellar-meditation': {
    name: 'Stellar Meditation',
    description: 'Cosmic silence and ethereal space ambiance',
    ambientSound: 'space',
    backgroundImage: stellarMeditation,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-1/4 left-1/4 w-4 h-4 text-purple-300 text-lg', animation: 'animate-ping' },
      { type: 'floating', className: 'absolute bottom-1/3 right-1/4 w-3 h-3 text-blue-300 text-sm', animation: 'animate-pulse' }
    ]
  },
  'alpine-retreat': {
    name: 'Alpine Retreat',
    description: 'Mountain winds through peaceful peaks',
    ambientSound: 'wind',
    backgroundImage: alpineRetreat,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'woodland-haven': {
    name: 'Woodland Haven',
    description: 'Forest sounds and rustling leaves',
    ambientSound: 'forest',
    backgroundImage: woodlandHaven,
    quranPosition: { x: 'right-1/3', y: 'top-1/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-40 left-16 w-6 h-6 text-green-400 text-xl', animation: 'animate-bounce' }
    ]
  }
};

export const Room = ({ roomId, onBack }: RoomProps) => {
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuranOpen, setIsQuranOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const roomConfig = roomConfigs[roomId];
  
  console.log('🏠 Room component rendering:', roomId);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
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

  const handleReload = () => {
    window.location.reload();
  };

  const handleQuranClick = () => {
    setIsQuranOpen(true);
  };

  if (!roomConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-destructive">
        <p className="text-xl text-destructive-foreground">Room not found: {roomId}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${roomConfig.backgroundImage})`,
          filter: isDarkMode ? 'brightness(0.3) contrast(1.2)' : 'brightness(0.8) contrast(1.1)'
        }}
      >
        {/* Dark overlay for better readability */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-black/60 via-blue-900/40 to-black/70' 
            : 'bg-gradient-to-br from-black/20 via-transparent to-black/30'
        }`} />
      </div>
      {/* Ambient Audio */}
      <audio
        ref={audioRef}
        loop
        src={`/sounds/${roomConfig.ambientSound}.mp3`}
        onError={(e) => {
          console.log('Audio failed to load:', `/sounds/${roomConfig.ambientSound}.mp3`);
          console.log('Note: Audio files are not included. Add your own ambient sounds to /public/sounds/');
        }}
        onLoadedData={() => {
          console.log('Audio loaded successfully');
          if (audioRef.current) {
            audioRef.current.play().catch(e => {
              console.log('Autoplay blocked, user interaction required');
            });
          }
        }}
      />

      {/* Interactive Elements */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {roomConfig.interactiveElements.map((element, index) => (
          <div key={index} className={`${element.className} ${element.animation}`}>
            {element.type === 'floating' && (
              <>
                {roomId === 'sunny-garden' && '🦋'}
                {roomId === 'seaside-sanctuary' && '🐚'}
                {roomId === 'stellar-meditation' && '✨'}
                {roomId === 'woodland-haven' && '🍃'}
              </>
            )}
          </div>
        ))}
        
        {/* Ambient particles for certain rooms */}
        {roomId === 'rainy-study' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-200/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {roomId === 'stellar-meditation' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Qur'an Book */}
      <div 
        className={`absolute ${roomConfig.quranPosition.x} ${roomConfig.quranPosition.y} transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 hover:scale-110 ${
          isDarkMode ? 'shadow-glow' : 'shadow-soft'
        }`}
        onClick={handleQuranClick}
      >
        <div className={`w-20 h-28 bg-gradient-to-br from-accent to-primary rounded-md relative ${
          isDarkMode ? 'ring-2 ring-quran-glow animate-pulse' : ''
        }`}>
          <div className="absolute inset-2 bg-card/90 rounded-sm">
            <div className="h-full flex flex-col items-center justify-center text-xs text-accent-foreground font-semibold">
              <div className="text-lg mb-1">📖</div>
              <div>القرآن</div>
              <div>الكريم</div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="bg-card/80 hover:bg-card text-card-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Rooms
        </Button>

        <div className="flex gap-3">
          <Button
            onClick={handleReload}
            variant="secondary"
            size="sm"
            className="bg-card/80 hover:bg-card text-card-foreground"
            title="Reload page if room or Quran isn't loading"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="secondary"
            size="sm"
            className="bg-card/80 hover:bg-card text-card-foreground"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <Card className="absolute bottom-6 left-6 p-4 bg-card/80 backdrop-blur-sm border-border/50">
        <div className="flex items-center gap-3 min-w-48">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-card-foreground hover:text-accent"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            min={0}
            step={1}
            className="flex-1"
            disabled={isMuted}
          />
          <span className="text-sm text-muted-foreground min-w-8">
            {isMuted ? 0 : volume[0]}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {roomConfig.description}
        </p>
        <p className="text-xs text-amber-600 mt-1">
          {t('room.audio.warning')}
        </p>
      </Card>

      {/* Room Info */}
      <Card className="absolute bottom-6 right-6 p-4 bg-card/80 backdrop-blur-sm border-border/50">
        <h3 className="font-semibold text-card-foreground mb-1">
          {roomConfig.name}
        </h3>
        <p className="text-xs text-muted-foreground">
          Click the Qur'an to begin reading
        </p>
      </Card>

      {/* Qur'an Reader Modal */}
      {isQuranOpen && (
        <QuranReader onClose={() => setIsQuranOpen(false)} />
      )}
    </div>
  );
};