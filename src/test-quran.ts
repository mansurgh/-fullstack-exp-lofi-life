// Простой тест для проверки работы системы загрузки текстов Корана
import { fetchSurahTexts } from './data/quranTextsComplete';
import { fetchSurahVerses } from './lib/quranApi';
import { fetchFullSurahTexts, generateAndSaveAllSurahs } from './data/quranTextsAll';

// Тест загрузки одной суры
async function testSingleSurah() {
  console.log('🧪 Тестирую загрузку суры 1 (Аль-Фатиха)...');
  
  try {
    const surahData = await fetchSurahTexts(1);
    
    if (surahData) {
      console.log('✅ Сура 1 загружена успешно:');
      console.log(`📖 Название: ${surahData.englishName}`);
      console.log(`📊 Количество аятов: ${surahData.verses}`);
      console.log(`🔤 Первый аят (арабский): ${surahData.texts[0]?.arabic.substring(0, 50)}...`);
      console.log(`🔤 Первый аят (английский): ${surahData.texts[0]?.translation.substring(0, 50)}...`);
      
      return true;
    } else {
      console.log('❌ Не удалось загрузить суру 1');
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка при тестировании суры 1:', error);
    return false;
  }
}

// Тест загрузки через API
async function testApiLoading() {
  console.log('🧪 Тестирую загрузку через API...');
  
  try {
    const verses = await fetchSurahVerses(1);
    
    if (verses && verses.length > 0) {
      console.log('✅ API загрузка успешна:');
      console.log(`📊 Загружено аятов: ${verses.length}`);
      console.log(`🔤 Первый аят (арабский): ${verses[0]?.arabic.substring(0, 50)}...`);
      console.log(`🔤 Первый аят (английский): ${verses[0]?.translation.substring(0, 50)}...`);
      
      return true;
    } else {
      console.log('❌ API не вернул данные');
      return false;
    }
  } catch (error) {
    console.error('❌ Ошибка при тестировании API:', error);
    return false;
  }
}

// Тест загрузки нескольких сур
async function testMultipleSurahs() {
  console.log('🧪 Тестирую загрузку нескольких сур...');
  
  const testSurahs = [1, 2, 3, 13, 112, 113, 114]; // Разные суры для тестирования
  let successCount = 0;
  
  for (const surahNumber of testSurahs) {
    try {
      const surahData = await fetchSurahTexts(surahNumber);
      
      if (surahData) {
        console.log(`✅ Сура ${surahNumber} (${surahData.englishName}): ${surahData.verses} аятов`);
        successCount++;
      } else {
        console.log(`❌ Сура ${surahNumber}: не удалось загрузить`);
      }
      
      // Небольшая задержка между запросами
      await new Promise(resolve => setTimeout(resolve, 200));
      
    } catch (error) {
      console.error(`❌ Ошибка при загрузке суры ${surahNumber}:`, error);
    }
  }
  
  console.log(`📊 Результат: ${successCount}/${testSurahs.length} сур загружено успешно`);
  return successCount === testSurahs.length;
}

// Тест загрузки полных текстов всех сур
async function testFullSurahsLoading() {
  console.log('🧪 Тестирую загрузку полных текстов всех сур...');
  
  try {
    // Тестируем загрузку нескольких сур с полными текстами
    const testSurahs = [1, 2, 112, 113, 114]; // Разные суры для тестирования
    let successCount = 0;
    
    for (const surahNumber of testSurahs) {
      try {
        const surahData = await fetchFullSurahTexts(surahNumber);
        
        if (surahData) {
          console.log(`✅ Сура ${surahNumber} (${surahData.englishName}): ${surahData.verses} аятов`);
          successCount++;
        } else {
          console.log(`❌ Сура ${surahNumber}: не удалось загрузить`);
        }
        
        // Небольшая задержка между запросами
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        console.error(`❌ Ошибка при загрузке суры ${surahNumber}:`, error);
      }
    }
    
    console.log(`📊 Результат: ${successCount}/${testSurahs.length} сур загружено успешно`);
    return successCount === testSurahs.length;
    
  } catch (error) {
    console.error('❌ Ошибка при тестировании полной загрузки:', error);
    return false;
  }
}

// Основная функция тестирования
export async function runQuranTests() {
  console.log('🚀 Начинаю тестирование системы загрузки текстов Корана...\n');
  
  const results = {
    singleSurah: false,
    apiLoading: false,
    multipleSurahs: false,
    fullSurahs: false
  };
  
  // Тест 1: Загрузка одной суры
  results.singleSurah = await testSingleSurah();
  console.log('');
  
  // Тест 2: Загрузка через API
  results.apiLoading = await testApiLoading();
  console.log('');
  
  // Тест 3: Загрузка нескольких сур
  results.multipleSurahs = await testMultipleSurahs();
  console.log('');
  
  // Тест 4: Загрузка полных текстов
  results.fullSurahs = await testFullSurahsLoading();
  console.log('');
  
  // Итоговый результат
  const totalTests = Object.keys(results).length;
  const passedTests = Object.values(results).filter(Boolean).length;
  
  console.log('📊 ИТОГОВЫЕ РЕЗУЛЬТАТЫ:');
  console.log(`✅ Пройдено тестов: ${passedTests}/${totalTests}`);
  console.log(`📖 Загрузка одной суры: ${results.singleSurah ? '✅' : '❌'}`);
  console.log(`🔌 API загрузка: ${results.apiLoading ? '✅' : '❌'}`);
  console.log(`📚 Загрузка нескольких сур: ${results.multipleSurahs ? '✅' : '❌'}`);
  console.log(`📖 Полная загрузка сур: ${results.fullSurahs ? '✅' : '❌'}`);
  
  if (passedTests === totalTests) {
    console.log('🎉 Все тесты пройдены успешно! Система работает корректно.');
  } else {
    console.log('⚠️ Некоторые тесты не пройдены. Проверьте систему.');
  }
  
  return results;
}

// Экспортируем функции для использования
export { testSingleSurah, testApiLoading, testMultipleSurahs };
