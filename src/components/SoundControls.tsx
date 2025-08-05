import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Settings,
  Music,
  Waves,
  Wind,
  Flame,
  CloudRain
} from 'lucide-react';
import { useSound } from '@/contexts/SoundContext';

interface SoundControlsProps {
  roomId: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export const SoundControls = ({ roomId, isVisible, onClose }: SoundControlsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'room' | 'ambient' | 'master'>('room');
  
  const {
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
    setMasterMuted,
    stopAllSounds
  } = useSound();

  const currentRoomSounds = roomSounds[roomId] || [];

  const getSoundIcon = (soundName: string) => {
    const name = soundName.toLowerCase();
    if (name.includes('rain')) return <CloudRain className="w-4 h-4" />;
    if (name.includes('fire')) return <Flame className="w-4 h-4" />;
    if (name.includes('wave')) return <Waves className="w-4 h-4" />;
    if (name.includes('wind')) return <Wind className="w-4 h-4" />;
    return <Music className="w-4 h-4" />;
  };

  const handleSoundToggle = (soundId: string, isPlaying: boolean, isRoomSound: boolean = true) => {
    if (isRoomSound) {
      if (isPlaying) {
        stopRoomSound(roomId, soundId);
      } else {
        playRoomSound(roomId, soundId);
      }
    } else {
      if (isPlaying) {
        stopAmbientSound(soundId);
      } else {
        playAmbientSound(soundId);
      }
    }
  };

  // If this is a modal version, show the full interface
  if (isVisible) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <Card className="w-96 max-h-[80vh] overflow-y-auto bg-black/90 backdrop-blur-sm border-white/20 text-white p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-base font-semibold flex items-center gap-1 whitespace-nowrap truncate max-w-[180px]">
              <Volume2 className="w-5 h-5" />
              Sound
              <span className="hidden sm:inline">Controls</span>
            </h3>
            {onClose && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white/20"
              >
                ×
              </Button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-4">
            <Button
              variant={activeTab === 'room' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('room')}
              className="text-xs flex-1"
            >
              Room
            </Button>
            <Button
              variant={activeTab === 'ambient' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('ambient')}
              className="text-xs flex-1"
            >
              Ambient
            </Button>
            <Button
              variant={activeTab === 'master' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('master')}
              className="text-xs flex-1"
            >
              Master
            </Button>
          </div>

          {/* Room Sounds Tab */}
          {activeTab === 'room' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Room Sounds</h4>
              {currentRoomSounds.map((sound) => (
                <div key={sound.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSoundIcon(sound.name)}
                      <span className="text-sm">{sound.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!sound.isMuted}
                        onCheckedChange={(checked) => muteRoomSound(roomId, sound.id, !checked)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSoundToggle(sound.id, sound.isPlaying, true)}
                        className="w-8 h-8 p-0"
                      >
                        {sound.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[sound.volume]}
                    onValueChange={([value]) => setRoomSoundVolume(roomId, sound.id, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 text-right">{sound.volume}%</div>
                </div>
              ))}
            </div>
          )}

          {/* Ambient Sounds Tab */}
          {activeTab === 'ambient' && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Global Ambient Sounds</h4>
              {ambientSounds.map((sound) => (
                <div key={sound.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSoundIcon(sound.name)}
                      <span className="text-sm">{sound.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={!sound.isMuted}
                        onCheckedChange={(checked) => muteAmbientSound(sound.id, !checked)}
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleSoundToggle(sound.id, sound.isPlaying, false)}
                        className="w-8 h-8 p-0"
                      >
                        {sound.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[sound.volume]}
                    onValueChange={([value]) => setAmbientSoundVolume(sound.id, value)}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                  <div className="text-xs text-gray-400 text-right">{sound.volume}%</div>
                </div>
              ))}
              <p className="text-xs text-gray-400 mt-2">
                Room sounds are specific to this room. Ambient sounds play globally.
              </p>
            </div>
          )}

          {/* Master Controls Tab */}
          {activeTab === 'master' && (
            <div className="space-y-4">
              <h4 className="text-sm font-medium">Master Controls</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Master Volume</span>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={!isMasterMuted}
                      onCheckedChange={(checked) => setMasterMuted(!checked)}
                    />
                    {isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </div>
                </div>
                <Slider
                  value={[masterVolume]}
                  onValueChange={([value]) => setMasterVolume(value)}
                  max={100}
                  step={1}
                  className="w-full"
                />
                <div className="text-xs text-gray-400 text-right">{masterVolume}%</div>
              </div>

              <Button
                onClick={stopAllSounds}
                variant="outline"
                size="sm"
                className="w-full"
              >
                Stop All Sounds
              </Button>
            </div>
          )}
        </Card>
      </div>
    );
  }

  // Original floating button version
  return (
    <div className="fixed bottom-4 left-4 z-40">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 p-2"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute bottom-12 left-0 w-80 bg-black/80 backdrop-blur-sm border-white/20 text-white p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-1 whitespace-nowrap truncate max-w-[140px]">
            <Volume2 className="w-4 h-4" />
            Sound <span className="hidden sm:inline">Controls</span>
          </h3>

          {/* Tab Navigation */}
          <div className="flex gap-1 mb-4">
            <Button
              variant={activeTab === 'room' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('room')}
              className="text-xs flex-1"
            >
              Room
            </Button>
            <Button
              variant={activeTab === 'ambient' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('ambient')}
              className="text-xs flex-1"
            >
              Ambient
            </Button>
            <Button
              variant={activeTab === 'master' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab('master')}
              className="text-xs flex-1"
            >
              Master
            </Button>
          </div>

          {/* Room Sounds Tab */}
          {activeTab === 'room' && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-white/70">Room Sounds</h4>
              {currentRoomSounds.map((sound) => (
                <div key={sound.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSoundIcon(sound.name)}
                      <span className="text-sm">{sound.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={!sound.isMuted}
                        onCheckedChange={(checked) => muteRoomSound(roomId, sound.id, !checked)}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSoundToggle(sound.id, sound.isPlaying)}
                        className="p-1 h-6 w-6"
                      >
                        {sound.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[sound.volume]}
                    onValueChange={([value]) => setRoomSoundVolume(roomId, sound.id, value)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                    disabled={sound.isMuted}
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>0%</span>
                    <span>{sound.volume}%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ambient Sounds Tab */}
          {activeTab === 'ambient' && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-white/70">Global Ambient Sounds</h4>
              {ambientSounds.map((sound) => (
                <div key={sound.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getSoundIcon(sound.name)}
                      <span className="text-sm">{sound.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Switch
                        checked={!sound.isMuted}
                        onCheckedChange={(checked) => muteAmbientSound(sound.id, !checked)}
                        size="sm"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSoundToggle(sound.id, sound.isPlaying, false)}
                        className="p-1 h-6 w-6"
                      >
                        {sound.isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                      </Button>
                    </div>
                  </div>
                  <Slider
                    value={[sound.volume]}
                    onValueChange={([value]) => setAmbientSoundVolume(sound.id, value)}
                    max={100}
                    min={0}
                    step={1}
                    className="w-full"
                    disabled={sound.isMuted}
                  />
                  <div className="flex justify-between text-xs text-white/50">
                    <span>0%</span>
                    <span>{sound.volume}%</span>
                    <span>100%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Master Controls Tab */}
          {activeTab === 'master' && (
            <div className="space-y-3">
              <h4 className="text-xs font-medium text-white/70">Master Controls</h4>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    <span className="text-sm">Master Volume</span>
                  </div>
                  <Switch
                    checked={!isMasterMuted}
                    onCheckedChange={(checked) => setMasterMuted(!checked)}
                    size="sm"
                  />
                </div>
                <Slider
                  value={[masterVolume]}
                  onValueChange={([value]) => setMasterVolume(value)}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                  disabled={isMasterMuted}
                />
                <div className="flex justify-between text-xs text-white/50">
                  <span>0%</span>
                  <span>{masterVolume}%</span>
                  <span>100%</span>
                </div>
              </div>

              <Separator className="bg-white/20" />

              <Button
                variant="outline"
                size="sm"
                onClick={stopAllSounds}
                className="w-full text-xs"
              >
                Stop All Sounds
              </Button>
            </div>
          )}

          <Separator className="my-3 bg-white/20" />
          
          <p className="text-xs text-white/70">
            Room sounds are specific to this room. Ambient sounds play globally.
          </p>
        </Card>
      )}
    </div>
  );
}; 