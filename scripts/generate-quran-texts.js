// Скрипт для генерации полных текстов всех 114 сур Корана
// Использует API для получения арабских текстов и английских переводов

const fs = require('fs');
const path = require('path');

// Функция для получения текстов суры с API
async function fetchSurahTexts(surahNumber) {
  try {
    console.log(`Загружаю суру ${surahNumber}...`);
    
    // Загружаем арабский текст (Uthmani script) и английский перевод (Sahih International)
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/editions/quran-uthmani,en.sahih`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || data.data.length < 2) {
      throw new Error('Неполные данные от API');
    }
    
    const arabicVerses = data.data[0].ayahs || [];
    const englishVerses = data.data[1].ayahs || [];
    
    // Получаем информацию о суре
    const surahInfo = data.data[0];
    
    const texts = arabicVerses.map((arabic, index) => {
      const arabicText = arabic.text || '';
      const englishText = englishVerses[index]?.text || '';
      
      return {
        arabic: arabicText,
        translation: englishText
      };
    });
    
    return {
      number: surahNumber,
      name: surahInfo.englishName || `Surah ${surahNumber}`,
      englishName: surahInfo.englishName || `Surah ${surahNumber}`,
      verses: texts.length,
      texts: texts
    };
    
  } catch (error) {
    console.error(`Ошибка при загрузке суры ${surahNumber}:`, error.message);
    return null;
  }
}

// Функция для генерации TypeScript кода
function generateTypeScriptCode(surahData) {
  if (!surahData) return '';
  
  const { number, name, englishName, verses, texts } = surahData;
  
  let code = `// Сура ${number} - ${englishName} (${verses} аятов)\n`;
  code += `export const surah${number}: SurahData = {\n`;
  code += `  number: ${number},\n`;
  code += `  name: "${name}",\n`;
  code += `  englishName: "${englishName}",\n`;
  code += `  verses: ${verses},\n`;
  code += `  texts: [\n`;
  
  texts.forEach((text, index) => {
    const arabicEscaped = text.arabic.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    const englishEscaped = text.translation.replace(/"/g, '\\"').replace(/\n/g, '\\n');
    
    code += `    { arabic: "${arabicEscaped}", translation: "${englishEscaped}" }`;
    if (index < texts.length - 1) code += ',';
    code += '\n';
  });
  
  code += `  ]\n`;
  code += `};\n\n`;
  
  return code;
}

// Основная функция
async function generateAllSurahs() {
  console.log('🚀 Начинаю генерацию текстов всех 114 сур...');
  
  let allCode = `// Полные тексты всех 114 сур Корана
// Арабские тексты и английские переводы
// Сгенерировано автоматически

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

  const successfulSurahs = [];
  const failedSurahs = [];
  
  // Генерируем суры по частям, чтобы не перегружать API
  for (let i = 1; i <= 114; i++) {
    try {
      const surahData = await fetchSurahTexts(i);
      
      if (surahData) {
        const code = generateTypeScriptCode(surahData);
        allCode += code;
        successfulSurahs.push(i);
        console.log(`✅ Сура ${i} (${surahData.englishName}) - ${surahData.verses} аятов`);
      } else {
        failedSurahs.push(i);
        console.log(`❌ Не удалось загрузить суру ${i}`);
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Ошибка при обработке суры ${i}:`, error.message);
      failedSurahs.push(i);
    }
  }
  
  // Сохраняем результат
  const outputPath = path.join(__dirname, '../src/data/quranTexts.ts');
  fs.writeFileSync(outputPath, allCode, 'utf8');
  
  console.log('\n📊 Результаты:');
  console.log(`✅ Успешно загружено: ${successfulSurahs.length} сур`);
  console.log(`❌ Не удалось загрузить: ${failedSurahs.length} сур`);
  
  if (failedSurahs.length > 0) {
    console.log(`Неудачные суры: ${failedSurahs.join(', ')}`);
  }
  
  console.log(`\n💾 Файл сохранен: ${outputPath}`);
  console.log('🎉 Генерация завершена!');
}

// Запускаем скрипт
if (require.main === module) {
  generateAllSurahs().catch(console.error);
}

module.exports = { generateAllSurahs, fetchSurahTexts };
