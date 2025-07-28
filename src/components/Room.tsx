import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { QuranReader } from './QuranReader';
import { Volume2, VolumeX, ArrowLeft, Moon, Sun } from 'lucide-react';

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
    backgroundClass: 'bg-gradient-to-br from-slate-400 via-slate-300 to-slate-500',
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

  const handleQuranClick = () => {
    setIsQuranOpen(true);
  };

  if (!roomConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xl text-foreground">Room not found</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-1000 ${
      isDarkMode ? 'bg-gradient-night' : roomConfig.backgroundClass
    }`}>
      {/* Ambient Audio */}
      <audio
        ref={audioRef}
        loop
        autoPlay
        src={`/sounds/${roomConfig.ambientSound}.mp3`}
      />

      {/* Background Elements */}
      <div className={`absolute inset-0 transition-opacity duration-1000 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        {/* Room-specific visual elements */}
        {roomId === 'rainy-study' && (
          <>
            <div className="absolute top-10 left-10 w-64 h-80 bg-card/30 rounded-lg shadow-soft" />
            <div className="absolute top-20 right-20 w-48 h-64 bg-primary/20 rounded-lg" />
          </>
        )}
        
        {roomId === 'sunny-garden' && (
          <>
            <div className="absolute bottom-10 left-10 w-72 h-40 bg-secondary/40 rounded-t-full" />
            <div className="absolute top-1/4 right-10 w-32 h-48 bg-primary/30 rounded-lg" />
          </>
        )}
        
        {roomId === 'fireplace-nook' && (
          <>
            <div className="absolute bottom-0 left-1/4 w-64 h-32 bg-firelight/60 rounded-t-lg shadow-fire" />
            <div className="absolute top-1/3 right-20 w-40 h-56 bg-primary/40 rounded-lg" />
          </>
        )}
        
        {roomId === 'moonlit-corner' && (
          <>
            <div className="absolute top-20 left-20 w-80 h-60 bg-moonlight/20 rounded-lg" />
            <div className="absolute bottom-20 right-20 w-48 h-32 bg-secondary/30 rounded-lg" />
          </>
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