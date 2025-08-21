// src/components/Room.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import QuranReader from "./QuranReader";
import { TetrisGame } from "./TetrisGame";
import ClickerGame from "./ClickerGame";
import { PrayersList } from "./PrayersList";
import { PrayerTimes } from "./PrayerTimes";
import { IslamicCalendar } from "./IslamicCalendar";
import { InteractiveComponents } from "./InteractiveComponents";
import { InteractiveControlsMenu } from "./InteractiveControlsMenu";
import { ArrowLeft, Moon, Sun, RotateCcw } from "lucide-react";
import { useTranslation } from "@/contexts/TranslationContext";

// --- импорт твоих изображений (оставил как у тебя) ---
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
import lofiMosqueInterior from "@/assets/lofi-mosque-interior.jpg";
import lofiLibraryRoom from "@/assets/lofi-library-room.jpg";
import lofiRgbRoom from "@/assets/lofi-rgb-room.jpg";
import lofiPolandSnow from "@/assets/lofi-poland-snow.jpg";
import lofiAntarcticIgloo from "@/assets/lofi-antarctic-igloo.jpg";
import lofiSpaceShip from "@/assets/lofi-space-ship.jpg";
import lofiPinkCandy from "@/assets/lofi-pink-candy.jpg";
import lofiPrisonCell from "@/assets/lofi-prison-cell.jpg";
import lofiSkyscraperView from "@/assets/lofi-skyscraper-view.jpg";
import lofiSubmarineView from "@/assets/lofi-submarine-view.jpg";
import lofiClickerArcade from "@/assets/lofi-clicker-arcade.jpg";
import lofiTetrisRoom from "@/assets/lofi-tetris-room.jpg";
import lofiSpongebobPineapple from "@/assets/lofi-spongebob-pineapple.jpg";
import lofiMinecraftRoom from "@/assets/lofi-minecraft-room.jpg";
import lofiPirateDeckView from "@/assets/lofi-pirate-deck-view.jpg";
import lofiNarutoRoom from "@/assets/lofi-naruto-room.jpg";
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

import footballField from "@/assets/football-field.jpg";
import tennisCourt from "@/assets/tennis-court.jpg";
import basketballCourt from "@/assets/basketball-court.jpg";
import volleyballCourt from "@/assets/volleyball-court.jpg";
import bowlingAlley from "@/assets/bowling-alley.jpg";
import americanFootball from "@/assets/american-football.jpg";
import hockeyRink from "@/assets/hockey-rink.jpg";
import indoorPool from "@/assets/indoor-pool.jpg";

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

// ... roomConfigs как у тебя (вставь свой полный объект) ...
const roomConfigs: Record<string, RoomConfig> = {
  "rainy-study": {
    name: "Rainy Study",
    description: "Rain gently pattering against the window",
    ambientSound: "rain",
    backgroundImage: lofiRainyStudy,
    quranPosition: { x: "left-1/2", y: "top-3/4" },
    interactiveElements: [],
  },
  // весь остальной твой объект roomConfigs без изменений
  "the-concept": {
    name: "A concept",
    description:
      "A peaceful bedroom with Islamic elements and prayer tools",
    ambientSound: "night",
    backgroundImage: theConcept,
    quranPosition: { x: "right-1/4", y: "top-2/3" },
    interactiveElements: [
      {
        type: "glow",
        className:
          "absolute top-16 right-20 w-24 h-24 bg-blue-300/20 rounded-full blur-2xl",
        animation: "animate-pulse",
      },
    ],
  },
};

export const Room = ({ roomId, onBack }: RoomProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isQuranOpen, setIsQuranOpen] = useState(false);
  const [isPrayersListOpen, setIsPrayersListOpen] = useState(false);
  const [isPrayerTimesOpen, setIsPrayerTimesOpen] = useState(false);
  const [isIslamicCalendarOpen, setIsIslamicCalendarOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [roomColor, setRoomColor] = useState("default");
  const [roomOffset, setRoomOffset] = useState({ x: 0, y: 0 });

  const isClickerView = location.pathname.includes("/clicker");
  const roomConfig = roomConfigs[roomId];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    const audio = new Audio("/audio/room-enter.mp3");
    audio.volume = 0.3;
    audio.play().catch(() => {});
    return () => clearTimeout(timer);
  }, [roomId]);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [isDarkMode]);

  // лёгкий параллакс от мыши
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2; // -1..1
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      const maxOffset = 15;
      setRoomOffset({ x: x * maxOffset, y: y * maxOffset });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleReload = () => window.location.reload();

  const colorOptions = [
    { name: "Red", value: "red", bg: "bg-red-500", glow: "bg-red-500/10" },
    { name: "Blue", value: "blue", bg: "bg-blue-500", glow: "bg-blue-500/10" },
    { name: "Pink", value: "pink", bg: "bg-pink-500", glow: "bg-pink-500/10" },
    { name: "Yellow", value: "yellow", bg: "bg-yellow-500", glow: "bg-yellow-500/10" },
    { name: "Orange", value: "orange", bg: "bg-orange-500", glow: "bg-orange-500/10" },
    { name: "Purple", value: "purple", bg: "bg-purple-500", glow: "bg-purple-500/10" },
    { name: "Green", value: "green", bg: "bg-green-500", glow: "bg-green-500/10" },
  ];

  const getRoomGlowClass = (baseClass: string) => {
    if (roomColor === "default") return baseClass;
    const current = colorOptions.find((c) => c.value === roomColor);
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
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
        style={{
          backgroundImage: `url(${roomConfig.backgroundImage})`,
          transform: `translate(${roomOffset.x}px, ${roomOffset.y}px) scale(1.08)`,
          transition: "transform 0.1s ease-out",
          filter: isDarkMode
            ? "brightness(0.3) contrast(1.2)"
            : "brightness(0.8) contrast(1.1)",
        }}
      >
        <div
          className={`absolute inset-0 transition-all duration-1000 ${
            isDarkMode
              ? "bg-gradient-to-br from-black/60 via-blue-900/40 to-black/70"
              : "bg-gradient-to-br from-black/20 via-transparent to-black/30"
          }`}
        />
      </div>

      {/* декоративные элементы */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{
          transform: `translate(${roomOffset.x * 0.5}px, ${
            roomOffset.y * 0.5
          }px)`,
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

      {/* кнопка открытия Корана (видна всегда) */}
      <Button
        onClick={() => setIsQuranOpen(true)}
        variant="outline"
        className="absolute bottom-4 left-4 bg-background/80 backdrop-blur border-border"
      >
        Open Qur’an
      </Button>

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
            {colorOptions.map((c) => (
              <Button
                key={c.value}
                onClick={() => setRoomColor(c.value)}
                variant={roomColor === c.value ? "default" : "outline"}
                size="sm"
                className={`w-full justify-start text-xs ${
                  roomColor === c.value ? c.bg + " text-white border-none" : ""
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

      {/* модалки */}
      <QuranReader isVisible={isQuranOpen} onClose={() => setIsQuranOpen(false)} />
      <PrayersList isOpen={isPrayersListOpen} onClose={() => setIsPrayersListOpen(false)} />
      <PrayerTimes isOpen={isPrayerTimesOpen} onClose={() => setIsPrayerTimesOpen(false)} />
      <IslamicCalendar
        isOpen={isIslamicCalendarOpen}
        onClose={() => setIsIslamicCalendarOpen(false)}
      />
    </div>
  );
};
