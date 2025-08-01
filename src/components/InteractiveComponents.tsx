import { useState, useRef, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, BookOpen, MapPin } from 'lucide-react';
import { PrayerTimes } from './PrayerTimes';
import { IslamicCalendar } from './IslamicCalendar';
import { QuranReader } from './QuranReader';

interface Position {
  x: number;
  y: number;
}

interface ComponentState {
  position: Position;
  visible: boolean;
}

interface InteractiveComponentsProps {
  roomId: string;
}

export const InteractiveComponents = ({ roomId }: InteractiveComponentsProps) => {
  const [dragState, setDragState] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuran, setShowQuran] = useState(false);

  // Component states with room-specific storage keys
  const [clock, setClock] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`clock-${roomId}`);
    return saved ? JSON.parse(saved) : { position: { x: 20, y: 20 }, visible: true };
  });

  const [calendar, setCalendar] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`calendar-${roomId}`);
    return saved ? JSON.parse(saved) : { position: { x: 20, y: 120 }, visible: true };
  });

  const [prayerMat, setPrayerMat] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`prayerMat-${roomId}`);
    return saved ? JSON.parse(saved) : { position: { x: 20, y: 220 }, visible: true };
  });

  const [quran, setQuran] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`quran-${roomId}`);
    return saved ? JSON.parse(saved) : { position: { x: 20, y: 320 }, visible: true };
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(`clock-${roomId}`, JSON.stringify(clock));
  }, [clock, roomId]);

  useEffect(() => {
    localStorage.setItem(`calendar-${roomId}`, JSON.stringify(calendar));
  }, [calendar, roomId]);

  useEffect(() => {
    localStorage.setItem(`prayerMat-${roomId}`, JSON.stringify(prayerMat));
  }, [prayerMat, roomId]);

  useEffect(() => {
    localStorage.setItem(`quran-${roomId}`, JSON.stringify(quran));
  }, [quran, roomId]);

  const handleMouseDown = (e: React.MouseEvent, componentId: string, currentPosition: Position) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    setDragState(componentId);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragState) return;

    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };

    // Constrain to viewport
    const constrainedPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 200, newPosition.x)),
      y: Math.max(0, Math.min(window.innerHeight - 100, newPosition.y))
    };

    switch (dragState) {
      case 'clock':
        setClock(prev => ({ ...prev, position: constrainedPosition }));
        break;
      case 'calendar':
        setCalendar(prev => ({ ...prev, position: constrainedPosition }));
        break;
      case 'prayerMat':
        setPrayerMat(prev => ({ ...prev, position: constrainedPosition }));
        break;
      case 'quran':
        setQuran(prev => ({ ...prev, position: constrainedPosition }));
        break;
    }
  };

  const handleMouseUp = () => {
    setDragState(null);
  };

  useEffect(() => {
    if (dragState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, dragOffset]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      {/* Clock Component */}
      {clock.visible && (
        <Card 
          className="fixed bg-black/70 backdrop-blur-sm border-white/20 text-white p-3 cursor-move z-30 select-none"
          style={{ 
            left: clock.position.x, 
            top: clock.position.y,
            transform: dragState === 'clock' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'clock', clock.position)}
        >
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <div className="text-sm">
              <div className="font-mono">{formatTime(currentTime)}</div>
              <div className="text-xs opacity-70">{formatDate(currentTime)}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Calendar Component */}
      {calendar.visible && (
        <Card 
          className="fixed bg-black/70 backdrop-blur-sm border-white/20 text-white p-3 cursor-move z-30 select-none"
          style={{ 
            left: calendar.position.x, 
            top: calendar.position.y,
            transform: dragState === 'calendar' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'calendar', calendar.position)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-white hover:bg-white/20 p-2"
            onClick={() => setShowCalendar(true)}
          >
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Islamic Calendar</span>
          </Button>
        </Card>
      )}

      {/* Prayer Mat Component */}
      {prayerMat.visible && (
        <Card 
          className="fixed bg-black/70 backdrop-blur-sm border-white/20 text-white p-3 cursor-move z-30 select-none"
          style={{ 
            left: prayerMat.position.x, 
            top: prayerMat.position.y,
            transform: dragState === 'prayerMat' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'prayerMat', prayerMat.position)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-white hover:bg-white/20 p-2"
            onClick={() => setShowPrayerTimes(true)}
          >
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Prayer Times</span>
          </Button>
        </Card>
      )}

      {/* Quran Component */}
      {quran.visible && (
        <Card 
          className="fixed bg-black/70 backdrop-blur-sm border-white/20 text-white p-3 cursor-move z-30 select-none"
          style={{ 
            left: quran.position.x, 
            top: quran.position.y,
            transform: dragState === 'quran' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'quran', quran.position)}
        >
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-white hover:bg-white/20 p-2"
            onClick={() => setShowQuran(true)}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm">Quran</span>
          </Button>
        </Card>
      )}

      {/* Modals */}
      <PrayerTimes isOpen={showPrayerTimes} onClose={() => setShowPrayerTimes(false)} />
      <IslamicCalendar isOpen={showCalendar} onClose={() => setShowCalendar(false)} />
      <QuranReader isVisible={showQuran} onClose={() => setShowQuran(false)} />

      {/* Global visibility controls - exposed via custom event */}
      <div className="hidden">
        <button
          id={`toggle-clock-${roomId}`}
          onClick={() => setClock(prev => ({ ...prev, visible: !prev.visible }))}
        />
        <button
          id={`toggle-calendar-${roomId}`}
          onClick={() => setCalendar(prev => ({ ...prev, visible: !prev.visible }))}
        />
        <button
          id={`toggle-prayerMat-${roomId}`}
          onClick={() => setPrayerMat(prev => ({ ...prev, visible: !prev.visible }))}
        />
        <button
          id={`toggle-quran-${roomId}`}
          onClick={() => setQuran(prev => ({ ...prev, visible: !prev.visible }))}
        />
      </div>
    </>
  );
};