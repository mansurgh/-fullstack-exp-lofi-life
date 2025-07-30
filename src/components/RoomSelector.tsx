import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from '@/contexts/TranslationContext';
import { ThemeSelector } from '@/components/ThemeSelector';
import { LanguageSelector } from '@/components/LanguageSelector';

// Lofi first-person view images
import lofiRainyStudy from "@/assets/lofi-rainy-study.jpg";
import lofiSunnyGarden from "@/assets/lofi-sunny-garden.jpg";
import lofiFireplaceNook from "@/assets/lofi-fireplace-nook.jpg";
import lofiMoonlitCorner from "@/assets/lofi-moonlit-corner.jpg";
import lofiSeasideSanctuary from "@/assets/lofi-seaside-sanctuary.jpg";
import lofiDesertMirage from "@/assets/lofi-desert-mirage.jpg";
import lofiTuscanVista from "@/assets/lofi-tuscan-vista.jpg";
import lofiStellarMeditation from "@/assets/lofi-stellar-meditation.jpg";
import lofiAlpineRetreat from "@/assets/lofi-alpine-retreat.jpg";
import lofiWoodlandHaven from "@/assets/lofi-woodland-haven.jpg";
import lofiRussianWinter from "@/assets/lofi-russian-winter.jpg";
import lofiChechenTower from "@/assets/lofi-chechen-tower.jpg";
import lofiFrenchEiffel from "@/assets/lofi-french-eiffel.jpg";
import lofiNorwegianLandscape from "@/assets/lofi-norwegian-landscape.jpg";
import lofiTokyoNeon from "@/assets/lofi-tokyo-neon.jpg";
import lofiBelgianGrey from "@/assets/lofi-belgian-grey.jpg";
import lofiGermanBrown from "@/assets/lofi-german-brown.jpg";
import lofiDutchFarm from "@/assets/lofi-dutch-farm.jpg";
import lofiChineseLake from "@/assets/lofi-chinese-lake.jpg";
import lofiCircusTent from "@/assets/lofi-circus-tent.jpg";
import lofiLibraryRoom from "@/assets/lofi-library-room.jpg";
import lofiMosqueInterior from "@/assets/lofi-mosque-interior.jpg";
import lofiRgbRoom from "@/assets/lofi-rgb-room.jpg";
import lofiPolandSnow from "@/assets/lofi-poland-snow.jpg";
import lofiAntarcticIgloo from "@/assets/lofi-antarctic-igloo.jpg";
import lofiSpaceShip from "@/assets/lofi-space-ship.jpg";
import lofiPinkCandy from "@/assets/lofi-pink-candy.jpg";
import lofiPrisonCell from "@/assets/lofi-prison-cell.jpg";
import lofiSkyscraperView from "@/assets/lofi-skyscraper-view.jpg";
import lofiSubmarineView from "@/assets/lofi-submarine-view.jpg";
import lofiTetrisRoom from "@/assets/lofi-tetris-room.jpg";
import lofiClickerArcade from "@/assets/lofi-clicker-arcade.jpg";
import lofiMinecraftRoom from "@/assets/lofi-minecraft-room.jpg";
import lofiNarutoRoom from "@/assets/lofi-naruto-room.jpg";
import lofiSpongebobPineapple from "@/assets/lofi-spongebob-pineapple.jpg";
import lofiPirateDeckView from "@/assets/lofi-pirate-deck-view.jpg";
import lofiGhibliForest from "@/assets/lofi-ghibli-forest.jpg";
import lofiTitanWall from "@/assets/lofi-titan-wall.jpg";
import lofiDemonSlayerDojo from "@/assets/lofi-demon-slayer-dojo.jpg";
import lofiHeroAcademy from "@/assets/lofi-hero-academy.jpg";
import lofiDragonBallTraining from "@/assets/lofi-dragon-ball-training.jpg";
import lofiHospitalWaiting from "@/assets/lofi-hospital-waiting.jpg";
import lofiJailCell from "@/assets/lofi-jail-cell.jpg";
import lofiTrainStation from "@/assets/lofi-train-station.jpg";
import lofiBusStop from "@/assets/lofi-bus-stop.jpg";
import lofiDoctorsOffice from "@/assets/lofi-doctors-office.jpg";
import lofiGym from "@/assets/lofi-gym.jpg";
import lofiBirdShop from "@/assets/lofi-bird-shop.jpg";
import lofiRoomWithCat from "@/assets/lofi-room-with-cat.jpg";
import lofiCatEating from "@/assets/lofi-cat-eating.jpg";
import lofiDogEating from "@/assets/lofi-dog-eating.jpg";
import lofiKitchenCockatiel from "@/assets/lofi-kitchen-cockatiel.jpg";
import lofiMoonlitRoom from "@/assets/lofi-moonlit-room.jpg";
import lofiRainHideout from "@/assets/lofi-rain-hideout.jpg";
import lofiParkTrees from "@/assets/lofi-park-trees.jpg";

