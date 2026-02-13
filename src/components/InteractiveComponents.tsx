import { useTranslation } from '@/contexts/TranslationContext';
import { Volume2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { HadithReader } from './HadithReader';
import { IslamicCalendar } from './IslamicCalendar';
import { PrayerTimes } from './PrayerTimes';
import QuranReader from './QuranReader';
import { SoundControls } from './SoundControls';

// Isolated Clock widget — its 1s timer only re-renders this component, not the entire tree
const ClockWidget = React.memo(({ position, isDragging, onMouseDown }: {
  position: Position;
  isDragging: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}) => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      className="fixed cursor-move z-30 select-none"
      style={{ left: position.x, top: position.y, transform: isDragging ? 'scale(1.05)' : 'scale(1)' }}
      onMouseDown={onMouseDown}
    >
      <div className="bg-black/70 backdrop-blur-sm rounded-xl shadow-lg border border-white/20 px-2 py-2 sm:px-4 sm:py-3 text-white min-w-[100px] sm:min-w-[140px]">
        <div className="text-lg sm:text-2xl font-mono font-bold text-center leading-none">
          {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })}
        </div>
        <div className="text-[8px] sm:text-[10px] text-white/60 text-center mt-1 font-mono">
          {time.toLocaleTimeString('en-US', { second: '2-digit' }).slice(-2)}s
        </div>
        <div className="text-[10px] sm:text-xs text-white/50 text-center mt-1">
          {time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
        </div>
      </div>
    </div>
  );
});
ClockWidget.displayName = 'ClockWidget';

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
  const { t } = useTranslation();
  const [dragState, setDragState] = useState<string | null>(null);
  const [hasDragged, setHasDragged] = useState(false);
  const dragStartPos = useRef<Position>({ x: 0, y: 0 });
  const dragOffsetRef = useRef<Position>({ x: 0, y: 0 });
  const [showPrayerTimes, setShowPrayerTimes] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showQuran, setShowQuran] = useState(false);
  const [showBukhariHadith, setShowBukhariHadith] = useState(false);
  const [showMuslimHadith, setShowMuslimHadith] = useState(false);
  const [showSoundControls, setShowSoundControls] = useState(false);

  // Component states with room-specific storage keys

  // Grid layout: each widget ~90px wide, ~100px tall, 10px gap
  // Row 1 (y=200): Sound Controls, Prayer Mat
  // Row 2 (y=310): Quran, Bukhari, Muslim
  // Row 3 (y=420): Clock, Calendar

  const [clock, setClock] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`clock-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 10, y: 80 } : { x: 20, y: 420 },
      visible: true
    };
  });

  const [calendar, setCalendar] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`calendar-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 70, y: 80 } : { x: 120, y: 420 },
      visible: true
    };
  });

  const [prayerMat, setPrayerMat] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`prayerMat-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 130, y: 80 } : { x: 120, y: 200 },
      visible: true
    };
  });

  const [quran, setQuran] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`quran-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 10, y: 150 } : { x: 20, y: 310 },
      visible: true
    };
  });

  const [bukhariBook, setBukhariBook] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`bukhariBook-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 70, y: 150 } : { x: 120, y: 310 },
      visible: true
    };
  });

  const [muslimBook, setMuslimBook] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`muslimBook-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 130, y: 150 } : { x: 220, y: 310 },
      visible: true
    };
  });

  const [soundControls, setSoundControls] = useState<ComponentState>(() => {
    const saved = localStorage.getItem(`soundControls-${roomId}`);
    const isMobile = window.innerWidth < 640;
    return saved ? JSON.parse(saved) : {
      position: isMobile ? { x: 190, y: 80 } : { x: 20, y: 200 },
      visible: true
    };
  });

  const [calendarTime] = useState(new Date()); // static for calendar date display

  // Keep a ref to all positions for stable saveAllPositions
  const positionsRef = useRef({ clock, calendar, prayerMat, quran, bukhariBook, muslimBook, soundControls });
  positionsRef.current = { clock, calendar, prayerMat, quran, bukhariBook, muslimBook, soundControls };

  // Save to localStorage only on mouseUp (end of drag) — stable callback
  const saveAllPositions = useCallback(() => {
    const p = positionsRef.current;
    localStorage.setItem(`clock-${roomId}`, JSON.stringify(p.clock));
    localStorage.setItem(`calendar-${roomId}`, JSON.stringify(p.calendar));
    localStorage.setItem(`prayerMat-${roomId}`, JSON.stringify(p.prayerMat));
    localStorage.setItem(`quran-${roomId}`, JSON.stringify(p.quran));
    localStorage.setItem(`bukhariBook-${roomId}`, JSON.stringify(p.bukhariBook));
    localStorage.setItem(`muslimBook-${roomId}`, JSON.stringify(p.muslimBook));
    localStorage.setItem(`soundControls-${roomId}`, JSON.stringify(p.soundControls));
  }, [roomId]);

  const handleMouseDown = (e: React.MouseEvent, componentId: string, currentPosition: Position) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    dragOffsetRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    setHasDragged(false);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    setDragState(componentId);
    e.preventDefault();
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // If mouse moved more than 5px, consider it a drag (not a click)
    const dx = e.clientX - dragStartPos.current.x;
    const dy = e.clientY - dragStartPos.current.y;
    if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
      setHasDragged(true);
    }

    const newPosition = {
      x: e.clientX - dragOffsetRef.current.x,
      y: e.clientY - dragOffsetRef.current.y
    };

    // Constrain to viewport
    const constrainedPosition = {
      x: Math.max(0, Math.min(window.innerWidth - 200, newPosition.x)),
      y: Math.max(0, Math.min(window.innerHeight - 100, newPosition.y))
    };

    // We need to read dragState from the closure, but since this is only
    // attached when dragState is set, we use a ref
    const setterMap: Record<string, React.Dispatch<React.SetStateAction<ComponentState>>> = {
      clock: setClock, calendar: setCalendar, prayerMat: setPrayerMat,
      quran: setQuran, bukhariBook: setBukhariBook, muslimBook: setMuslimBook,
      soundControls: setSoundControls
    };
    // dragState is captured in closure via the useEffect that attaches this
    // We store it in a ref to keep handleMouseMove stable
    const setter = setterMap[dragStateRef.current || ''];
    if (setter) {
      setter(prev => ({ ...prev, position: constrainedPosition }));
    }
  }, []);

  const dragStateRef = useRef<string | null>(null);

  const handleMouseUp = useCallback(() => {
    if (dragStateRef.current) {
      saveAllPositions();
    }
    dragStateRef.current = null;
    setDragState(null);
  }, [saveAllPositions]);

  useEffect(() => {
    if (dragState) {
      dragStateRef.current = dragState;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, handleMouseMove, handleMouseUp]);

  // Stable onClose callbacks for memoized children
  const closeQuran = useCallback(() => setShowQuran(false), []);
  const closeBukhariHadith = useCallback(() => setShowBukhariHadith(false), []);
  const closeMuslimHadith = useCallback(() => setShowMuslimHadith(false), []);
  const closeSoundControls = useCallback(() => setShowSoundControls(false), []);
  const closePrayerTimes = useCallback(() => setShowPrayerTimes(false), []);
  const closeCalendar = useCallback(() => setShowCalendar(false), []);

  return (
    <>
      {/* Hidden toggle buttons for InteractiveControlsMenu */}
      <button id={`toggle-clock-${roomId}`} className="hidden" onClick={() => setClock(prev => ({ ...prev, visible: !prev.visible }))} />

      {/* Clock Widget — isolated component with its own timer */}
      {clock.visible && (
        <ClockWidget
          position={clock.position}
          isDragging={dragState === 'clock'}
          onMouseDown={(e) => handleMouseDown(e, 'clock', clock.position)}
        />
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
          onClick={() => { if (!hasDragged) setShowCalendar(true); }}
        >
          <div className="w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-red-600 to-red-800 rounded-lg shadow-lg border border-red-900 hover:shadow-xl transition-shadow">
            <div className="h-4 sm:h-5 bg-red-900 rounded-t-lg flex items-center justify-center">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-300 rounded-full"></div>
            </div>
            <div className="p-1 sm:p-2 text-white text-center">
              <div className="text-[10px] sm:text-xs font-bold">{calendarTime.toLocaleDateString('en', { month: 'short' }).toUpperCase()}</div>
              <div className="text-base sm:text-xl font-bold leading-none">{calendarTime.getDate()}</div>
              <div className="text-[10px] sm:text-xs">{calendarTime.getFullYear()}</div>
            </div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {t('component.calendar.tooltip')}
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
          onClick={() => { if (!hasDragged) setShowPrayerTimes(true); }}
        >
          <div className="w-16 h-14 sm:w-28 sm:h-20 bg-gradient-to-br from-emerald-700 via-emerald-600 to-emerald-800 rounded-lg shadow-lg border-2 border-emerald-900 relative overflow-hidden hover:shadow-xl transition-shadow">
            {/* Prayer mat pattern */}
            <div className="absolute inset-1 border border-emerald-400 rounded">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-6 h-6 sm:w-10 sm:h-10 border border-emerald-300 rounded-full opacity-60"></div>
                <div className="absolute top-1/2 left-1/2 w-3 h-3 sm:w-5 sm:h-5 border border-emerald-200 rounded-full transform -translate-x-1/2 -translate-y-1/2 opacity-80"></div>
              </div>
              {/* Decorative corners */}
              <div className="absolute top-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-r border-b border-emerald-300 opacity-60"></div>
              <div className="absolute top-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-l border-b border-emerald-300 opacity-60"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-3 sm:h-3 border-r border-t border-emerald-300 opacity-60"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 sm:w-3 sm:h-3 border-l border-t border-emerald-300 opacity-60"></div>
            </div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {t('component.prayers.tooltip')}
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
          onClick={() => { if (!hasDragged) setShowQuran(true); }}
        >
          <div className="relative">
            <div className="w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-amber-800 via-amber-700 to-amber-900 rounded-lg shadow-lg border border-amber-950 relative overflow-hidden hover:shadow-xl transition-shadow">
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-amber-950"></div>
              {/* Cover design */}
              <div className="absolute inset-2 border border-amber-400 rounded opacity-60">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-200 text-[10px] sm:text-sm font-bold">
                  القرآن
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-amber-300 opacity-80"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-amber-300 opacity-80"></div>
            </div>
            {/* Pages effect */}
            <div className="absolute top-0.5 right-0.5 w-18 h-22 bg-cream-100 rounded-r-lg border-r border-t border-b border-amber-200 opacity-30"></div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {t('component.quran.tooltip')}
            </div>
          </div>
        </div>
      )}

      {/* Bukhari Hadith Book Component */}
      {bukhariBook.visible && (
        <div
          className="fixed cursor-move z-30 select-none"
          style={{
            left: bukhariBook.position.x,
            top: bukhariBook.position.y,
            transform: dragState === 'bukhariBook' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'bukhariBook', bukhariBook.position)}
          onClick={() => { if (!hasDragged) setShowBukhariHadith(true); }}
        >
          <div className="relative">
            <div className="w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-green-800 via-green-700 to-green-900 rounded-lg shadow-lg border border-green-950 relative overflow-hidden hover:shadow-xl transition-shadow">
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-green-950"></div>
              {/* Cover design */}
              <div className="absolute inset-2 border border-green-400 rounded opacity-60">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-green-200 text-[10px] sm:text-sm font-bold text-center">
                  البخاري
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-300 opacity-80"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-green-300 opacity-80"></div>
            </div>
            {/* Pages effect */}
            <div className="absolute top-0.5 right-0.5 w-18 h-22 bg-cream-100 rounded-r-lg border-r border-t border-b border-green-200 opacity-30"></div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {t('component.bukhari.tooltip')}
            </div>
          </div>
        </div>
      )}

      {/* Muslim Hadith Book Component */}
      {muslimBook.visible && (
        <div
          className="fixed cursor-move z-30 select-none"
          style={{
            left: muslimBook.position.x,
            top: muslimBook.position.y,
            transform: dragState === 'muslimBook' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'muslimBook', muslimBook.position)}
          onClick={() => { if (!hasDragged) setShowMuslimHadith(true); }}
        >
          <div className="relative">
            <div className="w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-blue-800 via-blue-700 to-blue-900 rounded-lg shadow-lg border border-blue-950 relative overflow-hidden hover:shadow-xl transition-shadow">
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-0.5 sm:w-1 bg-blue-950"></div>
              {/* Cover design */}
              <div className="absolute inset-2 border border-blue-400 rounded opacity-60">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-200 text-[10px] sm:text-sm font-bold text-center">
                  مسلم
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-300 opacity-80"></div>
              <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-blue-300 opacity-80"></div>
            </div>
            {/* Pages effect */}
            <div className="absolute top-0.5 right-0.5 w-18 h-22 bg-cream-100 rounded-r-lg border-r border-t border-b border-blue-200 opacity-30"></div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {t('component.muslim.tooltip')}
            </div>
          </div>
        </div>
      )}

      {/* Sound Controls Component */}
      {soundControls.visible && (
        <div
          className="fixed cursor-move z-30 select-none"
          style={{
            left: soundControls.position.x,
            top: soundControls.position.y,
            transform: dragState === 'soundControls' ? 'scale(1.05)' : 'scale(1)'
          }}
          onMouseDown={(e) => handleMouseDown(e, 'soundControls', soundControls.position)}
          onClick={() => { if (!hasDragged) setShowSoundControls(true); }}
        >
          <div className="w-14 h-16 sm:w-20 sm:h-24 bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg shadow-lg border border-purple-900 hover:shadow-xl transition-shadow">
            <div className="h-4 sm:h-5 bg-purple-900 rounded-t-lg flex items-center justify-center">
              <Volume2 className="w-3 h-3 sm:w-4 sm:h-4 text-purple-300" />
            </div>
            <div className="p-1 sm:p-2 text-white text-center flex flex-col items-center justify-center" style={{ height: 'calc(100% - 16px)' }}>
              <div className="text-[8px] sm:text-[10px] font-bold leading-tight">{t('sound.controls')}</div>
            </div>
            {/* Tooltip */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity">
              {t('component.sound.tooltip')}
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <PrayerTimes isOpen={showPrayerTimes} onClose={closePrayerTimes} />
      <IslamicCalendar isOpen={showCalendar} onClose={closeCalendar} />
      <QuranReader isVisible={showQuran} onClose={closeQuran} />
      <HadithReader isVisible={showBukhariHadith} onClose={closeBukhariHadith} collection="bukhari" />
      <HadithReader isVisible={showMuslimHadith} onClose={closeMuslimHadith} collection="muslim" />
      <SoundControls roomId={roomId} isVisible={showSoundControls} onClose={closeSoundControls} />

      {/* Global visibility controls - exposed via custom event */}
      <div className="hidden">

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
        <button
          id={`toggle-bukhariBook-${roomId}`}
          onClick={() => setBukhariBook(prev => ({ ...prev, visible: !prev.visible }))}
        />
        <button
          id={`toggle-muslimBook-${roomId}`}
          onClick={() => setMuslimBook(prev => ({ ...prev, visible: !prev.visible }))}
        />
        <button
          id={`toggle-soundControls-${roomId}`}
          onClick={() => setSoundControls(prev => ({ ...prev, visible: !prev.visible }))}
        />
      </div>
    </>
  );
};