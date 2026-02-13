import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useTranslation } from '@/contexts/TranslationContext';
import { Book, BookOpen, Calendar, Clock, MapPin, Settings, Volume2 } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InteractiveControlsMenuProps {
  roomId: string;
}

export const InteractiveControlsMenu = ({ roomId }: InteractiveControlsMenuProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [controls, setControls] = useState({
    clock: true,
    calendar: true,
    prayerMat: true,
    quran: true,
    bukhariBook: true,
    muslimBook: true,
    soundControls: true
  });

  // Load saved settings for this room
  useEffect(() => {
    const saved = localStorage.getItem(`controls-${roomId}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Ensure backward compatibility by adding new controls
      setControls({
        clock: parsed.clock ?? true,
        calendar: parsed.calendar ?? true,
        prayerMat: parsed.prayerMat ?? true,
        quran: parsed.quran ?? true,
        bukhariBook: parsed.bukhariBook ?? true,
        muslimBook: parsed.muslimBook ?? true,
        soundControls: parsed.soundControls ?? true
      });
    }
  }, [roomId]);

  // Save settings whenever they change
  useEffect(() => {
    localStorage.setItem(`controls-${roomId}`, JSON.stringify(controls));
  }, [controls, roomId]);

  const toggleComponent = (component: keyof typeof controls) => {
    const newControls = { ...controls, [component]: !controls[component] };
    setControls(newControls);

    // Trigger the toggle in the InteractiveComponents
    const toggleButton = document.getElementById(`toggle-${component}-${roomId}`);
    if (toggleButton) {
      toggleButton.click();
    }
  };

  return (
    <div className="fixed top-20 right-8 z-40">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 p-2"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-28 right-0 w-64 bg-black/80 backdrop-blur-sm border-white/20 text-white p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            {t('controls.title')}
          </h3>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">{t('controls.clock')}</span>
              </div>
              <Switch
                checked={controls.clock}
                onCheckedChange={() => toggleComponent('clock')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">{t('controls.calendar')}</span>
              </div>
              <Switch
                checked={controls.calendar}
                onCheckedChange={() => toggleComponent('calendar')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">{t('controls.prayer.times')}</span>
              </div>
              <Switch
                checked={controls.prayerMat}
                onCheckedChange={() => toggleComponent('prayerMat')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">{t('controls.quran')}</span>
              </div>
              <Switch
                checked={controls.quran}
                onCheckedChange={() => toggleComponent('quran')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span className="text-sm">{t('controls.bukhari')}</span>
              </div>
              <Switch
                checked={controls.bukhariBook}
                onCheckedChange={() => toggleComponent('bukhariBook')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Book className="w-4 h-4" />
                <span className="text-sm">{t('controls.muslim')}</span>
              </div>
              <Switch
                checked={controls.muslimBook}
                onCheckedChange={() => toggleComponent('muslimBook')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span className="text-sm">{t('controls.sound')}</span>
              </div>
              <Switch
                checked={controls.soundControls}
                onCheckedChange={() => toggleComponent('soundControls')}
              />
            </div>
          </div>

          <Separator className="my-3 bg-white/20" />

          <p className="text-xs text-white/70">
            {t('controls.drag.hint')}
          </p>
        </Card>
      )}
    </div>
  );
};