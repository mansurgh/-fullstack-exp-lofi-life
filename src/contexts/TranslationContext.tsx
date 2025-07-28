import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'ru' | 'nl' | 'fr' | 'de';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const translations = {
  en: {
    // Navigation & General
    'app.title': 'Islamic Lofi Rooms',
    'nav.rooms': 'Rooms',
    'nav.quran': 'Quran',
    'nav.help': 'Help',
    'language.selector': 'Language',
    
    // Room Selection
    'rooms.title': 'Choose Your Sacred Space',
    'rooms.subtitle': 'Select a room that resonates with your soul for prayer and reflection',
    'rooms.enter': 'Enter Room',
    
    // Room Names & Descriptions
    'room.rainy.name': 'Rainy Study Room',
    'room.rainy.desc': 'Peaceful rainfall creates a serene atmosphere for deep contemplation',
    'room.fireplace.name': 'Fireplace Nook',
    'room.fireplace.desc': 'Warm crackling fire provides comfort for intimate prayers',
    'room.seaside.name': 'Seaside Sanctuary',
    'room.seaside.desc': 'Ocean waves bring tranquility to your spiritual practice',
    'room.moonlit.name': 'Moonlit Corner',
    'room.moonlit.desc': 'Gentle moonlight illuminates your path to inner peace',
    'room.garden.name': 'Sunny Garden Room',
    'room.garden.desc': 'Bright sunlight and nature sounds energize your prayers',
    'room.desert.name': 'Desert Mirage',
    'room.desert.desc': 'Vast desert silence connects you with divine solitude',
    'room.tuscan.name': 'Tuscan Vista',
    'room.tuscan.desc': 'Rolling hills and gentle breeze inspire peaceful reflection',
    'room.stellar.name': 'Stellar Meditation',
    'room.stellar.desc': 'Cosmic beauty guides your journey to spiritual heights',
    'room.alpine.name': 'Alpine Retreat',
    'room.alpine.desc': 'Mountain winds carry your prayers to the heavens',
    'room.woodland.name': 'Woodland Haven',
    'room.woodland.desc': 'Forest whispers create harmony for sacred moments',
    
    // Room Interface
    'room.volume': 'Volume',
    'room.leave': 'Leave Room',
    'room.audio.warning': '⚠️ Audio files not included - add your own to /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Holy Quran',
    'quran.select.surah': 'Select Surah',
    'quran.verse': 'Verse',
    'quran.play': 'Play',
    'quran.pause': 'Pause',
    'quran.stop': 'Stop',
    'quran.repeat': 'Repeat',
    'quran.translation': 'Translation',
    'quran.arabic': 'Arabic',
    'quran.transliteration': 'Transliteration',
    'quran.word.click': 'Click any word to see word-by-word highlighting simulation',
    'quran.audio.warning': '⚠️ Audio recitation not included - this is a visual demonstration',
    'quran.audio.path': 'To add real audio: Add MP3 files to /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Help
    'help.title': 'How to Use',
    'help.rooms.title': 'Rooms',
    'help.rooms.desc': 'Select different environments for prayer and meditation',
    'help.quran.title': 'Quran Reader',
    'help.quran.desc': 'Read and listen to Quranic verses with translations',
    'help.audio.title': 'Audio Setup',
    'help.audio.desc': 'Add your own audio files for ambient sounds and recitation',
  },
  ru: {
    // Navigation & General
    'app.title': 'Исламские Лофи Комнаты',
    'nav.rooms': 'Комнаты',
    'nav.quran': 'Коран',
    'nav.help': 'Помощь',
    'language.selector': 'Язык',
    
    // Room Selection
    'rooms.title': 'Выберите Ваше Священное Место',
    'rooms.subtitle': 'Выберите комнату, которая резонирует с вашей душой для молитвы и размышлений',
    'rooms.enter': 'Войти в Комнату',
    
    // Room Names & Descriptions
    'room.rainy.name': 'Дождливая Комната для Учёбы',
    'room.rainy.desc': 'Мирный дождь создаёт спокойную атмосферу для глубоких размышлений',
    'room.fireplace.name': 'Уголок у Камина',
    'room.fireplace.desc': 'Тёплый потрескивающий огонь обеспечивает комфорт для интимных молитв',
    'room.seaside.name': 'Приморское Святилище',
    'room.seaside.desc': 'Океанские волны приносят спокойствие в вашу духовную практику',
    'room.moonlit.name': 'Лунный Уголок',
    'room.moonlit.desc': 'Нежный лунный свет освещает ваш путь к внутреннему покою',
    'room.garden.name': 'Солнечная Садовая Комната',
    'room.garden.desc': 'Яркий солнечный свет и звуки природы придают энергию вашим молитвам',
    'room.desert.name': 'Пустынный Мираж',
    'room.desert.desc': 'Безграничная тишина пустыни соединяет вас с божественным уединением',
    'room.tuscan.name': 'Тосканский Вид',
    'room.tuscan.desc': 'Холмистые пейзажи и нежный ветерок вдохновляют на мирные размышления',
    'room.stellar.name': 'Звёздная Медитация',
    'room.stellar.desc': 'Космическая красота направляет ваше путешествие к духовным высотам',
    'room.alpine.name': 'Альпийское Убежище',
    'room.alpine.desc': 'Горные ветра несут ваши молитвы к небесам',
    'room.woodland.name': 'Лесная Гавань',
    'room.woodland.desc': 'Лесной шёпот создаёт гармонию для священных моментов',
    
    // Room Interface
    'room.volume': 'Громкость',
    'room.leave': 'Покинуть Комнату',
    'room.audio.warning': '⚠️ Аудиофайлы не включены - добавьте свои в /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Священный Коран',
    'quran.select.surah': 'Выберите Суру',
    'quran.verse': 'Аят',
    'quran.play': 'Воспроизвести',
    'quran.pause': 'Пауза',
    'quran.stop': 'Стоп',
    'quran.repeat': 'Повторить',
    'quran.translation': 'Перевод',
    'quran.arabic': 'Арабский',
    'quran.transliteration': 'Транслитерация',
    'quran.word.click': 'Нажмите на любое слово для имитации подсветки по словам',
    'quran.audio.warning': '⚠️ Аудио чтение не включено - это визуальная демонстрация',
    'quran.audio.path': 'Для добавления реального аудио: Добавьте MP3 файлы в /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Help
    'help.title': 'Как Использовать',
    'help.rooms.title': 'Комнаты',
    'help.rooms.desc': 'Выберите различные среды для молитвы и медитации',
    'help.quran.title': 'Читатель Корана',
    'help.quran.desc': 'Читайте и слушайте аяты Корана с переводами',
    'help.audio.title': 'Настройка Аудио',
    'help.audio.desc': 'Добавьте свои аудиофайлы для фоновых звуков и чтения',
  },
  nl: {
    // Navigation & General
    'app.title': 'Islamitische Lofi Kamers',
    'nav.rooms': 'Kamers',
    'nav.quran': 'Koran',
    'nav.help': 'Help',
    'language.selector': 'Taal',
    
    // Room Selection
    'rooms.title': 'Kies Uw Heilige Ruimte',
    'rooms.subtitle': 'Selecteer een kamer die resoneert met uw ziel voor gebed en reflectie',
    'rooms.enter': 'Kamer Betreden',
    
    // Room Names & Descriptions
    'room.rainy.name': 'Regenachtige Studiekamer',
    'room.rainy.desc': 'Vredige regenval creëert een serene sfeer voor diepe contemplatie',
    'room.fireplace.name': 'Haard Hoekje',
    'room.fireplace.desc': 'Warm knapperend vuur biedt comfort voor intieme gebeden',
    'room.seaside.name': 'Zeekust Heiligdom',
    'room.seaside.desc': 'Oceaangolven brengen rust in uw spirituele praktijk',
    'room.moonlit.name': 'Maanverlichte Hoek',
    'room.moonlit.desc': 'Zachte maanlicht verlicht uw pad naar innerlijke vrede',
    'room.garden.name': 'Zonnige Tuinkamer',
    'room.garden.desc': 'Helder zonlicht en natuurgeluiden geven energie aan uw gebeden',
    'room.desert.name': 'Woestijn Luchtspiegeling',
    'room.desert.desc': 'Eindeloze woestijnstilte verbindt u met goddelijke eenzaamheid',
    'room.tuscan.name': 'Toscaans Uitzicht',
    'room.tuscan.desc': 'Glooiende heuvels en zachte bries inspireren vredige reflectie',
    'room.stellar.name': 'Stellaire Meditatie',
    'room.stellar.desc': 'Kosmische schoonheid begeleidt uw reis naar spirituele hoogten',
    'room.alpine.name': 'Alpen Toevlucht',
    'room.alpine.desc': 'Bergwinden dragen uw gebeden naar de hemel',
    'room.woodland.name': 'Bos Haven',
    'room.woodland.desc': 'Bosgefluster creëert harmonie voor heilige momenten',
    
    // Room Interface
    'room.volume': 'Volume',
    'room.leave': 'Kamer Verlaten',
    'room.audio.warning': '⚠️ Audiobestanden niet inbegrepen - voeg uw eigen toe aan /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Heilige Koran',
    'quran.select.surah': 'Selecteer Soera',
    'quran.verse': 'Vers',
    'quran.play': 'Afspelen',
    'quran.pause': 'Pauzeren',
    'quran.stop': 'Stoppen',
    'quran.repeat': 'Herhalen',
    'quran.translation': 'Vertaling',
    'quran.arabic': 'Arabisch',
    'quran.transliteration': 'Transliteratie',
    'quran.word.click': 'Klik op elk woord om woord-voor-woord markering simulatie te zien',
    'quran.audio.warning': '⚠️ Audio recitatie niet inbegrepen - dit is een visuele demonstratie',
    'quran.audio.path': 'Om echte audio toe te voegen: Voeg MP3 bestanden toe aan /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Help
    'help.title': 'Hoe Te Gebruiken',
    'help.rooms.title': 'Kamers',
    'help.rooms.desc': 'Selecteer verschillende omgevingen voor gebed en meditatie',
    'help.quran.title': 'Koran Lezer',
    'help.quran.desc': 'Lees en luister naar Koranverzen met vertalingen',
    'help.audio.title': 'Audio Instellingen',
    'help.audio.desc': 'Voeg uw eigen audiobestanden toe voor omgevingsgeluiden en recitatie',
  },
  fr: {
    // Navigation & General
    'app.title': 'Salles Lofi Islamiques',
    'nav.rooms': 'Salles',
    'nav.quran': 'Coran',
    'nav.help': 'Aide',
    'language.selector': 'Langue',
    
    // Room Selection
    'rooms.title': 'Choisissez Votre Espace Sacré',
    'rooms.subtitle': 'Sélectionnez une salle qui résonne avec votre âme pour la prière et la réflexion',
    'rooms.enter': 'Entrer dans la Salle',
    
    // Room Names & Descriptions
    'room.rainy.name': 'Salle d\'Étude Pluvieuse',
    'room.rainy.desc': 'La pluie paisible crée une atmosphère sereine pour une contemplation profonde',
    'room.fireplace.name': 'Coin Cheminée',
    'room.fireplace.desc': 'Un feu chaleureux qui crépite apporte du réconfort pour les prières intimes',
    'room.seaside.name': 'Sanctuaire du Bord de Mer',
    'room.seaside.desc': 'Les vagues de l\'océan apportent la tranquillité à votre pratique spirituelle',
    'room.moonlit.name': 'Coin Éclairé par la Lune',
    'room.moonlit.desc': 'La douce lumière de la lune illumine votre chemin vers la paix intérieure',
    'room.garden.name': 'Salle de Jardin Ensoleillée',
    'room.garden.desc': 'La lumière vive du soleil et les sons de la nature dynamisent vos prières',
    'room.desert.name': 'Mirage du Désert',
    'room.desert.desc': 'Le silence infini du désert vous connecte à la solitude divine',
    'room.tuscan.name': 'Vue Toscane',
    'room.tuscan.desc': 'Les collines vallonnées et la brise douce inspirent une réflexion paisible',
    'room.stellar.name': 'Méditation Stellaire',
    'room.stellar.desc': 'La beauté cosmique guide votre voyage vers les hauteurs spirituelles',
    'room.alpine.name': 'Retraite Alpine',
    'room.alpine.desc': 'Les vents de montagne portent vos prières vers les cieux',
    'room.woodland.name': 'Havre Forestier',
    'room.woodland.desc': 'Les murmures de la forêt créent l\'harmonie pour les moments sacrés',
    
    // Room Interface
    'room.volume': 'Volume',
    'room.leave': 'Quitter la Salle',
    'room.audio.warning': '⚠️ Fichiers audio non inclus - ajoutez les vôtres dans /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Saint Coran',
    'quran.select.surah': 'Sélectionner la Sourate',
    'quran.verse': 'Verset',
    'quran.play': 'Lire',
    'quran.pause': 'Pause',
    'quran.stop': 'Arrêter',
    'quran.repeat': 'Répéter',
    'quran.translation': 'Traduction',
    'quran.arabic': 'Arabe',
    'quran.transliteration': 'Translittération',
    'quran.word.click': 'Cliquez sur n\'importe quel mot pour voir la simulation de surbrillance mot par mot',
    'quran.audio.warning': '⚠️ Récitation audio non incluse - ceci est une démonstration visuelle',
    'quran.audio.path': 'Pour ajouter un vrai audio : Ajoutez des fichiers MP3 dans /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Help
    'help.title': 'Comment Utiliser',
    'help.rooms.title': 'Salles',
    'help.rooms.desc': 'Sélectionnez différents environnements pour la prière et la méditation',
    'help.quran.title': 'Lecteur du Coran',
    'help.quran.desc': 'Lisez et écoutez les versets coraniques avec des traductions',
    'help.audio.title': 'Configuration Audio',
    'help.audio.desc': 'Ajoutez vos propres fichiers audio pour les sons ambiants et la récitation',
  },
  de: {
    // Navigation & General
    'app.title': 'Islamische Lofi Räume',
    'nav.rooms': 'Räume',
    'nav.quran': 'Koran',
    'nav.help': 'Hilfe',
    'language.selector': 'Sprache',
    
    // Room Selection
    'rooms.title': 'Wählen Sie Ihren Heiligen Raum',
    'rooms.subtitle': 'Wählen Sie einen Raum, der mit Ihrer Seele für Gebet und Besinnung resoniert',
    'rooms.enter': 'Raum Betreten',
    
    // Room Names & Descriptions
    'room.rainy.name': 'Regnerisches Arbeitszimmer',
    'room.rainy.desc': 'Friedlicher Regen schafft eine ruhige Atmosphäre für tiefe Kontemplation',
    'room.fireplace.name': 'Kamin-Ecke',
    'room.fireplace.desc': 'Warmes knisterndes Feuer bietet Komfort für intime Gebete',
    'room.seaside.name': 'Küsten-Heiligtum',
    'room.seaside.desc': 'Ozeanwellen bringen Ruhe in Ihre spirituelle Praxis',
    'room.moonlit.name': 'Mondschein-Ecke',
    'room.moonlit.desc': 'Sanftes Mondlicht erhellt Ihren Weg zum inneren Frieden',
    'room.garden.name': 'Sonniger Gartenraum',
    'room.garden.desc': 'Helles Sonnenlicht und Naturgeräusche beleben Ihre Gebete',
    'room.desert.name': 'Wüsten-Fata Morgana',
    'room.desert.desc': 'Endlose Wüstenstille verbindet Sie mit göttlicher Einsamkeit',
    'room.tuscan.name': 'Toskanischer Ausblick',
    'room.tuscan.desc': 'Sanfte Hügel und leichte Brise inspirieren friedliche Besinnung',
    'room.stellar.name': 'Stellare Meditation',
    'room.stellar.desc': 'Kosmische Schönheit führt Ihre Reise zu spirituellen Höhen',
    'room.alpine.name': 'Alpine Zuflucht',
    'room.alpine.desc': 'Bergwinde tragen Ihre Gebete zum Himmel',
    'room.woodland.name': 'Wald-Hafen',
    'room.woodland.desc': 'Waldgeflüster schafft Harmonie für heilige Momente',
    
    // Room Interface
    'room.volume': 'Lautstärke',
    'room.leave': 'Raum Verlassen',
    'room.audio.warning': '⚠️ Audiodateien nicht enthalten - fügen Sie Ihre eigenen zu /public/sounds/ hinzu',
    
    // Quran Reader
    'quran.title': 'Heiliger Koran',
    'quran.select.surah': 'Sure Auswählen',
    'quran.verse': 'Vers',
    'quran.play': 'Abspielen',
    'quran.pause': 'Pausieren',
    'quran.stop': 'Stoppen',
    'quran.repeat': 'Wiederholen',
    'quran.translation': 'Übersetzung',
    'quran.arabic': 'Arabisch',
    'quran.transliteration': 'Transliteration',
    'quran.word.click': 'Klicken Sie auf ein beliebiges Wort, um die Wort-für-Wort-Hervorhebungssimulation zu sehen',
    'quran.audio.warning': '⚠️ Audio-Rezitation nicht enthalten - dies ist eine visuelle Demonstration',
    'quran.audio.path': 'Um echtes Audio hinzuzufügen: Fügen Sie MP3-Dateien zu /public/quran-audio/mishary/[surah]/[verse].mp3 hinzu',
    
    // Help
    'help.title': 'Wie Zu Verwenden',
    'help.rooms.title': 'Räume',
    'help.rooms.desc': 'Wählen Sie verschiedene Umgebungen für Gebet und Meditation',
    'help.quran.title': 'Koran-Leser',
    'help.quran.desc': 'Lesen und hören Sie Koranverse mit Übersetzungen',
    'help.audio.title': 'Audio-Einrichtung',
    'help.audio.desc': 'Fügen Sie Ihre eigenen Audiodateien für Umgebungsgeräusche und Rezitation hinzu',
  }
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};