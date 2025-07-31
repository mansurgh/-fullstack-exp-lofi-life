import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface PrayersListProps {
  isOpen: boolean;
  onClose: () => void;
}

const obligatoryPrayers = [
  { name: 'Fajr', rakats: 2, time: 'Dawn' },
  { name: 'Dhuhr', rakats: 4, time: 'Midday' },
  { name: 'Asr', rakats: 4, time: 'Afternoon' },
  { name: 'Maghrib', rakats: 3, time: 'Sunset' },
  { name: 'Isha', rakats: 4, time: 'Night' },
];

const optionalPrayers = [
  { name: 'Tahajjud', rakats: '2-12', time: 'Night' },
  { name: 'Duha', rakats: '2-12', time: 'Morning' },
  { name: 'Istikharah', rakats: 2, time: 'Any time' },
  { name: 'Tarawih', rakats: 20, time: 'Ramadan nights' },
  { name: 'Witr', rakats: '1-11', time: 'After Isha' },
  { name: 'Sunnah before Fajr', rakats: 2, time: 'Before Fajr' },
  { name: 'Sunnah before Dhuhr', rakats: 4, time: 'Before Dhuhr' },
  { name: 'Sunnah after Dhuhr', rakats: 2, time: 'After Dhuhr' },
  { name: 'Sunnah after Maghrib', rakats: 2, time: 'After Maghrib' },
  { name: 'Sunnah after Isha', rakats: 2, time: 'After Isha' },
];

export const PrayersList = ({ isOpen, onClose }: PrayersListProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            🕌 Islamic Prayers
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Obligatory Prayers */}
          <div>
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">Required</Badge>
              Obligatory Prayers (Fard)
            </h3>
            <div className="space-y-2">
              {obligatoryPrayers.map((prayer, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{prayer.name}</h4>
                      <p className="text-sm text-muted-foreground">{prayer.time}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {prayer.rakats} Rakats
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Optional Prayers */}
          <div>
            <h3 className="font-semibold text-primary mb-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Optional</Badge>
              Sunnah & Nafl Prayers
            </h3>
            <div className="space-y-2">
              {optionalPrayers.map((prayer, index) => (
                <Card key={index} className="p-3">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-medium">{prayer.name}</h4>
                      <p className="text-sm text-muted-foreground">{prayer.time}</p>
                    </div>
                    <Badge variant="outline" className="text-sm">
                      {prayer.rakats} Rakats
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};