// Fantasy rooms inspired by cartoons
import lofiFantasy1 from '@/assets/lofi-fantasy1.jpg';
import lofiFantasy2 from '@/assets/lofi-fantasy2.jpg';
import lofiFantasy3 from '@/assets/lofi-fantasy3.jpg';
import lofiFantasy4 from '@/assets/lofi-fantasy4.jpg';
import lofiFantasy5 from '@/assets/lofi-fantasy5.jpg';
import lofiFantasy6 from '@/assets/lofi-fantasy6.jpg';
import lofiFantasy7 from '@/assets/lofi-fantasy7.jpg';
import lofiFantasy8 from '@/assets/lofi-fantasy8.jpg';
import lofiFantasy9 from '@/assets/lofi-fantasy9.jpg';
import lofiFantasy10 from '@/assets/lofi-fantasy10.jpg';
import lofiFantasy11 from '@/assets/lofi-fantasy11.jpg';
import lofiFantasy12 from '@/assets/lofi-fantasy12.jpg';
import lofiFantasy13 from '@/assets/lofi-fantasy13.jpg';
import lofiFantasy14 from '@/assets/lofi-fantasy14.jpg';
import lofiFantasy15 from '@/assets/lofi-fantasy15.jpg';
import lofiFantasy16 from '@/assets/lofi-fantasy16.jpg';
import lofiFantasy17 from '@/assets/lofi-fantasy17.jpg';
import lofiFantasy18 from '@/assets/lofi-fantasy18.jpg';
import lofiFantasy19 from '@/assets/lofi-fantasy19.jpg';
import lofiFantasy20 from '@/assets/lofi-fantasy20.jpg';
import lofiFantasy21 from '@/assets/lofi-fantasy21.jpg';
import lofiFantasy22 from '@/assets/lofi-fantasy22.jpg';
import lofiFantasy23 from '@/assets/lofi-fantasy23.jpg';
import lofiFantasy24 from '@/assets/lofi-fantasy24.jpg';
import lofiFantasy25 from '@/assets/lofi-fantasy25.jpg';
import lofiFantasy26 from '@/assets/lofi-fantasy26.jpg';
import lofiFantasy27 from '@/assets/lofi-fantasy27.jpg';
import lofiFantasy28 from '@/assets/lofi-fantasy28.jpg';
import lofiFantasy29 from '@/assets/lofi-fantasy29.jpg';
import lofiFantasy30 from '@/assets/lofi-fantasy30.jpg';
import lofiFantasy31 from '@/assets/lofi-fantasy31.jpg';
import lofiFantasy32 from '@/assets/lofi-fantasy32.jpg';
import lofiFantasy33 from '@/assets/lofi-fantasy33.jpg';
import lofiFantasy34 from '@/assets/lofi-fantasy34.jpg';
import lofiFantasy35 from '@/assets/lofi-fantasy35.jpg';
import lofiFantasy36 from '@/assets/lofi-fantasy36.jpg';
import lofiFantasy37 from '@/assets/lofi-fantasy37.jpg';
import lofiFantasy38 from '@/assets/lofi-fantasy38.jpg';
import lofiFantasy39 from '@/assets/lofi-fantasy39.jpg';
import lofiFantasy40 from '@/assets/lofi-fantasy40.jpg';
import lofiFantasy41 from '@/assets/lofi-fantasy41.jpg';
import lofiFantasy42 from '@/assets/lofi-fantasy42.jpg';
import lofiFantasy43 from '@/assets/lofi-fantasy43.jpg';
import lofiFantasy44 from '@/assets/lofi-fantasy44.jpg';

// Sport rooms (keeping original)
import footballField from "@/assets/football-field.jpg";
import tennisCourt from "@/assets/tennis-court.jpg";
import basketballCourt from "@/assets/basketball-court.jpg";
import volleyballCourt from "@/assets/volleyball-court.jpg";
import bowlingAlley from "@/assets/bowling-alley.jpg";
import americanFootball from "@/assets/american-football.jpg";
import hockeyRink from "@/assets/hockey-rink.jpg";
import indoorPool from "@/assets/indoor-pool.jpg";

// Fictional characters (replaced with clean versions)
import cleanMinecraftRoom from "@/assets/clean-tetris-room.jpg"; // Using tetris room for minecraft
import cleanNarutoRoom from "@/assets/clean-library-room.jpg"; // Using library for naruto
import cleanSpongebobPineapple from "@/assets/clean-submarine-view.jpg"; // Using submarine for underwater
import cleanPirateDeckView from "@/assets/clean-seaside-sanctuary.jpg"; // Using seaside for pirate

interface Room {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  ambientType: 'rain' | 'birds' | 'fire' | 'night' | 'waves' | 'desert' | 'city' | 'space' | 'wind' | 'forest' | 'snow' | 'mountain' | 'traffic' | 'nature' | 'water' | 'underwater' | 'electronic' | 'silence' | 'sports' | 'pages' | 'japanese';
}

interface RoomSelectorProps {
  onSelectRoom: (roomId: string) => void;
}

