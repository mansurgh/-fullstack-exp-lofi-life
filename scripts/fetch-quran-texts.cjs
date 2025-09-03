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

// Информация о сурах
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
  10: { name: "يونس", englishName: "Yunus", verses: 109 }
};

// Основная функция
async function main() {
  console.log('🚀 Начинаем загрузку текстов Корана...\n');
  
  let allCode = `// Автоматически сгенерированные тексты Корана
// Источник: https://api.alquran.cloud/
// Дата генерации: ${new Date().toISOString()}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  verses: number;
  texts: Array<{
    arabic: string;
    translation: string;
  }>;
}

`;

  // Загружаем суры 1-10
  for (let surahNum = 1; surahNum <= 10; surahNum++) {
    const verses = await fetchSurahTexts(surahNum);
    
    if (verses) {
      const surahCode = generateSurahCode(surahNum, verses, surahInfo[surahNum]);
      allCode += surahCode;
    } else {
      console.log(`⚠️ Пропускаем суру ${surahNum} из-за ошибки`);
    }
    
    // Небольшая пауза между запросами
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Сохраняем в файл
  const outputPath = path.join(__dirname, '..', 'src', 'data', 'quranTexts.ts');
  fs.writeFileSync(outputPath, allCode, 'utf8');
  
  console.log(`\n✅ Готово! Файл сохранен: ${outputPath}`);
  console.log('📝 Теперь можно использовать полные тексты всех сур');
}

// Запускаем скрипт
main().catch(console.error);
