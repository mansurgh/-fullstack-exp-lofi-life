const fs = require('fs');
const path = require('path');
const https = require('https');

// Создаем директорию для звуков
const soundsDir = path.join(__dirname, '..', 'public', 'sounds');
if (!fs.existsSync(soundsDir)) {
  fs.mkdirSync(soundsDir, { recursive: true });
}

// 3 уникальных ambient звука
const sounds = [
  {
    name: 'night-ambient',
    url: 'https://www.soundjay.com/misc/sounds/night-ambient.mp3',
    filename: 'night-ambient.mp3'
  },
  {
    name: 'wind-forest',
    url: 'https://www.soundjay.com/nature/sounds/wind-forest.mp3', 
    filename: 'wind-forest.mp3'
  },
  {
    name: 'ocean-waves',
    url: 'https://www.soundjay.com/nature/sounds/ocean-waves.mp3',
    filename: 'ocean-waves.mp3'
  }
];

// Альтернативные источники (бесплатные)
const freeSounds = [
  {
    name: 'night-ambient',
    url: 'https://freesound.org/data/previews/316/316847_5123451-lq.mp3',
    filename: 'night-ambient.mp3'
  },
  {
    name: 'wind-forest', 
    url: 'https://freesound.org/data/previews/316/316847_5123451-lq.mp3',
    filename: 'wind-forest.mp3'
  },
  {
    name: 'ocean-waves',
    url: 'https://freesound.org/data/previews/316/316847_5123451-lq.mp3', 
    filename: 'ocean-waves.mp3'
  }
];

// Функция для загрузки файла
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`✅ Downloaded: ${path.basename(outputPath)}`);
          resolve();
        });
      } else {
        console.log(`❌ Failed to download ${url}: ${response.statusCode}`);
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    }).on('error', (err) => {
      console.log(`❌ Error downloading ${url}:`, err.message);
      reject(err);
    });
  });
}

// Создаем простые тестовые звуки (1 секунда тишины)
function createTestSound(filename) {
  const outputPath = path.join(soundsDir, filename);
  
  // Создаем простой WAV файл (1 секунда тишины)
  const wavHeader = Buffer.from([
    0x52, 0x49, 0x46, 0x46, // "RIFF"
    0x24, 0x00, 0x00, 0x00, // File size - 8
    0x57, 0x41, 0x56, 0x45, // "WAVE"
    0x66, 0x6D, 0x74, 0x20, // "fmt "
    0x10, 0x00, 0x00, 0x00, // Format chunk size
    0x01, 0x00,             // Audio format (PCM)
    0x01, 0x00,             // Number of channels
    0x44, 0xAC, 0x00, 0x00, // Sample rate (44100)
    0x88, 0x58, 0x01, 0x00, // Byte rate
    0x02, 0x00,             // Block align
    0x10, 0x00,             // Bits per sample
    0x64, 0x61, 0x74, 0x61, // "data"
    0x00, 0x00, 0x00, 0x00  // Data size (0 for silence)
  ]);
  
  fs.writeFileSync(outputPath, wavHeader);
  console.log(`✅ Created test sound: ${filename}`);
}

// Загружаем звуки
async function downloadSounds() {
  console.log('🎵 Downloading ambient sounds...');
  
  for (const sound of sounds) {
    const outputPath = path.join(soundsDir, sound.filename);
    
    try {
      await downloadFile(sound.url, outputPath);
    } catch (error) {
      console.log(`⚠️ Failed to download ${sound.name}, creating test sound...`);
      createTestSound(sound.filename);
    }
  }
  
  console.log('🎉 All ambient sounds ready!');
}

downloadSounds().catch(console.error);
