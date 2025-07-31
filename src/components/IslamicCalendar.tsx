import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Star } from 'lucide-react';

interface IslamicCalendarProps {
  isOpen: boolean;
  onClose: () => void;
}

const getUpcomingIslamicEvents = () => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const nextYear = currentYear + 1;
  
  const events = [
    // 2025 events
    { name: 'Ramadan', date: 'February 28, 2025', type: 'holy-month', icon: '🌙' },
    { name: 'Eid al-Fitr', date: 'March 30, 2025', type: 'celebration', icon: '🎉' },
    { name: 'Hajj', date: 'June 3-8, 2025', type: 'pilgrimage', icon: '🕋' },
    { name: 'Eid al-Adha', date: 'June 6, 2025', type: 'celebration', icon: '🐑' },
    { name: 'Islamic New Year', date: 'June 26, 2025', type: 'new-year', icon: '📅' },
    { name: 'Day of Ashura', date: 'July 5, 2025', type: 'holy-day', icon: '⭐' },
    { name: 'Mawlid al-Nabi', date: 'September 4, 2025', type: 'holy-day', icon: '🌟' },
    
    // 2026 events
    { name: 'Ramadan', date: 'February 17, 2026', type: 'holy-month', icon: '🌙' },
    { name: 'Eid al-Fitr', date: 'March 19, 2026', type: 'celebration', icon: '🎉' },
    { name: 'Hajj', date: 'May 23-28, 2026', type: 'pilgrimage', icon: '🕋' },
    { name: 'Eid al-Adha', date: 'May 26, 2026', type: 'celebration', icon: '🐑' },
    { name: 'Islamic New Year', date: 'June 15, 2026', type: 'new-year', icon: '📅' },
    { name: 'Day of Ashura', date: 'June 24, 2026', type: 'holy-day', icon: '⭐' },
    { name: 'Mawlid al-Nabi', date: 'August 24, 2026', type: 'holy-day', icon: '🌟' },
  ];
  
  // Filter to show only upcoming events
  return events.filter(event => {
    const eventDate = new Date(event.date.split(',')[0] + ', ' + event.date.split(', ')[1]);
    return eventDate >= now;
  }).slice(0, 8); // Show next 8 upcoming events
};

const getCurrentIslamicDate = () => {
  const now = new Date();
  // More accurate Islamic calendar calculation
  // Islamic calendar epoch: July 16, 622 CE (1 Muharram 1 AH)
  const islamicEpoch = new Date('622-07-16');
  const daysDiff = Math.floor((now.getTime() - islamicEpoch.getTime()) / (1000 * 60 * 60 * 24));
  
  // Islamic year is 354.367 days on average
  const islamicYear = Math.floor(daysDiff / 354.367) + 1;
  const dayInYear = Math.floor(daysDiff % 354.367);
  
  const islamicMonths = [
    'Muharram', 'Safar', 'Rabi\' al-Awwal', 'Rabi\' al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];
  
  // Each Islamic month alternates between 29 and 30 days
  const monthLengths = [30, 29, 30, 29, 30, 29, 30, 29, 30, 29, 30, 29];
  
  let currentDay = dayInYear;
  let monthIndex = 0;
  
  while (currentDay >= monthLengths[monthIndex] && monthIndex < 11) {
    currentDay -= monthLengths[monthIndex];
    monthIndex++;
  }
  
  return {
    day: currentDay + 1,
    month: islamicMonths[monthIndex],
    year: islamicYear
  };
};

export const IslamicCalendar = ({ isOpen, onClose }: IslamicCalendarProps) => {
  const [timeToRamadan, setTimeToRamadan] = useState('');
  const [currentIslamicDate, setCurrentIslamicDate] = useState(getCurrentIslamicDate());
  const [islamicEvents] = useState(getUpcomingIslamicEvents());

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentIslamicDate(getCurrentIslamicDate());
      
      const nextRamadan = new Date('2025-02-28'); // Next Ramadan (approximate)
      const diff = nextRamadan.getTime() - now.getTime();
      
      if (diff > 0) {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        setTimeToRamadan(`${days} days, ${hours} hours, ${minutes} minutes`);
      } else {
        setTimeToRamadan('Ramadan has passed this year');
      }
    };

    updateTime();
    const timer = setInterval(updateTime, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'holy-month': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'celebration': return 'bg-green-100 text-green-800 border-green-200';
      case 'pilgrimage': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'holy-day': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'new-year': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            📅 Islamic Calendar
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Current Islamic Date */}
          <Card className="p-4 bg-primary/5 border-primary/20">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl">🌙</span>
                <h3 className="font-semibold text-primary">Today's Islamic Date</h3>
              </div>
              <p className="text-xl font-bold">
                {currentIslamicDate.day} {currentIslamicDate.month}
              </p>
              <p className="text-lg text-muted-foreground">
                {currentIslamicDate.year} AH
              </p>
            </div>
          </Card>

          {/* Ramadan Countdown */}
          <Card className="p-4 border-purple-200 bg-purple-50">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-xl">🌙</span>
                <h3 className="font-semibold text-purple-800">Next Ramadan</h3>
              </div>
              <p className="text-sm text-purple-600 font-medium">
                {timeToRamadan}
              </p>
            </div>
          </Card>

          <Separator />

          {/* Islamic Events */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Upcoming Islamic Events
            </h3>
            <div className="space-y-2">
              {islamicEvents.map((event, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{event.icon}</span>
                      <div>
                        <h4 className="font-medium">{event.name}</h4>
                        <p className="text-sm text-muted-foreground">{event.date}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getEventTypeColor(event.type)}`}
                    >
                      {event.type.replace('-', ' ')}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            Dates are approximate and may vary based on moon sighting. Please verify with your local Islamic authority.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};