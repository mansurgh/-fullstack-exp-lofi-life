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
    
    // Main page content
    'main.subtitle': 'Choose your peaceful room for Qur\'an reading and reflection. Each room offers its own unique ambiance and sounds.',
    'main.message': 'Assalamu Aleykum Waramatullahi Wabarakatuh, dear brothers and sisters, I have not much knowledge on making sites nor do I have the necessary money to invest in my plans. So I would like your help if you like the concept that u see before you. I don\'t know how to make this work, but my intentions are to attract more muslims that can just relax and listen, study or read the Qur\'an in a lofi style for the more calm people. For people that like nature, knowledge and calmness of mind. So please feel free to aid me or use my site to its fullest, May Allah make it easy for all of you and may Allah reward you all nonetheless.',
    'main.verse': '"And it is He who sends down rain from heaven, and We produce thereby the vegetation of every kind."',
    'main.verse.reference': '- Qur\'an 6:99',
    'main.enter.room': 'Enter Room',
    
    // Room names and descriptions
    'room.rainy-study.name': 'Rainy Study',
    'room.rainy-study.description': 'A cozy study room with rain gently falling outside the window',
    'room.sunny-garden.name': 'Garden View', 
    'room.sunny-garden.description': 'A bright room overlooking a peaceful garden with chirping birds',
    'room.fireplace-nook.name': 'Fireplace Nook',
    'room.fireplace-nook.description': 'A warm corner with a crackling fireplace and comfortable seating',
    'room.moonlit-corner.name': 'Moonlit Corner',
    'room.moonlit-corner.description': 'A serene nighttime space bathed in gentle moonlight',
    'room.seaside-sanctuary.name': 'Seaside Room',
    'room.seaside-sanctuary.description': 'Ocean waves and distant seagulls create peaceful coastal ambiance',
    'room.desert-mirage.name': 'Desert Mirage',
    'room.desert-mirage.description': 'Gentle desert winds with distant sandy whispers and silence',
    'room.tuscan-vista.name': 'Tuscan Vista',
    'room.tuscan-vista.description': 'Soft Italian breeze with distant city murmurs and gentle wind',
    'room.stellar-meditation.name': 'Stellar Meditation',
    'room.stellar-meditation.description': 'Cosmic silence with ethereal space ambiance and celestial sounds',
    'room.alpine-retreat.name': 'Alpine Retreat',
    'room.alpine-retreat.description': 'Mountain winds whistling through peaceful snow-capped peaks',
    'room.woodland-haven.name': 'Woodland Haven',
    'room.woodland-haven.description': 'Forest sounds with gentle rustling leaves and nature\'s symphony',
    'room.russian-winter.name': 'Russian Winter',
    'room.russian-winter.description': 'Snow falling gently outside with peaceful winter ambiance',
    'room.chechen-tower.name': 'Chechen Tower',
    'room.chechen-tower.description': 'Mountain winds around the ancient Vainakh tower',
    'room.french-eiffel.name': 'French Elegance',
    'room.french-eiffel.description': 'Parisian streets with distant Eiffel Tower view',
    'room.norwegian-landscape.name': 'Norwegian Sky',
    'room.norwegian-landscape.description': 'Open Norwegian landscape with mountain winds',
    'room.tokyo-neon.name': 'Tokyo Nights',
    'room.tokyo-neon.description': 'Neon-lit cityscape with urban night sounds',
    'room.belgian-grey.name': 'Belgian Streets',
    'room.belgian-grey.description': 'Grey city atmosphere with gentle rain sounds',
    'room.german-brown.name': 'German Village',
    'room.german-brown.description': 'Traditional brown-roofed cityscape with peaceful ambiance',
    'room.dutch-farm.name': 'Dutch Countryside',
    'room.dutch-farm.description': 'Peaceful farmland with nature sounds and gentle breeze',
    'room.chinese-lake.name': 'Chinese Serenity',
    'room.chinese-lake.description': 'Tranquil lake view with gentle water sounds',
    'room.circus-tent.name': 'Circus Memories',
    'room.circus-tent.description': 'Inside the big tent with nostalgic circus atmosphere',
    'room.football-field.name': 'Football Field',
    'room.football-field.description': 'On the field with gentle wind and outdoor ambiance',
    'room.tennis-court.name': 'Tennis Court',
    'room.tennis-court.description': 'Peaceful tennis court with outdoor sports atmosphere',
    'room.basketball-court.name': 'Basketball Court',
    'room.basketball-court.description': 'Indoor basketball court with gentle echoing sounds',
    'room.volleyball-court.name': 'Volleyball Court',
    'room.volleyball-court.description': 'Clean volleyball court with peaceful gym ambiance',
    'room.bowling-alley.name': 'Bowling Alley',
    'room.bowling-alley.description': 'Quiet bowling alley with subtle rolling sounds',
    'room.american-football.name': 'American Football',
    'room.american-football.description': 'Stadium field with gentle wind and outdoor sounds',
    'room.hockey-rink.name': 'Hockey Rink',
    'room.hockey-rink.description': 'Ice rink with peaceful arena ambiance',
    'room.indoor-pool.name': 'Swimming Pool',
    'room.indoor-pool.description': 'Peaceful poolside with gentle water sounds',
    'room.spongebob-pineapple.name': 'Underwater Home',
    'room.spongebob-pineapple.description': 'SpongeBob\'s pineapple with underwater bubble sounds',
    'room.minecraft-room.name': 'Minecraft World',
    'room.minecraft-room.description': 'Blocky world with peaceful ambient cube sounds',
    'room.mosque-interior.name': 'Sacred Mosque',
    'room.mosque-interior.description': 'Peaceful mosque interior with spiritual silence',
    'room.library-room.name': 'Quiet Library',
    'room.library-room.description': 'Silent library with gentle page turning sounds',
    'room.rgb-room.name': 'Disco',
    'room.rgb-room.description': 'Dark room with customizable lighting effects and electronic ambiance',
    'room.poland-snow.name': 'Polish Winter',
    'room.poland-snow.description': 'Cozy Polish room with peaceful snowy winter sounds',
    'room.antarctic-igloo.name': 'Antarctic Igloo',
    'room.antarctic-igloo.description': 'Inside an igloo with cold Antarctic wind sounds',
    'room.space-ship.name': 'Space Station',
    'room.space-ship.description': 'Spaceship with cosmic silence and Earth view',
    'room.pink-candy.name': 'Sweet Dreams',
    'room.pink-candy.description': 'Pink room with magical candy field view and peaceful silence',
    'room.prison-cell.name': 'Prison Cell',
    'room.prison-cell.description': 'Institutional cell with echoing silence',
    'room.skyscraper-view.name': 'Sky High',
    'room.skyscraper-view.description': 'High-rise room with city sounds from far below',
    'room.submarine-view.name': 'Deep Sea',
    'room.submarine-view.description': 'Submarine with underwater bubble sounds and sea plant view',
    'room.pirate-deck-view.name': 'Nakama',
    'room.pirate-deck-view.description': 'Standing at the helm with adventure gear around',
    
    // Room interface
    'room.back': 'Back to Rooms',
    'room.quran.click': 'Click the Qur\'an to begin reading',
    'room.audio.warning': '⚠️ Audio files not included - add your own to /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Noble Qur\'an',
    'quran.select.surah': 'Select Surah',
    'quran.audio.player': 'Audio Player',
    'quran.settings': 'Recitation Settings',
    'quran.speed': 'Speed',
    'quran.repeat.word': 'Repeat each word',
    'quran.repeat.verse': 'Repeat each verse',
    'quran.repeat.surah': 'Repeat entire surah',
    'quran.display': 'Display Options',
    'quran.show.transliteration': 'Show Transliteration',
    'quran.show.translation': 'Show Translation',
    'quran.audio.warning': '⚠️ Audio files not included',
    'quran.word.click': '💡 Click any word to repeat it',
    'quran.audio.path': 'Add audio files to: /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Quran verses (Al-Fatihah)
    'quran.1.1.transliteration': 'Bismillahi r-rahmani r-raheem',
    'quran.1.1.translation': 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    'quran.1.2.transliteration': 'Alhamdu lillahi rabbi l-\'alameen',
    'quran.1.2.translation': 'All praise is due to Allah, Lord of the worlds.',
    'quran.1.3.transliteration': 'Ar-rahmani r-raheem',
    'quran.1.3.translation': 'The Entirely Merciful, the Especially Merciful.',
    'quran.1.4.transliteration': 'Maliki yawmi d-deen',
    'quran.1.4.translation': 'Sovereign of the Day of Recompense.',
    'quran.1.5.transliteration': 'Iyyaka na\'budu wa iyyaka nasta\'een',
    'quran.1.5.translation': 'It is You we worship and You we ask for help.',
    'quran.1.6.transliteration': 'Ihdina s-sirata l-mustaqeem',
    'quran.1.6.translation': 'Guide us to the straight path.',
    'quran.1.7.transliteration': 'Sirata l-ladheena an\'amta \'alayhim ghayri l-maghdoobi \'alayhim wa la d-dalleen',
    'quran.1.7.translation': 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.',
    
    // Theme selector
    'theme.title': 'Choose Your Theme',
    'theme.subtitle': 'Select a theme that matches your mood and the atmosphere you desire',
    'theme.current': 'Current theme',
    'theme.default': 'Default',
    'theme.spring': 'Spring',
    'theme.summer': 'Summer',
    'theme.autumn': 'Autumn',
    'theme.winter': 'Winter',
    'theme.day': 'Day Cycle',
    'theme.night': 'Night Cycle',
    'theme.rainy': 'Rainy Days',
    
    // Help section
    'help.title': 'Help Me Out',
    'help.subtitle': 'Support this project and help me improve it',
    'help.money': 'With Money',
    'help.knowledge': 'With Knowledge',
    'help.donation.title': 'Support with Donation',
    'help.donation.subtitle': 'Choose an amount to support the development of this project',
    'help.contact.title': 'Contact Me',
    'help.contact.subtitle': 'Share your knowledge, ideas, or feedback',
  },
  ru: {
    // Navigation & General
    'app.title': 'Исламские Лофи Комнаты',
    'nav.rooms': 'Комнаты',
    'nav.quran': 'Коран',
    'nav.help': 'Помощь',
    'language.selector': 'Язык',
    
    // Main page content
    'main.subtitle': 'Выберите ваше мирное убежище для чтения Корана и размышлений. Каждая комната предлагает свою уникальную атмосферу и звуки.',
    'main.message': 'Ассаламу алейкум ва рахматуллахи ва баракатух, дорогие братья и сёстры, у меня не так много знаний в создании сайтов, и у меня нет необходимых денег для инвестирования в мои планы. Поэтому я хотел бы вашей помощи, если вам нравится концепция, которую вы видите перед собой. Я не знаю, как заставить это работать, но мои намерения - привлечь больше мусульман, которые могут просто расслабиться и слушать, изучать или читать Коран в лофи стиле для более спокойных людей. Для людей, которые любят природу, знания и спокойствие ума. Поэтому, пожалуйста, не стесняйтесь помочь мне или использовать мой сайт в полной мере. Пусть Аллах облегчит это для всех вас и пусть Аллах вознаградит всех вас, тем не менее.',
    'main.verse': '"И Он - Тот, Кто ниспосылает дождь с неба, и Мы производим им растительность всякого рода."',
    'main.verse.reference': '- Коран 6:99',
    'main.enter.room': 'Войти в Комнату',
    
    // Room names and descriptions
    'room.rainy-study.name': 'Дождливый Кабинет',
    'room.rainy-study.description': 'Уютная учебная комната с дождем, мягко падающим за окном',
    'room.sunny-garden.name': 'Садовый Вид',
    'room.sunny-garden.description': 'Светлая комната с видом на мирный сад с щебетанием птиц',
    'room.fireplace-nook.name': 'Каминный Уголок',
    'room.fireplace-nook.description': 'Теплый уголок с потрескивающим камином и удобными креслами',
    'room.moonlit-corner.name': 'Лунный Уголок',
    'room.moonlit-corner.description': 'Безмятежное ночное пространство, купающееся в нежном лунном свете',
    'room.seaside-sanctuary.name': 'Приморская Комната',
    'room.seaside-sanctuary.description': 'Океанские волны и далекие чайки создают мирную прибрежную атмосферу',
    'room.desert-mirage.name': 'Пустынный Мираж',
    'room.desert-mirage.description': 'Нежные пустынные ветра с далеким песчаным шепотом и тишиной',
    'room.tuscan-vista.name': 'Тосканская Панорама',
    'room.tuscan-vista.description': 'Мягкий итальянский бриз с далеким городским гулом и нежным ветром',
    'room.stellar-meditation.name': 'Звездная Медитация',
    'room.stellar-meditation.description': 'Космическая тишина с эфирной космической атмосферой и небесными звуками',
    'room.alpine-retreat.name': 'Альпийское Убежище',
    'room.alpine-retreat.description': 'Горные ветра, свистящие через мирные заснеженные вершины',
    'room.woodland-haven.name': 'Лесная Гавань',
    'room.woodland-haven.description': 'Лесные звуки с нежным шелестом листьев и симфонией природы',
    
    // Room interface
    'room.back': 'Вернуться к Комнатам',
    'room.quran.click': 'Нажмите на Коран, чтобы начать чтение',
    'room.audio.warning': '⚠️ Аудиофайлы не включены - добавьте свои в /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Благородный Коран',
    'quran.select.surah': 'Выберите Суру',
    'quran.audio.player': 'Аудиоплеер',
    'quran.settings': 'Настройки Чтения',
    'quran.speed': 'Скорость',
    'quran.repeat.word': 'Повторить каждое слово',
    'quran.repeat.verse': 'Повторить каждый аят',
    'quran.repeat.surah': 'Повторить всю суру',
    'quran.display': 'Настройки Отображения',
    'quran.show.transliteration': 'Показать Транслитерацию',
    'quran.show.translation': 'Показать Перевод',
    'quran.audio.warning': '⚠️ Аудиофайлы не включены',
    'quran.word.click': '💡 Нажмите на любое слово, чтобы повторить его',
    'quran.audio.path': 'Добавьте аудиофайлы в: /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Quran verses (Al-Fatihah) - keeping Arabic transliteration the same but translating the translation
    'quran.1.1.transliteration': 'Bismillahi r-rahmani r-raheem',
    'quran.1.1.translation': 'Во имя Аллаха, Милостивого, Милосердного.',
    'quran.1.2.transliteration': 'Alhamdu lillahi rabbi l-\'alameen',
    'quran.1.2.translation': 'Хвала Аллаху, Господу миров.',
    'quran.1.3.transliteration': 'Ar-rahmani r-raheem',
    'quran.1.3.translation': 'Милостивому, Милосердному.',
    'quran.1.4.transliteration': 'Maliki yawmi d-deen',
    'quran.1.4.translation': 'Властелину Дня воздаяния.',
    'quran.1.5.transliteration': 'Iyyaka na\'budu wa iyyaka nasta\'een',
    'quran.1.5.translation': 'Тебе одному мы поклоняемся и Тебя одному молим о помощи.',
    'quran.1.6.transliteration': 'Ihdina s-sirata l-mustaqeem',
    'quran.1.6.translation': 'Веди нас прямым путем.',
    'quran.1.7.transliteration': 'Sirata l-ladheena an\'amta \'alayhim ghayri l-maghdoobi \'alayhim wa la d-dalleen',
    'quran.1.7.translation': 'Путем тех, кого Ты одарил благодатью, не тех, которые находятся под гневом, и не заблудших.',
    
    // Theme selector
    'theme.title': 'Выберите Вашу Тему',
    'theme.subtitle': 'Выберите тему, которая соответствует вашему настроению и желаемой атмосфере',
    'theme.current': 'Текущая тема',
    'theme.default': 'По умолчанию',
    'theme.spring': 'Весна',
    'theme.summer': 'Лето',
    'theme.autumn': 'Осень',
    'theme.winter': 'Зима',
    'theme.day': 'Дневной цикл',
    'theme.night': 'Ночной цикл',
    'theme.rainy': 'Дождливые дни',
    
    // Help section
    'help.title': 'Помогите Мне',
    'help.subtitle': 'Поддержите этот проект и помогите мне улучшить его',
    'help.money': 'Деньгами',
    'help.knowledge': 'Знаниями',
    'help.donation.title': 'Поддержка Пожертвованием',
    'help.donation.subtitle': 'Выберите сумму для поддержки развития этого проекта',
    'help.contact.title': 'Связаться со Мной',
    'help.contact.subtitle': 'Поделитесь своими знаниями, идеями или отзывами',
  },
  nl: {
    // Navigation & General
    'app.title': 'Islamitische Lofi Kamers',
    'nav.rooms': 'Kamers',
    'nav.quran': 'Koran',
    'nav.help': 'Help',
    'language.selector': 'Taal',
    
    // Main page content
    'main.subtitle': 'Kies uw vredige toevluchtsoord voor Koran lezen en reflectie. Elke kamer biedt zijn eigen unieke sfeer en geluiden.',
    'main.message': 'Assalamu Aleykum Waramatullahi Wabarakatuh, lieve broeders en zusters, ik heb niet veel kennis van het maken van websites en ik heb ook niet het nodige geld om in mijn plannen te investeren. Dus ik zou graag jullie hulp willen als jullie het concept bevalt dat jullie voor jullie zien. Ik weet niet hoe dit moet werken, maar mijn intenties zijn om meer moslims aan te trekken die gewoon kunnen ontspannen en luisteren, studeren of de Koran lezen in een lofi stijl voor de meer kalme mensen. Voor mensen die van natuur, kennis en gemoedrust houden. Dus voel je vrij om mij te helpen of mijn site ten volle te gebruiken, moge Allah het gemakkelijk maken voor jullie allemaal en moge Allah jullie allemaal belonen desondanks.',
    'main.verse': '"En Hij is degene die regen van de hemel doet neerdalen, en Wij brengen daardoor alle soorten vegetatie voort."',
    'main.verse.reference': '- Koran 6:99',
    'main.enter.room': 'Kamer Betreden',
    
    // Room names and descriptions
    'room.rainy-study.name': 'Regenachtige Studeerkamer',
    'room.rainy-study.description': 'Een gezellige studeerkamer met regen die zacht buiten het raam valt',
    'room.sunny-garden.name': 'Tuinzicht',
    'room.sunny-garden.description': 'Een heldere kamer met uitzicht op een vredige tuin met kwetterende vogels',
    'room.fireplace-nook.name': 'Haard Hoekje',
    'room.fireplace-nook.description': 'Een warme hoek met een knapperend haardvuur en comfortabele zitplaatsen',
    'room.moonlit-corner.name': 'Maanverlichte Hoek',
    'room.moonlit-corner.description': 'Een serene nachtelijke ruimte badend in zacht maanlicht',
    'room.seaside-sanctuary.name': 'Zeekust Kamer',
    'room.seaside-sanctuary.description': 'Oceaangolven en verre meeuwen creëren een vredige kust sfeer',
    'room.desert-mirage.name': 'Woestijn Luchtspiegeling',
    'room.desert-mirage.description': 'Zachte woestijnwinden met verre zandige fluisteringen en stilte',
    'room.tuscan-vista.name': 'Toscaans Uitzicht',
    'room.tuscan-vista.description': 'Zachte Italiaanse bries met verre stadsmompelingen en zachte wind',
    'room.stellar-meditation.name': 'Stellaire Meditatie',
    'room.stellar-meditation.description': 'Kosmische stilte met etherische ruimte sfeer en hemelse geluiden',
    'room.alpine-retreat.name': 'Alpen Toevlucht',
    'room.alpine-retreat.description': 'Bergwinden fluitend door vredige besneeuwde pieken',
    'room.woodland-haven.name': 'Bos Haven',
    'room.woodland-haven.description': 'Bosgeluiden met zacht ritselende bladeren en de symfonie van de natuur',
    
    // Room interface
    'room.back': 'Terug naar Kamers',
    'room.quran.click': 'Klik op de Koran om te beginnen met lezen',
    'room.audio.warning': '⚠️ Audiobestanden niet inbegrepen - voeg uw eigen toe aan /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Edele Koran',
    'quran.select.surah': 'Selecteer Soera',
    'quran.audio.player': 'Audiospeler',
    'quran.settings': 'Recitatie Instellingen',
    'quran.speed': 'Snelheid',
    'quran.repeat.word': 'Herhaal elk woord',
    'quran.repeat.verse': 'Herhaal elke vers',
    'quran.repeat.surah': 'Herhaal hele soera',
    'quran.display': 'Weergave Opties',
    'quran.show.transliteration': 'Toon Transliteratie',
    'quran.show.translation': 'Toon Vertaling',
    'quran.audio.warning': '⚠️ Audiobestanden niet inbegrepen',
    'quran.word.click': '💡 Klik op elk woord om het te herhalen',
    'quran.audio.path': 'Voeg audiobestanden toe aan: /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Quran verses (Al-Fatihah)
    'quran.1.1.transliteration': 'Bismillahi r-rahmani r-raheem',
    'quran.1.1.translation': 'In de naam van Allah, de Barmhartige, de Genadevolle.',
    'quran.1.2.transliteration': 'Alhamdu lillahi rabbi l-\'alameen',
    'quran.1.2.translation': 'Alle lof is voor Allah, Heer der werelden.',
    'quran.1.3.transliteration': 'Ar-rahmani r-raheem',
    'quran.1.3.translation': 'De Barmhartige, de Genadevolle.',
    'quran.1.4.transliteration': 'Maliki yawmi d-deen',
    'quran.1.4.translation': 'Beeerser van de Dag des Oordeels.',
    'quran.1.5.transliteration': 'Iyyaka na\'budu wa iyyaka nasta\'een',
    'quran.1.5.translation': 'U alleen aanbidden wij en U alleen vragen wij om hulp.',
    'quran.1.6.transliteration': 'Ihdina s-sirata l-mustaqeem',
    'quran.1.6.translation': 'Leid ons op het rechte pad.',
    'quran.1.7.transliteration': 'Sirata l-ladheena an\'amta \'alayhim ghayri l-maghdoobi \'alayhim wa la d-dalleen',
    'quran.1.7.translation': 'Het pad van degenen die U genade hebt geschonken, niet van degenen die Uw toorn hebben opgewekt, noch van de dwalenden.',
    
    // Theme selector
    'theme.title': 'Kies Uw Thema',
    'theme.subtitle': 'Selecteer een thema dat past bij uw stemming en de gewenste sfeer',
    'theme.current': 'Huidige thema',
    'theme.default': 'Standaard',
    'theme.spring': 'Lente',
    'theme.summer': 'Zomer',
    'theme.autumn': 'Herfst',
    'theme.winter': 'Winter',
    'theme.day': 'Dag cyclus',
    'theme.night': 'Nacht cyclus',
    'theme.rainy': 'Regenachtige dagen',
    
    // Help section
    'help.title': 'Help Mij',
    'help.subtitle': 'Steun dit project en help mij het te verbeteren',
    'help.money': 'Met Geld',
    'help.knowledge': 'Met Kennis',
    'help.donation.title': 'Steun met Donatie',
    'help.donation.subtitle': 'Kies een bedrag om de ontwikkeling van dit project te steunen',
    'help.contact.title': 'Contact Opnemen',
    'help.contact.subtitle': 'Deel uw kennis, ideeën of feedback',
  },
  fr: {
    // Navigation & General
    'app.title': 'Salles Lofi Islamiques',
    'nav.rooms': 'Salles',
    'nav.quran': 'Coran',
    'nav.help': 'Aide',
    'language.selector': 'Langue',
    
    // Main page content
    'main.subtitle': 'Choisissez votre sanctuaire paisible pour la lecture du Coran et la réflexion. Chaque salle offre sa propre ambiance et ses sons uniques.',
    'main.message': 'Assalamu Aleykum Waramatullahi Wabarakatuh, chers frères et sœurs, je n\'ai pas beaucoup de connaissances pour créer des sites et je n\'ai pas l\'argent nécessaire pour investir dans mes projets. Donc j\'aimerais votre aide si vous aimez le concept que vous voyez devant vous. Je ne sais pas comment faire fonctionner cela, mais mes intentions sont d\'attirer plus de musulmans qui peuvent simplement se détendre et écouter, étudier ou lire le Coran dans un style lofi pour les personnes plus calmes. Pour les gens qui aiment la nature, la connaissance et la tranquillité d\'esprit. Alors n\'hésitez pas à m\'aider ou à utiliser mon site au maximum, qu\'Allah vous facilite les choses à tous et qu\'Allah vous récompense tous néanmoins.',
    'main.verse': '"Et c\'est Lui qui fait descendre la pluie du ciel, et Nous produisons par elle la végétation de toute sorte."',
    'main.verse.reference': '- Coran 6:99',
    'main.enter.room': 'Entrer dans la Salle',
    
    // Complete French room translations and remaining content
    'room.rainy-study.name': 'Bureau Pluvieux',
    'room.rainy-study.description': 'Un bureau d\'étude confortable avec la pluie tombant doucement à l\'extérieur de la fenêtre',
    'room.sunny-garden.name': 'Vue sur Jardin',
    'room.sunny-garden.description': 'Une pièce lumineuse donnant sur un jardin paisible avec des oiseaux qui chantent',
    'room.fireplace-nook.name': 'Coin Cheminée',
    'room.fireplace-nook.description': 'Un coin chaleureux avec une cheminée crépitante et des sièges confortables',
    'room.moonlit-corner.name': 'Coin Éclairé par la Lune',
    'room.moonlit-corner.description': 'Un espace nocturne serein baigné de douce lumière lunaire',
    'room.seaside-sanctuary.name': 'Salle du Bord de Mer',
    'room.seaside-sanctuary.description': 'Les vagues de l\'océan et les mouettes lointaines créent une ambiance côtière paisible',
    'room.desert-mirage.name': 'Mirage du Désert',
    'room.desert-mirage.description': 'Doux vents du désert avec des chuchotements sablonneux lointains et le silence',
    'room.tuscan-vista.name': 'Vue Toscane',
    'room.tuscan-vista.description': 'Brise italienne douce avec des murmures de ville lointains et un vent doux',
    'room.stellar-meditation.name': 'Méditation Stellaire',
    'room.stellar-meditation.description': 'Silence cosmique avec ambiance spatiale éthérée et sons célestes',
    'room.alpine-retreat.name': 'Retraite Alpine',
    'room.alpine-retreat.description': 'Vents de montagne sifflant à travers des pics enneigés paisibles',
    'room.woodland-haven.name': 'Havre Forestier',
    'room.woodland-haven.description': 'Sons de forêt avec de doux bruissements de feuilles et la symphonie de la nature',
    
    'room.back': 'Retour aux Salles',
    'room.quran.click': 'Cliquez sur le Coran pour commencer à lire',
    'room.audio.warning': '⚠️ Fichiers audio non inclus - ajoutez les vôtres dans /public/sounds/',
    
    'quran.title': 'Noble Coran',
    'quran.select.surah': 'Sélectionner la Sourate',
    'quran.1.1.transliteration': 'Bismillahi r-rahmani r-raheem',
    'quran.1.1.translation': 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    
    'theme.title': 'Choisissez Votre Thème',
    'theme.subtitle': 'Sélectionnez un thème qui correspond à votre humeur et à l\'atmosphère désirée',
    'theme.current': 'Thème actuel',
    'theme.default': 'Par défaut',
    'theme.spring': 'Printemps',
    'theme.summer': 'Été',
    'theme.autumn': 'Automne',
    'theme.winter': 'Hiver',
    'theme.day': 'Cycle diurne',
    'theme.night': 'Cycle nocturne',
    'theme.rainy': 'Jours pluvieux',
    
    'help.title': 'Aidez-Moi',
    'help.subtitle': 'Soutenez ce projet et aidez-moi à l\'améliorer',
  },
  de: {
    // All German translations including theme selector
    'app.title': 'Islamische Lofi Räume',
    
    'room.woodland-haven.description': 'Waldklänge mit sanftem Blätterrauschen und der Symphonie der Natur',
    
    'theme.title': 'Wählen Sie Ihr Thema',
    'theme.subtitle': 'Wählen Sie ein Thema, das zu Ihrer Stimmung und der gewünschten Atmosphäre passt',
    'theme.current': 'Aktuelles Thema',
    'theme.default': 'Standard',
    'theme.spring': 'Frühling',
    'theme.summer': 'Sommer',
    'theme.autumn': 'Herbst',
    'theme.winter': 'Winter',
    'theme.day': 'Tag-Zyklus',
    'theme.night': 'Nacht-Zyklus',
    'theme.rainy': 'Regentage',
    
    'help.title': 'Helfen Sie Mir'
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
