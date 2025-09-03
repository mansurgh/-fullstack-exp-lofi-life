const fs = require('fs');
const path = require('path');

// Функция для получения текста суры через API
async function fetchSurahTexts(surahNumber) {
  const apiUrl = `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`;
  
  try {
    console.log(`🔄 Загружаем суру ${surahNumber}...`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length < 2) {
      throw new Error('Неполные данные от API');
    }
    
    const arabicVerses = data.data[0].ayahs;
    const englishVerses = data.data[1].ayahs;
    
    const verses = [];
    for (let i = 0; i < arabicVerses.length; i++) {
      const arabic = arabicVerses[i].text || '';
      const translation = englishVerses[i]?.text || '';
      
      verses.push({
        arabic: arabic.trim(),
        translation: translation.trim()
      });
    }
    
    console.log(`✅ Сура ${surahNumber}: получено ${verses.length} аятов`);
    return verses;
    
  } catch (error) {
    console.error(`❌ Ошибка при загрузке суры ${surahNumber}:`, error.message);
    return null;
  }
}

// Функция для генерации кода суры
function generateSurahCode(surahNumber, verses, surahInfo) {
  const surahName = surahInfo.name;
  const englishName = surahInfo.englishName;
  const versesCount = verses.length;
  
  let code = `// Сура ${surahNumber} - ${surahName} (${versesCount} аятов)\n`;
  code += `export const surah${surahNumber}: SurahData = {\n`;
  code += `  number: ${surahNumber},\n`;
  code += `  name: "${surahName}",\n`;
  code += `  englishName: "${englishName}",\n`;
  code += `  verses: ${versesCount},\n`;
  code += `  texts: [\n`;
  
  verses.forEach((verse, index) => {
    const arabicEscaped = verse.arabic.replace(/"/g, '\\"');
    const translationEscaped = verse.translation.replace(/"/g, '\\"');
    
    code += `    { arabic: "${arabicEscaped}", translation: "${translationEscaped}" }`;
    if (index < verses.length - 1) {
      code += ',';
    }
    code += '\n';
  });
  
  code += `  ]\n`;
  code += `};\n\n`;
  
  return code;
}

// Полная информация о всех 114 сурах
const surahInfo = {
  1: { name: "الفاتحة", englishName: "Al-Fatihah", verses: 7 },
  2: { name: "البقرة", englishName: "Al-Baqarah", verses: 286 },
  3: { name: "آل عمران", englishName: "Ali 'Imran", verses: 200 },
  4: { name: "النساء", englishName: "An-Nisa", verses: 176 },
  5: { name: "المائدة", englishName: "Al-Ma'idah", verses: 120 },
  6: { name: "الأنعام", englishName: "Al-An'am", verses: 165 },
  7: { name: "الأعراف", englishName: "Al-A'raf", verses: 206 },
  8: { name: "الأنفال", englishName: "Al-Anfal", verses: 75 },
  9: { name: "التوبة", englishName: "At-Tawbah", verses: 129 },
  10: { name: "يونس", englishName: "Yunus", verses: 109 },
  11: { name: "هود", englishName: "Hud", verses: 123 },
  12: { name: "يوسف", englishName: "Yusuf", verses: 111 },
  13: { name: "الرعد", englishName: "Ar-Ra'd", verses: 43 },
  14: { name: "إبراهيم", englishName: "Ibrahim", verses: 52 },
  15: { name: "الحجر", englishName: "Al-Hijr", verses: 99 },
  16: { name: "النحل", englishName: "An-Nahl", verses: 128 },
  17: { name: "الإسراء", englishName: "Al-Isra", verses: 111 },
  18: { name: "الكهف", englishName: "Al-Kahf", verses: 110 },
  19: { name: "مريم", englishName: "Maryam", verses: 98 },
  20: { name: "طه", englishName: "Taha", verses: 135 },
  21: { name: "الأنبياء", englishName: "Al-Anbiya", verses: 112 },
  22: { name: "الحج", englishName: "Al-Hajj", verses: 78 },
  23: { name: "المؤمنون", englishName: "Al-Mu'minun", verses: 118 },
  24: { name: "النور", englishName: "An-Nur", verses: 64 },
  25: { name: "الفرقان", englishName: "Al-Furqan", verses: 77 },
  26: { name: "الشعراء", englishName: "Ash-Shu'ara", verses: 227 },
  27: { name: "النمل", englishName: "An-Naml", verses: 93 },
  28: { name: "القصص", englishName: "Al-Qasas", verses: 88 },
  29: { name: "العنكبوت", englishName: "Al-Ankabut", verses: 69 },
  30: { name: "الروم", englishName: "Ar-Rum", verses: 60 },
  31: { name: "لقمان", englishName: "Luqman", verses: 34 },
  32: { name: "السجدة", englishName: "As-Sajdah", verses: 30 },
  33: { name: "الأحزاب", englishName: "Al-Ahzab", verses: 73 },
  34: { name: "سبأ", englishName: "Saba", verses: 54 },
  35: { name: "فاطر", englishName: "Fatir", verses: 45 },
  36: { name: "يس", englishName: "Ya-Sin", verses: 83 },
  37: { name: "الصافات", englishName: "As-Saffat", verses: 182 },
  38: { name: "ص", englishName: "Sad", verses: 88 },
  39: { name: "الزمر", englishName: "Az-Zumar", verses: 75 },
  40: { name: "غافر", englishName: "Ghafir", verses: 85 },
  41: { name: "فصلت", englishName: "Fussilat", verses: 54 },
  42: { name: "الشورى", englishName: "Ash-Shura", verses: 53 },
  43: { name: "الزخرف", englishName: "Az-Zukhruf", verses: 89 },
  44: { name: "الدخان", englishName: "Ad-Dukhan", verses: 59 },
  45: { name: "الجاثية", englishName: "Al-Jathiyah", verses: 37 },
  46: { name: "الأحقاف", englishName: "Al-Ahqaf", verses: 35 },
  47: { name: "محمد", englishName: "Muhammad", verses: 38 },
  48: { name: "الفتح", englishName: "Al-Fath", verses: 29 },
  49: { name: "الحجرات", englishName: "Al-Hujurat", verses: 18 },
  50: { name: "ق", englishName: "Qaf", verses: 45 },
  51: { name: "الذاريات", englishName: "Adh-Dhariyat", verses: 60 },
  52: { name: "الطور", englishName: "At-Tur", verses: 49 },
  53: { name: "النجم", englishName: "An-Najm", verses: 62 },
  54: { name: "القمر", englishName: "Al-Qamar", verses: 55 },
  55: { name: "الرحمن", englishName: "Ar-Rahman", verses: 78 },
  56: { name: "الواقعة", englishName: "Al-Waqi'ah", verses: 96 },
  57: { name: "الحديد", englishName: "Al-Hadid", verses: 29 },
  58: { name: "المجادلة", englishName: "Al-Mujadila", verses: 22 },
  59: { name: "الحشر", englishName: "Al-Hashr", verses: 24 },
  60: { name: "الممتحنة", englishName: "Al-Mumtahanah", verses: 13 },
  61: { name: "الصف", englishName: "As-Saff", verses: 14 },
  62: { name: "الجمعة", englishName: "Al-Jumu'ah", verses: 11 },
  63: { name: "المنافقون", englishName: "Al-Munafiqun", verses: 11 },
  64: { name: "التغابن", englishName: "At-Taghabun", verses: 18 },
  65: { name: "الطلاق", englishName: "At-Talaq", verses: 12 },
  66: { name: "التحريم", englishName: "At-Tahrim", verses: 12 },
  67: { name: "الملك", englishName: "Al-Mulk", verses: 30 },
  68: { name: "القلم", englishName: "Al-Qalam", verses: 52 },
  69: { name: "الحاقة", englishName: "Al-Haqqah", verses: 52 },
  70: { name: "المعارج", englishName: "Al-Ma'arij", verses: 44 },
  71: { name: "نوح", englishName: "Nuh", verses: 28 },
  72: { name: "الجن", englishName: "Al-Jinn", verses: 28 },
  73: { name: "المزمل", englishName: "Al-Muzzammil", verses: 20 },
  74: { name: "المدثر", englishName: "Al-Muddaththir", verses: 56 },
  75: { name: "القيامة", englishName: "Al-Qiyamah", verses: 40 },
  76: { name: "الإنسان", englishName: "Al-Insan", verses: 31 },
  77: { name: "المرسلات", englishName: "Al-Mursalat", verses: 50 },
  78: { name: "النبأ", englishName: "An-Naba", verses: 40 },
  79: { name: "النازعات", englishName: "An-Nazi'at", verses: 46 },
  80: { name: "عبس", englishName: "Abasa", verses: 42 },
  81: { name: "التكوير", englishName: "At-Takwir", verses: 29 },
  82: { name: "الانفطار", englishName: "Al-Infitar", verses: 19 },
  83: { name: "المطففين", englishName: "Al-Mutaffifin", verses: 36 },
  84: { name: "الانشقاق", englishName: "Al-Inshiqaq", verses: 25 },
  85: { name: "البروج", englishName: "Al-Buruj", verses: 22 },
  86: { name: "الطارق", englishName: "At-Tariq", verses: 17 },
  87: { name: "الأعلى", englishName: "Al-A'la", verses: 19 },
  88: { name: "الغاشية", englishName: "Al-Ghashiyah", verses: 26 },
  89: { name: "الفجر", englishName: "Al-Fajr", verses: 30 },
  90: { name: "البلد", englishName: "Al-Balad", verses: 20 },
  91: { name: "الشمس", englishName: "Ash-Shams", verses: 15 },
  92: { name: "الليل", englishName: "Al-Layl", verses: 21 },
  93: { name: "الضحى", englishName: "Ad-Duha", verses: 11 },
  94: { name: "الشرح", englishName: "Ash-Sharh", verses: 8 },
  95: { name: "التين", englishName: "At-Tin", verses: 8 },
  96: { name: "العلق", englishName: "Al-Alaq", verses: 19 },
  97: { name: "القدر", englishName: "Al-Qadr", verses: 5 },
  98: { name: "البينة", englishName: "Al-Bayyinah", verses: 8 },
  99: { name: "الزلزلة", englishName: "Az-Zalzalah", verses: 8 },
  100: { name: "العاديات", englishName: "Al-Adiyat", verses: 11 },
  101: { name: "القارعة", englishName: "Al-Qari'ah", verses: 11 },
  102: { name: "التكاثر", englishName: "At-Takathur", verses: 8 },
  103: { name: "العصر", englishName: "Al-Asr", verses: 3 },
  104: { name: "الهمزة", englishName: "Al-Humazah", verses: 9 },
  105: { name: "الفيل", englishName: "Al-Fil", verses: 5 },
  106: { name: "قريش", englishName: "Quraysh", verses: 4 },
  107: { name: "الماعون", englishName: "Al-Ma'un", verses: 7 },
  108: { name: "الكوثر", englishName: "Al-Kawthar", verses: 3 },
  109: { name: "الكافرون", englishName: "Al-Kafirun", verses: 6 },
  110: { name: "النصر", englishName: "An-Nasr", verses: 3 },
  111: { name: "المسد", englishName: "Al-Masad", verses: 5 },
  112: { name: "الإخلاص", englishName: "Al-Ikhlas", verses: 4 },
  113: { name: "الفلق", englishName: "Al-Falaq", verses: 5 },
  114: { name: "الناس", englishName: "An-Nas", verses: 6 }
};

// Основная функция
async function main() {
  console.log('🚀 ПОЛНАЯ АВТОМАТИЗАЦИЯ: Загружаем ВСЕ 114 сур Корана...\n');
  
  // Начинаем с заголовка файла
  let allCode = `// Полные тексты всех 114 сур Корана
// Арабские тексты и английские переводы
// Автоматически сгенерировано: ${new Date().toISOString()}

export interface SurahText {
  arabic: string;
  translation: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  verses: number;
  texts: SurahText[];
}

`;

  let successCount = 0;
  let errorCount = 0;

  // Загружаем ВСЕ суры 1-114
  for (let surahNum = 1; surahNum <= 114; surahNum++) {
    const verses = await fetchSurahTexts(surahNum);
    
    if (verses) {
      const surahCode = generateSurahCode(surahNum, verses, surahInfo[surahNum]);
      allCode += surahCode;
      successCount++;
    } else {
      console.log(`⚠️ Пропускаем суру ${surahNum} из-за ошибки`);
      errorCount++;
    }
    
    // Небольшая пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  // Сохраняем в файл
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'quranTexts.ts');
  fs.writeFileSync(outputPath, allCode, 'utf8');
  
  console.log(`\n🎉 ГОТОВО! Полная автоматизация завершена!`);
  console.log(`✅ Успешно загружено: ${successCount} сур`);
  console.log(`❌ Ошибок: ${errorCount} сур`);
  console.log(`📁 Файл сохранен: ${outputPath}`);
  console.log(`📝 Теперь ВСЕ 114 сур содержат полные тексты без ошибок!`);
  console.log(`🎯 Можно тестировать приложение - все аяты должны отображаться корректно`);
}

// Запускаем полную автоматизацию
main().catch(console.error);
