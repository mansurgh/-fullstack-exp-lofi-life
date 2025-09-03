// src/lib/quranApi.ts
export interface VerseDTO {
  arabic: string;
  translation: string;
  audioUrl: string;
}

import { surah1, surah2, surah3, surah4, surah5, surah6, surah7, surah8, surah9, surah10, surah11, surah12, surah13, surah14, surah15, surah16, surah17, surah18, surah19, surah20, surah21, surah22, surah23, surah24, surah25, surah26, surah27, surah28, surah29, surah30, surah31, surah32, surah33, surah34, surah35, surah36, surah37, surah38, surah39, surah40, surah41, surah42, surah43, surah44, surah45, surah46, surah47, surah48, surah49, surah50, surah51, surah52, surah53, surah54, surah55, surah56, surah57, surah58, surah59, surah60, surah61, surah62, surah63, surah64, surah65, surah66, surah67, surah68, surah69, surah70, surah71, surah72, surah73, surah74, surah75, surah76, surah77, surah78, surah79, surah80, surah81, surah82, surah83, surah84, surah85, surah86, surah87, surah88, surah89, surah90, surah91, surah92, surah93, surah94, surah95, surah96, surah97, surah98, surah99, surah100, surah101, surah102, surah103, surah104, surah105, surah106, surah107, surah108, surah109, surah110, surah111, surah112, surah113, surah114, SurahData } from '../data/quranTexts';


const RECITER = "ar.abdulbasitmurattal";
const mem = new Map<string, VerseDTO[]>();

const buildAudio = (s: number, a: number) =>
  `https://cdn.islamic.network/quran/audio/ayah/${RECITER}/${s}:${a}.mp3`;

export function loadCachedSurah(surahId: string | number): VerseDTO[] | null {
  try {
    const raw = localStorage.getItem(`quran_surah_${surahId}`);
    if (raw) {
      const cached = JSON.parse(raw) as VerseDTO[];
      // Проверяем, что кэш содержит реальные тексты, а не placeholder
      const hasPlaceholder = cached.some(v => 
        v.arabic.includes('آية') && v.arabic.includes('من سورة') ||
        v.translation.includes('Verse') && v.translation.includes('of')
      );
      if (hasPlaceholder) {
        console.log(`🗑️ Clearing cached placeholder data for surah ${surahId}`);
        localStorage.removeItem(`quran_surah_${surahId}`);
        return null;
      }
      return cached;
    }
    return null;
  } catch {
    return null;
  }
}

// Функция для очистки всего кэша Корана
export function clearQuranCache(): void {
  console.log('🗑️ Clearing all Quran cache...');
  for (let i = 1; i <= 114; i++) {
    localStorage.removeItem(`quran_surah_${i}`);
  }
  mem.clear();
}

// Локальные тексты для всех 114 сур
const localSurahData: Record<number, SurahData> = {
  1: surah1, 2: surah2, 3: surah3, 4: surah4, 5: surah5, 6: surah6, 7: surah7, 8: surah8, 9: surah9, 10: surah10,
  11: surah11, 12: surah12, 13: surah13, 14: surah14, 15: surah15, 16: surah16, 17: surah17, 18: surah18, 19: surah19, 20: surah20,
  21: surah21, 22: surah22, 23: surah23, 24: surah24, 25: surah25, 26: surah26, 27: surah27, 28: surah28, 29: surah29, 30: surah30,
  31: surah31, 32: surah32, 33: surah33, 34: surah34, 35: surah35, 36: surah36, 37: surah37, 38: surah38, 39: surah39, 40: surah40,
  41: surah41, 42: surah42, 43: surah43, 44: surah44, 45: surah45, 46: surah46, 47: surah47, 48: surah48, 49: surah49, 50: surah50,
  51: surah51, 52: surah52, 53: surah53, 54: surah54, 55: surah55, 56: surah56, 57: surah57, 58: surah58, 59: surah59, 60: surah60,
  61: surah61, 62: surah62, 63: surah63, 64: surah64, 65: surah65, 66: surah66, 67: surah67, 68: surah68, 69: surah69, 70: surah70,
  71: surah71, 72: surah72, 73: surah73, 74: surah74, 75: surah75, 76: surah76, 77: surah77, 78: surah78, 79: surah79, 80: surah80,
  81: surah81, 82: surah82, 83: surah83, 84: surah84, 85: surah85, 86: surah86, 87: surah87, 88: surah88, 89: surah89, 90: surah90,
  91: surah91, 92: surah92, 93: surah93, 94: surah94, 95: surah95, 96: surah96, 97: surah97, 98: surah98, 99: surah99, 100: surah100,
  101: surah101, 102: surah102, 103: surah103, 104: surah104, 105: surah105, 106: surah106, 107: surah107, 108: surah108, 109: surah109, 110: surah110,
  111: surah111, 112: surah112, 113: surah113, 114: surah114
};

export async function fetchSurahVerses(
  surahId: string | number
): Promise<VerseDTO[]> {
  const key = String(surahId);
  if (mem.has(key)) return mem.get(key)!;

  const surahNumber = Number(surahId);
  
  // Используем локальные тексты (все 114 сур доступны)
  if (localSurahData[surahNumber]) {
    console.log(`📖 Using local texts for surah ${surahNumber}`);
    const surahData = localSurahData[surahNumber];
    const verses: VerseDTO[] = surahData.texts.map((text, i) => ({
      arabic: text.arabic,
      translation: text.translation,
      audioUrl: buildAudio(surahNumber, i + 1), // Используем CDN для аудио
    }));
    
    mem.set(key, verses);
    console.log(`✅ Successfully loaded surah ${surahNumber} with ${verses.length} verses from local data`);
    return verses;
  }

  // Если сура не найдена (не должно происходить)
  throw new Error(`Surah ${surahNumber} not found in local data`);
}

// Функция для получения информации о суре
function getSurahInfo(surahNumber: number): { name: string; englishName: string; verses: number } | null {
  const surahs = [
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
    { number: 114, name: "الناس", englishName: "An-Nas", verses: 6 }
  ];

  return surahs.find(s => s.number === surahNumber) || null;
}
