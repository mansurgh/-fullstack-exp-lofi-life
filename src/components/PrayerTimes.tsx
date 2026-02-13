import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useTranslation } from '@/contexts/TranslationContext';
import { Clock, MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface PrayerTimesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AladhanTimings {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export const PrayerTimes = ({ isOpen, onClose }: PrayerTimesProps) => {
  const { t } = useTranslation();
  const [cityName, setCityName] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationError, setLocationError] = useState(false);
  const [prayerTimings, setPrayerTimings] = useState<AladhanTimings | null>(null);
  const [loadingPrayers, setLoadingPrayers] = useState(false);
  const fetchedRef = useRef(false);

  // Request geolocation + fetch real prayer times from Aladhan API
  useEffect(() => {
    if (isOpen && !fetchedRef.current && !locationError) {
      setCityName(t('prayers.getting.location'));
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchedRef.current = true;

            // Reverse geocoding for city name via Nominatim
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&accept-language=en`)
              .then(res => res.json())
              .then(data => {
                const city = data.address?.city || data.address?.town || data.address?.village || data.address?.municipality || data.address?.county || '';
                const country = data.address?.country || '';
                setCityName(city ? `${city}, ${country}` : `${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);
              })
              .catch(() => {
                setCityName(`${lat.toFixed(2)}°, ${lon.toFixed(2)}°`);
              });

            // Fetch accurate prayer times from Aladhan API (method=2 = ISNA)
            setLoadingPrayers(true);
            const today = new Date();
            const dd = String(today.getDate()).padStart(2, '0');
            const mm = String(today.getMonth() + 1).padStart(2, '0');
            const yyyy = today.getFullYear();
            fetch(`https://api.aladhan.com/v1/timings/${dd}-${mm}-${yyyy}?latitude=${lat}&longitude=${lon}&method=2`)
              .then(res => res.json())
              .then(data => {
                if (data.code === 200 && data.data?.timings) {
                  setPrayerTimings(data.data.timings);
                }
                setLoadingPrayers(false);
              })
              .catch(() => setLoadingPrayers(false));
          },
          (error) => {
            console.error('Geolocation error:', error);
            setCityName(t('prayers.location.unavailable'));
            setLocationError(true);
          }
        );
      } else {
        setCityName(t('prayers.geolocation.unsupported'));
        setLocationError(true);
      }
    }
  }, [isOpen, locationError, t]);

  // Update clock every second — only when dialog is open
  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':');
    return Number(parts[0]) * 60 + Number(parts[1]);
  };

  const getPrayerList = () => {
    if (!prayerTimings) {
      return [
        { name: 'Fajr', time: '--:--', timeMinutes: 0 },
        { name: 'Dhuhr', time: '--:--', timeMinutes: 0 },
        { name: 'Asr', time: '--:--', timeMinutes: 0 },
        { name: 'Maghrib', time: '--:--', timeMinutes: 0 },
        { name: 'Isha', time: '--:--', timeMinutes: 0 },
      ];
    }
    return [
      { name: 'Fajr', time: prayerTimings.Fajr, timeMinutes: parseTime(prayerTimings.Fajr) },
      { name: 'Dhuhr', time: prayerTimings.Dhuhr, timeMinutes: parseTime(prayerTimings.Dhuhr) },
      { name: 'Asr', time: prayerTimings.Asr, timeMinutes: parseTime(prayerTimings.Asr) },
      { name: 'Maghrib', time: prayerTimings.Maghrib, timeMinutes: parseTime(prayerTimings.Maghrib) },
      { name: 'Isha', time: prayerTimings.Isha, timeMinutes: parseTime(prayerTimings.Isha) },
    ];
  };

  const prayers = getPrayerList();
  const nowMinutes = currentTime.getHours() * 60 + currentTime.getMinutes();

  const prayersWithStatus = prayers.map((prayer, index) => {
    const passed = prayerTimings ? nowMinutes > prayer.timeMinutes : false;
    const nextIdx = prayers.findIndex(p => p.timeMinutes > nowMinutes);
    const isCurrent = prayerTimings ? (nextIdx === index) || (nextIdx === -1 && index === 0) : false;
    return { ...prayer, passed, current: !passed && isCurrent };
  });

  const getCurrentPrayer = () => {
    const current = prayersWithStatus.find(p => p.current);
    return current ? current.name : 'Isha';
  };

  const getNextPrayer = () => {
    const currentIdx = prayersWithStatus.findIndex(p => p.current);
    const nextIdx = currentIdx + 1;
    return nextIdx < prayersWithStatus.length
      ? prayersWithStatus[nextIdx]
      : { name: 'Fajr', time: prayerTimings?.Fajr || '--:--' };
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-lg font-bold">
            🕐 {t('prayers.title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Card className="p-3 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-primary" />
              <span className="text-sm text-muted-foreground">{cityName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="font-mono text-lg">
                {currentTime.toLocaleTimeString()}
              </span>
            </div>
          </Card>

          {prayerTimings && (
            <Card className="p-3 border-primary/50">
              <div className="text-center">
                <h3 className="font-semibold text-primary">{t('prayers.current.time')}</h3>
                <p className="text-2xl font-bold">{getCurrentPrayer()}</p>
                <p className="text-sm text-muted-foreground">
                  {t('prayers.next')}: {getNextPrayer().name} {t('prayers.at')} {getNextPrayer().time}
                </p>
              </div>
            </Card>
          )}

          {loadingPrayers && (
            <div className="text-center text-sm text-muted-foreground">{t('prayers.loading')}</div>
          )}

          <div className="space-y-2">
            <h3 className="font-semibold">{t('prayers.today')}</h3>
            {prayersWithStatus.map((prayer, index) => (
              <Card key={index} className={`p-3 ${prayer.current ? 'border-primary bg-primary/5' : ''}`}>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{prayer.name}</span>
                    {prayer.current && (
                      <Badge variant="default" className="text-xs">{t('prayers.current.badge')}</Badge>
                    )}
                    {prayer.passed && !prayer.current && (
                      <Badge variant="secondary" className="text-xs">{t('prayers.completed.badge')}</Badge>
                    )}
                  </div>
                  <span className="font-mono">{prayer.time}</span>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-xs text-muted-foreground text-center">
            {t('prayers.disclaimer')}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};