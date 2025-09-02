// src/components/QuranReader.tsx
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, SkipBack, SkipForward, X } from "lucide-react";
import { fetchSurahVerses, loadCachedSurah, VerseDTO } from "@/lib/quranApi";

interface QuranReaderProps {
  onClose: () => void;
  isVisible: boolean;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  verses: number;
}

// сокращённый список для примера — у тебя уже есть полный на 114 сур
const surahs: Surah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", verses: 7 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", verses: 286 },
  { number: 114, name: "الناس", englishName: "An-Nas", verses: 6 },
];

export default function QuranReader({ onClose, isVisible }: QuranReaderProps) {
  const [selectedSurah, setSelectedSurah] = useState<string>("1");
  const [verses, setVerses] = useState<VerseDTO[]>([]);
  const [currentVerse, setCurrentVerse] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [showTranslation, setShowTranslation] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const activeRef = useRef<HTMLDivElement | null>(null);
  const sourceIndexRef = useRef<number>(0);

  // Формируем список источников для текущего аята: локально → CDN
  const getAudioSources = (surah: number, ayah: number): string[] => {
    const local = `/quran-audio/basit/${surah}/${ayah}.mp3`;
    const cdn1 = `https://cdn.islamic.network/quran/audio/ayah/ar.abdulbasitmurattal/${surah}:${ayah}.mp3`;
    const cdn2 = `https://server8.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${ayah.toString().padStart(3, '0')}.mp3`;
    const cdn3 = `https://www.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${ayah.toString().padStart(3, '0')}.mp3`;
    return [local, cdn1, cdn2, cdn3];
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    setIsPlaying(false);
    setCurrentVerse(0);

    const cached = loadCachedSurah(selectedSurah);
    if (cached && mounted) {
      setVerses(cached);
      setLoading(false);
    }

    fetchSurahVerses(selectedSurah)
      .then((v) => {
        if (mounted) {
          setVerses(v);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Failed to load surah");
          setVerses([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedSurah]);

  // Настройка аудио и воспроизведения
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.crossOrigin = "anonymous";

    const onEnded = () => {
      if (currentVerse < verses.length - 1) {
        setCurrentVerse((v) => v + 1);
      } else {
        setIsPlaying(false);
      }
    };

    const onError = () => {
      // Пробуем следующий источник
      const verse = verses[currentVerse];
      if (!verse) return;
      const surah = Number(selectedSurah);
      const sources = getAudioSources(surah, currentVerse + 1);
      sourceIndexRef.current += 1;
      const nextSrc = sources[sourceIndexRef.current];
      if (nextSrc) {
        audio.src = nextSrc;
        audio.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("ended", onEnded);
    audio.addEventListener("error", onError);
    return () => {
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("error", onError);
    };
  }, [currentVerse, verses.length, selectedSurah]);

  // При старте/смене аята загружаем аудио с фолбеком
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!isPlaying) return;
    const verse = verses[currentVerse];
    if (!verse) return;

    console.log('Loading audio for verse:', currentVerse + 1, 'surah:', selectedSurah);
    
    const surah = Number(selectedSurah);
    const sources = getAudioSources(surah, currentVerse + 1);
    console.log('Audio sources:', sources);
    
    sourceIndexRef.current = 0;
    audio.src = sources[0];
    
    // Добавляем обработчики событий
    const handleCanPlay = () => {
      console.log('Audio can play, starting...');
      audio.play().then(() => {
        console.log('Audio started successfully from source:', sources[0]);
      }).catch((error) => {
        console.error('Failed to play audio from source 1:', error);
        // Пробуем второй источник
        if (sources[1]) {
          console.log('Trying alternative source:', sources[1]);
          sourceIndexRef.current = 1;
          audio.src = sources[1];
          audio.play().catch((altError) => {
            console.error('Failed to play alternative audio:', altError);
            setIsPlaying(false);
            alert('Unable to play audio. Please check your internet connection.');
          });
        } else {
          setIsPlaying(false);
          alert('Unable to play audio. Please check your internet connection.');
        }
      });
    };

    const handleError = (error: Event) => {
      console.error('Audio error:', error);
      // Пробуем второй источник при ошибке
      if (sources[1] && sourceIndexRef.current === 0) {
        console.log('Trying alternative source on error:', sources[1]);
        sourceIndexRef.current = 1;
        audio.src = sources[1];
        audio.play().catch((altError) => {
          console.error('Failed to play alternative audio on error:', altError);
          setIsPlaying(false);
          alert('Unable to play audio. Please check your internet connection.');
        });
      } else {
        setIsPlaying(false);
        alert('Unable to play audio. Please check your internet connection.');
      }
    };

    // Убираем старые обработчики
    audio.removeEventListener('canplay', handleCanPlay);
    audio.removeEventListener('error', handleError);
    
    // Добавляем новые обработчики
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    
    // Загружаем аудио
    audio.load();
    
    // Очистка обработчиков
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [isPlaying, currentVerse, verses, selectedSurah]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentVerse]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !verses.length) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };

  const nextVerse = () => {
    if (currentVerse < verses.length - 1) setCurrentVerse((v) => v + 1);
    else setIsPlaying(false);
  };

  const prevVerse = () => {
    if (currentVerse > 0) setCurrentVerse((v) => v - 1);
  };

  if (!isVisible) return null;

  return (
    <Card className="fixed inset-4 z-50 p-4 space-y-4 bg-card/95 backdrop-blur border border-border overflow-hidden">
      <div className="flex items-center justify-between gap-2">
        <Select value={selectedSurah} onValueChange={setSelectedSurah}>
          <SelectTrigger className="w-[240px]">
            <SelectValue placeholder="Select Surah" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            {surahs.map((s) => (
              <SelectItem key={s.number} value={String(s.number)}>
                {s.number}. {s.englishName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={prevVerse} disabled={currentVerse === 0 || !verses.length}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button variant="default" size="icon" onClick={togglePlay} disabled={!verses.length || loading}>
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={nextVerse}
            disabled={!verses.length || currentVerse === verses.length - 1}
          >
            <SkipForward className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose} title="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {loading && <div className="text-sm text-muted-foreground">Loading…</div>}
      {error && <div className="text-sm text-red-500">Error: {error}</div>}
      


      <div className="max-h-[65vh] overflow-y-auto space-y-3">
        {verses.map((v, idx) => {
          const active = idx === currentVerse && isPlaying;
          return (
            <div
              key={idx}
              ref={idx === currentVerse ? activeRef : null}
              onClick={() => setCurrentVerse(idx)}
              className={`p-3 rounded transition cursor-pointer ${
                active ? "bg-accent/20 ring-1 ring-accent" : "hover:bg-muted/40"
              }`}
            >
              <p dir="rtl" className="text-right text-xl leading-relaxed">
                {v.arabic}
              </p>
              {showTranslation && <p className="text-sm mt-1 text-muted-foreground">{v.translation}</p>}
            </div>
          );
        })}
        {!loading && !verses.length && !error && (
          <div className="text-sm text-muted-foreground">No verses loaded.</div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <Switch checked={showTranslation} onCheckedChange={setShowTranslation} />
        <span className="text-sm">Show translation</span>
        
        {/* Debug button for testing audio */}
        <Button
          onClick={() => {
            const testAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
            testAudio.volume = 0.1;
            testAudio.play().then(() => {
              console.log('Test audio played successfully');
              setTimeout(() => testAudio.pause(), 1000);
            }).catch((error) => {
              console.error('Test audio failed:', error);
              alert('Audio test failed: ' + error.message);
            });
          }}
          size="sm"
          variant="outline"
          className="text-xs"
        >
          Test Audio
        </Button>
      </div>

      <audio ref={audioRef} />
    </Card>
  );
}