const rooms: Room[] = [
  {
    id: 'rainy-study',
    name: 'Rainy Study',
    description: 'A cozy study room with rain gently falling outside the window',
    thumbnail: lofiRainyStudy,
    ambientType: 'rain'
  },
  {
    id: 'sunny-garden',
    name: 'Garden View',
    description: 'A bright room overlooking a peaceful garden with chirping birds',
    thumbnail: lofiSunnyGarden,
    ambientType: 'birds'
  },
  {
    id: 'fireplace-nook',
    name: 'Fireplace Nook',
    description: 'A warm corner with a crackling fireplace and comfortable seating',
    thumbnail: lofiFireplaceNook,
    ambientType: 'fire'
  },
  {
    id: 'moonlit-corner',
    name: 'Moonlit Corner',
    description: 'A serene nighttime space bathed in gentle moonlight',
    thumbnail: lofiMoonlitCorner,
    ambientType: 'night'
  },
  {
    id: 'seaside-sanctuary',
    name: 'Seaside Room',
    description: 'Ocean waves and distant seagulls create peaceful coastal ambiance',
    thumbnail: lofiSeasideSanctuary,
    ambientType: 'waves'
  },
  {
    id: 'desert-mirage',
    name: 'Desert Mirage',
    description: 'Gentle desert winds with distant sandy whispers and silence',
    thumbnail: lofiDesertMirage,
    ambientType: 'desert'
  },
  {
    id: 'tuscan-vista',
    name: 'Tuscan Vista',
    description: 'Soft Italian breeze with distant city murmurs and gentle wind',
    thumbnail: lofiTuscanVista,
    ambientType: 'city'
  },
  {
    id: 'stellar-meditation',
    name: 'Stellar Meditation',
    description: 'Cosmic silence with ethereal space ambiance and celestial sounds',
    thumbnail: lofiStellarMeditation,
    ambientType: 'space'
  },
  {
    id: 'alpine-retreat',
    name: 'Alpine Retreat',
    description: 'Mountain winds whistling through peaceful snow-capped peaks',
    thumbnail: lofiAlpineRetreat,
    ambientType: 'wind'
  },
  {
    id: 'woodland-haven',
    name: 'Woodland Haven',
    description: 'Forest sounds with gentle rustling leaves and nature\'s symphony',
    thumbnail: lofiWoodlandHaven,
    ambientType: 'forest'
  },
  {
    id: 'russian-winter',
    name: 'Russian Winter',
    description: 'Snow falling gently outside with peaceful winter ambiance',
    thumbnail: lofiRussianWinter,
    ambientType: 'snow'
  },
  {
    id: 'chechen-tower',
    name: 'Chechen Tower',
    description: 'Mountain winds around the ancient Vainakh tower',
    thumbnail: lofiChechenTower,
    ambientType: 'mountain'
  },
  {
    id: 'french-eiffel',
    name: 'French Elegance',
    description: 'Parisian streets with distant Eiffel Tower view',
    thumbnail: lofiFrenchEiffel,
    ambientType: 'city'
  },
  {
    id: 'norwegian-landscape',
    name: 'Norwegian Sky',
    description: 'Open Norwegian landscape with mountain winds',
    thumbnail: lofiNorwegianLandscape,
    ambientType: 'wind'
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Nights',
    description: 'Neon-lit cityscape with urban night sounds',
    thumbnail: lofiTokyoNeon,
    ambientType: 'traffic'
  },
  {
    id: 'belgian-grey',
    name: 'Belgian Streets',
    description: 'Grey city atmosphere with gentle rain sounds',
    thumbnail: lofiBelgianGrey,
    ambientType: 'rain'
  },
  {
    id: 'german-brown',
    name: 'German Village',
    description: 'Traditional brown-roofed cityscape with peaceful ambiance',
    thumbnail: lofiGermanBrown,
    ambientType: 'city'
  },
  {
    id: 'dutch-farm',
    name: 'Dutch Countryside',
    description: 'Peaceful farmland with nature sounds and gentle breeze',
    thumbnail: lofiDutchFarm,
    ambientType: 'nature'
  },
  {
    id: 'chinese-lake',
    name: 'Chinese Serenity',
    description: 'Tranquil lake view with gentle water sounds',
    thumbnail: lofiChineseLake,
    ambientType: 'water'
  },
  {
    id: 'circus-tent',
    name: 'Circus Memories',
    description: 'Inside the big tent with nostalgic circus atmosphere',
    thumbnail: lofiCircusTent,
    ambientType: 'silence'
  },
  {
    id: 'football-field',
    name: 'Football Field',
    description: 'On the field with gentle wind and outdoor ambiance',
    thumbnail: footballField,
    ambientType: 'sports'
  },
  {
    id: 'tennis-court',
    name: 'Tennis Court',
    description: 'Peaceful tennis court with outdoor sports atmosphere',
    thumbnail: tennisCourt,
    ambientType: 'sports'
  },
  {
    id: 'basketball-court',
    name: 'Basketball Court',
    description: 'Indoor basketball court with gentle echoing sounds',
    thumbnail: basketballCourt,
    ambientType: 'sports'
  },
  {
    id: 'volleyball-court',
    name: 'Volleyball Court',
    description: 'Clean volleyball court with peaceful gym ambiance',
    thumbnail: volleyballCourt,
    ambientType: 'sports'
  },
  {
    id: 'bowling-alley',
    name: 'Bowling Alley',
    description: 'Quiet bowling alley with subtle rolling sounds',
    thumbnail: bowlingAlley,
    ambientType: 'sports'
  },
  {
    id: 'american-football',
    name: 'American Football',
    description: 'Stadium field with gentle wind and outdoor sounds',
    thumbnail: americanFootball,
    ambientType: 'sports'
  },
  {
    id: 'hockey-rink',
    name: 'Hockey Rink',
    description: 'Ice rink with peaceful arena ambiance',
    thumbnail: hockeyRink,
    ambientType: 'sports'
  },
  {
    id: 'indoor-pool',
    name: 'Swimming Pool',
    description: 'Peaceful poolside with gentle water sounds',
    thumbnail: indoorPool,
    ambientType: 'water'
  },
  {
    id: 'spongebob-pineapple',
    name: 'Underwater Home',
    description: 'Underwater environment with bubble sounds',
    thumbnail: lofiSpongebobPineapple,
    ambientType: 'underwater'
  },
  {
    id: 'minecraft-room',
    name: 'Minecraft World',
    description: 'Blocky world with peaceful ambient cube sounds',
    thumbnail: lofiMinecraftRoom,
    ambientType: 'electronic'
  },
  {
    id: 'mosque-interior',
    name: 'Sacred Mosque',
    description: 'Peaceful mosque interior with spiritual silence',
    thumbnail: lofiMosqueInterior,
    ambientType: 'silence'
  },
  {
    id: 'library-room',
    name: 'Quiet Library',
    description: 'Silent library with gentle page turning sounds',
    thumbnail: lofiLibraryRoom,
    ambientType: 'pages'
  },
  {
    id: 'rgb-room',
    name: 'Disco',
    description: 'Dark room with customizable lighting effects and electronic ambiance',
    thumbnail: lofiRgbRoom,
    ambientType: 'electronic'
  },
  {
    id: 'poland-snow',
    name: 'Polish Winter',
    description: 'Cozy Polish room with peaceful snowy winter sounds',
    thumbnail: lofiPolandSnow,
    ambientType: 'snow'
  },
  {
    id: 'antarctic-igloo',
    name: 'Antarctic Igloo',
    description: 'Inside an igloo with cold Antarctic wind sounds',
    thumbnail: lofiAntarcticIgloo,
    ambientType: 'wind'
  },
  {
    id: 'space-ship',
    name: 'Space Station',
    description: 'Spaceship with cosmic silence and Earth view',
    thumbnail: lofiSpaceShip,
    ambientType: 'space'
  },
  {
    id: 'pink-candy',
    name: 'Sweet Dreams',
    description: 'Pink room with magical candy field view and peaceful silence',
    thumbnail: lofiPinkCandy,
    ambientType: 'silence'
  },
  {
    id: 'prison-cell',
    name: 'Prison Cell',
    description: 'Institutional cell with echoing silence',
    thumbnail: lofiPrisonCell,
    ambientType: 'silence'
  },
  {
    id: 'skyscraper-view',
    name: 'Sky High',
    description: 'High-rise room with city sounds from far below',
    thumbnail: lofiSkyscraperView,
    ambientType: 'city'
  },
  {
    id: 'submarine-view',
    name: 'Deep Sea',
    description: 'Submarine with underwater bubble sounds and sea plant view',
    thumbnail: lofiSubmarineView,
    ambientType: 'underwater'
  },
  {
    id: 'pirate-deck-view',
    name: 'Nakama',
    description: 'Standing at the helm with adventure gear around',
    thumbnail: lofiPirateDeckView,
    ambientType: 'waves'
  },
  {
    id: 'naruto-room',
    name: 'Ninja Hideout',
    description: 'Restaurant with peaceful atmosphere',
    thumbnail: lofiNarutoRoom,
    ambientType: 'silence'
  },
  {
    id: 'ghibli-forest',
    name: 'Ghibli Forest',
    description: 'Magical forest view with Studio Ghibli atmosphere',
    thumbnail: lofiGhibliForest,
    ambientType: 'forest'
  },
  {
    id: 'titan-wall',
    name: 'Titan Wall',
    description: 'Watchtower overlooking the titan walls',
    thumbnail: lofiTitanWall,
    ambientType: 'wind'
  },
  {
    id: 'demon-slayer-dojo',
    name: 'Demon Slayer Dojo',
    description: 'Traditional Japanese training dojo',
    thumbnail: lofiDemonSlayerDojo,
    ambientType: 'japanese'
  },
  {
    id: 'hero-academy',
    name: 'Hero Academy',
    description: 'UA High School classroom atmosphere',
    thumbnail: lofiHeroAcademy,
    ambientType: 'city'
  },
  {
    id: 'dragon-ball-training',
    name: 'Kame House',
    description: 'Dragon Ball training ground by the ocean',
    thumbnail: lofiDragonBallTraining,
    ambientType: 'waves'
  },
  {
    id: 'tetris-room',
    name: 'Tetris Arcade',
    description: 'Retro gaming room with playable tetris using WASD controls',
    thumbnail: lofiTetrisRoom,
    ambientType: 'electronic'
  },
  {
    id: 'clicker-arcade',
    name: 'Clicker Arcade',
    description: 'Click gift packages to discover ahadith wisdom',
    thumbnail: lofiClickerArcade,
    ambientType: 'electronic'
  },
  {
    id: 'hospital-waiting',
    name: 'Hospital Waiting',
    description: 'Peaceful hospital waiting room with warm atmosphere',
    thumbnail: lofiHospitalWaiting,
    ambientType: 'silence'
  },
  {
    id: 'jail-cell',
    name: 'Peaceful Cell',
    description: 'Contemplative space for reflection and reading',
    thumbnail: lofiJailCell,
    ambientType: 'silence'
  },
  {
    id: 'train-station',
    name: 'Train Platform',
    description: 'Nostalgic train station with gentle station sounds',
    thumbnail: lofiTrainStation,
    ambientType: 'city'
  },
  {
    id: 'bus-stop',
    name: 'Bus Stop Shelter',
    description: 'Cozy bus stop with evening ambiance',
    thumbnail: lofiBusStop,
    ambientType: 'city'
  },
  {
    id: 'doctors-office',
    name: 'Doctor\'s Office',
    description: 'Warm medical office with peaceful atmosphere',
    thumbnail: lofiDoctorsOffice,
    ambientType: 'silence'
  },
  {
    id: 'gym',
    name: 'Peaceful Gym',
    description: 'Cozy gym space with warm lighting',
    thumbnail: lofiGym,
    ambientType: 'silence'
  },
  {
    id: 'bird-shop',
    name: 'Bird Shop',
    description: 'Charming bird shop with colorful birds',
    thumbnail: lofiBirdShop,
    ambientType: 'birds'
  },
  {
    id: 'room-with-cat',
    name: 'Cat\'s Corner',
    description: 'Cozy room with a friendly cat companion',
    thumbnail: lofiRoomWithCat,
    ambientType: 'silence'
  },
  {
    id: 'cat-eating',
    name: 'Feeding Time',
    description: 'Peaceful room watching a cat enjoy its meal',
    thumbnail: lofiCatEating,
    ambientType: 'silence'
  },
  {
    id: 'dog-eating',
    name: 'Happy Pup',
    description: 'Warm room with a content dog at mealtime',
    thumbnail: lofiDogEating,
    ambientType: 'silence'
  },
  {
    id: 'kitchen-cockatiel',
    name: 'Kitchen Bird',
    description: 'Cozy kitchen with a colorful cockatiel friend',
    thumbnail: lofiKitchenCockatiel,
    ambientType: 'birds'
  },
  {
    id: 'moonlit-room',
    name: 'Night Moon',
    description: 'Dark room illuminated by bright moonlight',
    thumbnail: lofiMoonlitRoom,
    ambientType: 'night'
  },
  {
    id: 'rain-hideout',
    name: 'Rain Shelter',
    description: 'Cozy hideout protecting from the rain outside',
    thumbnail: lofiRainHideout,
    ambientType: 'rain'
  },
  {
    id: 'park-trees',
    name: 'Tree Park',
    description: 'Peaceful park with lush green trees',
    thumbnail: lofiParkTrees,
    ambientType: 'nature'
  },
  
  // Fantasy rooms
  { id: 'fantasy1', name: 'Fantasy 1', description: 'Gothic mystical study room with green glowing elements', thumbnail: lofiFantasy1, ambientType: 'silence' },
  { id: 'fantasy2', name: 'Fantasy 2', description: 'Magical colorful bedroom with whimsical decorations', thumbnail: lofiFantasy2, ambientType: 'silence' },
  { id: 'fantasy3', name: 'Fantasy 3', description: 'Zen meditation room with elemental symbols', thumbnail: lofiFantasy3, ambientType: 'silence' },
  { id: 'fantasy4', name: 'Fantasy 4', description: 'Underground lair with green neon lighting', thumbnail: lofiFantasy4, ambientType: 'city' },
  { id: 'fantasy5', name: 'Fantasy 5', description: 'Cozy suburban living room with warm orange tones', thumbnail: lofiFantasy5, ambientType: 'silence' },
  { id: 'fantasy6', name: 'Fantasy 6', description: 'Modern suburban living room with green accents', thumbnail: lofiFantasy6, ambientType: 'silence' },
  { id: 'fantasy7', name: 'Fantasy 7', description: 'Mountain town bedroom with winter atmosphere', thumbnail: lofiFantasy7, ambientType: 'snow' },
  { id: 'fantasy8', name: 'Fantasy 8', description: 'Trainer bedroom with adventure gear', thumbnail: lofiFantasy8, ambientType: 'silence' },
  { id: 'fantasy9', name: 'Fantasy 9', description: 'Vintage kitchen with classic 1940s decor', thumbnail: lofiFantasy9, ambientType: 'silence' },
  { id: 'fantasy10', name: 'Fantasy 10', description: 'High-tech teenage bedroom with spy gadgets', thumbnail: lofiFantasy10, ambientType: 'electronic' },
  { id: 'fantasy11', name: 'Fantasy 11', description: 'Suburban garage workshop with creative inventions', thumbnail: lofiFantasy11, ambientType: 'silence' },
  { id: 'fantasy12', name: 'Fantasy 12', description: 'Baby nursery with colorful toys and soft pastels', thumbnail: lofiFantasy12, ambientType: 'silence' },
  { id: 'fantasy13', name: 'Fantasy 13', description: 'Superhero bedroom with pink blue green colors', thumbnail: lofiFantasy13, ambientType: 'city' },
  { id: 'fantasy14', name: 'Fantasy 14', description: 'Magical fairy bedroom with sparkling decorations', thumbnail: lofiFantasy14, ambientType: 'silence' },
  { id: 'fantasy15', name: 'Fantasy 15', description: 'Cute kawaii bedroom with pink bows and hearts', thumbnail: lofiFantasy15, ambientType: 'silence' },
  { id: 'fantasy16', name: 'Fantasy 16', description: 'Stone age cave dwelling with rock furniture', thumbnail: lofiFantasy16, ambientType: 'silence' },
  { id: 'fantasy17', name: 'Fantasy 17', description: 'Spooky mystery room with detective equipment', thumbnail: lofiFantasy17, ambientType: 'silence' },
  { id: 'fantasy18', name: 'Fantasy 18', description: 'Quirky British apartment with eccentric decorations', thumbnail: lofiFantasy18, ambientType: 'silence' },
  { id: 'fantasy19', name: 'Fantasy 19', description: 'Cozy doghouse interior with writer supplies', thumbnail: lofiFantasy19, ambientType: 'silence' },
  { id: 'fantasy20', name: 'Fantasy 20', description: 'Sailor cabin with nautical decorations', thumbnail: lofiFantasy20, ambientType: 'waves' },
  { id: 'fantasy21', name: 'Fantasy 21', description: 'Mushroom house interior with forest elements', thumbnail: lofiFantasy21, ambientType: 'forest' },
  { id: 'fantasy22', name: 'Fantasy 22', description: 'Invention workshop with blueprints and gadgets', thumbnail: lofiFantasy22, ambientType: 'silence' },
  { id: 'fantasy23', name: 'Fantasy 23', description: 'Rabbit hole home with carrot decorations', thumbnail: lofiFantasy23, ambientType: 'silence' },
  { id: 'fantasy24', name: 'Fantasy 24', description: 'Pirate ship cabin with candy jars', thumbnail: lofiFantasy24, ambientType: 'waves' },
  { id: 'fantasy25', name: 'Fantasy 25', description: 'Zen meditation dojo with katana swords', thumbnail: lofiFantasy25, ambientType: 'japanese' },
  { id: 'fantasy26', name: 'Fantasy 26', description: 'Treehouse bedroom with geometric patterns', thumbnail: lofiFantasy26, ambientType: 'forest' },
  { id: 'fantasy27', name: 'Fantasy 27', description: 'Spooky bedroom with gothic decorations', thumbnail: lofiFantasy27, ambientType: 'silence' },
  { id: 'fantasy28', name: 'Fantasy 28', description: 'Classic cartoon studio with animation equipment', thumbnail: lofiFantasy28, ambientType: 'silence' },
  { id: 'fantasy29', name: 'Fantasy 29', description: 'Honey-themed bedroom with warm golden tones', thumbnail: lofiFantasy29, ambientType: 'silence' },
  { id: 'fantasy30', name: 'Fantasy 30', description: 'Alien tech bedroom with sci-fi gadgets', thumbnail: lofiFantasy30, ambientType: 'space' },
  { id: 'fantasy31', name: 'Fantasy 31', description: 'Sophisticated pink-themed detective lounge', thumbnail: lofiFantasy31, ambientType: 'silence' },
  { id: 'fantasy32', name: 'Fantasy 32', description: 'Mexican-themed bedroom with vibrant colors', thumbnail: lofiFantasy32, ambientType: 'silence' },
  { id: 'fantasy33', name: 'Fantasy 33', description: 'Cluttered search room with hidden objects', thumbnail: lofiFantasy33, ambientType: 'silence' },
  { id: 'fantasy34', name: 'Fantasy 34', description: 'Spiritual warrior bedroom with Japanese elements', thumbnail: lofiFantasy34, ambientType: 'japanese' },
  { id: 'fantasy35', name: 'Fantasy 35', description: 'Pirate ship cabin with treasure maps', thumbnail: lofiFantasy35, ambientType: 'waves' },
  { id: 'fantasy36', name: 'Fantasy 36', description: 'Superhero apartment with workout equipment', thumbnail: lofiFantasy36, ambientType: 'silence' },
  { id: 'fantasy37', name: 'Fantasy 37', description: 'NYC apartment with web decorations', thumbnail: lofiFantasy37, ambientType: 'city' },
  { id: 'fantasy38', name: 'Fantasy 38', description: 'Antihero hideout with weapons and comics', thumbnail: lofiFantasy38, ambientType: 'silence' },
  { id: 'fantasy39', name: 'Fantasy 39', description: 'Crystal fortress study with heroic memorabilia', thumbnail: lofiFantasy39, ambientType: 'space' },
  { id: 'fantasy40', name: 'Fantasy 40', description: 'Dark cave hideout with computer screens', thumbnail: lofiFantasy40, ambientType: 'silence' },
  { id: 'fantasy41', name: 'Fantasy 41', description: 'Yellow laboratory with playful gadgets', thumbnail: lofiFantasy41, ambientType: 'electronic' },
  { id: 'fantasy42', name: 'Fantasy 42', description: 'Mad scientist laboratory with portal technology', thumbnail: lofiFantasy42, ambientType: 'electronic' },
  { id: 'fantasy43', name: 'Fantasy 43', description: 'Classic cartoon studio with water tower view', thumbnail: lofiFantasy43, ambientType: 'silence' },
  { id: 'fantasy44', name: 'Fantasy 44', description: 'Cozy swamp cottage with fairy tale elements', thumbnail: lofiFantasy44, ambientType: 'nature' }
];

