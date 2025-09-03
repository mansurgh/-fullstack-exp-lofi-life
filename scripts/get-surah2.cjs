const fs = require('fs');
const { execSync } = require('child_process');

async function getSurah2() {
  try {
    console.log('🔄 Получаем данные суры 2 через curl...');
    
    // Получаем данные через curl
    const curlCommand = 'curl -s "https://api.alquran.cloud/v1/surah/2/editions/quran-uthmani,en.sahih"';
    const result = execSync(curlCommand, { encoding: 'utf8' });
    
    console.log('✅ Данные получены, парсим...');
    
    const data = JSON.parse(result);
    
    if (!data.data || data.data.length < 2) {
      throw new Error('Неполные данные от API');
    }
    
    const arabicVerses = data.data[0].ayahs;
    const englishVerses = data.data[1].ayahs;
    
    console.log(`📖 Найдено ${arabicVerses.length} аятов`);
    
    // Генерируем код для суры 2
    let code = `// Сура 2 - البقرة (${arabicVerses.length} аятов) - ПОЛНЫЙ ТЕКСТ\n`;
    code += `export const surah2: SurahData = {\n`;
    code += `  number: 2,\n`;
    code += `  name: "البقرة",\n`;
    code += `  englishName: "Al-Baqarah",\n`;
    code += `  verses: ${arabicVerses.length},\n`;
    code += `  texts: [\n`;
    
    for (let i = 0; i < arabicVerses.length; i++) {
      const arabic = arabicVerses[i].text || '';
      const translation = englishVerses[i]?.text || '';
      
      const arabicEscaped = arabic.replace(/"/g, '\\"').trim();
      const translationEscaped = translation.replace(/"/g, '\\"').trim();
      
      code += `    { arabic: "${arabicEscaped}", translation: "${translationEscaped}" }`;
      if (i < arabicVerses.length - 1) {
        code += ',';
      }
      code += '\n';
    }
    
    code += `  ]\n`;
    code += `};\n\n`;
    
    // Сохраняем в отдельный файл
    fs.writeFileSync('surah2-complete.txt', code, 'utf8');
    
    console.log('✅ Код для суры 2 сохранен в surah2-complete.txt');
    console.log('📝 Теперь можно скопировать этот код в quranTexts.ts');
    
  } catch (error) {
    console.error('❌ Ошибка:', error.message);
  }
}

getSurah2();
