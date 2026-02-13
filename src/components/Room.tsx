// src/components/Room.tsx
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "@/contexts/TranslationContext";
import { ArrowLeft, Moon, RotateCcw, Sun } from "lucide-react";
import ClickerGame from "./ClickerGame";
import { InteractiveComponents } from "./InteractiveComponents";
import { InteractiveControlsMenu } from "./InteractiveControlsMenu";
import { TetrisGame } from "./TetrisGame";

// --- импорт твоих изображений (оставил как у тебя) ---
import lofiAlpineRetreat from "@/assets/lofi-alpine-retreat.jpg";
import lofiAntarcticIgloo from "@/assets/lofi-antarctic-igloo.jpg";
import lofiBelgianGrey from "@/assets/lofi-belgian-grey.jpg";
import lofiBirdShop from "@/assets/lofi-bird-shop.jpg";
import lofiBusStop from "@/assets/lofi-bus-stop.jpg";
import lofiCatEating from "@/assets/lofi-cat-eating.jpg";
import lofiChechenTower from "@/assets/lofi-chechen-tower.jpg";
import lofiChineseLake from "@/assets/lofi-chinese-lake.jpg";
import lofiCircusTent from "@/assets/lofi-circus-tent.jpg";
import lofiClickerArcade from "@/assets/lofi-clicker-arcade.jpg";
import lofiDemonSlayerDojo from "@/assets/lofi-demon-slayer-dojo.jpg";
import lofiDesertMirage from "@/assets/lofi-desert-mirage.jpg";
import lofiDoctorsOffice from "@/assets/lofi-doctors-office.jpg";
import lofiDogEating from "@/assets/lofi-dog-eating.jpg";
import lofiDragonBallTraining from "@/assets/lofi-dragon-ball-training.jpg";
import lofiDutchFarm from "@/assets/lofi-dutch-farm.jpg";
import lofiFireplaceNook from "@/assets/lofi-fireplace-nook.jpg";
import lofiFrenchEiffel from "@/assets/lofi-french-eiffel.jpg";
import lofiGermanBrown from "@/assets/lofi-german-brown.jpg";
import lofiGhibliForest from "@/assets/lofi-ghibli-forest.jpg";
import lofiGym from "@/assets/lofi-gym.jpg";
import lofiHeroAcademy from "@/assets/lofi-hero-academy.jpg";
import lofiHospitalWaiting from "@/assets/lofi-hospital-waiting.jpg";
import lofiJailCell from "@/assets/lofi-jail-cell.jpg";
import lofiKitchenCockatiel from "@/assets/lofi-kitchen-cockatiel.jpg";
import lofiLibraryRoom from "@/assets/lofi-library-room.jpg";
import lofiMinecraftRoom from "@/assets/lofi-minecraft-room.jpg";
import lofiMoonlitCorner from "@/assets/lofi-moonlit-corner.jpg";
import lofiMoonlitRoom from "@/assets/lofi-moonlit-room.jpg";
import lofiMosqueInterior from "@/assets/lofi-mosque-interior.jpg";
import lofiNarutoRoom from "@/assets/lofi-naruto-room.jpg";
import lofiNorwegianLandscape from "@/assets/lofi-norwegian-landscape.jpg";
import lofiParkTrees from "@/assets/lofi-park-trees.jpg";
import lofiPinkCandy from "@/assets/lofi-pink-candy.jpg";
import lofiPirateDeckView from "@/assets/lofi-pirate-deck-view.jpg";
import lofiPolandSnow from "@/assets/lofi-poland-snow.jpg";
import lofiPrisonCell from "@/assets/lofi-prison-cell.jpg";
import lofiRainHideout from "@/assets/lofi-rain-hideout.jpg";
import lofiRainyStudy from "@/assets/lofi-rainy-study.jpg";
import lofiRgbRoom from "@/assets/lofi-rgb-room.jpg";
import lofiRoomWithCat from "@/assets/lofi-room-with-cat.jpg";
import lofiRussianWinter from "@/assets/lofi-russian-winter.jpg";
import lofiSeasideSanctuary from "@/assets/lofi-seaside-sanctuary.jpg";
import lofiSkyscraperView from "@/assets/lofi-skyscraper-view.jpg";
import lofiSpaceShip from "@/assets/lofi-space-ship.jpg";
import lofiSpongebobPineapple from "@/assets/lofi-spongebob-pineapple.jpg";
import lofiStellarMeditation from "@/assets/lofi-stellar-meditation.jpg";
import lofiSubmarineView from "@/assets/lofi-submarine-view.jpg";
import lofiSunnyGarden from "@/assets/lofi-sunny-garden.jpg";
import lofiTetrisRoom from "@/assets/lofi-tetris-room.jpg";
import lofiTitanWall from "@/assets/lofi-titan-wall.jpg";
import lofiTokyoNeon from "@/assets/lofi-tokyo-neon.jpg";
import lofiTrainStation from "@/assets/lofi-train-station.jpg";
import lofiTuscanVista from "@/assets/lofi-tuscan-vista.jpg";
import lofiWoodlandHaven from "@/assets/lofi-woodland-haven.jpg";

