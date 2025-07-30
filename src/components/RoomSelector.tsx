import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from '@/contexts/TranslationContext';

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
  }
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
  'clicker-arcade': 'hobbies'
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
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('app.title')}
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            {t('main.subtitle')}
          </p>
          <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-3xl mx-auto mt-4 sm:mt-6 leading-relaxed px-4">
            {t('main.message')}
          </p>
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
        
        {/* Page Navigation - hide on mobile if only one page */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 sm:gap-4 mb-4 sm:mb-8">
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