const fs = require('fs');
const path = require('path');

// Читаем текущий файл
const filePath = path.join(__dirname, '..', 'src', 'data', 'quranTexts.ts');
let content = fs.readFileSync(filePath, 'utf8');

console.log('🧹 Очищаем файл от дублирований и ошибок...');

// Удаляем дублированные объявления
content = content.replace(/export const surah\d+: SurahData = \{[^}]*\}\s*export const surah\d+: SurahData = \{/g, 'export const surah$1: SurahData = {');

// Удаляем лишние закрывающие скобки
content = content.replace(/\}\s*;\s*\n\s*\]\s*\}/g, '};');

// Удаляем дублированные комментарии
content = content.replace(/\/\/ Сура \d+ - [^\\n]*\\n\s*export const surah\d+: SurahData = \{/g, 'export const surah$1: SurahData = {');

// Удаляем дублированные свойства
content = content.replace(/number: \d+,\s*name: "[^"]*",\s*englishName: "[^"]*",\s*verses: \d+,\s*texts: \[\s*number: \d+,\s*name: "[^"]*",\s*englishName: "[^"]*",\s*verses: \d+,\s*texts: \[/g, 'number: $1, name: "$2", englishName: "$3", verses: $4, texts: [');

// Сохраняем очищенный файл
fs.writeFileSync(filePath, content, 'utf8');

console.log('✅ Файл очищен и сохранен!');
