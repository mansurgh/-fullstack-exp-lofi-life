import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Play, Pause, SkipBack, SkipForward, Volume2, X, BookOpen, Settings, Minus, Maximize2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

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

// All 114 surahs of the Quran
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
  { number: 21, name: "الأنبياء", englishName: "Al-Anbya", verses: 112 },
  { number: 22, name: "الحج", englishName: "Al-Hajj", verses: 78 },
  { number: 23, name: "المؤمنون", englishName: "Al-Mu'minun", verses: 118 },
  { number: 24, name: "النور", englishName: "An-Nur", verses: 64 },
  { number: 25, name: "الفرقان", englishName: "Al-Furqan", verses: 77 },
  { number: 26, name: "الشعراء", englishName: "Ash-Shu'ara", verses: 227 },
  { number: 27, name: "النمل", englishName: "An-Naml", verses: 93 },
  { number: 28, name: "القصص", englishName: "Al-Qasas", verses: 88 },
  { number: 29, name: "العنكبوت", englishName: "Al-'Ankabut", verses: 69 },
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
  { number: 42, name: "الشورى", englishName: "Ash-Shuraa", verses: 53 },
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
  { number: 93, name: "الضحى", englishName: "Ad-Duhaa", verses: 11 },
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

// Sample verse data for Al-Fatihah with word-by-word alignment
const getSampleVerses = (t: (key: string) => string) => [
  {
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: t('quran.1.1.transliteration'),
    translation: t('quran.1.1.translation'),
    wordAlignments: [
      { arabic: ["بِسْمِ"], transliteration: ["Bismi"], translation: ["In", "the", "name"] },
      { arabic: ["ٱللَّهِ"], transliteration: ["Allahi"], translation: ["of", "Allah"] },
      { arabic: ["ٱلرَّحْمَٰنِ"], transliteration: ["Ar-Rahmani"], translation: ["the", "Most", "Gracious"] },
      { arabic: ["ٱلرَّحِيمِ"], transliteration: ["Ar-Raheem"], translation: ["the", "Most", "Merciful"] }
    ]
  },
  {
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    transliteration: t('quran.1.2.transliteration'),
    translation: t('quran.1.2.translation'),
    wordAlignments: [
      { arabic: ["ٱلْحَمْدُ"], transliteration: ["Al-hamdu"], translation: ["All", "praise"] },
      { arabic: ["لِلَّهِ"], transliteration: ["lillahi"], translation: ["is", "due", "to", "Allah"] },
      { arabic: ["رَبِّ"], transliteration: ["Rabbi"], translation: ["Lord", "of"] },
      { arabic: ["ٱلْعَٰلَمِينَ"], transliteration: ["al-'alameen"], translation: ["the", "worlds"] }
    ]
  },
  {
    arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: t('quran.1.3.transliteration'),
    translation: t('quran.1.3.translation'),
    wordAlignments: [
      { arabic: ["ٱلرَّحْمَٰنِ"], transliteration: ["Ar-Rahmani"], translation: ["The", "Most", "Gracious"] },
      { arabic: ["ٱلرَّحِيمِ"], transliteration: ["Ar-Raheem"], translation: ["the", "Most", "Merciful"] }
    ]
  },
  {
    arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
    transliteration: t('quran.1.4.transliteration'),
    translation: t('quran.1.4.translation'),
    wordAlignments: [
      { arabic: ["مَٰلِكِ"], transliteration: ["Maliki"], translation: ["Sovereign", "of"] },
      { arabic: ["يَوْمِ"], transliteration: ["yawmi"], translation: ["the", "Day"] },
      { arabic: ["ٱلدِّينِ"], transliteration: ["ad-deen"], translation: ["of", "Judgment"] }
    ]
  },
  {
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: t('quran.1.5.transliteration'),
    translation: t('quran.1.5.translation'),
    wordAlignments: [
      { arabic: ["إِيَّاكَ"], transliteration: ["Iyyaka"], translation: ["You", "alone"] },
      { arabic: ["نَعْبُدُ"], transliteration: ["na'budu"], translation: ["we", "worship"] },
      { arabic: ["وَإِيَّاكَ"], transliteration: ["wa", "iyyaka"], translation: ["and", "You", "alone"] },
      { arabic: ["نَسْتَعِينُ"], transliteration: ["nasta'een"], translation: ["we", "ask", "for", "help"] }
    ]
  },
  {
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    transliteration: t('quran.1.6.transliteration'),
    translation: t('quran.1.6.translation'),
    wordAlignments: [
      { arabic: ["ٱهْدِنَا"], transliteration: ["Ihdina"], translation: ["Guide", "us"] },
      { arabic: ["ٱلصِّرَٰطَ"], transliteration: ["as-sirata"], translation: ["to", "the", "path"] },
      { arabic: ["ٱلْمُسْتَقِيمَ"], transliteration: ["al-mustaqeem"], translation: ["that", "is", "straight"] }
    ]
  },
  {
    arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    transliteration: t('quran.1.7.transliteration'),
    translation: t('quran.1.7.translation'),
    wordAlignments: [
      { arabic: ["صِرَٰطَ"], transliteration: ["Sirata"], translation: ["The", "path"] },
      { arabic: ["ٱلَّذِينَ"], transliteration: ["alladhina"], translation: ["of", "those"] },
      { arabic: ["أَنْعَمْتَ"], transliteration: ["an'amta"], translation: ["You", "have", "blessed"] },
      { arabic: ["عَلَيْهِمْ"], transliteration: ["'alayhim"], translation: ["upon", "them"] },
      { arabic: ["غَيْرِ"], transliteration: ["ghayri"], translation: ["not", "of"] },
      { arabic: ["ٱلْمَغْضُوبِ"], transliteration: ["al-maghdoobi"], translation: ["those", "who", "earned", "anger"] },
      { arabic: ["عَلَيْهِمْ"], transliteration: ["'alayhim"], translation: ["upon", "them"] },
      { arabic: ["وَلَا"], transliteration: ["wa", "la"], translation: ["and", "not"] },
      { arabic: ["ٱلضَّآلِّينَ"], transliteration: ["ad-dalleen"], translation: ["of", "those", "who", "went", "astray"] }
    ]
  }
];

