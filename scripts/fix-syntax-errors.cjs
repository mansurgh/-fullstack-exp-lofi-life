const fs = require('fs');
const path = require('path');

// Читаем файл
const filePath = path.join(__dirname, '..', 'src', 'data', 'quranTexts.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🔧 Исправляем синтаксические ошибки...');

// Исправляем основные проблемы:

// 1. Удаляем дублированные объявления внутри texts
content = content.replace(/texts: \[\s*\/\/ Сура \d+ - [^\\n]*\\n\s*export const surah\d+: SurahData = \{/g, 'texts: [');

// 2. Удаляем лишние закрывающие скобки
content = content.replace(/\}\s*;\s*\n\s*\]\s*\}/g, '};');

// 3. Исправляем дублированные свойства
content = content.replace(/number: \d+,\s*name: "[^"]*",\s*englishName: "[^"]*",\s*verses: \d+,\s*texts: \[\s*number: \d+,\s*name: "[^"]*",\s*englishName: "[^"]*",\s*verses: \d+,\s*texts: \[/g, 'number: $1, name: "$2", englishName: "$3", verses: $4, texts: [');

// 4. Удаляем пустые строки между сурами
content = content.replace(/\}\s*;\s*\n\s*\n\s*\/\/ Сура/g, '};\n\n// Сура');

// Сохраняем исправленный файл
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Синтаксические ошибки исправлены!');
