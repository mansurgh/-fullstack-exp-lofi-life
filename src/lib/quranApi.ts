// src/lib/quranApi.ts
export interface VerseDTO {
  arabic: string;
  translation: string;
  transliteration?: string;
  audioUrl: string;
}

import type { SurahData } from '../data/quranTexts';

// Lazy-load quranTexts (~2.4MB) — loaded only when needed
let _localSurahData: Record<number, SurahData> | null = null;
async function getLocalSurahData(): Promise<Record<number, SurahData>> {
  if (_localSurahData) return _localSurahData;
  const mod = await import('../data/quranTexts');
  const data: Record<number, SurahData> = {};
  for (let i = 1; i <= 114; i++) {
    const key = `surah${i}` as keyof typeof mod;
    if (mod[key]) data[i] = mod[key] as SurahData;
  }
  _localSurahData = data;
  return data;
}

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

// localSurahData loaded lazily via getLocalSurahData()

// Функция для получения научной транслитерации с правильными диакритическими знаками
// Различает: ح (ḥ), خ (kh), ه (h), ع (ʿ), ء (ʾ), ص (ṣ), ض (ḍ), ط (ṭ), ظ (ẓ), etc.
async function fetchTransliteration(surahNumber: number): Promise<string[]> {
  try {
    // Пробуем несколько источников для получения точной транслитерации

    // Источник 1: Tanzil API с научной транслитерацией
    try {
      const tanzilResponse = await fetch(
        `https://api.quran.com/api/v4/quran/translations/transliteration?chapter_number=${surahNumber}`
      );

      if (tanzilResponse.ok) {
        const tanzilData = await tanzilResponse.json();
        if (tanzilData.translations && Array.isArray(tanzilData.translations)) {
          console.log(`✅ Got scientific transliteration from quran.com for surah ${surahNumber}`);
          return tanzilData.translations.map((item: any) => item.text || '');
        }
      }
    } catch (e) {
      console.log('Trying alternative transliteration source...');
    }

    // Источник 2: AlQuran Cloud API
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/en.transliteration`
    );

    if (!response.ok) {
      console.warn(`Failed to fetch transliteration for surah ${surahNumber}`);
      return [];
    }

    const data = await response.json();

    if (data.data && data.data.ayahs) {
      // Улучшаем транслитерацию, добавляя диакритические знаки
      const transliterations = data.data.ayahs.map((ayah: any) => {
        let text = ayah.text || '';

        // Применяем правила научной транслитерации
        // Это базовое улучшение, но идеально нужен API с готовой научной транслитерацией
        text = enhanceTransliteration(text);

        return text;
      });

      console.log(`✅ Got enhanced transliteration for surah ${surahNumber}`);
      return transliterations;
    }

    return [];
  } catch (error) {
    console.warn(`Error fetching transliteration for surah ${surahNumber}:`, error);
    return [];
  }
}

// Функция для преобразования арабского текста в научную транслитерацию
// с правильными диакритическими знаками для каждой буквы
function arabicToScientificTransliteration(arabicText: string): string {
  // Карта соответствия арабских букв научной транслитерации
  const transliterationMap: Record<string, string> = {
    // Согласные
    'ا': 'ā',      // алиф
    'أ': 'ʾa',     // хамза над алифом
    'إ': 'ʾi',     // хамза под алифом
    'آ': 'ʾā',     // мадда
    'ء': 'ʾ',      // хамза
    'ب': 'b',      // ба
    'ت': 't',      // та
    'ث': 'th',     // са
    'ج': 'j',      // джим
    'ح': 'ḥ',      // ха (твёрдая)
    'خ': 'kh',     // ха (мягкая)
    'د': 'd',      // даль
    'ذ': 'dh',     // заль
    'ر': 'r',      // ра
    'ز': 'z',      // за
    'س': 's',      // син
    'ش': 'sh',     // шин
    'ص': 'ṣ',      // сад
    'ض': 'ḍ',      // дад
    'ط': 'ṭ',      // та (эмфатическая)
    'ظ': 'ẓ',      // за (эмфатическая)
    'ع': 'ʿ',      // айн
    'غ': 'gh',     // гайн
    'ف': 'f',      // фа
    'ق': 'q',      // каф
    'ك': 'k',      // каф
    'ل': 'l',      // лям
    'م': 'm',      // мим
    'ن': 'n',      // нун
    'ه': 'h',      // ха
    'ة': 'h',      // та марбута
    'و': 'w',      // вав
    'ؤ': 'ʾū',     // хамза над вав
    'ي': 'y',      // йа
    'ئ': 'ʾī',     // хамза над йа
    'ى': 'ā',      // алиф максура

    // Диакритические знаки (харакаты)
    'َ': 'a',      // фатха
    'ُ': 'u',      // дамма
    'ِ': 'i',      // кясра
    'ّ': '',       // шадда (удваивание)
    'ْ': '',       // сукун
    'ً': '',       // танвин фатха (убираем для чтения с остановками/вакф)
    'ٌ': '',       // танвин дамма (убираем для чтения с остановками/вакф)
    'ٍ': '',       // танвин кясра (убираем для чтения с остановками/вакф)
    'ـ': '',       // кашида (соединительная линия)
    'ٱ': '',       // васла (соединительная хамза) - не произносится
    'ٰ': 'ā',      // короткая вертикальная алиф (кинжал/даггер алиф)
    'ۡ': '',       // маленький высокий знак сукун
    'ۢ': '',       // маленький высокий знак мим
    'ۖ': '',       // маленький высокий знак
    'ۗ': '',       // маленький высокий знак лигатура лям с алиф
    'ۘ': '',       // маленький высокий знак нун
    'ۙ': '',       // маленький высокий знак зайн
    '۟': '',       // маленький высокий круглый знак
    '۠': '',       // маленький высокий знак
  };

  let result = '';
  let previousChar = '';

  for (let i = 0; i < arabicText.length; i++) {
    const char = arabicText[i];
    const nextChar = i < arabicText.length - 1 ? arabicText[i + 1] : '';

    if (transliterationMap[char]) {
      let translitChar = transliterationMap[char];

      // Обработка шадды (удвоение предыдущей согласной)
      if (char === 'ّ' && previousChar) {
        result += previousChar;
        continue;
      }

      // Обработка долгих гласных
      if (char === 'ا' && previousChar === 'a') {
        result = result.slice(0, -1) + 'ā';
        previousChar = translitChar;
        continue;
      }

      if (char === 'و' && previousChar === 'u') {
        result = result.slice(0, -1) + 'ū';
        previousChar = translitChar;
        continue;
      }

      if (char === 'ي' && previousChar === 'i') {
        result = result.slice(0, -1) + 'ī';
        previousChar = translitChar;
        continue;
      }

      result += translitChar;
      previousChar = translitChar;
    } else if (char === ' ') {
      result += ' ';
      previousChar = '';
    }
  }

  return result;
}

// Функция для улучшения существующей транслитерации с правильными диакритическими знаками
// Преобразует упрощённую транслитерацию API в научную транслитерацию
function enhanceTransliteration(text: string): string {
  // Если текст на арабском, конвертируем напрямую
  if (/[\u0600-\u06FF]/.test(text)) {
    return arabicToScientificTransliteration(text);
  }

  // Если текст содержит латинские буквы, улучшаем его
  if (/[a-zA-Z]/.test(text)) {
    // Заменяем упрощённую транслитерацию на научную с диакритиками
    // Важно: порядок замен имеет значение (более длинные сначала)
    let enhanced = text;

    // Специальные комбинации (должны быть первыми)
    enhanced = enhanced.replace(/dhabha/gi, 'ḍabḥa'); // ضبحa
    enhanced = enhanced.replace(/dhabh/gi, 'ḍabḥ'); // ضبح
    enhanced = enhanced.replace(/dhab/gi, 'ḍab'); // ضب

    // Заменяем h в контексте (после гласной или в конце слова) на ḥ где нужно
    // Паттерны для ح (твёрдая ха) vs ه (обычная ха)
    enhanced = enhanced.replace(/([aeiou])h([aeiou])/gi, (match, before, after) => {
      // Эвристика: если h между гласными, скорее всего это ḥ
      return before + 'ḥ' + after;
    });

    // Заменяем конкретные паттерны
    enhanced = enhanced.replace(/\bwaal/gi, 'wal'); // wal не waal

    // Эмфатические согласные
    // s -> ṣ (когда это ص)
    // t -> ṭ (когда это ط) 
    // d -> ḍ (когда это ض)
    // z -> ẓ (когда это ظ)

    // Специальные буквы
    enhanced = enhanced.replace(/'/g, 'ʿ');  // айн
    enhanced = enhanced.replace(/`/g, 'ʿ');  // айн альтернативный
    enhanced = enhanced.replace(/'/g, 'ʾ');  // хамза

    return enhanced;
  }

  return text;
} export async function fetchSurahVerses(
  surahId: string | number,
  language: string = 'en'
): Promise<VerseDTO[]> {
  const key = `${surahId}_${language}`;

  // Проверяем кэш в памяти, но только если там есть транслитерация
  if (mem.has(key)) {
    const cached = mem.get(key)!;
    // Если в кэше есть транслитерация хотя бы в одном аяте, возвращаем кэш
    if (cached.length > 0 && cached[0].transliteration !== undefined) {
      return cached;
    }
    // Иначе перезагружаем с транслитерацией
    console.log(`🔄 Reloading surah ${surahId} with transliteration...`);
  }

  const surahNumber = Number(surahId);

  // Используем локальные тексты (все 114 сур доступны)
  const localSurahData = await getLocalSurahData();
  if (localSurahData[surahNumber]) {
    console.log(`📖 Using local texts for surah ${surahNumber} (lang: ${language})`);
    const surahData = localSurahData[surahNumber];

    // Конвертируем арабский текст напрямую в научную транслитерацию
    console.log(`🔤 Generating scientific transliteration for surah ${surahNumber}`);

    // Для русского языка — загружаем перевод Кулиева с API
    let russianTranslations: string[] | null = null;
    if (language === 'ru') {
      try {
        console.log(`🇷🇺 Fetching Russian translation for surah ${surahNumber}...`);
        const response = await fetch(
          `https://api.alquran.cloud/v1/surah/${surahNumber}/ru.kuliev`
        );
        if (response.ok) {
          const data = await response.json();
          if (data.data && data.data.ayahs) {
            russianTranslations = data.data.ayahs.map((ayah: any) => ayah.text || '');
            console.log(`✅ Got Russian translation for surah ${surahNumber}`);
          }
        }
      } catch (err) {
        console.warn(`⚠️ Failed to fetch Russian translation for surah ${surahNumber}:`, err);
      }
    }

    const verses: VerseDTO[] = surahData.texts.map((text, i) => {
      const transliteration = arabicToScientificTransliteration(text.arabic);

      return {
        arabic: text.arabic,
        translation: russianTranslations && russianTranslations[i] ? russianTranslations[i] : text.translation,
        transliteration: transliteration,
        audioUrl: buildAudio(surahNumber, i + 1),
      };
    }); mem.set(key, verses);
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
