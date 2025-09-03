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

// Полный список всех 114 сур Корана
const surahs: Surah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", verses: 7 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", verses: 286 },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", verses: 200 },
  { number: 4, name: "النساء", englishName: "An-Nisa", verses: 176 },
  { number: 5, name: "المائدة", englishName: "Al-Ma'idah", verses: 120 },
  { number: 6, name: "الأنعام", englishName: "Al-An'am", verses: 165 },
  { number: 7, name: "الأعراف", englishName: "Al-A'raf", verses: 206 },
  { number: 8, name: "الأنفال", englishName: "Al-Anfal", verses: 75 },
  { number: 9, name: "التوبة", englishName: "At-Tawbah", verses: 129 },
  { number: 10, name: "يونس", englishName: "Yunus", verses: 109 },
  { number: 11, name: "هود", englishName: "Hud", verses: 123 },
  { number: 12, name: "يوسف", englishName: "Yusuf", verses: 111 },
  { number: 13, name: "الرعد", englishName: "Ar-Ra'd", verses: 43 },
  { number: 14, name: "إبراهيم", englishName: "Ibrahim", verses: 52 },
  { number: 15, name: "الحجر", englishName: "Al-Hijr", verses: 99 },
  { number: 16, name: "النحل", englishName: "An-Nahl", verses: 128 },
  { number: 17, name: "الإسراء", englishName: "Al-Isra", verses: 111 },
  { number: 18, name: "الكهف", englishName: "Al-Kahf", verses: 110 },
  { number: 19, name: "مريم", englishName: "Maryam", verses: 98 },
  { number: 20, name: "طه", englishName: "Taha", verses: 135 },
  { number: 21, name: "الأنبياء", englishName: "Al-Anbiya", verses: 112 },
  { number: 22, name: "الحج", englishName: "Al-Hajj", verses: 78 },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", verses: 118 },
  { number: 24, name: "النور", englishName: "An-Nur", verses: 64 },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", verses: 77 },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", verses: 227 },
  { number: 27, name: "النمل", englishName: "An-Naml", verses: 93 },
  { number: 28, name: "القصص", englishName: "Al-Qasas", verses: 88 },
  { number: 29, name: "العنكبوت", englishName: "Al-Ankabut", verses: 69 },
  { number: 30, name: "الروم", englishName: "Ar-Rum", verses: 60 },
  { number: 31, name: "لقمان", englishName: "Luqman", verses: 34 },
  { number: 32, name: "السجدة", englishName: "As-Sajdah", verses: 30 },
  { number: 33, name: "الأحزاب", englishName: "Al-Ahzab", verses: 73 },
  { number: 34, name: "سبأ", englishName: "Saba", verses: 54 },
  { number: 35, name: "فاطر", englishName: "Fatir", verses: 45 },
  { number: 36, name: "يس", englishName: "Ya-Sin", verses: 83 },
  { number: 37, name: "الصافات", englishName: "As-Saffat", verses: 182 },
  { number: 38, name: "ص", englishName: "Sad", verses: 88 },
  { number: 39, name: "الزمر", englishName: "Az-Zumar", verses: 75 },
  { number: 40, name: "غافر", englishName: "Ghafir", verses: 85 },
  { number: 41, name: "فصلت", englishName: "Fussilat", verses: 54 },
  { number: 42, name: "الشورى", englishName: "Ash-Shura", verses: 53 },
  { number: 43, name: "الزخرف", englishName: "Az-Zukhruf", verses: 89 },
  { number: 44, name: "الدخان", englishName: "Ad-Dukhan", verses: 59 },
  { number: 45, name: "الجاثية", englishName: "Al-Jathiyah", verses: 37 },
  { number: 46, name: "الأحقاف", englishName: "Al-Ahqaf", verses: 35 },
  { number: 47, name: "محمد", englishName: "Muhammad", verses: 38 },
  { number: 48, name: "الفتح", englishName: "Al-Fath", verses: 29 },
  { number: 49, name: "الحجرات", englishName: "Al-Hujurat", verses: 18 },
  { number: 50, name: "ق", englishName: "Qaf", verses: 45 },
  { number: 51, name: "الذاريات", englishName: "Adh-Dhariyat", verses: 60 },
  { number: 52, name: "الطور", englishName: "At-Tur", verses: 49 },
  { number: 53, name: "النجم", englishName: "An-Najm", verses: 62 },
  { number: 54, name: "القمر", englishName: "Al-Qamar", verses: 55 },
  { number: 55, name: "الرحمن", englishName: "Ar-Rahman", verses: 78 },
  { number: 56, name: "الواقعة", englishName: "Al-Waqi'ah", verses: 96 },
  { number: 57, name: "الحديد", englishName: "Al-Hadid", verses: 29 },
  { number: 58, name: "المجادلة", englishName: "Al-Mujadila", verses: 22 },
  { number: 59, name: "الحشر", englishName: "Al-Hashr", verses: 24 },
  { number: 60, name: "الممتحنة", englishName: "Al-Mumtahanah", verses: 13 },
  { number: 61, name: "الصف", englishName: "As-Saff", verses: 14 },
  { number: 62, name: "الجمعة", englishName: "Al-Jumu'ah", verses: 11 },
  { number: 63, name: "المنافقون", englishName: "Al-Munafiqun", verses: 11 },
  { number: 64, name: "التغابن", englishName: "At-Taghabun", verses: 18 },
  { number: 65, name: "الطلاق", englishName: "At-Talaq", verses: 12 },
  { number: 66, name: "التحريم", englishName: "At-Tahrim", verses: 12 },
  { number: 67, name: "الملك", englishName: "Al-Mulk", verses: 30 },
  { number: 68, name: "القلم", englishName: "Al-Qalam", verses: 52 },
  { number: 69, name: "الحاقة", englishName: "Al-Haqqah", verses: 52 },
  { number: 70, name: "المعارج", englishName: "Al-Ma'arij", verses: 44 },
  { number: 71, name: "نوح", englishName: "Nuh", verses: 28 },
  { number: 72, name: "الجن", englishName: "Al-Jinn", verses: 28 },
  { number: 73, name: "المزمل", englishName: "Al-Muzzammil", verses: 20 },
  { number: 74, name: "المدثر", englishName: "Al-Muddaththir", verses: 56 },
  { number: 75, name: "القيامة", englishName: "Al-Qiyamah", verses: 40 },
  { number: 76, name: "الإنسان", englishName: "Al-Insan", verses: 31 },
  { number: 77, name: "المرسلات", englishName: "Al-Mursalat", verses: 50 },
  { number: 78, name: "النبأ", englishName: "An-Naba", verses: 40 },
  { number: 79, name: "النازعات", englishName: "An-Nazi'at", verses: 46 },
  { number: 80, name: "عبس", englishName: "Abasa", verses: 42 },
  { number: 81, name: "التكوير", englishName: "At-Takwir", verses: 29 },
  { number: 82, name: "الانفطار", englishName: "Al-Infitar", verses: 19 },
  { number: 83, name: "المطففين", englishName: "Al-Mutaffifin", verses: 36 },
  { number: 84, name: "الانشقاق", englishName: "Al-Inshiqaq", verses: 25 },
  { number: 85, name: "البروج", englishName: "Al-Buruj", verses: 22 },
  { number: 86, name: "الطارق", englishName: "At-Tariq", verses: 17 },
  { number: 87, name: "الأعلى", englishName: "Al-A'la", verses: 19 },
  { number: 88, name: "الغاشية", englishName: "Al-Ghashiyah", verses: 26 },
  { number: 89, name: "الفجر", englishName: "Al-Fajr", verses: 30 },
  { number: 90, name: "البلد", englishName: "Al-Balad", verses: 20 },
  { number: 91, name: "الشمس", englishName: "Ash-Shams", verses: 15 },
  { number: 92, name: "الليل", englishName: "Al-Layl", verses: 21 },
  { number: 93, name: "الضحى", englishName: "Ad-Duha", verses: 11 },
  { number: 94, name: "الشرح", englishName: "Ash-Sharh", verses: 8 },
  { number: 95, name: "التين", englishName: "At-Tin", verses: 8 },
  { number: 96, name: "العلق", englishName: "Al-Alaq", verses: 19 },
  { number: 97, name: "القدر", englishName: "Al-Qadr", verses: 5 },
  { number: 98, name: "البينة", englishName: "Al-Bayyinah", verses: 8 },
  { number: 99, name: "الزلزلة", englishName: "Az-Zalzalah", verses: 8 },
  { number: 100, name: "العاديات", englishName: "Al-Adiyat", verses: 11 },
  { number: 101, name: "القارعة", englishName: "Al-Qari'ah", verses: 11 },
  { number: 102, name: "التكاثر", englishName: "At-Takathur", verses: 8 },
  { number: 103, name: "العصر", englishName: "Al-Asr", verses: 3 },
  { number: 104, name: "الهمزة", englishName: "Al-Humazah", verses: 9 },
  { number: 105, name: "الفيل", englishName: "Al-Fil", verses: 5 },
  { number: 106, name: "قريش", englishName: "Quraysh", verses: 4 },
  { number: 107, name: "الماعون", englishName: "Al-Ma'un", verses: 7 },
  { number: 108, name: "الكوثر", englishName: "Al-Kawthar", verses: 3 },
  { number: 109, name: "الكافرون", englishName: "Al-Kafirun", verses: 6 },
  { number: 110, name: "النصر", englishName: "An-Nasr", verses: 3 },
  { number: 111, name: "المسد", englishName: "Al-Masad", verses: 5 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", verses: 4 },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", verses: 5 },
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

    // Проверяем кэш и очищаем если содержит placeholder
    const cached = loadCachedSurah(selectedSurah);
    if (cached && mounted) {
      setVerses(cached);
      setLoading(false);
    }

    // Всегда загружаем свежие данные с API
    console.log(`🔄 Loading surah ${selectedSurah} from API...`);
    fetchSurahVerses(selectedSurah)
      .then((v) => {
        if (mounted) {
          console.log(`✅ Loaded ${v.length} verses for surah ${selectedSurah}`);
          setVerses(v);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (mounted) {
          console.error(`❌ Failed to load surah ${selectedSurah}:`, e);
          setError(e instanceof Error ? e.message : "Failed to load surah");
          setVerses([]);
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [selectedSurah]);

  // Настройка аудио
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.crossOrigin = "anonymous";
  }, []);

  // При старте/смене аята загружаем аудио с фолбеком
  useEffect(() => {
    console.log('🎵 MAIN useEffect triggered - isPlaying:', isPlaying, 'currentVerse:', currentVerse, 'verses.length:', verses.length);
    const audio = audioRef.current;
    if (!audio) {
      console.log('❌ No audio element found');
      return;
    }
    if (!isPlaying) {
      console.log('❌ Not playing, skipping audio load');
      return;
    }
    const verse = verses[currentVerse];
    if (!verse) {
      console.log('❌ No verse found for index:', currentVerse);
      return;
    }

    console.log('✅ Loading audio for verse:', currentVerse + 1, 'surah:', selectedSurah, 'isPlaying:', isPlaying);
    
    const surah = Number(selectedSurah);
    const sources = getAudioSources(surah, currentVerse + 1);
    console.log('Audio sources:', sources);
    
    sourceIndexRef.current = 0;
    audio.src = sources[0];
    
    // Добавляем обработчики событий
    const handleCanPlay = () => {
      console.log('🎵 Audio can play, starting verse:', currentVerse + 1);
      audio.play().then(() => {
        console.log('✅ Audio started successfully from source:', sources[0], 'for verse:', currentVerse + 1);
      }).catch((error) => {
        console.error('❌ Failed to play audio from source 1:', error, 'for verse:', currentVerse + 1);
        // Пробуем второй источник
        if (sources[1]) {
          console.log('🔄 Trying alternative source:', sources[1]);
          sourceIndexRef.current = 1;
          audio.src = sources[1];
          audio.play().catch((altError) => {
            console.error('❌ Failed to play alternative audio:', altError);
            setIsPlaying(false);
            alert('Unable to play audio. Please check your internet connection.');
          });
        } else {
          setIsPlaying(false);
          alert('Unable to play audio. Please check your internet connection.');
        }
      });
    };

    const handleEnded = () => {
      console.log('🎵 Audio ended for verse:', currentVerse + 1, 'total verses:', verses.length);
      if (currentVerse < verses.length - 1) {
        // Автоматически переходим к следующему аяту
        console.log('➡️ Moving to next verse:', currentVerse + 2);
        setCurrentVerse((v) => v + 1);
        // isPlaying остается true, чтобы следующий аят автоматически запустился
      } else {
        console.log('🏁 Last verse reached, stopping playback');
        setIsPlaying(false);
      }
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
    audio.addEventListener('ended', handleEnded);
    
    // Загружаем аудио
    audio.load();
    
    // Очистка обработчиков
    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [isPlaying, currentVerse, verses, selectedSurah]);

  // Дополнительный useEffect для принудительного запуска следующего аята
  useEffect(() => {
    console.log('🔄 BACKUP useEffect triggered - isPlaying:', isPlaying, 'currentVerse:', currentVerse);
    if (isPlaying && currentVerse > 0) {
      console.log('🚀 Current verse changed to:', currentVerse, 'forcing audio load...');
      const audio = audioRef.current;
      if (audio) {
        // Небольшая задержка для обеспечения правильной последовательности
        setTimeout(() => {
          console.log('⏰ Timeout executed, loading verse:', currentVerse + 1);
          const verse = verses[currentVerse];
          if (verse) {
            const surah = Number(selectedSurah);
            const sources = getAudioSources(surah, currentVerse + 1);
            sourceIndexRef.current = 0;
            audio.src = sources[0];
            audio.load();
            console.log('🎵 Attempting to play verse:', currentVerse + 1);
            audio.play().then(() => {
              console.log('✅ Successfully started playing verse:', currentVerse + 1);
            }).catch((error) => {
              console.error('❌ Failed to play next verse:', error);
              if (sources[1]) {
                sourceIndexRef.current = 1;
                audio.src = sources[1];
                audio.play().catch(() => {
                  console.log('❌ All sources failed, stopping playback');
                  setIsPlaying(false);
                });
              } else {
                console.log('❌ No backup source, stopping playback');
                setIsPlaying(false);
              }
            });
          } else {
            console.log('❌ No verse found in backup useEffect');
          }
        }, 100);
      } else {
        console.log('❌ No audio element in backup useEffect');
      }
    } else {
      console.log('⏭️ Skipping backup useEffect - isPlaying:', isPlaying, 'currentVerse:', currentVerse);
    }
  }, [currentVerse, isPlaying, verses, selectedSurah]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [currentVerse]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !verses.length) return;
    if (isPlaying) {
      console.log('🛑 PAUSING playback');
      audio.pause();
      setIsPlaying(false);
    } else {
      console.log('▶️ STARTING playback for verse:', currentVerse + 1);
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
      </div>

      <audio ref={audioRef} />
    </Card>
  );
}
