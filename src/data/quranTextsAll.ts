// Полные тексты всех 114 сур Корана
// Арабские тексты и английские переводы
// Этот файл содержит полные тексты всех сур

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

// Функция для получения полных текстов суры с API
export async function fetchFullSurahTexts(surahNumber: number): Promise<SurahData | null> {
  try {
    console.log(`Загружаю полные тексты суры ${surahNumber}...`);
    
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
    
    const texts = arabicVerses.map((arabic: any, index: number) => {
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
    console.error(`Ошибка при загрузке суры ${surahNumber}:`, error);
    return null;
  }
}

// Функция для получения всех сур с полными текстами
export async function fetchAllFullSurahs(): Promise<SurahData[]> {
  const surahs: SurahData[] = [];
  
  console.log('🚀 Начинаю загрузку всех 114 сур...');
  
  for (let i = 1; i <= 114; i++) {
    try {
      const surah = await fetchFullSurahTexts(i);
      if (surah) {
        surahs.push(surah);
        console.log(`✅ Сура ${i} (${surah.englishName}): ${surah.verses} аятов`);
      } else {
        console.log(`❌ Не удалось загрузить суру ${i}`);
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Ошибка при загрузке суры ${i}:`, error);
    }
  }
  
  console.log(`📊 Загружено ${surahs.length} из 114 сур`);
  return surahs;
}

// Функция для генерации TypeScript кода для всех сур
export function generateAllSurahsCode(surahs: SurahData[]): string {
  let code = `// Полные тексты всех 114 сур Корана
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

  surahs.forEach(surah => {
    code += `// Сура ${surah.number} - ${surah.englishName} (${surah.verses} аятов)\n`;
    code += `export const surah${surah.number}: SurahData = {\n`;
    code += `  number: ${surah.number},\n`;
    code += `  name: "${surah.name}",\n`;
    code += `  englishName: "${surah.englishName}",\n`;
    code += `  verses: ${surah.verses},\n`;
    code += `  texts: [\n`;
    
    surah.texts.forEach((text, index) => {
      const arabicEscaped = text.arabic.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      const englishEscaped = text.translation.replace(/"/g, '\\"').replace(/\n/g, '\\n');
      
      code += `    { arabic: "${arabicEscaped}", translation: "${englishEscaped}" }`;
      if (index < surah.texts.length - 1) code += ',';
      code += '\n';
    });
    
    code += `  ]\n`;
    code += `};\n\n`;
  });
  
  return code;
}

// Функция для сохранения всех сур в файл
export async function generateAndSaveAllSurahs(): Promise<void> {
  try {
    const surahs = await fetchAllFullSurahs();
    const code = generateAllSurahsCode(surahs);
    
    // В браузере мы не можем напрямую записать файл, но можем показать код
    console.log('📝 Сгенерированный код для всех сур:');
    console.log(code);
    
    // Можно скопировать код и сохранить в файл вручную
    return;
    
  } catch (error) {
    console.error('Ошибка при генерации всех сур:', error);
  }
}

// Функции уже экспортированы выше с помощью export async function
