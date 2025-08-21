import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Получаем __dirname для ES модулей
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация
const OUTPUT_DIR = path.join(__dirname, '../public/quran-audio/basit');
const SURAH_COUNT = 114;
const MAX_CONCURRENT_DOWNLOADS = 3; // Уменьшаем для стабильности

// Создаем папки если их нет
function ensureDirectories() {
  for (let surah = 1; surah <= SURAH_COUNT; surah++) {
    const surahDir = path.join(OUTPUT_DIR, surah.toString());
    if (!fs.existsSync(surahDir)) {
      fs.mkdirSync(surahDir, { recursive: true });
    }
  }
}

// Получаем количество аятов для каждой суры
const surahVerseCounts = {
  1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
  11: 123, 12: 111, 13: 43, 14: 52, 15: 99, 16: 128, 17: 111, 18: 110, 19: 98, 20: 135,
  21: 112, 22: 78, 23: 118, 24: 64, 25: 77, 26: 227, 27: 93, 28: 88, 29: 69, 30: 60,
  31: 34, 32: 30, 33: 73, 34: 54, 35: 45, 36: 83, 37: 182, 38: 88, 39: 75, 40: 85,
  41: 54, 42: 53, 43: 89, 44: 59, 45: 37, 46: 35, 47: 38, 48: 29, 49: 18, 50: 45,
  51: 60, 52: 49, 53: 62, 54: 55, 55: 78, 56: 96, 57: 29, 58: 22, 59: 24, 60: 13,
  61: 14, 62: 11, 63: 11, 64: 18, 65: 12, 66: 12, 67: 30, 68: 52, 69: 52, 70: 44,
  71: 28, 72: 28, 73: 20, 74: 56, 75: 40, 76: 31, 77: 50, 78: 40, 79: 46, 80: 42,
  81: 29, 82: 19, 83: 36, 84: 25, 85: 22, 86: 17, 87: 19, 88: 26, 89: 30, 90: 20,
  91: 15, 92: 21, 93: 11, 94: 8, 95: 8, 96: 19, 97: 5, 98: 8, 99: 8, 100: 11,
  101: 11, 102: 8, 103: 3, 104: 9, 105: 5, 106: 4, 107: 7, 108: 3, 109: 6, 110: 3,
  111: 5, 112: 4, 113: 5, 114: 6
};

// Скачиваем файл
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const request = protocol.get(url, (response) => {
      if (response.statusCode === 200) {
        const file = fs.createWriteStream(outputPath);
        response.pipe(file);
        
        file.on('finish', () => {
          file.close();
          resolve();
        });
        
        file.on('error', (err) => {
          fs.unlink(outputPath, () => {}); // Удаляем неполный файл
          reject(err);
        });
      } else if (response.statusCode === 404) {
        reject(new Error('File not found'));
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', reject);
    request.setTimeout(45000, () => { // Увеличиваем timeout
      request.destroy();
      reject(new Error('Timeout'));
    });
  });
}

// Тестируем доступность источников
async function testSources() {
  console.log('🧪 Testing audio sources...');
  
  const testUrls = [
    'https://everyayah.com/data/Alafasy_128kbps/001001.mp3',
    'https://server8.mp3quran.net/abdul_basit_murattal/001001.mp3',
    'https://www.mp3quran.net/abdul_basit_murattal/001001.mp3',
    'https://cdn.islamic.network/quran/audio/ayah/ar.abdulbasitmurattal/1:1.mp3'
  ];
  
  for (let i = 0; i < testUrls.length; i++) {
    try {
      const response = await new Promise((resolve, reject) => {
        const protocol = testUrls[i].startsWith('https:') ? https : http;
        const req = protocol.get(testUrls[i], (res) => {
          resolve(res.statusCode);
        });
        req.setTimeout(10000, () => reject(new Error('Timeout')));
        req.on('error', reject);
      });
      
      if (response === 200) {
        console.log(`✅ Source ${i + 1} working: ${testUrls[i]}`);
      } else {
        console.log(`⚠️  Source ${i + 1} status ${response}: ${testUrls[i]}`);
      }
    } catch (error) {
      console.log(`❌ Source ${i + 1} failed: ${error.message}`);
    }
  }
}

