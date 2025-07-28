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
    'main.subtitle': 'Choose your peaceful sanctuary for Qur\'an reading and reflection. Each room offers its own unique ambiance and sounds.',
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
    'room.seaside-sanctuary.name': 'Seaside Sanctuary',
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
    'room.seaside-sanctuary.name': 'Приморское Святилище',
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
    'room.seaside-sanctuary.name': 'Zeekust Heiligdom',
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
    
    // Room names and descriptions
    'room.rainy-study.name': 'Bureau Pluvieux',
    'room.rainy-study.description': 'Un bureau d\'étude confortable avec la pluie tombant doucement à l\'extérieur de la fenêtre',
    'room.sunny-garden.name': 'Vue sur Jardin',
    'room.sunny-garden.description': 'Une pièce lumineuse donnant sur un jardin paisible avec des oiseaux qui chantent',
    'room.fireplace-nook.name': 'Coin Cheminée',
    'room.fireplace-nook.description': 'Un coin chaleureux avec une cheminée crépitante et des sièges confortables',
    'room.moonlit-corner.name': 'Coin Éclairé par la Lune',
    'room.moonlit-corner.description': 'Un espace nocturne serein baigné de douce lumière lunaire',
    'room.seaside-sanctuary.name': 'Sanctuaire du Bord de Mer',
    'room.seaside-sanctuary.description': 'Les vagues de l\'océan et les mouettes lointaines créent une ambiance côtière paisible',
    'room.desert-mirage.name': 'Mirage du Désert',
    'room.desert-mirage.description': 'Doux vents du désert avec des chuchotements sablonneux lointains et le silence',
    'room.tuscan-vista.name': 'Vue Toscane',
    'room.tuscan-vista.description': 'Brise italienne douce avec des murmures de ville lointains et un vent doux',
    'room.stellar-meditation.name': 'Méditation Stellaire',
    'room.stellar-meditation.description': 'Silence cosmique avec ambiance spatiale éthérée et sons célestes',
    'room.alpine-retreat.name': 'Retraite Alpine',
    'room.alpine-retreat.description': 'Bergwinde pfeifen à travers des pics enneigés paisibles',
    'room.woodland-haven.name': 'Havre Forestier',
    'room.woodland-haven.description': 'Sons de forêt avec de doux bruissements de feuilles et la symphonie de la nature',
    
    // Room interface
    'room.back': 'Retour aux Salles',
    'room.quran.click': 'Cliquez sur le Coran pour commencer à lire',
    'room.audio.warning': '⚠️ Fichiers audio non inclus - ajoutez les vôtres dans /public/sounds/',
    
    // Quran Reader
    'quran.title': 'Noble Coran',
    'quran.select.surah': 'Sélectionner la Sourate',
    'quran.audio.player': 'Lecteur Audio',
    'quran.settings': 'Paramètres de Récitation',
    'quran.speed': 'Vitesse',
    'quran.repeat.word': 'Répéter chaque mot',
    'quran.repeat.verse': 'Répéter chaque verset',
    'quran.repeat.surah': 'Répéter toute la sourate',
    'quran.display': 'Options d\'Affichage',
    'quran.show.transliteration': 'Afficher la Translittération',
    'quran.show.translation': 'Afficher la Traduction',
    'quran.audio.warning': '⚠️ Fichiers audio non inclus',
    'quran.word.click': '💡 Cliquez sur n\'importe quel mot pour le répéter',
    'quran.audio.path': 'Ajoutez des fichiers audio à : /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Quran verses (Al-Fatihah)
    'quran.1.1.transliteration': 'Bismillahi r-rahmani r-raheem',
    'quran.1.1.translation': 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
    'quran.1.2.transliteration': 'Alhamdu lillahi rabbi l-\'alameen',
    'quran.1.2.translation': 'Louange à Allah, Seigneur de l\'univers.',
    'quran.1.3.transliteration': 'Ar-rahmani r-raheem',
    'quran.1.3.translation': 'Le Tout Miséricordieux, le Très Miséricordieux.',
    'quran.1.4.transliteration': 'Maliki yawmi d-deen',
    'quran.1.4.translation': 'Maître du Jour de la rétribution.',
    'quran.1.5.transliteration': 'Iyyaka na\'budu wa iyyaka nasta\'een',
    'quran.1.5.translation': 'C\'est Toi que nous adorons, et c\'est Toi dont nous implorons secours.',
    'quran.1.6.transliteration': 'Ihdina s-sirata l-mustaqeem',
    'quran.1.6.translation': 'Guide-nous dans le droit chemin.',
    'quran.1.7.transliteration': 'Sirata l-ladheena an\'amta \'alayhim ghayri l-maghdoobi \'alayhim wa la d-dalleen',
    'quran.1.7.translation': 'Le chemin de ceux que Tu as comblés de faveurs, non pas de ceux qui ont encouru Ta colère, ni des égarés.',
    
    // Help section
    'help.title': 'Aidez-Moi',
    'help.subtitle': 'Soutenez ce projet et aidez-moi à l\'améliorer',
    'help.money': 'Avec de l\'Argent',
    'help.knowledge': 'Avec des Connaissances',
    'help.donation.title': 'Soutenir avec un Don',
    'help.donation.subtitle': 'Choisissez un montant pour soutenir le développement de ce projet',
    'help.contact.title': 'Me Contacter',
    'help.contact.subtitle': 'Partagez vos connaissances, idées ou commentaires',
  },
  de: {
    // Navigation & General
    'app.title': 'Islamische Lofi Räume',
    'nav.rooms': 'Räume',
    'nav.quran': 'Koran',
    'nav.help': 'Hilfe',
    'language.selector': 'Sprache',
    
    // Main page content
    'main.subtitle': 'Wählen Sie Ihr friedliches Heiligtum zum Koran lesen und zur Besinnung. Jeder Raum bietet seine eigene einzigartige Atmosphäre und Klänge.',
    'main.message': 'Assalamu Aleykum Waramatullahi Wabarakatuh, liebe Brüder und Schwestern, ich habe nicht viel Wissen über das Erstellen von Websites und ich habe auch nicht das nötige Geld, um in meine Pläne zu investieren. Deshalb möchte ich Ihre Hilfe, wenn Ihnen das Konzept gefällt, das Sie vor sich sehen. Ich weiß nicht, wie das funktionieren soll, aber meine Absichten sind es, mehr Muslime anzuziehen, die einfach entspannen und zuhören, studieren oder den Koran im Lofi-Stil lesen können, für die ruhigeren Menschen. Für Menschen, die Natur, Wissen und Seelenfrieden lieben. Also zögern Sie nicht, mir zu helfen oder meine Website voll zu nutzen, möge Allah es für Sie alle leicht machen und möge Allah Sie alle dennoch belohnen.',
    'main.verse': '"Und Er ist es, der Regen vom Himmel herabsendet, und Wir bringen dadurch die Vegetation aller Art hervor."',
    'main.verse.reference': '- Koran 6:99',
    'main.enter.room': 'Raum Betreten',
    
    // Room names and descriptions
    'room.rainy-study.name': 'Regnerisches Arbeitszimmer',
    'room.rainy-study.description': 'Ein gemütliches Arbeitszimmer mit Regen, der sanft vor dem Fenster fällt',
    'room.sunny-garden.name': 'Gartenblick',
    'room.sunny-garden.description': 'Ein heller Raum mit Blick auf einen friedlichen Garten mit zwitschernden Vögeln',
    'room.fireplace-nook.name': 'Kamin-Ecke',
    'room.fireplace-nook.description': 'Eine warme Ecke mit einem knisternden Kamin und bequemen Sitzgelegenheiten',
    'room.moonlit-corner.name': 'Mondschein-Ecke',
    'room.moonlit-corner.description': 'Ein ruhiger nächtlicher Raum, der in sanftes Mondlicht getaucht ist',
    'room.seaside-sanctuary.name': 'Küsten-Heiligtum',
    'room.seaside-sanctuary.description': 'Ozeanwellen und ferne Möwen schaffen eine friedliche Küstenatmosphäre',
    'room.desert-mirage.name': 'Wüsten-Fata Morgana',
    'room.desert-mirage.description': 'Sanfte Wüstenwinde mit fernem sandigem Flüstern und Stille',
    'room.tuscan-vista.name': 'Toskanischer Ausblick',
    'room.tuscan-vista.description': 'Sanfte italienische Brise mit fernem Stadtgemurmel und sanftem Wind',
    'room.stellar-meditation.name': 'Stellare Meditation',
    'room.stellar-meditation.description': 'Kosmische Stille mit ätherischer Weltraumatmosphäre und himmlischen Klängen',
    'room.alpine-retreat.name': 'Alpine Zuflucht',
    'room.alpine-retreat.description': 'Bergwinde pfeifen durch friedliche schneebedeckte Gipfel',
    'room.woodland-haven.name': 'Wald-Hafen',
    'room.woodland-haven.description': 'Sons de forêt avec de doux bruissements de feuilles et la symphonie de la nature',
    
    // Room interface
    'room.back': 'Zurück zu den Räumen',
    'room.quran.click': 'Klicken Sie auf den Koran, um mit dem Lesen zu beginnen',
    'room.audio.warning': '⚠️ Audiodateien nicht enthalten - fügen Sie Ihre eigenen zu /public/sounds/ hinzu',
    
    // Quran Reader
    'quran.title': 'Edler Koran',
    'quran.select.surah': 'Sure Auswählen',
    'quran.audio.player': 'Audio-Player',
    'quran.settings': 'Rezitations-Einstellungen',
    'quran.speed': 'Geschwindigkeit',
    'quran.repeat.word': 'Jedes Wort wiederholen',
    'quran.repeat.verse': 'Jeden Vers wiederholen',
    'quran.repeat.surah': 'Ganze Sure wiederholen',
    'quran.display': 'Anzeigeoptionen',
    'quran.show.transliteration': 'Transliteration Anzeigen',
    'quran.show.translation': 'Übersetzung Anzeigen',
    'quran.audio.warning': '⚠️ Audiodateien nicht enthalten',
    'quran.word.click': '💡 Klicken Sie auf ein beliebiges Wort, um es zu wiederholen',
    'quran.audio.path': 'Audiodateien hinzufügen zu: /public/quran-audio/mishary/[surah]/[verse].mp3',
    
    // Quran verses (Al-Fatihah)
    'quran.1.1.transliteration': 'Bismillahi r-rahmani r-raheem',
    'quran.1.1.translation': 'Im Namen Allahs, des Allerbarmers, des Barmherzigen.',
    'quran.1.2.transliteration': 'Alhamdu lillahi rabbi l-\'alameen',
    'quran.1.2.translation': 'Alles Lob gebührt Allah, dem Herrn der Welten.',
    'quran.1.3.transliteration': 'Ar-rahmani r-raheem',
    'quran.1.3.translation': 'Dem Allerbarmer, dem Barmherzigen.',
    'quran.1.4.transliteration': 'Maliki yawmi d-deen',
    'quran.1.4.translation': 'Dem Herrscher am Tag des Gerichts.',
    'quran.1.5.transliteration': 'Iyyaka na\'budu wa iyyaka nasta\'een',
    'quran.1.5.translation': 'Dir allein dienen wir, und Dich allein bitten wir um Hilfe.',
    'quran.1.6.transliteration': 'Ihdina s-sirata l-mustaqeem',
    'quran.1.6.translation': 'Führe uns den geraden Weg.',
    'quran.1.7.transliteration': 'Sirata l-ladheena an\'amta \'alayhim ghayri l-maghdoobi \'alayhim wa la d-dalleen',
    'quran.1.7.translation': 'Den Weg derer, denen Du Gunst erwiesen hast, nicht derer, die (Deinen) Zorn erregt haben, und nicht der Irregehenden.',
    
    // Help section
    'help.title': 'Helfen Sie Mir',
    'help.subtitle': 'Unterstützen Sie dieses Projekt und helfen Sie mir, es zu verbessern',
    'help.money': 'Mit Geld',
    'help.knowledge': 'Mit Wissen',
    'help.donation.title': 'Mit Spende Unterstützen',
    'help.donation.subtitle': 'Wählen Sie einen Betrag zur Unterstützung der Entwicklung dieses Projekts',
    'help.contact.title': 'Kontaktieren Sie Mich',
    'help.contact.subtitle': 'Teilen Sie Ihr Wissen, Ihre Ideen oder Ihr Feedback',
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
