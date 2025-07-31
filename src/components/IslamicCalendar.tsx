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

const islamicEvents = [
  { name: 'Ramadan', date: 'March 10, 2024', type: 'holy-month', icon: '🌙' },
  { name: 'Eid al-Fitr', date: 'April 10, 2024', type: 'celebration', icon: '🎉' },
  { name: 'Hajj', date: 'June 14-19, 2024', type: 'pilgrimage', icon: '🕋' },
  { name: 'Eid al-Adha', date: 'June 16, 2024', type: 'celebration', icon: '🐑' },
  { name: 'Islamic New Year', date: 'July 7, 2024', type: 'new-year', icon: '📅' },
  { name: 'Day of Ashura', date: 'July 17, 2024', type: 'holy-day', icon: '⭐' },
  { name: 'Mawlid al-Nabi', date: 'September 15, 2024', type: 'holy-day', icon: '🌟' },
];

const getCurrentIslamicDate = () => {
  const now = new Date();
  // Approximate conversion from Gregorian to Islamic calendar
  // Islamic calendar started on July 16, 622 CE
  const islamicEpoch = new Date('622-07-16');
  const daysDiff = Math.floor((now.getTime() - islamicEpoch.getTime()) / (1000 * 60 * 60 * 24));
  
  // Islamic year is approximately 354.37 days
  const islamicYear = Math.floor(daysDiff / 354.37) + 1;
  const dayInYear = Math.floor(daysDiff % 354.37);
  
  const islamicMonths = [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhu al-Qi\'dah', 'Dhu al-Hijjah'
  ];
  
  // Approximate month and day calculation
  const monthIndex = Math.floor(dayInYear / 29.5);
  const dayInMonth = Math.floor(dayInYear % 29.5) + 1;
  
  return {
    day: dayInMonth,
    month: islamicMonths[monthIndex] || islamicMonths[0],
    year: islamicYear
  };
};

export const IslamicCalendar = ({ isOpen, onClose }: IslamicCalendarProps) => {
  const [timeToRamadan, setTimeToRamadan] = useState('');
  const [currentIslamicDate, setCurrentIslamicDate] = useState(getCurrentIslamicDate());

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