import americanFootball from "@/assets/american-football.jpg";
import basketballCourt from "@/assets/basketball-court.jpg";
import bowlingAlley from "@/assets/bowling-alley.jpg";
import footballField from "@/assets/football-field.jpg";
import hockeyRink from "@/assets/hockey-rink.jpg";
import indoorPool from "@/assets/indoor-pool.jpg";
import tennisCourt from "@/assets/tennis-court.jpg";
import volleyballCourt from "@/assets/volleyball-court.jpg";

import theConcept from "@/assets/the-concept.jpg";

// ---------- типы и конфиги комнат (оставил твою большую структуру) ----------
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
    type: "floating" | "glow" | "particles";
    className: string;
    animation: string;
  }>;
}

// Helper functions for room translations
export const getRoomName = (roomId: string, t: (key: string) => string): string => {
  return t(`room.${roomId}.name`);
};

export const getRoomDescription = (roomId: string, t: (key: string) => string): string => {
  return t(`room.${roomId}.desc`);
};

// Полная конфигурация всех комнат
const roomConfigs: Record<string, RoomConfig> = {
  "rainy-study": {
    name: "Rainy Study",
    description: "Rain gently pattering against the window",
    ambientSound: "rain",
    backgroundImage: lofiRainyStudy,
    quranPosition: { x: "left-1/2", y: "top-3/4" },
    interactiveElements: [],
  },
  "sunny-garden": {
    name: "Sunny Garden",
    description: "A peaceful garden with birds singing",
    ambientSound: "birds",
    backgroundImage: lofiSunnyGarden,
    quranPosition: { x: "right-1/4", y: "top-2/3" },
    interactiveElements: [],
  },
  "fireplace-nook": {
    name: "Fireplace Nook",
    description: "Cozy corner by the warm fireplace",
    ambientSound: "fireplace",
    backgroundImage: lofiFireplaceNook,
    quranPosition: { x: "left-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "moonlit-corner": {
    name: "Moonlit Corner",
    description: "Peaceful night scene under the moonlight",
    ambientSound: "wind",
    backgroundImage: lofiMoonlitCorner,
    quranPosition: { x: "right-1/4", y: "top-1/3" },
    interactiveElements: [],
  },
  "seaside-sanctuary": {
    name: "Seaside Sanctuary",
    description: "Ocean waves and seagulls in the distance",
    ambientSound: "waves",
    backgroundImage: lofiSeasideSanctuary,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "desert-mirage": {
    name: "Desert Mirage",
    description: "Vast desert landscape with gentle winds",
    ambientSound: "wind",
    backgroundImage: lofiDesertMirage,
    quranPosition: { x: "right-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "tuscan-vista": {
    name: "Tuscan Vista",
    description: "Beautiful Italian countryside view",
    ambientSound: "birds",
    backgroundImage: lofiTuscanVista,
    quranPosition: { x: "left-1/4", y: "top-1/3" },
    interactiveElements: [],
  },
  "stellar-meditation": {
    name: "Stellar Meditation",
    description: "Cosmic space for deep contemplation",
    ambientSound: "wind",
    backgroundImage: lofiStellarMeditation,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "alpine-retreat": {
    name: "Alpine Retreat",
    description: "Mountain retreat with fresh air",
    ambientSound: "wind",
    backgroundImage: lofiAlpineRetreat,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "woodland-haven": {
    name: "Woodland Haven",
    description: "Forest sanctuary with nature sounds",
    ambientSound: "birds",
    backgroundImage: lofiWoodlandHaven,
    quranPosition: { x: "left-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "russian-winter": {
    name: "Russian Winter",
    description: "Snow-covered Russian landscape",
    ambientSound: "wind",
    backgroundImage: lofiRussianWinter,
    quranPosition: { x: "right-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "chechen-tower": {
    name: "Chechen Tower",
    description: "Ancient tower in the mountains",
    ambientSound: "wind",
    backgroundImage: lofiChechenTower,
    quranPosition: { x: "left-1/2", y: "top-1/3" },
    interactiveElements: [],
  },
  "french-eiffel": {
    name: "French Eiffel",
    description: "Parisian view with the Eiffel Tower",
    ambientSound: "wind",
    backgroundImage: lofiFrenchEiffel,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "norwegian-landscape": {
    name: "Norwegian Landscape",
    description: "Beautiful Norwegian fjords and mountains",
    ambientSound: "wind",
    backgroundImage: lofiNorwegianLandscape,
    quranPosition: { x: "left-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "tokyo-neon": {
    name: "Tokyo Neon",
    description: "Vibrant Tokyo cityscape at night",
    ambientSound: "wind",
    backgroundImage: lofiTokyoNeon,
    quranPosition: { x: "right-1/4", y: "top-1/3" },
    interactiveElements: [],
  },
  "belgian-grey": {
    name: "Belgian Grey",
    description: "Moody Belgian cityscape",
    ambientSound: "rain",
    backgroundImage: lofiBelgianGrey,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "german-brown": {
    name: "German Brown",
    description: "Traditional German architecture",
    ambientSound: "wind",
    backgroundImage: lofiGermanBrown,
    quranPosition: { x: "right-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "dutch-farm": {
    name: "Dutch Farm",
    description: "Peaceful Dutch countryside",
    ambientSound: "birds",
    backgroundImage: lofiDutchFarm,
    quranPosition: { x: "left-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "chinese-lake": {
    name: "Chinese Lake",
    description: "Serene Chinese lake with mountains",
    ambientSound: "wind",
    backgroundImage: lofiChineseLake,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "circus-tent": {
    name: "Circus Tent",
    description: "Colorful circus atmosphere",
    ambientSound: "wind",
    backgroundImage: lofiCircusTent,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "mosque-interior": {
    name: "Mosque Interior",
    description: "Peaceful mosque interior for prayer",
    ambientSound: "wind",
    backgroundImage: lofiMosqueInterior,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "library-room": {
    name: "Library Room",
    description: "Quiet library for study and reflection",
    ambientSound: "wind",
    backgroundImage: lofiLibraryRoom,
    quranPosition: { x: "right-1/4", y: "top-1/3" },
    interactiveElements: [],
  },
  "rgb-room": {
    name: "RGB Room",
    description: "Modern room with RGB lighting",
    ambientSound: "wind",
    backgroundImage: lofiRgbRoom,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "poland-snow": {
    name: "Poland Snow",
    description: "Snowy Polish landscape",
    ambientSound: "wind",
    backgroundImage: lofiPolandSnow,
    quranPosition: { x: "right-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "antarctic-igloo": {
    name: "Antarctic Igloo",
    description: "Cozy igloo in the Antarctic",
    ambientSound: "wind",
    backgroundImage: lofiAntarcticIgloo,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "space-ship": {
    name: "Space Ship",
    description: "Futuristic spaceship interior",
    ambientSound: "wind",
    backgroundImage: lofiSpaceShip,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "pink-candy": {
    name: "Pink Candy",
    description: "Sweet pink candy room",
    ambientSound: "wind",
    backgroundImage: lofiPinkCandy,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "prison-cell": {
    name: "Prison Cell",
    description: "Minimalist prison cell",
    ambientSound: "wind",
    backgroundImage: lofiPrisonCell,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "skyscraper-view": {
    name: "Skyscraper View",
    description: "High-rise city view",
    ambientSound: "wind",
    backgroundImage: lofiSkyscraperView,
    quranPosition: { x: "right-1/4", y: "top-1/3" },
    interactiveElements: [],
  },
  "submarine-view": {
    name: "Submarine View",
    description: "Underwater submarine interior",
    ambientSound: "waves",
    backgroundImage: lofiSubmarineView,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "clicker-arcade": {
    name: "Clicker Arcade",
    description: "Retro arcade gaming room",
    ambientSound: "wind",
    backgroundImage: lofiClickerArcade,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "tetris-room": {
    name: "Tetris Room",
    description: "Classic Tetris gaming atmosphere",
    ambientSound: "wind",
    backgroundImage: lofiTetrisRoom,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "spongebob-pineapple": {
    name: "Spongebob Pineapple",
    description: "Under the sea in Bikini Bottom",
    ambientSound: "waves",
    backgroundImage: lofiSpongebobPineapple,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "minecraft-room": {
    name: "Minecraft Room",
    description: "Blocky Minecraft world",
    ambientSound: "wind",
    backgroundImage: lofiMinecraftRoom,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "pirate-deck-view": {
    name: "Pirate Deck View",
    description: "Pirate ship deck on the high seas",
    ambientSound: "waves",
    backgroundImage: lofiPirateDeckView,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "naruto-room": {
    name: "Naruto Room",
    description: "Hidden Leaf Village atmosphere",
    ambientSound: "wind",
    backgroundImage: lofiNarutoRoom,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "ghibli-forest": {
    name: "Ghibli Forest",
    description: "Magical Studio Ghibli forest",
    ambientSound: "birds",
    backgroundImage: lofiGhibliForest,
    quranPosition: { x: "left-1/3", y: "top-1/2" },
    interactiveElements: [],
  },
  "titan-wall": {
    name: "Titan Wall",
    description: "Attack on Titan wall scene",
    ambientSound: "wind",
    backgroundImage: lofiTitanWall,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "demon-slayer-dojo": {
    name: "Demon Slayer Dojo",
    description: "Training dojo from Demon Slayer",
    ambientSound: "wind",
    backgroundImage: lofiDemonSlayerDojo,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "hero-academy": {
    name: "Hero Academy",
    description: "My Hero Academia classroom",
    ambientSound: "wind",
    backgroundImage: lofiHeroAcademy,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "dragon-ball-training": {
    name: "Dragon Ball Training",
    description: "Training room from Dragon Ball",
    ambientSound: "wind",
    backgroundImage: lofiDragonBallTraining,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "hospital-waiting": {
    name: "Hospital Waiting",
    description: "Quiet hospital waiting room",
    ambientSound: "wind",
    backgroundImage: lofiHospitalWaiting,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "jail-cell": {
    name: "Jail Cell",
    description: "Minimalist jail cell",
    ambientSound: "wind",
    backgroundImage: lofiJailCell,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "the-concept": {
    name: "The Concept",
    description: "A peaceful bedroom with Islamic elements and prayer tools",
    ambientSound: "wind",
    backgroundImage: theConcept,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [
      {
        type: "glow",
        className: "absolute top-16 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl",
        animation: "animate-pulse",
      },
    ],
  },
  // Спортивные комнаты
  "football-field": {
    name: "Football Field",
    description: "Green football field under the sky",
    ambientSound: "wind",
    backgroundImage: footballField,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "tennis-court": {
    name: "Tennis Court",
    description: "Professional tennis court",
    ambientSound: "wind",
    backgroundImage: tennisCourt,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "basketball-court": {
    name: "Basketball Court",
    description: "Indoor basketball court",
    ambientSound: "wind",
    backgroundImage: basketballCourt,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "volleyball-court": {
    name: "Volleyball Court",
    description: "Beach volleyball court",
    ambientSound: "wind",
    backgroundImage: volleyballCourt,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "bowling-alley": {
    name: "Bowling Alley",
    description: "Classic bowling alley",
    ambientSound: "wind",
    backgroundImage: bowlingAlley,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "american-football": {
    name: "American Football",
    description: "American football field",
    ambientSound: "wind",
    backgroundImage: americanFootball,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "hockey-rink": {
    name: "Hockey Rink",
    description: "Ice hockey rink",
    ambientSound: "wind",
    backgroundImage: hockeyRink,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "indoor-pool": {
    name: "Indoor Pool",
    description: "Luxurious indoor swimming pool",
    ambientSound: "waves",
    backgroundImage: indoorPool,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  // Дополнительные lofi комнаты
  "train-station": {
    name: "Train Station",
    description: "Quiet train station platform",
    ambientSound: "wind",
    backgroundImage: lofiTrainStation,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "bus-stop": {
    name: "Bus Stop",
    description: "Cozy bus stop shelter",
    ambientSound: "wind",
    backgroundImage: lofiBusStop,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "doctors-office": {
    name: "Doctor's Office",
    description: "Peaceful medical office",
    ambientSound: "wind",
    backgroundImage: lofiDoctorsOffice,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "gym": {
    name: "Gym",
    description: "Modern fitness gym",
    ambientSound: "wind",
    backgroundImage: lofiGym,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "bird-shop": {
    name: "Bird Shop",
    description: "Charming bird shop",
    ambientSound: "birds",
    backgroundImage: lofiBirdShop,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "room-with-cat": {
    name: "Room with Cat",
    description: "Cozy room with a sleeping cat",
    ambientSound: "wind",
    backgroundImage: lofiRoomWithCat,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "cat-eating": {
    name: "Cat Eating",
    description: "Cat enjoying its meal",
    ambientSound: "wind",
    backgroundImage: lofiCatEating,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "dog-eating": {
    name: "Dog Eating",
    description: "Dog enjoying its meal",
    ambientSound: "wind",
    backgroundImage: lofiDogEating,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "kitchen-cockatiel": {
    name: "Kitchen Cockatiel",
    description: "Kitchen with a friendly cockatiel",
    ambientSound: "birds",
    backgroundImage: lofiKitchenCockatiel,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "moonlit-room": {
    name: "Moonlit Room",
    description: "Room bathed in moonlight",
    ambientSound: "wind",
    backgroundImage: lofiMoonlitRoom,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
  "rain-hideout": {
    name: "Rain Hideout",
    description: "Shelter from the rain",
    ambientSound: "rain",
    backgroundImage: lofiRainHideout,
    quranPosition: { x: "left-1/2", y: "top-1/2" },
    interactiveElements: [],
  },
  "park-trees": {
    name: "Park Trees",
    description: "Peaceful park with tall trees",
    ambientSound: "birds",
    backgroundImage: lofiParkTrees,
    quranPosition: { x: "right-1/4", y: "top-1/2" },
    interactiveElements: [],
  },
};

// Static color options — defined outside component to avoid re-creation
const COLOR_OPTIONS = [
  { name: "Red", value: "red", bg: "bg-red-500", glow: "bg-red-500/10" },
  { name: "Blue", value: "blue", bg: "bg-blue-500", glow: "bg-blue-500/10" },
  { name: "Pink", value: "pink", bg: "bg-pink-500", glow: "bg-pink-500/10" },
  { name: "Yellow", value: "yellow", bg: "bg-yellow-500", glow: "bg-yellow-500/10" },
  { name: "Orange", value: "orange", bg: "bg-orange-500", glow: "bg-orange-500/10" },
  { name: "Purple", value: "purple", bg: "bg-purple-500", glow: "bg-purple-500/10" },
  { name: "Green", value: "green", bg: "bg-green-500", glow: "bg-green-500/10" },
] as const;

export const Room = ({ roomId, onBack }: RoomProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const [roomColor, setRoomColor] = useState("default");
  const bgRef = useRef<HTMLDivElement>(null);
  const decorRef = useRef<HTMLDivElement>(null);

  const isClickerView = location.pathname.includes("/clicker");
  const roomConfig = roomConfigs[roomId];

  // Если комната не найдена, показываем ошибку
  if (!roomConfig) {
    return (
      <div className="min-h-screen bg-gradient-cozy flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Room Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The room "{roomId}" could not be found. Please check the URL or go back to the room selector.
          </p>
          <Button onClick={onBack} className="w-full">
            Back to Room Selector
          </Button>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    const audio = new Audio("/audio/room-enter.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => { });
    return () => {
      clearTimeout(timer);
      audio.pause();
      audio.src = '';
    };
  }, [roomId]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  // лёгкий параллакс от мыши (direct DOM — без setState/re-render, throttled via rAF)
  useEffect(() => {
    let rafId = 0;
    const handleMouseMove = (e: MouseEvent) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        const maxOffset = 15;
        const ox = x * maxOffset;
        const oy = y * maxOffset;
        if (bgRef.current) {
          bgRef.current.style.transform = `translate(${ox}px, ${oy}px) scale(1.08)`;
        }
        if (decorRef.current) {
          decorRef.current.style.transform = `translate(${ox * 0.5}px, ${oy * 0.5}px)`;
        }
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  const handleReload = () => window.location.reload();

  const getRoomGlowClass = (baseClass: string) => {
    if (roomColor === "default") return baseClass;
    const current = COLOR_OPTIONS.find((c) => c.value === roomColor);
    if (!current) return baseClass;
    return baseClass.replace(/bg-\w+-\d+\/[\d.]+/, current.glow);
  };

  if (!roomConfig) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-destructive">
        <p className="text-xl text-destructive-foreground">
          Room not found: {roomId}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* фон */}
      <div
        ref={bgRef}
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${roomConfig.backgroundImage})`,
          transform: `translate(0px, 0px) scale(1.08)`,
          transition: "transform 0.1s ease-out",
          filter: isDarkMode
            ? "brightness(0.3) contrast(1.2)"
            : "brightness(0.8) contrast(1.1)",
        }}
      >
        <div
          className={`absolute inset-0 transition-all duration-1000 ${isDarkMode
            ? "bg-gradient-to-br from-black/60 via-blue-900/40 to-black/70"
            : "bg-gradient-to-br from-black/20 via-transparent to-black/30"
            }`}
        />
      </div>

      {/* декоративные элементы */}
      <div
        ref={decorRef}
        className={`absolute inset-0 transition-opacity duration-1000 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
        style={{
          transform: `translate(0px, 0px)`,
          transition: "transform 0.1s ease-out",
        }}
      >
        {roomConfig.interactiveElements.map((el, idx) => (
          <div key={idx} className={`${getRoomGlowClass(el.className)} ${el.animation}`}>
            {el.type === "floating" && (
              <>
                {roomId === "sunny-garden" && "🦋"}
                {roomId === "seaside-sanctuary" && "🐚"}
                {roomId === "stellar-meditation" && "✨"}
                {roomId === "woodland-haven" && "🍃"}
              </>
            )}
          </div>
        ))}
      </div>

      {/* верхние контролы */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 right-4 sm:right-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button
          onClick={onBack}
          variant="secondary"
          size="sm"
          className="bg-card/80 hover:bg-card text-card-foreground w-full sm:w-auto"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t("room.back")}
        </Button>

        <div className="flex gap-3 w-full sm:w-auto justify-end">
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
            onClick={() => setIsDarkMode((v) => !v)}
            variant="secondary"
            size="sm"
            className="bg-card/80 hover:bg-card text-card-foreground"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </Button>
        </div>
      </div>



      {/* Меню цветов — только для rgb-room */}
      {roomId === "rgb-room" && (
        <Card className="absolute top-1/2 right-4 sm:right-6 p-3 bg-card/80 backdrop-blur-sm border-border/50 transform -translate-y-1/2">
          <h4 className="text-sm font-semibold text-card-foreground mb-2">
            Lighting
          </h4>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setRoomColor("default")}
              variant={roomColor === "default" ? "default" : "outline"}
              size="sm"
              className="w-full justify-start text-xs"
            >
              <span className="w-3 h-3 rounded-full bg-gray-400 mr-2" />
              Default
            </Button>
            {COLOR_OPTIONS.map((c) => (
              <Button
                key={c.value}
                onClick={() => setRoomColor(c.value)}
                variant={roomColor === c.value ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-xs ${roomColor === c.value ? c.bg + " text-white border-none" : ""
                  }`}
              >
                <span className={`w-3 h-3 rounded-full ${c.bg} mr-2`} />
                {c.name}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* тетрис/кликер/интерактив как у тебя */}
      {roomId === "tetris-room" && (
        <div className="absolute top-4 right-4 w-64">
          <TetrisGame className="w-full" />
        </div>
      )}

      {roomId === "clicker-arcade" && isClickerView && (
        <div className="fixed inset-0 z-50">
          <ClickerGame onBack={() => navigate(`/room/${roomId}`)} />
        </div>
      )}

      <InteractiveControlsMenu roomId={roomId} />
      <InteractiveComponents roomId={roomId} />

      {/* карточка-инфо */}
      <Card className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 p-3 sm:p-4 bg-card/80 backdrop-blur-sm border-border/50 w-[calc(100%-2rem)] sm:w-auto max-w-xs">
        <h3 className="font-semibold text-card-foreground mb-1 text-sm sm:text-base">
          {t(`room.${roomId}.name`)}
        </h3>
        <p className="text-xs text-muted-foreground">
          {roomId === "tetris-room"
            ? "Use WASD keys to play!"
            : roomId === "clicker-arcade" && !isClickerView
              ? "Press the big button to enter clicker mode"
              : t("room.quran.click")}
        </p>
      </Card>
    </div>
  );
};
