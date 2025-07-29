import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Card } from "@/components/ui/card";
import { QuranReader } from './QuranReader';
import { TetrisGame } from './TetrisGame';
import ClickerGame from './ClickerGame';
import { Volume2, VolumeX, ArrowLeft, Moon, Sun, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import rainyStudyRoom from "@/assets/rainy-study-room.jpg";
import sunnyGardenRoom from "@/assets/sunny-garden-room.jpg";
import fireplaceNook from "@/assets/fireplace-nook.jpg";
import moonlitCorner from "@/assets/moonlit-corner.jpg";
import seasideSanctuary from "@/assets/seaside-sanctuary.jpg";
import desertMirage from "@/assets/desert-mirage.jpg";
import tuscanVista from "@/assets/tuscan-vista.jpg";
import stellarMeditation from "@/assets/stellar-meditation.jpg";
import alpineRetreat from "@/assets/alpine-retreat.jpg";
import woodlandHaven from "@/assets/woodland-haven.jpg";
import russianWinter from "@/assets/russian-winter.jpg";
import chechenTower from "@/assets/chechen-tower.jpg";
import frenchEiffel from "@/assets/french-eiffel.jpg";
import norwegianLandscape from "@/assets/norwegian-landscape.jpg";
import tokyoNeon from "@/assets/tokyo-neon.jpg";

// High-quality images
import hqRainyStudy from "@/assets/hq-rainy-study.jpg";
import hqSunnyGarden from "@/assets/hq-sunny-garden.jpg";
import hqFireplaceNook from "@/assets/hq-fireplace-nook.jpg";
import hqMoonlitCorner from "@/assets/hq-moonlit-corner.jpg";
import hqSeasideSanctuary from "@/assets/hq-seaside-sanctuary.jpg";
import hqDesertMirage from "@/assets/hq-desert-mirage.jpg";
import hqTuscanVista from "@/assets/hq-tuscan-vista.jpg";
import hqStellarMeditation from "@/assets/hq-stellar-meditation.jpg";
import hqAlpineRetreat from "@/assets/hq-alpine-retreat.jpg";
import hqWoodlandHaven from "@/assets/hq-woodland-haven.jpg";
import hqRussianWinter from "@/assets/hq-russian-winter.jpg";
import hqFrenchEiffel from "@/assets/hq-french-eiffel.jpg";
import hqNorwegianLandscape from "@/assets/hq-norwegian-landscape.jpg";
import hqTokyoNeon from "@/assets/hq-tokyo-neon.jpg";
import hqLibraryRoom from "@/assets/hq-library-room.jpg";
import hqMosqueInterior from "@/assets/hq-mosque-interior.jpg";
import hqSpaceShip from "@/assets/hq-space-ship.jpg";
import hqSkyscraperView from "@/assets/hq-skyscraper-view.jpg";
import hqSubmarineView from "@/assets/hq-submarine-view.jpg";
import hqAntarcticIgloo from "@/assets/hq-antarctic-igloo.jpg";
import hqDutchFarm from "@/assets/hq-dutch-farm.jpg";
import hqChineseLake from "@/assets/hq-chinese-lake.jpg";
import hqRgbRoom from "@/assets/hq-rgb-room.jpg";
import hqPinkCandy from "@/assets/hq-pink-candy.jpg";
import hqChechenTower from "@/assets/hq-chechen-tower.jpg";
import hqPrisonCell from "@/assets/hq-prison-cell.jpg";
import hqCircusTent from "@/assets/hq-circus-tent.jpg";
import belgianGrey from "@/assets/belgian-grey.jpg";
import germanBrown from "@/assets/german-brown.jpg";
import dutchFarm from "@/assets/dutch-farm.jpg";
import chineseLake from "@/assets/chinese-lake.jpg";
import circusTent from "@/assets/circus-tent.jpg";
import footballField from "@/assets/football-field.jpg";
import tennisCourt from "@/assets/tennis-court.jpg";
import basketballCourt from "@/assets/basketball-court.jpg";
import volleyballCourt from "@/assets/volleyball-court.jpg";
import bowlingAlley from "@/assets/bowling-alley.jpg";
import americanFootball from "@/assets/american-football.jpg";
import hockeyRink from "@/assets/hockey-rink.jpg";
import indoorPool from "@/assets/indoor-pool.jpg";
import spongebobPineapple from "@/assets/spongebob-pineapple.jpg";
import minecraftRoom from "@/assets/minecraft-room.jpg";
import mosqueInterior from "@/assets/mosque-interior.jpg";
import libraryRoom from "@/assets/library-room.jpg";
import rgbRoom from "@/assets/rgb-room.jpg";
import polandSnow from "@/assets/poland-snow.jpg";
import antarcticIgloo from "@/assets/antarctic-igloo.jpg";
import spaceShip from "@/assets/space-ship.jpg";
import pinkCandy from "@/assets/pink-candy.jpg";
import prisonCell from "@/assets/prison-cell.jpg";
import skyscraperView from "@/assets/skyscraper-view.jpg";
import submarineView from "@/assets/submarine-view.jpg";
import pirateShip from "@/assets/pirate-ship.jpg";
import pirateDeckView from "@/assets/pirate-deck-view.jpg";
import narutoRoom from "@/assets/naruto-room.jpg";
import tetrisRoom from "@/assets/tetris-room.jpg";
import clickerArcade from '@/assets/clicker-arcade.jpg';

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
    backgroundImage: hqRainyStudy,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: []
  },
  'sunny-garden': {
    name: 'Garden View',
    description: 'Birds chirping in the sunny garden',
    ambientSound: 'birds',
    backgroundImage: hqSunnyGarden,
    quranPosition: { x: 'right-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 left-10 w-8 h-8 text-yellow-400 text-2xl', animation: 'animate-bounce' }
    ]
  },
  'fireplace-nook': {
    name: 'Fireplace Nook',
    description: 'Crackling fire warming the cozy space',
    ambientSound: 'fire',
    backgroundImage: hqFireplaceNook,
    quranPosition: { x: 'left-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-1/4 w-32 h-16 bg-orange-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'moonlit-corner': {
    name: 'Moonlit Corner',
    description: 'Peaceful moonlight through the window',
    ambientSound: 'night',
    backgroundImage: hqMoonlitCorner,
    quranPosition: { x: 'right-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-10 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'seaside-sanctuary': {
    name: 'Seaside Room',
    description: 'Peaceful ocean waves',
    ambientSound: 'waves',
    backgroundImage: hqSeasideSanctuary,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 right-10 w-6 h-6 text-blue-300 text-xl', animation: 'animate-bounce' }
    ]
  },
  'desert-mirage': {
    name: 'Desert Mirage',
    description: 'Gentle desert winds and sandy whispers',
    ambientSound: 'desert',
    backgroundImage: hqDesertMirage,
    quranPosition: { x: 'right-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-t from-yellow-600/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'tuscan-vista': {
    name: 'Tuscan Vista',
    description: 'Italian breeze and distant city murmurs',
    ambientSound: 'city',
    backgroundImage: hqTuscanVista,
    quranPosition: { x: 'left-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 right-20 w-20 h-20 bg-orange-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'stellar-meditation': {
    name: 'Stellar Meditation',
    description: 'Cosmic silence and ethereal space ambiance',
    ambientSound: 'space',
    backgroundImage: hqStellarMeditation,
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
    backgroundImage: hqAlpineRetreat,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'woodland-haven': {
    name: 'Woodland Haven',
    description: 'Forest sounds and rustling leaves',
    ambientSound: 'forest',
    backgroundImage: hqWoodlandHaven,
    quranPosition: { x: 'right-1/3', y: 'top-1/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-40 left-16 w-6 h-6 text-green-400 text-xl', animation: 'animate-bounce' }
    ]
  },
  'russian-winter': {
    name: 'Russian Winter',
    description: 'Snow falling gently outside',
    ambientSound: 'snow',
    backgroundImage: hqRussianWinter,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'chechen-tower': {
    name: 'Chechen Tower',
    description: 'Mountain winds around ancient tower',
    ambientSound: 'mountain',
    backgroundImage: hqChechenTower,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 right-10 w-16 h-16 bg-stone-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'french-eiffel': {
    name: 'French Elegance',
    description: 'Parisian streets and Eiffel Tower',
    ambientSound: 'city',
    backgroundImage: hqFrenchEiffel,
    quranPosition: { x: 'left-1/3', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-40 right-20 w-24 h-24 bg-amber-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'norwegian-landscape': {
    name: 'Norwegian Sky',
    description: 'Open landscape with mountain winds',
    ambientSound: 'wind',
    backgroundImage: hqNorwegianLandscape,
    quranPosition: { x: 'right-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-t from-green-600/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'tokyo-neon': {
    name: 'Tokyo Nights',
    description: 'Neon-lit cityscape',
    ambientSound: 'traffic',
    backgroundImage: hqTokyoNeon,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-32 right-16 w-20 h-20 bg-pink-500/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'belgian-grey': {
    name: 'Belgian Streets',
    description: 'Grey city atmosphere',
    ambientSound: 'rain',
    backgroundImage: belgianGrey,
    quranPosition: { x: 'right-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-gray-500/15 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'german-brown': {
    name: 'German Village',
    description: 'Traditional brown cityscape',
    ambientSound: 'city',
    backgroundImage: germanBrown,
    quranPosition: { x: 'left-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 left-20 w-18 h-18 bg-amber-600/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'dutch-farm': {
    name: 'Dutch Countryside',
    description: 'Peaceful farmland and nature',
    ambientSound: 'nature',
    backgroundImage: hqDutchFarm,
    quranPosition: { x: 'right-1/4', y: 'top-3/5' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 left-12 w-5 h-5 text-green-500 text-lg', animation: 'animate-bounce' }
    ]
  },
  'chinese-lake': {
    name: 'Chinese Serenity',
    description: 'Tranquil lake view',
    ambientSound: 'water',
    backgroundImage: hqChineseLake,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-40 right-24 w-20 h-20 bg-blue-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'circus-tent': {
    name: 'Circus Memories',
    description: 'Inside the big tent',
    ambientSound: 'silence',
    backgroundImage: hqCircusTent,
    quranPosition: { x: 'right-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-1/3 w-24 h-24 bg-red-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'football-field': {
    name: 'Football Field',
    description: 'On the field with outdoor ambiance',
    ambientSound: 'sports',
    backgroundImage: footballField,
    quranPosition: { x: 'left-1/4', y: 'top-3/4' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 right-20 w-4 h-4 text-white text-lg', animation: 'animate-bounce' }
    ]
  },
  'tennis-court': {
    name: 'Tennis Court',
    description: 'Peaceful tennis court',
    ambientSound: 'sports',
    backgroundImage: tennisCourt,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-24 left-16 w-16 h-16 bg-green-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'basketball-court': {
    name: 'Basketball Court',
    description: 'Indoor court with echoing sounds',
    ambientSound: 'sports',
    backgroundImage: basketballCourt,
    quranPosition: { x: 'left-1/2', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 right-12 w-20 h-20 bg-orange-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'volleyball-court': {
    name: 'Volleyball Court',
    description: 'Clean court with gym ambiance',
    ambientSound: 'sports',
    backgroundImage: volleyballCourt,
    quranPosition: { x: 'right-1/4', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-28 left-16 w-4 h-4 text-yellow-400 text-lg', animation: 'animate-bounce' }
    ]
  },
  'bowling-alley': {
    name: 'Bowling Alley',
    description: 'Quiet alley with subtle sounds',
    ambientSound: 'sports',
    backgroundImage: bowlingAlley,
    quranPosition: { x: 'left-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 right-20 w-18 h-18 bg-purple-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'american-football': {
    name: 'American Football',
    description: 'Stadium field with gentle wind',
    ambientSound: 'sports',
    backgroundImage: americanFootball,
    quranPosition: { x: 'right-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-t from-green-700/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'hockey-rink': {
    name: 'Hockey Rink',
    description: 'Ice rink with arena ambiance',
    ambientSound: 'sports',
    backgroundImage: hockeyRink,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-24 right-24 w-20 h-20 bg-blue-300/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'indoor-pool': {
    name: 'Swimming Pool',
    description: 'Peaceful poolside',
    ambientSound: 'water',
    backgroundImage: indoorPool,
    quranPosition: { x: 'right-1/3', y: 'top-1/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-20 left-20 w-32 h-16 bg-cyan-400/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'spongebob-pineapple': {
    name: 'Underwater Home',
    description: 'SpongeBob\'s pineapple with bubbles',
    ambientSound: 'underwater',
    backgroundImage: spongebobPineapple,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-16 w-6 h-6 text-blue-300 text-xl', animation: 'animate-bounce' },
      { type: 'floating', className: 'absolute bottom-32 left-12 w-4 h-4 text-cyan-300 text-lg', animation: 'animate-pulse' }
    ]
  },
  'minecraft-room': {
    name: 'Minecraft World',
    description: 'Blocky world with cube sounds',
    ambientSound: 'electronic',
    backgroundImage: minecraftRoom,
    quranPosition: { x: 'right-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-br from-green-600/15 via-transparent to-brown-600/15', animation: 'animate-pulse' }
    ]
  },
  'mosque-interior': {
    name: 'Sacred Mosque',
    description: 'Peaceful mosque interior',
    ambientSound: 'silence',
    backgroundImage: hqMosqueInterior,
    quranPosition: { x: 'left-1/2', y: 'top-3/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-16 left-1/2 w-24 h-24 bg-gold-400/20 rounded-full blur-2xl', animation: 'animate-pulse' }
    ]
  },
  'library-room': {
    name: 'Quiet Library',
    description: 'Silent library with page sounds',
    ambientSound: 'pages',
    backgroundImage: hqLibraryRoom,
    quranPosition: { x: 'right-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-24 left-24 w-20 h-20 bg-amber-300/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'rgb-room': {
    name: 'Disco',
    description: 'Dark room with customizable lighting effects',
    ambientSound: 'electronic',
    backgroundImage: hqRgbRoom,
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
    backgroundImage: polandSnow,
    quranPosition: { x: 'left-1/2', y: 'top-2/3' },
    interactiveElements: [
      { type: 'particles', className: 'absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-transparent', animation: 'animate-pulse' }
    ]
  },
  'antarctic-igloo': {
    name: 'Antarctic Igloo',
    description: 'Inside an igloo with icy Antarctic view',
    ambientSound: 'wind',
    backgroundImage: hqAntarcticIgloo,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-20 w-20 h-20 bg-cyan-300/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'space-ship': {
    name: 'Space Station',
    description: 'Spaceship with Earth view from orbit',
    ambientSound: 'space',
    backgroundImage: hqSpaceShip,
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
    backgroundImage: hqPinkCandy,
    quranPosition: { x: 'right-1/2', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-32 left-16 w-6 h-6 text-pink-300 text-xl', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-20 right-20 w-28 h-28 bg-pink-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'prison-cell': {
    name: 'Prison Cell',
    description: 'Institutional cell with courtyard view',
    ambientSound: 'silence',
    backgroundImage: hqPrisonCell,
    quranPosition: { x: 'left-1/3', y: 'top-2/3' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-40 right-16 w-16 h-32 bg-gray-400/15 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'skyscraper-view': {
    name: 'Sky High',
    description: 'High-rise room with panoramic city view',
    ambientSound: 'city',
    backgroundImage: hqSkyscraperView,
    quranPosition: { x: 'right-1/4', y: 'top-3/5' },
    interactiveElements: [
      { type: 'glow', className: 'absolute bottom-32 left-24 w-20 h-20 bg-amber-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'submarine-view': {
    name: 'Deep Sea',
    description: 'Submarine with underwater plant view',
    ambientSound: 'underwater',
    backgroundImage: hqSubmarineView,
    quranPosition: { x: 'left-1/2', y: 'top-1/3' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-12 w-5 h-5 text-cyan-300 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-24 left-20 w-24 h-16 bg-teal-400/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'pirate-deck-view': {
    name: 'Nakama',
    description: 'Standing at the helm with adventure gear around',
    ambientSound: 'waves',
    backgroundImage: pirateDeckView,
    quranPosition: { x: 'left-1/4', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-20 right-20 w-5 h-5 text-orange-300 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-40 left-1/3 w-24 h-16 bg-amber-500/25 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'naruto-room': {
    name: 'Ninja Hideout',
    description: 'Ramen restaurant with ninja weapons and peaceful atmosphere',
    ambientSound: 'silence',
    backgroundImage: narutoRoom,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'floating', className: 'absolute top-24 left-20 w-6 h-6 text-orange-300 text-lg', animation: 'animate-bounce' },
      { type: 'glow', className: 'absolute bottom-32 right-24 w-20 h-20 bg-amber-400/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'tetris-room': {
    name: 'Tetris Arcade',
    description: 'Retro gaming room with playable tetris using WASD controls',
    ambientSound: 'electronic',
    backgroundImage: tetrisRoom,
    quranPosition: { x: 'left-1/4', y: 'top-1/4' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-16 right-16 w-20 h-20 bg-blue-500/25 rounded-full blur-xl', animation: 'animate-pulse' },
      { type: 'glow', className: 'absolute bottom-20 left-20 w-24 h-24 bg-purple-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
    ]
  },
  'clicker-arcade': {
    name: 'Clicker Arcade',
    description: 'Click gift packages to discover ahadith wisdom',
    ambientSound: 'electronic',
    backgroundImage: clickerArcade,
    quranPosition: { x: 'right-1/3', y: 'top-1/2' },
    interactiveElements: [
      { type: 'glow', className: 'absolute top-20 left-20 w-24 h-24 bg-pink-500/25 rounded-full blur-xl', animation: 'animate-pulse' },
      { type: 'glow', className: 'absolute bottom-24 right-24 w-20 h-20 bg-purple-500/20 rounded-full blur-xl', animation: 'animate-pulse' }
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
  const hasGlowEffects = roomConfig.interactiveElements.some(element => 
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

      {/* Color Controls - Show for rooms with glow effects */}
      {hasGlowEffects && (
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
    </div>
  );
};