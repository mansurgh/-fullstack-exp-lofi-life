import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { QuranReader } from './QuranReader';
import { TetrisGame } from './TetrisGame';
import ClickerGame from './ClickerGame';
import { PrayersList } from './PrayersList';
import { PrayerTimes } from './PrayerTimes';
import { IslamicCalendar } from './IslamicCalendar';
import { Volume2, VolumeX, ArrowLeft, Moon, Sun, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

// Lofi first-person room images
import lofiRainyStudy from '@/assets/lofi-rainy-study.jpg';
import lofiSunnyGarden from '@/assets/lofi-sunny-garden.jpg';
import lofiFireplaceNook from '@/assets/lofi-fireplace-nook.jpg';
import lofiMoonlitCorner from '@/assets/lofi-moonlit-corner.jpg';
import lofiSeasideSanctuary from '@/assets/lofi-seaside-sanctuary.jpg';
import lofiDesertMirage from '@/assets/lofi-desert-mirage.jpg';
import lofiTuscanVista from '@/assets/lofi-tuscan-vista.jpg';
import lofiStellarMeditation from '@/assets/lofi-stellar-meditation.jpg';
import lofiAlpineRetreat from '@/assets/lofi-alpine-retreat.jpg';
import lofiWoodlandHaven from '@/assets/lofi-woodland-haven.jpg';
import lofiRussianWinter from '@/assets/lofi-russian-winter.jpg';
import lofiChechenTower from '@/assets/lofi-chechen-tower.jpg';
import lofiFrenchEiffel from '@/assets/lofi-french-eiffel.jpg';
import lofiNorwegianLandscape from '@/assets/lofi-norwegian-landscape.jpg';
import lofiTokyoNeon from '@/assets/lofi-tokyo-neon.jpg';
import lofiBelgianGrey from '@/assets/lofi-belgian-grey.jpg';
import lofiGermanBrown from '@/assets/lofi-german-brown.jpg';
import lofiDutchFarm from '@/assets/lofi-dutch-farm.jpg';
import lofiChineseLake from '@/assets/lofi-chinese-lake.jpg';
import lofiCircusTent from '@/assets/lofi-circus-tent.jpg';
import lofiMosqueInterior from '@/assets/lofi-mosque-interior.jpg';
import lofiLibraryRoom from '@/assets/lofi-library-room.jpg';
import lofiRgbRoom from '@/assets/lofi-rgb-room.jpg';
import lofiPolandSnow from '@/assets/lofi-poland-snow.jpg';
import lofiAntarcticIgloo from '@/assets/lofi-antarctic-igloo.jpg';
import lofiSpaceShip from '@/assets/lofi-space-ship.jpg';
import lofiPinkCandy from '@/assets/lofi-pink-candy.jpg';
import lofiPrisonCell from '@/assets/lofi-prison-cell.jpg';
import lofiSkyscraperView from '@/assets/lofi-skyscraper-view.jpg';
import lofiSubmarineView from '@/assets/lofi-submarine-view.jpg';
import lofiClickerArcade from '@/assets/lofi-clicker-arcade.jpg';
import lofiTetrisRoom from '@/assets/lofi-tetris-room.jpg';
import lofiSpongebobPineapple from '@/assets/lofi-spongebob-pineapple.jpg';
import lofiMinecraftRoom from '@/assets/lofi-minecraft-room.jpg';
import lofiPirateDeckView from '@/assets/lofi-pirate-deck-view.jpg';
import lofiNarutoRoom from '@/assets/lofi-naruto-room.jpg';
import lofiGhibliForest from '@/assets/lofi-ghibli-forest.jpg';
import lofiTitanWall from '@/assets/lofi-titan-wall.jpg';
import lofiDemonSlayerDojo from '@/assets/lofi-demon-slayer-dojo.jpg';
import lofiHeroAcademy from '@/assets/lofi-hero-academy.jpg';
import lofiDragonBallTraining from '@/assets/lofi-dragon-ball-training.jpg';
import lofiHospitalWaiting from '@/assets/lofi-hospital-waiting.jpg';
import lofiJailCell from '@/assets/lofi-jail-cell.jpg';
import lofiTrainStation from '@/assets/lofi-train-station.jpg';
import lofiBusStop from '@/assets/lofi-bus-stop.jpg';
import lofiDoctorsOffice from '@/assets/lofi-doctors-office.jpg';
import lofiGym from '@/assets/lofi-gym.jpg';
import lofiBirdShop from '@/assets/lofi-bird-shop.jpg';
import lofiRoomWithCat from '@/assets/lofi-room-with-cat.jpg';
import lofiCatEating from '@/assets/lofi-cat-eating.jpg';
import lofiDogEating from '@/assets/lofi-dog-eating.jpg';
import lofiKitchenCockatiel from '@/assets/lofi-kitchen-cockatiel.jpg';
import lofiMoonlitRoom from '@/assets/lofi-moonlit-room.jpg';
import lofiRainHideout from '@/assets/lofi-rain-hideout.jpg';
import lofiParkTrees from '@/assets/lofi-park-trees.jpg';

// Sports images (keep original as requested)
import footballField from "@/assets/football-field.jpg";
import tennisCourt from "@/assets/tennis-court.jpg";
import basketballCourt from "@/assets/basketball-court.jpg";
import volleyballCourt from "@/assets/volleyball-court.jpg";
import bowlingAlley from "@/assets/bowling-alley.jpg";
import americanFootball from "@/assets/american-football.jpg";
import hockeyRink from "@/assets/hockey-rink.jpg";
import indoorPool from "@/assets/indoor-pool.jpg";

// The Concept room
import theConcept from "@/assets/the-concept.jpg";

interface RoomProps {
  roomId: string;
  onBack: () => void;
}

interface RoomConfig {
  name: string;
  description: string;
  ambientSound: string;
  backgroundImage: string;
  quranPosition: { x: string; y: string };
  interactiveElements: Array<{
    type: 'floating' | 'glow' | 'particles';
    className: string;
    animation: string;
  }>;
}

const roomConfigs: Record<string, RoomConfig> = {
  'rainy-study': {
    name: 'Rainy Study',
    description: 'Rain gently pattering against the window',
    ambientSound: 'rain',
    backgroundImage: lofiRainyStudy,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: []
  },
  'sunny-garden': {
    name: 'Garden View',
    description: 'Birds chirping in the sunny garden',
    ambientSound: 'birds',
    backgroundImage: lofiSunnyGarden,
    quranPosition: { x: 'right-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 left-10 w-8 h-8 text-yellow-400 text-2xl', animation: 'animate-bounce' }
    ]
  },
  'fireplace-nook': {
    name: 'Fireplace Nook',
    description: 'Crackling fire warming the cozy space',
    ambientSound: 'fire',
    backgroundImage: lofiFireplaceNook,
    quranPosition: { x: 'left-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-1/4 w-32 h-16 bg-orange-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'moonlit-corner': {
    name: 'Moonlit Corner',
    description: 'Peaceful moonlight through the window',
    ambientSound: 'night',
    backgroundImage: lofiMoonlitCorner,
    quranPosition: { x: 'right-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-10 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'seaside-sanctuary': {
    name: 'Seaside',
    description: 'Peaceful ocean waves',
    ambientSound: 'waves',
    backgroundImage: lofiSeasideSanctuary,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 right-10 w-6 h-6 text-blue-300 text-xl', animation: 'animate-bounce' }
    ]
  },
  'desert-mirage': {
    name: 'Desert Mirage',
    description: 'Gentle desert winds and sandy whispers',
    ambientSound: 'desert',
    backgroundImage: lofiDesertMirage,
    quranPosition: { x: 'right-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-t from-yellow-600/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'tuscan-vista': {
    name: 'Tuscan Vista',
    description: 'Italian breeze and distant city murmurs',
    ambientSound: 'city',
    backgroundImage: lofiTuscanVista,
    quranPosition: { x: 'left-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 right-20 w-20 h-20 bg-orange-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'stellar-meditation': {
    name: 'Stellar Meditation',
    description: 'Cosmic silence and ethereal space ambiance',
    ambientSound: 'space',
    backgroundImage: lofiStellarMeditation,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-1/4 left-1/4 w-4 h-4 text-purple-300 text-lg', animation: 'animate-ping' },
      { type: 'floating', className: 'absolute bottom-1/3 right-1/4 w-3 h-3 text-blue-300 text-sm', animation: 'animate-pulse' }
    ]
  },
  'alpine-retreat': {
    name: 'Alpine Retreat',
    description: 'Mountain winds through peaceful peaks',
    ambientSound: 'wind',
    backgroundImage: lofiAlpineRetreat,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'woodland-haven': {
    name: 'Woodland Haven',
    description: 'Forest sounds and rustling leaves',
    ambientSound: 'forest',
    backgroundImage: lofiWoodlandHaven,
    quranPosition: { x: 'right-1/3', y: 'top-1/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-40 left-16 w-6 h-6 text-green-400 text-xl', animation: 'animate-bounce' }
    ]
  },
  'russian-winter': {
    name: 'Russian Winter',
    description: 'Snow falling gently outside',
    ambientSound: 'snow',
    backgroundImage: lofiRussianWinter,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'chechen-tower': {
    name: 'Chechen Tower',
    description: 'Mountain winds around ancient tower',
    ambientSound: 'mountain',
    backgroundImage: lofiChechenTower,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 right-10 w-16 h-16 bg-stone-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'french-eiffel': {
    name: 'French Elegance',
    description: 'Parisian streets and Eiffel Tower',
    ambientSound: 'city',
    backgroundImage: lofiFrenchEiffel,
    quranPosition: { x: 'left-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-40 right-20 w-24 h-24 bg-amber-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'norwegian-landscape': {
    name: 'Norwegian Sky',
    description: 'Open landscape with mountain winds',
    ambientSound: 'wind',
    backgroundImage: lofiNorwegianLandscape,
    quranPosition: { x: 'right-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-t from-green-600/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'tokyo-neon': {
    name: 'Tokyo Nights',
    description: 'Neon-lit cityscape',
    ambientSound: 'traffic',
    backgroundImage: lofiTokyoNeon,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-32 right-16 w-20 h-20 bg-pink-500/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'belgian-grey': {
    name: 'Belgian Streets',
    description: 'Grey city atmosphere',
    ambientSound: 'rain',
    backgroundImage: lofiBelgianGrey,
    quranPosition: { x: 'right-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-gray-500/15 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'german-brown': {
    name: 'German Village',
    description: 'Traditional brown cityscape',
    ambientSound: 'city',
    backgroundImage: lofiGermanBrown,
    quranPosition: { x: 'left-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 left-20 w-18 h-18 bg-amber-600/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'dutch-farm': {
    name: 'Dutch Countryside',
    description: 'Peaceful farmland and nature',
    ambientSound: 'nature',
    backgroundImage: lofiDutchFarm,
    quranPosition: { x: 'right-1/4', y: 'top-3/5' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 left-12 w-5 h-5 text-green-500 text-lg', animation: 'animate-bounce' }
    ]
  },
  'chinese-lake': {
    name: 'Chinese Serenity',
    description: 'Tranquil lake view',
    ambientSound: 'water',
    backgroundImage: lofiChineseLake,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-40 right-24 w-20 h-20 bg-blue-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'circus-tent': {
    name: 'Circus Memories',
    description: 'Inside the big tent',
    ambientSound: 'silence',
    backgroundImage: lofiCircusTent,
    quranPosition: { x: 'right-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-1/3 w-24 h-24 bg-red-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'mosque-interior': {
    name: 'Sacred Mosque',
    description: 'Peaceful mosque interior',
    ambientSound: 'silence',
    backgroundImage: lofiMosqueInterior,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-16 left-1/2 w-24 h-24 bg-gold-400/20 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'library-room': {
    name: 'Library',
    description: 'Silent library with page sounds',
    ambientSound: 'pages',
    backgroundImage: lofiLibraryRoom,
    quranPosition: { x: 'right-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-24 left-24 w-20 h-20 bg-amber-300/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'rgb-room': {
    name: 'Disco',
    description: 'Dark room with customizable lighting effects',
    ambientSound: 'electronic',
    backgroundImage: lofiRgbRoom,
    quranPosition: { x: 'left-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-0 left-0 w-full h-1/2 bg-purple-500/10 blur-3xl', animation: '' },
      { type: 'glow', className: 'absolute bottom-0 left-0 w-full h-1/2 bg-purple-500/10 blur-3xl', animation: '' },
      { type: 'glow', className: 'absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-purple-500/10 rounded-full blur-3xl', animation: '' },
      { type: 'glow', className: 'absolute inset-0 bg-purple-500/5 blur-2xl', animation: '' }
    ]
  },
  'poland-snow': {
    name: 'Polish Winter',
    description: 'Cozy Polish room with snowy winter view',
    ambientSound: 'snow',
    backgroundImage: lofiPolandSnow,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'antarctic-igloo': {
    name: 'Antarctic Igloo',
    description: 'Inside an igloo with icy Antarctic view',
    ambientSound: 'wind',
    backgroundImage: lofiAntarcticIgloo,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-20 w-20 h-20 bg-cyan-300/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'space-ship': {
    name: 'Space',
    description: 'Spaceship with Earth view from orbit',
    ambientSound: 'space',
    backgroundImage: lofiSpaceShip,
    quranPosition: { x: 'left-1/4', y: 'top-3/4' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-1/4 right-1/4 w-4 h-4 text-blue-300 text-lg', animation: 'animate-ping' },
      { type: 'glow', className: 'absolute bottom-1/3 left-1/3 w-24 h-24 bg-blue-400/15 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'pink-candy': {
    name: 'Sweet Dreams',
    description: 'Pink room with magical candy field view',
    ambientSound: 'silence',
    backgroundImage: lofiPinkCandy,
    quranPosition: { x: 'right-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 left-16 w-6 h-6 text-pink-300 text-xl', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-20 right-20 w-28 h-28 bg-pink-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'prison-cell': {
    name: 'Prison',
    description: 'Institutional cell with courtyard view',
    ambientSound: 'silence',
    backgroundImage: lofiPrisonCell,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-40 right-16 w-16 h-32 bg-gray-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'skyscraper-view': {
    name: 'Sky High',
    description: 'High-rise room with panoramic city view',
    ambientSound: 'city',
    backgroundImage: lofiSkyscraperView,
    quranPosition: { x: 'right-1/4', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 left-24 w-20 h-20 bg-amber-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'submarine-view': {
    name: 'Deep Sea',
    description: 'Submarine with underwater plant view',
    ambientSound: 'underwater',
    backgroundImage: lofiSubmarineView,
    quranPosition: { x: 'left-1/2', y: 'top-1/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-12 w-5 h-5 text-cyan-300 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-24 left-20 w-24 h-16 bg-teal-400/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'tetris-room': {
    name: 'Tetris',
    description: 'Retro gaming room with playable tetris using WASD controls',
    ambientSound: 'electronic',
    backgroundImage: lofiTetrisRoom,
    quranPosition: { x: 'left-1/4', y: 'top-1/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-16 right-16 w-20 h-20 bg-blue-500/25 rounded-full blur-xl', animation: 'animate-pulse' },
      { type: 'glow', className: 'absolute bottom-20 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'clicker-arcade': {
    name: 'Clicker',
    description: 'Click gift packages to discover ahadith wisdom',
    ambientSound: 'electronic',
    backgroundImage: lofiClickerArcade,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-20 w-24 h-24 bg-pink-500/25 rounded-full blur-xl', animation: 'animate-pulse' },
      { type: 'glow', className: 'absolute bottom-24 right-24 w-20 h-20 bg-purple-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'spongebob-pineapple': {
    name: 'Underwater',
    description: 'Cozy underwater pineapple interior',
    ambientSound: 'underwater',
    backgroundImage: lofiSpongebobPineapple,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-20 w-6 h-6 text-yellow-400 text-xl', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-24 left-24 w-20 h-20 bg-orange-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'minecraft-room': {
    name: 'Blocky World',
    description: 'Pixelated crafting room interior',
    ambientSound: 'silence',
    backgroundImage: lofiMinecraftRoom,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-32 left-32 w-16 h-16 bg-green-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'pirate-deck-view': {
    name: 'Pirate Quarters',
    description: 'Captain\'s cabin with ocean view',
    ambientSound: 'waves',
    backgroundImage: lofiPirateDeckView,
    quranPosition: { x: 'left-1/4', y: 'top-3/4' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 right-16 w-5 h-5 text-amber-400 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-20 left-20 w-24 h-16 bg-amber-600/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'naruto-room': {
    name: 'Ninja Hideout',
    description: 'Traditional Japanese ninja room interior',
    ambientSound: 'japanese',
    backgroundImage: lofiNarutoRoom,
    quranPosition: { x: 'right-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-20 w-20 h-20 bg-orange-500/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'ghibli-forest': {
    name: 'Ghibli Forest',
    description: 'Magical forest view with Studio Ghibli atmosphere',
    ambientSound: 'forest',
    backgroundImage: lofiGhibliForest,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 right-16 w-5 h-5 text-green-300 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-20 left-20 w-24 h-16 bg-green-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'titan-wall': {
    name: 'Titan Wall',
    description: 'Watchtower overlooking the titan walls',
    ambientSound: 'wind',
    backgroundImage: lofiTitanWall,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-32 left-32 w-20 h-20 bg-stone-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'demon-slayer-dojo': {
    name: 'Demon Slayer Dojo',
    description: 'Traditional Japanese training dojo',
    ambientSound: 'japanese',
    backgroundImage: lofiDemonSlayerDojo,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-20 w-4 h-4 text-pink-300 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-24 left-24 w-20 h-20 bg-red-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'hero-academy': {
    name: 'Hero Academy',
    description: 'UA High School classroom atmosphere',
    ambientSound: 'city',
    backgroundImage: lofiHeroAcademy,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-20 w-20 h-20 bg-blue-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'dragon-ball-training': {
    name: 'Kame House',
    description: 'Dragon Ball training ground by the ocean',
    ambientSound: 'waves',
    backgroundImage: lofiDragonBallTraining,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 right-16 w-6 h-6 text-orange-400 text-xl', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-20 left-20 w-24 h-16 bg-orange-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'hospital-waiting': {
    name: 'Hospital',
    description: 'Peaceful hospital waiting room with warm atmosphere',
    ambientSound: 'silence',
    backgroundImage: lofiHospitalWaiting,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 right-20 w-20 h-20 bg-green-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'jail-cell': {
    name: 'Peaceful',
    description: 'Contemplative space for reflection and reading',
    ambientSound: 'silence',
    backgroundImage: lofiJailCell,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-24 left-16 w-16 h-20 bg-amber-300/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'train-station': {
    name: 'Train',
    description: 'Nostalgic train station with gentle station sounds',
    ambientSound: 'city',
    backgroundImage: lofiTrainStation,
    quranPosition: { x: 'left-1/4', y: 'top-3/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-32 right-24 w-24 h-16 bg-yellow-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'bus-stop': {
    name: 'Bus',
    description: 'Cozy bus stop with evening ambiance',
    ambientSound: 'city',
    backgroundImage: lofiBusStop,
    quranPosition: { x: 'right-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 left-12 w-5 h-5 text-amber-400 text-lg', animation: 'animate-bounce' }
    ]
  },
  'doctors-office': {
    name: 'Doctor',
    description: 'Warm medical office with peaceful atmosphere',
    ambientSound: 'silence',
    backgroundImage: lofiDoctorsOffice,
    quranPosition: { x: 'left-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 right-20 w-20 h-20 bg-blue-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'gym': {
    name: 'Gym',
    description: 'Cozy gym space with warm lighting',
    ambientSound: 'silence',
    backgroundImage: lofiGym,
    quranPosition: { x: 'right-1/4', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-24 w-20 h-20 bg-orange-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'bird-shop': {
    name: 'Bird',
    description: 'Charming bird shop with colorful birds',
    ambientSound: 'birds',
    backgroundImage: lofiBirdShop,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-16 w-6 h-6 text-yellow-400 text-xl', animation: 'animate-bounce' }
    ]
  },
  'room-with-cat': {
    name: 'Cat\'s Corner',
    description: 'Cozy room with a friendly cat companion',
    ambientSound: 'silence',
    backgroundImage: lofiRoomWithCat,
    quranPosition: { x: 'right-1/3', y: 'top-1/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 left-20 w-5 h-5 text-orange-400 text-lg', animation: 'animate-bounce' }
    ]
  },
  'cat-eating': {
    name: 'Feeding Time',
    description: 'Peaceful room watching a cat enjoy its meal',
    ambientSound: 'silence',
    backgroundImage: lofiCatEating,
    quranPosition: { x: 'left-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-24 right-24 w-16 h-16 bg-pink-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'dog-eating': {
    name: 'Happy Pup',
    description: 'Warm room with a content dog at mealtime',
    ambientSound: 'silence',
    backgroundImage: lofiDogEating,
    quranPosition: { x: 'right-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 left-16 w-6 h-6 text-brown-400 text-xl', animation: 'animate-bounce' }
    ]
  },
  'kitchen-cockatiel': {
    name: 'Kitchen Bird',
    description: 'Cozy kitchen with a colorful cockatiel friend',
    ambientSound: 'birds',
    backgroundImage: lofiKitchenCockatiel,
    quranPosition: { x: 'left-1/3', y: 'top-3/4' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 right-20 w-5 h-5 text-yellow-300 text-lg', animation: 'animate-bounce' }
    ]
  },
  'moonlit-room': {
    name: 'Night Moon',
    description: 'Dark room illuminated by bright moonlight',
    ambientSound: 'night',
    backgroundImage: lofiMoonlitRoom,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-16 left-20 w-24 h-24 bg-blue-300/25 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'rain-hideout': {
    name: 'Rain Shelter',
    description: 'Cozy hideout protecting from the rain outside',
    ambientSound: 'rain',
    backgroundImage: lofiRainHideout,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 right-16 w-20 h-16 bg-orange-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'park-trees': {
    name: 'Tree Park',
    description: 'Peaceful park with lush green trees',
    ambientSound: 'nature',
    backgroundImage: lofiParkTrees,
    quranPosition: { x: 'right-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 left-24 w-6 h-6 text-green-400 text-xl', animation: 'animate-bounce' }
    ]
  },
  // Sports rooms (keep original images as requested)
  'football-field': {
    name: 'Football',
    description: 'Professional football stadium',
    ambientSound: 'sports',
    backgroundImage: footballField,
    quranPosition: { x: 'left-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-1/3 w-32 h-16 bg-green-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'tennis-court': {
    name: 'Tennis',
    description: 'Professional tennis arena',
    ambientSound: 'sports',
    backgroundImage: tennisCourt,
    quranPosition: { x: 'right-1/3', y: 'top-1/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-24 left-24 w-20 h-20 bg-blue-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'basketball-court': {
    name: 'Basketball',
    description: 'Indoor basketball arena',
    ambientSound: 'sports',
    backgroundImage: basketballCourt,
    quranPosition: { x: 'left-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 right-20 w-24 h-24 bg-orange-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'volleyball-court': {
    name: 'Volleyball',
    description: 'Beach volleyball arena',
    ambientSound: 'sports',
    backgroundImage: volleyballCourt,
    quranPosition: { x: 'right-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-1/4 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'bowling-alley': {
    name: 'Bowling',
    description: 'Classic bowling lane',
    ambientSound: 'sports',
    backgroundImage: bowlingAlley,
    quranPosition: { x: 'left-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-24 right-24 w-20 h-20 bg-purple-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'american-football': {
    name: 'American Football',
    description: 'NFL stadium atmosphere',
    ambientSound: 'sports',
    backgroundImage: americanFootball,
    quranPosition: { x: 'right-1/4', y: 'top-3/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-32 left-32 w-24 h-16 bg-red-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'hockey-rink': {
    name: 'Hockey',
    description: 'Ice hockey arena',
    ambientSound: 'sports',
    backgroundImage: hockeyRink,
    quranPosition: { x: 'left-1/2', y: 'top-1/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 right-20 w-20 h-20 bg-cyan-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'indoor-pool': {
    name: 'Swimming',
    description: 'Indoor swimming facility',
    ambientSound: 'water',
    backgroundImage: indoorPool,
    quranPosition: { x: 'right-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 left-16 w-5 h-5 text-blue-400 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-24 left-24 w-24 h-16 bg-blue-400/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'the-concept': {
    name: 'A concept',
    description: 'A peaceful bedroom with Islamic elements and prayer tools',
    ambientSound: 'night',
    backgroundImage: theConcept,
    quranPosition: { x: 'right-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-16 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  }
};

export const Room = ({ roomId, onBack }: RoomProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [volume, setVolume] = useState([50]);
  const [isMuted, setIsMuted] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuranOpen, setIsQuranOpen] = useState(false);
  const [isPrayersListOpen, setIsPrayersListOpen] = useState(false);
  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [isIslamicCalendarOpen, setIsIslamicCalendarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roomColor, setRoomColor] = useState('default'); // For all room color control
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 }); // Mouse position for panning
  const [roomOffset, setRoomOffset] = useState({ x: 0, y: 0 }); // Room view offset
  const audioRef = useRef<HTMLAudioElement>(null);
  
  const isClickerView = location.pathname.includes('/clicker');
  
  const handleClickerBack = () => {
    navigate(`/room/${roomId}`);
  };
  
  const handleStartClicker = () => {
    navigate(`/room/${roomId}/clicker`);
  };

  const roomConfig = roomConfigs[roomId];
  
  console.log('🏠 Room component rendering:', roomId);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume[0] / 100;
    }
  }, [volume, isMuted]);

  // Mouse movement for room panning
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // Range: -1 to 1
      const y = (e.clientY / window.innerHeight - 0.5) * 2; // Range: -1 to 1
      
      setMousePosition({ x, y });
      
      // Convert mouse position to room offset (subtle movement)
      const maxOffset = 15; // Reduced maximum pixels to move to prevent showing edges
      setRoomOffset({
        x: x * maxOffset,
        y: y * maxOffset
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleReload = () => {
    window.location.reload();
  };

  const handleQuranClick = () => {
    setIsQuranOpen(true);
  };

  const colorOptions = [
    { name: 'Red', value: 'red', bg: 'bg-red-500', glow: 'bg-red-500/10' },
    { name: 'Blue', value: 'blue', bg: 'bg-blue-500', glow: 'bg-blue-500/10' },
    { name: 'Pink', value: 'pink', bg: 'bg-pink-500', glow: 'bg-pink-500/10' },
    { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-500', glow: 'bg-yellow-500/10' },
    { name: 'Orange', value: 'orange', bg: 'bg-orange-500', glow: 'bg-orange-500/10' },
    { name: 'Purple', value: 'purple', bg: 'bg-purple-500', glow: 'bg-purple-500/10' },
    { name: 'Green', value: 'green', bg: 'bg-green-500', glow: 'bg-green-500/10' }
  ];

  const getRoomGlowClass = (baseClass: string) => {
    if (roomColor === 'default') return baseClass;
    
    const currentColor = colorOptions.find(color => color.value === roomColor);
    if (!currentColor) return baseClass;
    
    // Replace any existing color glow with the selected color
    return baseClass.replace(/bg-\w+-\d+\/[\d.]+/, currentColor.glow);
  };

  // Check if current room has glow effects
  const hasGlowEffects = roomConfig?.interactiveElements.some(element => 
    element.type === 'glow' || element.className.includes('bg-') && element.className.includes('/')
  );

  if (!roomConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-destructive">
        <p className="text-xl text-destructive-foreground">Room not found: {roomId}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Full-screen Background Image with Panning */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{ 
          backgroundImage: `url(${roomConfig.backgroundImage})`,
          transform: `translate(${roomOffset.x}px, ${roomOffset.y}px) scale(1.08)`,
          transition: 'transform 0.1s ease-out',
          filter: isDarkMode ? 'brightness(0.3) contrast(1.2)' : 'brightness(0.8) contrast(1.1)'
        }}
      >
        {/* Dark overlay for better readability */}
        <div className={`absolute inset-0 transition-all duration-1000 ${
          isDarkMode 
            ? 'bg-gradient-to-br from-black/60 via-blue-900/40 to-black/70' 
            : 'bg-gradient-to-br from-black/20 via-transparent to-black/30'
        }`} />
      </div>
      {/* Ambient Audio */}
      <audio
        ref={audioRef}
        loop
        src={`/sounds/${roomConfig.ambientSound}.mp3`}
        onError={(e) => {
          console.log('Audio failed to load:', `/sounds/${roomConfig.ambientSound}.mp3`);
          console.log('Note: Audio files are not included. Add your own ambient sounds to /public/sounds/');
        }}
        onLoadedData={() => {
          console.log('Audio loaded successfully');
          if (audioRef.current) {
            audioRef.current.play().catch(e => {
              console.log('Autoplay blocked, user interaction required');
            });
          }
        }}
      />

      {/* Interactive Elements with Panning */}
      <div 
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          transform: `translate(${roomOffset.x * 0.5}px, ${roomOffset.y * 0.5}px)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {roomConfig.interactiveElements.map((element, index) => (
          <div key={index} className={`${getRoomGlowClass(element.className)} ${element.animation}`}>
            {element.type === 'floating' && (
              <>
                {roomId === 'sunny-garden' && '🦋'}
                {roomId === 'seaside-sanctuary' && '🐚'}
                {roomId === 'stellar-meditation' && '✨'}
                {roomId === 'woodland-haven' && '🍃'}
              </>
            )}
          </div>
        ))}
        
        {/* Ambient particles for certain rooms */}
        {roomId === 'rainy-study' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-0.5 h-8 bg-blue-200/30 rounded-full animate-pulse"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
        
        {roomId === 'stellar-meditation' && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full animate-ping"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Qur'an Book with Panning */}
      <div 
        className={`absolute ${roomConfig.quranPosition.x} ${roomConfig.quranPosition.y} cursor-pointer transition-all duration-500 hover:scale-110 ${
          isDarkMode ? 'shadow-glow' : 'shadow-soft'
        }`}
        style={{
          transform: `translate(${roomOffset.x * 0.3}px, ${roomOffset.y * 0.3}px) translate(-50%, -50%)`,
          transition: 'transform 0.1s ease-out'
        }}
        onClick={handleQuranClick}
      >
        <div className={`w-20 h-28 bg-gradient-to-br from-accent to-primary rounded-md relative ${
          isDarkMode ? 'ring-2 ring-quran-glow animate-pulse' : ''
        }`}>
          <div className="absolute inset-2 bg-card/90 rounded-sm">
            <div className="h-full flex flex-col items-center justify-center text-xs text-accent-foreground font-semibold">
              <div className="text-lg mb-1">📖</div>
              <div>القرآن</div>
              <div>الكريم</div>
            </div>
          </div>
        </div>
      </div>

      {/* Special Interactive Elements for "The Concept" Room */}
      {roomId === 'the-concept' && (
        <>
          {/* Prayer Rug - Clickable */}
          <div 
            className="absolute left-1/3 top-3/4 cursor-pointer transition-all duration-500 hover:scale-110"
            style={{
              transform: `translate(${roomOffset.x * 0.3}px, ${roomOffset.y * 0.3}px) translate(-50%, -50%)`,
            }}
            onClick={() => setIsPrayersListOpen(true)}
            title="Click to view prayer list"
          >
            <div className="w-16 h-12 bg-gradient-to-br from-red-600 to-red-800 rounded border-2 border-yellow-600 relative">
              <div className="absolute inset-1 bg-red-700/50 rounded">
                <div className="h-full flex items-center justify-center text-xs text-white">
                  🕌
                </div>
              </div>
            </div>
          </div>

          {/* Clock - Clickable */}
          <div 
            className="absolute right-1/4 top-1/4 cursor-pointer transition-all duration-500 hover:scale-110"
            style={{
              transform: `translate(${roomOffset.x * 0.3}px, ${roomOffset.y * 0.3}px) translate(-50%, -50%)`,
            }}
            onClick={() => setIsPrayerTimesOpen(true)}
            title="Click to view prayer times"
          >
            <div className="w-12 h-12 bg-white border-4 border-black rounded-full relative">
              <div className="absolute inset-1 bg-white rounded-full flex items-center justify-center">
                <div className="text-lg">🕐</div>
              </div>
            </div>
          </div>

          {/* Calendar - Clickable */}
          <div 
            className="absolute right-1/4 top-1/3 cursor-pointer transition-all duration-500 hover:scale-110"
            style={{
              transform: `translate(${roomOffset.x * 0.3}px, ${roomOffset.y * 0.3}px) translate(-50%, -50%)`,
            }}
            onClick={() => setIsIslamicCalendarOpen(true)}
            title="Click to view Islamic calendar"
          >
            <div className="w-12 h-10 bg-white border-2 border-gray-400 rounded relative">
              <div className="absolute inset-1 bg-white rounded flex flex-col items-center justify-center text-xs">
                <div className="text-sm">📅</div>
                <div className="text-[8px] text-gray-600">Islamic</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Controls */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="bg-card/80 hover:bg-card text-card-foreground w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t('room.back')}
        </Button>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            onClick={handleReload}
            variant="secondary"
            size="sm"
            className="bg-card/80 hover:bg-card text-card-foreground"
            title="Reload page if room or Quran isn't loading"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={() => setIsDarkMode(!isDarkMode)}
            variant="secondary"
            size="sm"
            className="bg-card/80 hover:bg-card text-card-foreground"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Volume Control */}
      <Card className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-border/50 w-[calc(100%-2rem)] sm:w-auto max-w-xs">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            onClick={toggleMute}
            variant="ghost"
            size="sm"
            className="text-card-foreground hover:text-accent flex-shrink-0"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
          <Slider
            value={volume}
            onValueChange={setVolume}
            max={100}
            min={0}
            step={1}
            className="flex-1"
            disabled={isMuted}
          />
          <span className="text-sm text-muted-foreground min-w-8 text-right">
            {isMuted ? 0 : volume[0]}%
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 hidden sm:block">
          {roomConfig.description}
        </p>
        <p className="text-xs text-amber-600 mt-1">
          {t('room.audio.warning')}
        </p>
      </Card>

      {/* Color Controls - Show only for RGB room (disco) */}
      {roomId === 'rgb-room' && (
        <Card className="absolute top-1/2 right-4 sm:right-6 p-3 bg-card/80 backdrop-blur-sm border-border/50 transform -translate-y-1/2">
          <h4 className="text-sm font-semibold text-card-foreground mb-2">Lighting</h4>
          
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setRoomColor('default')}
              variant={roomColor === 'default' ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs"
            >
              <div className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
              Default
            </Button>
            
            {colorOptions.map((color) => (
              <Button
                key={color.value}
                onClick={() => setRoomColor(color.value)}
                variant={roomColor === color.value ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-xs ${roomColor === color.value ? color.bg + ' text-white border-none' : ''}`}
              >
                <div className={`w-3 h-3 rounded-full ${color.bg} mr-2`} />
                {color.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Tetris Game - Only for tetris room */}
      {roomId === 'tetris-room' && (
        <div className="absolute top-4 right-4 w-64">
          <TetrisGame className="w-full" />
        </div>
      )}

      {/* Clicker Game - Only for clicker arcade */}
      {roomId === 'clicker-arcade' && isClickerView && (
        <div className="fixed inset-0 z-50">
          <ClickerGame onBack={handleClickerBack} />
        </div>
      )}

      {/* Room Info */}
      <Card className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-border/50 w-[calc(100%-2rem)] sm:w-auto max-w-xs">
        <h3 className="font-semibold text-card-foreground mb-1 text-sm sm:text-base">
          {t(`room.${roomId}.name`)}
        </h3>
        <p className="text-xs text-muted-foreground">
          {roomId === 'tetris-room' ? 'Use WASD keys to play!' : 
           roomId === 'clicker-arcade' && !isClickerView ? (
             <Button 
               onClick={handleStartClicker}
               variant="outline" 
               size="sm"
               className="mt-2 w-full text-xs"
             >
               Start Clicker Game
             </Button>
           ) : roomId === 'clicker-arcade' ? 'Click the gift package 100 times!' : 
           t('room.quran.click')}
        </p>
      </Card>

      {/* Qur'an Reader */}
      <QuranReader 
        isVisible={isQuranOpen} 
        onClose={() => setIsQuranOpen(false)} 
      />

      {/* Islamic Dialog Components for The Concept Room */}
      <PrayersList 
        isOpen={isPrayersListOpen}
        onClose={() => setIsPrayersListOpen(false)}
      />
      
      <PrayerTimes 
        isOpen={isPrayerTimesOpen}
        onClose={() => setIsPrayerTimesOpen(false)}
      />
      
      <IslamicCalendar 
        isOpen={isIslamicCalendarOpen}
        onClose={() => setIsIslamicCalendarOpen(false)}
      />
    </div>
  );
};
