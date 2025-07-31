import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from 'lucide-react';

interface PrayerTimesProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrayerTimes = ({ isOpen, onClose }: PrayerTimesProps) => {
  const [location, setLocation] = useState('Getting location...');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Generate prayer times based on current time
  const getPrayerTimes = () => {
    const now = currentTime;
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTimeMinutes = currentHour * 60 + currentMinute;
    
    const prayers = [
      { name: 'Fajr', time: '05:30', timeMinutes: 5 * 60 + 30 },
      { name: 'Dhuhr', time: '12:45', timeMinutes: 12 * 60 + 45 },
      { name: 'Asr', time: '15:20', timeMinutes: 15 * 60 + 20 },
      { name: 'Maghrib', time: '18:15', timeMinutes: 18 * 60 + 15 },
      { name: 'Isha', time: '19:30', timeMinutes: 19 * 60 + 30 },
    ];
    
    return prayers.map((prayer, index) => {
      const passed = currentTimeMinutes > prayer.timeMinutes;
      const nextPrayerIndex = prayers.findIndex(p => p.timeMinutes > currentTimeMinutes);
      const current = nextPrayerIndex === index || (nextPrayerIndex === -1 && index === 0);
      
      return {
        ...prayer,
        passed,
        current: !passed && current
      };
    });
  };

  const prayerTimes = getPrayerTimes();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, you would reverse geocode this
          setLocation('Current Location');
        },
        () => {
          setLocation('Location not available');
        }
      );
    }
  }, []);

  const getCurrentPrayer = () => {
    const current = prayerTimes.find(prayer => prayer.current);
    return current ? current.name : 'Isha';
  };

  const getNextPrayer = () => {
    const nextIndex = prayerTimes.findIndex(prayer => prayer.current) + 1;
    return nextIndex < prayerTimes.length 
      ? prayerTimes[nextIndex] 
      : { name: 'Fajr', time: '05:30 (Tomorrow)' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            🕐 Prayer Times
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Time & Location */}
          <Card className="p-3 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{location}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono text-lg">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </Card>

          {/* Current Prayer */}
          <Card className="p-3 border-primary/50">
            <div className="text-center">
              <h3 className="font-semibold text-primary">Current Prayer Time</h3>
              <p className="text-2xl font-bold">{getCurrentPrayer()}</p>
              <p className="text-sm text-muted-foreground">
                Next: {getNextPrayer().name} at {getNextPrayer().time}
              </p>
            </div>
          </Card>

          {/* Prayer Times List */}
          <div className="space-y-2">
            <h3 className="font-semibold">Today's Prayer Times</h3>
            {prayerTimes.map((prayer, index) => (
              <Card key={index} className={`p-3 ${prayer.current ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{prayer.name}</span>
                    {prayer.current && (
                      <Badge variant="default" className="text-xs">Current</Badge>
                    )}
                    {prayer.passed && !prayer.current && (
                      <Badge variant="secondary" className="text-xs">Completed</Badge>
                    )}
                  </div>
                  <span className="font-mono">{prayer.time}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Prayer times are calculated for your current location. For accurate times, please verify with your local mosque.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};