export const QuranReader = ({ onClose, isVisible }: QuranReaderProps) => {
  const { t } = useTranslation();
  // Helper functions for localStorage
  const getStoredSetting = <T,>(key: string, defaultValue: T): T => {
    try {
      const stored = localStorage.getItem(`quran_${key}`);
      return stored ? (JSON.parse(stored) as T) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

  const storeSetting = (key: string, value: unknown) => {
    try {
      localStorage.setItem(`quran_${key}`, JSON.stringify(value));
    } catch {
      // Silent fail if localStorage is not available
    }
  };

  const [selectedSurah, setSelectedSurah] = useState<string>("1");
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(() => getStoredSetting('showTransliteration', true));
  const [showTranslation, setShowTranslation] = useState(() => getStoredSetting('showTranslation', true));
  const [audioVolume, setAudioVolume] = useState(() => getStoredSetting('audioVolume', [75]));
  const [verses] = useState(() => getSampleVerses(t));
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [recitationSpeed, setRecitationSpeed] = useState(() => getStoredSetting('recitationSpeed', [100])); // 100% = normal speed
  const [wordRepeatCount, setWordRepeatCount] = useState(() => getStoredSetting('wordRepeatCount', 1));
  const [verseRepeatCount, setVerseRepeatCount] = useState(() => getStoredSetting('verseRepeatCount', 1));
  const [surahRepeatCount, setSurahRepeatCount] = useState(() => getStoredSetting('surahRepeatCount', 1));
  const [currentWordRepeat, setCurrentWordRepeat] = useState(0);
  const [currentVerseRepeat, setCurrentVerseRepeat] = useState(0);
  const [currentSurahRepeat, setCurrentSurahRepeat] = useState(0);
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);
  const [isWordClickMode, setIsWordClickMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(() => getStoredSetting('showAudioPlayer', true));
  const [enableTextFollowing, setEnableTextFollowing] = useState(() => getStoredSetting('enableTextFollowing', true));
  const [followTransliteration, setFollowTransliteration] = useState(() => getStoredSetting('followTransliteration', false));
  const [followTranslation, setFollowTranslation] = useState(() => getStoredSetting('followTranslation', false));
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const selectedSurahData = surahs.find(s => s.number.toString() === selectedSurah);

  useEffect(() => {
    if (!isPlaying) return;
    const audio = audioRef.current;
    if (!audio) return;
    const src = `https://cdn.islamic.network/quran/audio/ayah/ar.abdulbasitmurattal/${selectedSurah}:${currentVerse + 1}.mp3`;
    audio.src = src;
    audio.play().catch(() => {
      setIsPlaying(false);
    });
  }, [isPlaying, currentVerse, selectedSurah]);

  // Simulate word-by-word reading with speed and repetition control
  const simulateReading = () => {
    if (!isAutoReading) return;
    
    const currentVerseData = verses[currentVerse];
    if (!currentVerseData) return;
    
    // Use word alignment count instead of Arabic word count for accuracy
    const totalWordAlignments = currentVerseData.wordAlignments?.length || currentVerseData.arabic.split(" ").length;
    
    // Calculate delay based on speed (100% = 800ms, 50% = 1600ms, 200% = 400ms)
    const baseDelay = 800;
    const speedMultiplier = recitationSpeed[0] / 100;
    const wordDelay = baseDelay / speedMultiplier;
    
    // Handle word repetition
    if (currentWordRepeat < wordRepeatCount - 1) {
      setTimeout(() => {
        setCurrentWordRepeat(prev => prev + 1);
      }, wordDelay);
      return;
    }
    
    // Move to next word or handle verse completion
    if (currentWordIndex < totalWordAlignments - 1) {
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentWordRepeat(0);
      }, wordDelay);
    } else {
      // Handle verse repetition
      if (currentVerseRepeat < verseRepeatCount - 1) {
        setTimeout(() => {
          setCurrentWordIndex(0);
          setCurrentWordRepeat(0);
          setCurrentVerseRepeat(prev => prev + 1);
        }, wordDelay * 1.5);
        return;
      }
      
      // Move to next verse or handle surah completion
      if (currentVerse < verses.length - 1) {
        setTimeout(() => {
          setCurrentVerse(prev => prev + 1);
          setCurrentWordIndex(0);
          setCurrentWordRepeat(0);
          setCurrentVerseRepeat(0);
        }, wordDelay * 2);
      } else {
        // Handle surah repetition
        if (currentSurahRepeat < surahRepeatCount - 1) {
          setTimeout(() => {
            setCurrentVerse(0);
            setCurrentWordIndex(0);
            setCurrentWordRepeat(0);
            setCurrentVerseRepeat(0);
            setCurrentSurahRepeat(prev => prev + 1);
          }, wordDelay * 3);
        } else {
          // Finished all repetitions
          setIsAutoReading(false);
          setIsPlaying(false);
          setCurrentSurahRepeat(0);
        }
      }
    }
  };

  const handlePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setClickedWordIndex(null);
      setIsWordClickMode(false);
      setIsAutoReading(false);
      setCurrentWordIndex(0);
      setCurrentWordRepeat(0);
      setCurrentVerseRepeat(0);
      setCurrentSurahRepeat(0);
      setIsPlaying(true);
    }
  };

  const nextVerse = () => {
    if (currentVerse < verses.length - 1) {
      setCurrentVerse(currentVerse + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(currentVerse - 1);
    }
  };

  const handleAudioEnded = () => {
    if (currentVerse < verses.length - 1) {
      setCurrentVerse(currentVerse + 1);
    } else {
      setIsPlaying(false);
    }
  };

  // Handle clicking on a specific word in any text type
  const handleWordClick = (verseIndex: number, wordIndex: number) => {
    if (verseIndex === currentVerse) {
      // If clicking the same word that's already selected, toggle it off
      if (clickedWordIndex === wordIndex && isWordClickMode) {
        setIsWordClickMode(false);
        setClickedWordIndex(null);
        setIsAutoReading(false);
        setIsPlaying(false);
        return;
      }
      
      // Set up word click mode
      setIsWordClickMode(true);
      setClickedWordIndex(wordIndex);
      setCurrentWordIndex(wordIndex);
      setCurrentWordRepeat(0);
      setIsAutoReading(true);
      setIsPlaying(true);
      
      // Stop any existing audio and start word repetition
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  // Handle clicking on transliteration words
  const handleTransliterationWordClick = (verseIndex: number, wordIndex: number) => {
    handleWordClick(verseIndex, wordIndex);
  };

  // Handle clicking on translation words
  const handleTranslationWordClick = (verseIndex: number, wordIndex: number) => {
    handleWordClick(verseIndex, wordIndex);
  };

  // Enhanced word repetition for clicked words
  const simulateWordClickRepetition = () => {
    if (!isWordClickMode || clickedWordIndex === null) return;
    
    const baseDelay = 800;
    const speedMultiplier = recitationSpeed[0] / 100;
    const wordDelay = baseDelay / speedMultiplier;
    
    if (currentWordRepeat < wordRepeatCount - 1) {
      setTimeout(() => {
        setCurrentWordRepeat(prev => prev + 1);
      }, wordDelay);
    } else {
      // Finished repeating the clicked word - keep it selected but stop playing
      setTimeout(() => {
        setIsAutoReading(false);
        setIsPlaying(false);
        // Keep isWordClickMode and clickedWordIndex to maintain highlighting
      }, wordDelay);
    }
  };

  // Word highlighting rendering helper with click functionality
  const renderHighlightedText = (arabicText: string, verseIndex: number) => {
    const words = arabicText.split(" ");
    
    return words.map((word, wordIndex) => {
      const isCurrentVerse = verseIndex === currentVerse;
      const isCurrentWord = isCurrentVerse && wordIndex === currentWordIndex && (isAutoReading || isWordClickMode);
      const isPastWord = isCurrentVerse && wordIndex < currentWordIndex && isAutoReading && !isWordClickMode;
      const isClickedWord = isCurrentVerse && wordIndex === clickedWordIndex && isWordClickMode;
      
      return (
        <span
          key={wordIndex}
          onClick={() => handleWordClick(verseIndex, wordIndex)}
          className={`inline-block transition-all duration-300 cursor-pointer hover:scale-105 hover:text-accent ${
            isClickedWord 
              ? 'bg-accent text-accent-foreground px-1 rounded scale-110 shadow-glow ring-2 ring-accent' 
              : isCurrentWord 
              ? 'bg-accent/80 text-accent-foreground px-1 rounded scale-105 shadow-glow ring-1 ring-accent' 
              : isPastWord 
              ? 'text-accent/70'
              : 'hover:bg-accent/20 hover:px-1 hover:rounded'
          }`}
          style={{
            marginRight: wordIndex > 0 ? '0.5rem' : '0'
          }}
          title={`Click to repeat this word ${wordRepeatCount} time(s)`}
        >
          {word}
        </span>
      );
    });
  };

  // Helper to render highlighted transliteration using word alignments
  const renderHighlightedTransliteration = (transliterationText: string, verseIndex: number) => {
    const verse = verses[verseIndex];
    if (!verse?.wordAlignments) {
      // Fallback to simple word splitting if no alignments
      const words = transliterationText.split(" ");
      return words.map((word, wordIndex) => (
        <span 
          key={wordIndex} 
          onClick={() => handleWordClick(verseIndex, wordIndex)}
          className="inline-block transition-all duration-300 cursor-pointer hover:scale-105 hover:text-accent hover:bg-accent/20 hover:px-1 hover:rounded"
          style={{ marginRight: wordIndex > 0 ? '0.25rem' : '0' }}
          title={`Click to repeat this word ${wordRepeatCount} time(s)`}
        >
          {word}
        </span>
      ));
    }

    const transliterationResult: JSX.Element[] = [];
    let transliterationWordIndex = 0;

    verse.wordAlignments.forEach((alignment, alignmentIndex) => {
      const isCurrentVerse = verseIndex === currentVerse;
      const isCurrentWord = isCurrentVerse && alignmentIndex === currentWordIndex && (isAutoReading || isWordClickMode);
      const isPastWord = isCurrentVerse && alignmentIndex < currentWordIndex && isAutoReading && !isWordClickMode;
      const isClickedWord = isCurrentVerse && alignmentIndex === clickedWordIndex && isWordClickMode;

      alignment.transliteration.forEach((translitWord, translitIndex) => {
        transliterationResult.push(
          <span
            key={`${alignmentIndex}-${translitIndex}`}
            onClick={() => handleTransliterationWordClick(verseIndex, alignmentIndex)}
            className={`inline-block transition-all duration-300 cursor-pointer hover:scale-105 hover:text-accent ${
              isClickedWord 
                ? 'bg-accent/60 text-accent-foreground px-1 rounded ring-1 ring-accent' 
                : isCurrentWord 
                ? 'bg-accent/40 text-accent-foreground px-1 rounded ring-1 ring-accent/50' 
                : isPastWord 
                ? 'text-accent/60'
                : 'hover:bg-accent/20 hover:px-1 hover:rounded'
            }`}
            style={{
              marginRight: '0.25rem'
            }}
            title={`Click to repeat this word ${wordRepeatCount} time(s)`}
          >
            {translitWord}
          </span>
        );
        transliterationWordIndex++;
      });
    });

    return transliterationResult;
  };

  // Helper to render highlighted translation using word alignments
  const renderHighlightedTranslation = (translationText: string, verseIndex: number) => {
    const verse = verses[verseIndex];
    if (!verse?.wordAlignments) {
      // Fallback to simple word splitting if no alignments
      const words = translationText.split(" ");
      return words.map((word, wordIndex) => (
        <span 
          key={wordIndex} 
          onClick={() => handleWordClick(verseIndex, wordIndex)}
          className="inline-block transition-all duration-300 cursor-pointer hover:scale-105 hover:text-accent hover:bg-accent/15 hover:px-1 hover:rounded"
          style={{ marginRight: wordIndex > 0 ? '0.25rem' : '0' }}
          title={`Click to repeat this word ${wordRepeatCount} time(s)`}
        >
          {word}
        </span>
      ));
    }

    const translationResult: JSX.Element[] = [];

    verse.wordAlignments.forEach((alignment, alignmentIndex) => {
      const isCurrentVerse = verseIndex === currentVerse;
      const isCurrentWord = isCurrentVerse && alignmentIndex === currentWordIndex && (isAutoReading || isWordClickMode);
      const isPastWord = isCurrentVerse && alignmentIndex < currentWordIndex && isAutoReading && !isWordClickMode;
      const isClickedWord = isCurrentVerse && alignmentIndex === clickedWordIndex && isWordClickMode;

      alignment.translation.forEach((translationWord, translationIndex) => {
        translationResult.push(
          <span
            key={`${alignmentIndex}-${translationIndex}`}
            onClick={() => handleTranslationWordClick(verseIndex, alignmentIndex)}
            className={`inline-block transition-all duration-300 cursor-pointer hover:scale-105 hover:text-accent ${
              isClickedWord 
                ? 'bg-accent/40 text-accent-foreground px-1 rounded ring-1 ring-accent/60' 
                : isCurrentWord 
                ? 'bg-accent/30 text-accent-foreground px-1 rounded ring-1 ring-accent/40' 
                : isPastWord 
                ? 'text-accent/50'
                : 'hover:bg-accent/15 hover:px-1 hover:rounded'
            }`}
            style={{
              marginRight: '0.25rem'
            }}
            title={`Click to repeat this word ${wordRepeatCount} time(s)`}
          >
            {translationWord}
          </span>
        );
      });
    });

    return translationResult;
  };

  useEffect(() => {
    if (isAutoReading && isPlaying) {
      if (isWordClickMode) {
        simulateWordClickRepetition();
      } else {
        simulateReading();
      }
    }
  }, [currentWordIndex, currentVerse, isAutoReading, isPlaying, currentWordRepeat, currentVerseRepeat, isWordClickMode, recitationSpeed, wordRepeatCount, verseRepeatCount, surahRepeatCount]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume[0] / 100;
    }
  }, [audioVolume]);

  // Clear word selection when component becomes hidden (user leaves room)
  useEffect(() => {
    if (!isVisible) {
      setIsWordClickMode(false);
      setClickedWordIndex(null);
      setIsAutoReading(false);
      setIsPlaying(false);
    }
  }, [isVisible]);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    storeSetting('showTransliteration', showTransliteration);
  }, [showTransliteration]);

  useEffect(() => {
    storeSetting('showTranslation', showTranslation);
  }, [showTranslation]);

  useEffect(() => {
    storeSetting('audioVolume', audioVolume);
  }, [audioVolume]);

  useEffect(() => {
    storeSetting('recitationSpeed', recitationSpeed);
  }, [recitationSpeed]);

  useEffect(() => {
    storeSetting('wordRepeatCount', wordRepeatCount);
  }, [wordRepeatCount]);

  useEffect(() => {
    storeSetting('verseRepeatCount', verseRepeatCount);
  }, [verseRepeatCount]);

  useEffect(() => {
    storeSetting('surahRepeatCount', surahRepeatCount);
  }, [surahRepeatCount]);

  useEffect(() => {
    storeSetting('showAudioPlayer', showAudioPlayer);
  }, [showAudioPlayer]);

  useEffect(() => {
    storeSetting('enableTextFollowing', enableTextFollowing);
  }, [enableTextFollowing]);

  useEffect(() => {
    storeSetting('followTransliteration', followTransliteration);
  }, [followTransliteration]);

  useEffect(() => {
    storeSetting('followTranslation', followTranslation);
  }, [followTranslation]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 z-50 ${
      isMinimized ? 'w-80 h-16' : 'w-[95vw] max-w-4xl h-[70vh]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/95 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-card-foreground">
            {isMinimized ? 'القرآن الكريم' : `${t('quran.title')} - القرآن الكريم`}
          </span>
          {isPlaying && isMinimized && (
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recitation Settings</h4>
                
                {/* Speed Control */}
                <div>
                  <label className="text-xs text-card-foreground mb-1 block">
                    Speed: {recitationSpeed[0]}%
                  </label>
                  <Slider
                    value={recitationSpeed}
                    onValueChange={setRecitationSpeed}
                    max={200}
                    min={25}
                    step={25}
                    className="flex-1"
                  />
                </div>

                {/* Word Repetition */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Repeat words:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setWordRepeatCount(Math.max(1, wordRepeatCount - 1))}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      -
                    </Button>
                    <span className="text-xs min-w-6 text-center">{wordRepeatCount}x</span>
                    <Button
                      onClick={() => setWordRepeatCount(Math.min(10, wordRepeatCount + 1))}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Audio Player Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show audio player:</span>
                  <Switch
                    checked={showAudioPlayer}
                    onCheckedChange={setShowAudioPlayer}
                  />
                </div>

                {/* Display Options */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show transliteration:</span>
                  <Switch
                    checked={showTransliteration}
                    onCheckedChange={setShowTransliteration}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show translation:</span>
                  <Switch
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                </div>

                {/* Text Following Options */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Enable text following:</span>
                  <Switch
                    checked={enableTextFollowing}
                    onCheckedChange={setEnableTextFollowing}
                  />
                </div>

                {enableTextFollowing && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-xs">Follow transliteration:</span>
                      <Switch
                        checked={followTransliteration}
                        onCheckedChange={setFollowTransliteration}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs">Follow translation:</span>
                      <Switch
                        checked={followTranslation}
                        onCheckedChange={setFollowTranslation}
                      />
                    </div>
                  </>
                )}
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-card-foreground"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {!isMinimized && (
        <div className="flex flex-col h-[calc(70vh-4rem)] p-3">
          {/* Surah Selection */}
          <div className="mb-3">
            <Select value={selectedSurah} onValueChange={setSelectedSurah}>
              <SelectTrigger className="text-sm w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {surahs.map((surah) => (
                  <SelectItem key={surah.number} value={surah.number.toString()}>
                    {surah.number}. {surah.name} ({surah.englishName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audio Player (conditionally shown) */}
          {showAudioPlayer && (
            <div className="mb-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Button onClick={prevVerse} variant="outline" size="sm" disabled={currentVerse === 0}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button onClick={handlePlay} variant="default" size="sm">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button onClick={nextVerse} variant="outline" size="sm" disabled={currentVerse === verses.length - 1}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={audioVolume}
                  onValueChange={setAudioVolume}
                  max={100}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-8">
                  {audioVolume[0]}%
                </span>
              </div>
            </div>
          )}

          {/* Qur'an Text */}
          <div className="flex-1 bg-gradient-to-br from-background to-secondary/20 rounded-lg p-4 overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedSurahData?.name}
              </h2>
              <p className="text-lg text-accent font-semibold">
                {selectedSurahData?.englishName}
              </p>
            </div>

            <div className="space-y-6">
              {verses.map((verse, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                    index === currentVerse && isPlaying
                      ? 'bg-accent/10 border-accent shadow-glow ring-2 ring-accent/30 transform scale-[1.02]'
                      : 'bg-card border-border hover:border-accent/30'
                  }`}
                >
                  <div className="text-right mb-3" dir="rtl">
                    <p className="text-xl leading-relaxed text-foreground font-arabic" style={{ direction: 'rtl', textAlign: 'right' }}>
                      {renderHighlightedText(verse.arabic, index)}
                    </p>
                  </div>
                  
                  {showTransliteration && (
                    <div className="mb-2">
                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                        {renderHighlightedTransliteration(verse.transliteration, index)}
                      </p>
                    </div>
                  )}
                  
                  {showTranslation && (
                    <div>
                      <p className="text-sm text-card-foreground leading-relaxed">
                        {renderHighlightedTranslation(verse.translation, index)}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      Verse {index + 1}
                    </span>
                    <Button
                      onClick={() => setCurrentVerse(index)}
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent-foreground h-6"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element - in production, this would have actual audio sources */}
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
      />
    </div>
  );
};