type FilterCategory = 'all' | 'places' | 'hobbies' | 'fantasy';

const roomCategories: Record<string, FilterCategory> = {
  // Places
  'seaside-sanctuary': 'places',
  'desert-mirage': 'places',
  'skyscraper-view': 'places',
  'submarine-view': 'places',
  'russian-winter': 'places',
  'chechen-tower': 'places',
  'french-eiffel': 'places',
  'norwegian-landscape': 'places',
  'tokyo-neon': 'places',
  'belgian-grey': 'places',
  'german-brown': 'places',
  'dutch-farm': 'places',
  'chinese-lake': 'places',
  'poland-snow': 'places',
  'antarctic-igloo': 'places',
  'hospital-waiting': 'places',
  'jail-cell': 'places',
  'train-station': 'places',
  'bus-stop': 'places',
  'doctors-office': 'places',
  'park-trees': 'places',
  
  // Hobbies
  'circus-tent': 'hobbies',
  'football-field': 'hobbies',
  'tennis-court': 'hobbies',
  'basketball-court': 'hobbies',
  'volleyball-court': 'hobbies',
  'bowling-alley': 'hobbies',
  'american-football': 'hobbies',
  'hockey-rink': 'hobbies',
  'indoor-pool': 'hobbies',
  'mosque-interior': 'hobbies',
  'stellar-meditation': 'hobbies',
  'library-room': 'hobbies',
  'prison-cell': 'hobbies',
  'space-ship': 'hobbies',
  'rgb-room': 'hobbies',
  
  // Fantasy (all others)
  'rainy-study': 'fantasy',
  'sunny-garden': 'fantasy',
  'fireplace-nook': 'fantasy',
  'moonlit-corner': 'fantasy',
  'tuscan-vista': 'fantasy',
  'alpine-retreat': 'fantasy',
  'woodland-haven': 'fantasy',
  'spongebob-pineapple': 'fantasy',
  'minecraft-room': 'fantasy',
  'pink-candy': 'fantasy',
  'pirate-deck-view': 'fantasy',
  'naruto-room': 'fantasy',
  'ghibli-forest': 'fantasy',
  'titan-wall': 'fantasy',
  'demon-slayer-dojo': 'fantasy',
  'hero-academy': 'fantasy',
  'dragon-ball-training': 'fantasy',
  'tetris-room': 'hobbies',
  'clicker-arcade': 'hobbies',
  'gym': 'hobbies',
  'bird-shop': 'fantasy',
  'room-with-cat': 'fantasy',
  'cat-eating': 'fantasy',
  'dog-eating': 'fantasy',
  'kitchen-cockatiel': 'fantasy',
  'moonlit-room': 'fantasy',
  'rain-hideout': 'fantasy',
  
  // New fantasy rooms
  'fantasy1': 'fantasy', 'fantasy2': 'fantasy', 'fantasy3': 'fantasy', 'fantasy4': 'fantasy', 'fantasy5': 'fantasy',
  'fantasy6': 'fantasy', 'fantasy7': 'fantasy', 'fantasy8': 'fantasy', 'fantasy9': 'fantasy', 'fantasy10': 'fantasy',
  'fantasy11': 'fantasy', 'fantasy12': 'fantasy', 'fantasy13': 'fantasy', 'fantasy14': 'fantasy', 'fantasy15': 'fantasy',
  'fantasy16': 'fantasy', 'fantasy17': 'fantasy', 'fantasy18': 'fantasy', 'fantasy19': 'fantasy', 'fantasy20': 'fantasy',
  'fantasy21': 'fantasy', 'fantasy22': 'fantasy', 'fantasy23': 'fantasy', 'fantasy24': 'fantasy', 'fantasy25': 'fantasy',
  'fantasy26': 'fantasy', 'fantasy27': 'fantasy', 'fantasy28': 'fantasy', 'fantasy29': 'fantasy', 'fantasy30': 'fantasy',
  'fantasy31': 'fantasy', 'fantasy32': 'fantasy', 'fantasy33': 'fantasy', 'fantasy34': 'fantasy', 'fantasy35': 'fantasy',
  'fantasy36': 'fantasy', 'fantasy37': 'fantasy', 'fantasy38': 'fantasy', 'fantasy39': 'fantasy', 'fantasy40': 'fantasy',
  'fantasy41': 'fantasy', 'fantasy42': 'fantasy', 'fantasy43': 'fantasy', 'fantasy44': 'fantasy'
};

