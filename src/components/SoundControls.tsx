import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useSound } from '@/contexts/SoundContext';
import { useTranslation } from '@/contexts/TranslationContext';
import {
  CloudRain,
  Flame,
  Music,
  Volume2,
  VolumeX,
  Waves,
  Wind
} from 'lucide-react';
import { useState } from 'react';

interface SoundControlsProps {
  roomId: string;
  isVisible?: boolean;
  onClose?: () => void;
}

export const SoundControls = ({ roomId, isVisible, onClose }: SoundControlsProps) => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'ambient' | 'master'>('ambient');

  const {
    ambientSounds,
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

  const getSoundIcon = (soundName: string) => {
    const name = soundName.toLowerCase();
    if (name.includes('rain')) return <CloudRain className="w-4 h-4" />;
    if (name.includes('fire')) return <Flame className="w-4 h-4" />;
    if (name.includes('wind')) return <Wind className="w-4 h-4" />;
    if (name.includes('bird')) return <Music className="w-4 h-4" />;
    if (name.includes('wave')) return <Waves className="w-4 h-4" />;
    return <Music className="w-4 h-4" />;
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="w-80 p-4 bg-white backdrop-blur-sm border border-gray-300 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Sound Controls</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-4">
          <Button
            variant={activeTab === 'ambient' ? 'default' : 'outline'}
            onClick={() => setActiveTab('ambient')}
            className={`text-xs flex-1 ${activeTab === 'ambient'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
          >
            {t('sound.ambient')}
          </Button>
          <Button
            variant={activeTab === 'master' ? 'default' : 'outline'}
            onClick={() => setActiveTab('master')}
            className={`text-xs flex-1 ${activeTab === 'master'
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              }`}
          >
            {t('sound.master')}
          </Button>
        </div>

        {/* Ambient Sounds */}
        {activeTab === 'ambient' && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">{t('sound.ambient.sounds')}</h4>
            {ambientSounds.map((sound) => (
              <div key={sound.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getSoundIcon(sound.name)}
                    <span className="text-sm text-gray-900">{sound.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={sound.isPlaying}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          playAmbientSound(sound.id);
                        } else {
                          stopAmbientSound(sound.id);
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => muteAmbientSound(sound.id, !sound.isMuted)}
                      className="p-1"
                    >
                      {sound.isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                    </Button>
                  </div>
                </div>
                <Slider
                  value={[sound.volume]}
                  onValueChange={([value]) => setAmbientSoundVolume(sound.id, value)}
                  max={100}
                  step={1}
                  className="w-full"
                  disabled={sound.isMuted}
                />
              </div>
            ))}
          </div>
        )}

        {/* Master Controls */}
        {activeTab === 'master' && (
          <div className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900">{t('sound.master.volume')}</h4>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMasterMuted(!isMasterMuted)}
                    className="p-1 text-gray-700 hover:text-gray-900"
                  >
                    {isMasterMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
              <Slider
                value={[masterVolume]}
                onValueChange={([value]) => setMasterVolume(value)}
                max={100}
                step={1}
                className="w-full"
                disabled={isMasterMuted}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Button
                onClick={stopAllSounds}
                variant="outline"
                size="sm"
                className="w-full text-gray-700 border-gray-300 hover:bg-gray-50"
              >
                {t('sound.stop.all')}
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};