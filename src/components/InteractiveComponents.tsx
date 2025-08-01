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
        <div 
          className="fixed cursor-move z-30 select-none"
          style={{ 
            left: clock.position.x, 
            top: clock.position.y,
            transform: dragState === 'clock' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'clock', clock.position)}
          onClick={() => setShowPrayerTimes(true)}
        >
          <div className="relative w-20 h-20 bg-gradient-to-br from-amber-100 to-amber-200 rounded-full border-4 border-amber-800 shadow-lg">
            <div className="absolute inset-2 bg-white rounded-full border-2 border-amber-700">
              <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-800 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
              {/* Hour hand */}
              <div 
                className="absolute top-1/2 left-1/2 w-0.5 h-5 bg-amber-900 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full"
                style={{ transform: `translate(-50%, -100%) rotate(${(currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5}deg)` }}
              ></div>
              {/* Minute hand */}
              <div 
                className="absolute top-1/2 left-1/2 w-0.5 h-6 bg-amber-800 rounded-full origin-bottom transform -translate-x-1/2 -translate-y-full"
                style={{ transform: `translate(-50%, -100%) rotate(${currentTime.getMinutes() * 6}deg)` }}
              ></div>
              {/* Hour markers */}
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-2 bg-amber-700"
                  style={{
                    top: '2px',
                    left: '50%',
                    transformOrigin: '50% 30px',
                    transform: `translateX(-50%) rotate(${i * 30}deg)`
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Calendar Component */}
      {calendar.visible && (
        <div 
          className="fixed cursor-move z-30 select-none"
          style={{ 
            left: calendar.position.x, 
            top: calendar.position.y,
            transform: dragState === 'calendar' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'calendar', calendar.position)}
          onClick={() => setShowCalendar(true)}
        >
          <div className="w-16 h-20 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg border border-red-900">
            <div className="h-4 bg-red-900 rounded-t-lg flex items-center justify-center">
              <div className="w-2 h-2 bg-red-300 rounded-full"></div>
            </div>
            <div className="p-1 text-white text-center">
              <div className="text-xs font-bold">{currentTime.toLocaleDateString('en', {month: 'short'}).toUpperCase()}</div>
              <div className="text-lg font-bold leading-none">{currentTime.getDate()}</div>
              <div className="text-xs">{currentTime.getFullYear()}</div>
            </div>
          </div>
        </div>
      )}

      {/* Prayer Mat Component */}
      {prayerMat.visible && (
        <div 
          className="fixed cursor-move z-30 select-none"
          style={{ 
            left: prayerMat.position.x, 
            top: prayerMat.position.y,
            transform: dragState === 'prayerMat' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'prayerMat', prayerMat.position)}
          onClick={() => setShowPrayerTimes(true)}
        >
          <div className="w-24 h-16 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 rounded-lg shadow-lg border-2 border-emerald-900 relative overflow-hidden">
            {/* Prayer mat pattern */}
            <div className="absolute inset-1 border border-emerald-400 rounded">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 border border-emerald-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-emerald-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
              </div>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-r border-b border-emerald-300 opacity-60"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-l border-b border-emerald-300 opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-r border-t border-emerald-300 opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-l border-t border-emerald-300 opacity-60"></div>
            </div>
          </div>
        </div>
      )}

      {/* Quran Component */}
      {quran.visible && (
        <div 
          className="fixed cursor-move z-30 select-none"
          style={{ 
            left: quran.position.x, 
            top: quran.position.y,
            transform: dragState === 'quran' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'quran', quran.position)}
          onClick={() => setShowQuran(true)}
        >
          <div className="relative">
            <div className="w-16 h-20 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-lg shadow-lg border border-amber-950 relative overflow-hidden">
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-950"></div>
              {/* Cover design */}
              <div className="absolute inset-2 border border-amber-400 rounded opacity-60">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-200 text-xs font-bold">
                  القرآن
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-300 opacity-80"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-amber-300 opacity-80"></div>
            </div>
            {/* Pages effect */}
            <div className="absolute top-0.5 right-0.5 w-15 h-19 bg-cream-100 rounded-r-lg border-r border-t border-b border-amber-200 opacity-30"></div>
          </div>
        </div>
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