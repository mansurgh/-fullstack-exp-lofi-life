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

// Функция для получения текстов суры
export async function fetchSurahTexts(surahNumber: number): Promise<SurahData | null> {
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

// Функция для получения всех сур
export async function fetchAllSurahs(): Promise<SurahData[]> {
  const surahs: SurahData[] = [];
  
  for (let i = 1; i <= 114; i++) {
    const surah = await fetchSurahTexts(i);
    if (surah) {
      surahs.push(surah);
    }
    
    // Небольшая задержка между запросами
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return surahs;
}

// Функции уже экспортированы выше с помощью export async function