export const RoomSelector = ({ onSelectRoom }: RoomSelectorProps) => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get initial page from URL or default to 0
  const initialPage = parseInt(searchParams.get('page') || '0', 10);
  const initialFilter = (searchParams.get('filter') as FilterCategory) || 'all';
  
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>(initialFilter);
  
  const ROOMS_PER_PAGE = 9;
  
  const filteredRooms = selectedFilter === 'all' 
    ? rooms.sort((a, b) => a.name.localeCompare(b.name))
    : rooms.filter(room => roomCategories[room.id] === selectedFilter)
           .sort((a, b) => a.name.localeCompare(b.name));
  
  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
  
  const currentRooms = filteredRooms.slice(
    currentPage * ROOMS_PER_PAGE,
    (currentPage + 1) * ROOMS_PER_PAGE
  );
  
  // Update URL when page or filter changes
  useEffect(() => {
    const params = new URLSearchParams();
    if (currentPage > 0) params.set('page', currentPage.toString());
    if (selectedFilter !== 'all') params.set('filter', selectedFilter);
    setSearchParams(params, { replace: true });
  }, [currentPage, selectedFilter, setSearchParams]);
  
  const handleFilterChange = (filter: FilterCategory) => {
    setSelectedFilter(filter);
    setCurrentPage(0); // Reset to first page when changing filter
  };
  
  const goToNextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };
  
  const goToPrevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };
  
  return (
    <div className="min-h-screen bg-gradient-cozy p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <div className="flex justify-center items-center gap-4 mb-4">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
              {t('app.title')}
            </h1>
            <div className="flex items-center">
              <LanguageSelector />
            </div>
          </div>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('main.subtitle')}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-3xl mx-auto mt-4 sm:mt-6 leading-relaxed px-4">
            {t('main.message')}
          </p>
          
          {/* Theme Settings */}
          <div className="flex justify-center mt-6">
            <ThemeSelector />
          </div>
        </div>
        
        {/* Filter Buttons - more compact on mobile */}
        <div className="flex justify-center items-center gap-1 sm:gap-2 mb-4 sm:mb-8">
          <Button
            onClick={() => handleFilterChange('all')}
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
          >
            All
          </Button>
          <Button
            onClick={() => handleFilterChange('places')}
            variant={selectedFilter === 'places' ? 'default' : 'outline'}
            size="sm"
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
          >
            Places
          </Button>
          <Button
            onClick={() => handleFilterChange('hobbies')}
            variant={selectedFilter === 'hobbies' ? 'default' : 'outline'}
            size="sm"
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
          >
            Hobbies
          </Button>
          <Button
            onClick={() => handleFilterChange('fantasy')}
            variant={selectedFilter === 'fantasy' ? 'default' : 'outline'}
            size="sm"
            className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm"
          >
            Fantasy
          </Button>
        </div>
        
        
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-6 lg:gap-8">
          {currentRooms.map((room) => (
            <Card 
              key={room.id}
              className="overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] bg-card border-border cursor-pointer"
              onClick={() => onSelectRoom(room.id)}
            >
              <div className="relative">
                <img 
                  src={room.thumbnail} 
                  alt={room.name}
                  className="aspect-video w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-1 sm:top-4 right-1 sm:right-4 text-sm sm:text-2xl opacity-80">
                  {room.ambientType === 'rain' && '🌧️'}
                  {room.ambientType === 'birds' && '☀️'}
                  {room.ambientType === 'fire' && '🔥'}
                  {room.ambientType === 'night' && '🌙'}
                  {room.ambientType === 'waves' && '🌊'}
                  {room.ambientType === 'desert' && '🏜️'}
                  {room.ambientType === 'city' && '🏛️'}
                  {room.ambientType === 'space' && '✨'}
                  {room.ambientType === 'wind' && '🏔️'}
                  {room.ambientType === 'forest' && '🌲'}
                  {room.ambientType === 'snow' && '❄️'}
                  {room.ambientType === 'mountain' && '⛰️'}
                  {room.ambientType === 'traffic' && '🌃'}
                  {room.ambientType === 'nature' && '🌿'}
                  {room.ambientType === 'water' && '💧'}
                  {room.ambientType === 'underwater' && '🫧'}
                  {room.ambientType === 'electronic' && '💻'}
                  {room.ambientType === 'silence' && '🤫'}
                  {room.ambientType === 'sports' && '⚽'}
                  {room.ambientType === 'pages' && '📚'}
                  {room.ambientType === 'japanese' && '🍜'}
                </div>
                <div className="absolute bottom-1 sm:bottom-3 left-1 sm:left-3 right-1 sm:right-3">
                  <h3 className="text-white font-semibold text-sm sm:text-lg mb-1 drop-shadow-lg">
                    {t(`room.${room.id}.name`)}
                  </h3>
                  <p className="text-white/90 text-xs line-clamp-2 drop-shadow hidden sm:block">
                    {t(`room.${room.id}.description`)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Page Navigation - hide on mobile if only one page */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 mt-4 sm:mt-8">
            <Button
              onClick={goToPrevPage}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-2 sm:px-4"
            >
              <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
            
            <span className="text-xs sm:text-sm text-muted-foreground px-2">
              {currentPage + 1}/{totalPages}
            </span>
            
            <Button
              onClick={goToNextPage}
              variant="outline"
              size="sm"
              className="flex items-center gap-1 px-2 sm:px-4"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </Button>
          </div>
        )}
        
        
        <div className="text-center mt-8 sm:mt-12 px-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('main.verse')}
            <br />
            <span className="text-accent font-medium">{t('main.verse.reference')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};