import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Settings, Clock, Calendar, BookOpen, MapPin } from 'lucide-react';

interface InteractiveControlsMenuProps {
  roomId: string;
}

export const InteractiveControlsMenu = ({ roomId }: InteractiveControlsMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [controls, setControls] = useState({
    clock: true,
    calendar: true,
    prayerMat: true,
    quran: true
  });

  // Load saved settings for this room
  useEffect(() => {
    const saved = localStorage.getItem(`controls-${roomId}`);
    if (saved) {
      setControls(JSON.parse(saved));
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
    <div className="fixed top-4 right-16 z-40">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-black/50 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20 p-2"
      >
        <Settings className="w-4 h-4" />
      </Button>

      {isOpen && (
        <Card className="absolute top-12 right-0 w-64 bg-black/80 backdrop-blur-sm border-white/20 text-white p-4">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Interactive Components
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm">Clock</span>
              </div>
              <Switch
                checked={controls.clock}
                onCheckedChange={() => toggleComponent('clock')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Islamic Calendar</span>
              </div>
              <Switch
                checked={controls.calendar}
                onCheckedChange={() => toggleComponent('calendar')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm">Prayer Times</span>
              </div>
              <Switch
                checked={controls.prayerMat}
                onCheckedChange={() => toggleComponent('prayerMat')}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">Quran Reader</span>
              </div>
              <Switch
                checked={controls.quran}
                onCheckedChange={() => toggleComponent('quran')}
              />
            </div>
          </div>

          <Separator className="my-3 bg-white/20" />
          
          <p className="text-xs text-white/70">
            Drag components to reposition them. Settings are saved per room.
          </p>
        </Card>
      )}
    </div>
  );
};