// Основная функция загрузки
async function downloadQuranAudio() {
  console.log('🚀 Starting Quran audio download (v2)...');
  console.log(`📁 Output directory: ${OUTPUT_DIR}`);
  
  // Сначала тестируем источники
  await testSources();
  
  ensureDirectories();
  
  let totalFiles = 0;
  let downloadedFiles = 0;
  let failedFiles = 0;
  
  // Подсчитываем общее количество файлов
  for (let surah = 1; surah <= SURAH_COUNT; surah++) {
    totalFiles += surahVerseCounts[surah] || 0;
  }
  
  console.log(`📊 Total files to download: ${totalFiles}`);
  
  // Создаем очередь загрузок
  const downloadQueue = [];
  
  for (let surah = 1; surah <= SURAH_COUNT; surah++) {
    const verseCount = surahVerseCounts[surah] || 0;
    
    for (let verse = 1; verse <= verseCount; verse++) {
      const outputPath = path.join(OUTPUT_DIR, surah.toString(), `${verse}.mp3`);
      
      // Проверяем, существует ли уже файл
      if (fs.existsSync(outputPath)) {
        console.log(`✅ Already exists: ${surah}:${verse}`);
        downloadedFiles++;
        continue;
      }
      
      // Добавляем в очередь с альтернативными источниками
      downloadQueue.push({
        surah,
        verse,
        outputPath,
        urls: [
          // Альтернативные источники
          `https://everyayah.com/data/Alafasy_128kbps/${surah.toString().padStart(3, '0')}${verse.toString().padStart(3, '0')}.mp3`,
          `https://server8.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${verse.toString().padStart(3, '0')}.mp3`,
          `https://www.mp3quran.net/abdul_basit_murattal/${surah.toString().padStart(3, '0')}${verse.toString().padStart(3, '0')}.mp3`,
          // Старые источники как fallback
          `https://cdn.islamic.network/quran/audio/ayah/ar.abdulbasitmurattal/${surah}:${verse}.mp3`
        ]
      });
    }
  }
  
  console.log(`📥 Files to download: ${downloadQueue.length}`);
  
  // Функция для загрузки одного файла
  async function downloadFromQueue() {
    if (downloadQueue.length === 0) return;
    
    const item = downloadQueue.shift();
    const { surah, verse, outputPath, urls } = item;
    
    console.log(`⬇️  Downloading ${surah}:${verse}...`);
    
    // Пробуем все URL по очереди
    for (let i = 0; i < urls.length; i++) {
      try {
        await downloadFile(urls[i], outputPath);
        console.log(`✅ Downloaded ${surah}:${verse} from source ${i + 1}`);
        downloadedFiles++;
        break;
      } catch (error) {
        if (i === urls.length - 1) {
          console.log(`❌ Failed to download ${surah}:${verse} from all sources: ${error.message}`);
          failedFiles++;
        } else {
          console.log(`⚠️  Source ${i + 1} failed for ${surah}:${verse}, trying next...`);
        }
      }
    }
    
    // Показываем прогресс
    const progress = ((downloadedFiles + failedFiles) / totalFiles * 100).toFixed(1);
    console.log(`📊 Progress: ${progress}% (${downloadedFiles}/${totalFiles} downloaded, ${failedFiles} failed)`);
    
    // Продолжаем с следующим файлом
    setTimeout(downloadFromQueue, 200); // Увеличиваем задержку
  }
  
  // Запускаем загрузки
  const workers = [];
  for (let i = 0; i < MAX_CONCURRENT_DOWNLOADS; i++) {
    workers.push(downloadFromQueue());
  }
  
  // Ждем завершения всех загрузок
  await Promise.all(workers);
  
  console.log('\n🎉 Download completed!');
  console.log(`✅ Downloaded: ${downloadedFiles}`);
  console.log(`❌ Failed: ${failedFiles}`);
  console.log(`📁 Files saved to: ${OUTPUT_DIR}`);
}

// Запускаем скрипт
downloadQuranAudio().catch(console.error);
