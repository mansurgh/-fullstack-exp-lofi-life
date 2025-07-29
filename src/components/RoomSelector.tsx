import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
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
    thumbnail: rainyStudyRoom,
    ambientType: 'rain'
  },
  {
    id: 'sunny-garden',
    name: 'Garden View',
    description: 'A bright room overlooking a peaceful garden with chirping birds',
    thumbnail: sunnyGardenRoom,
    ambientType: 'birds'
  },
  {
    id: 'fireplace-nook',
    name: 'Fireplace Nook',
    description: 'A warm corner with a crackling fireplace and comfortable seating',
    thumbnail: fireplaceNook,
    ambientType: 'fire'
  },
  {
    id: 'moonlit-corner',
    name: 'Moonlit Corner',
    description: 'A serene nighttime space bathed in gentle moonlight',
    thumbnail: moonlitCorner,
    ambientType: 'night'
  },
  {
    id: 'seaside-sanctuary',
    name: 'Seaside Room',
    description: 'Ocean waves and distant seagulls create peaceful coastal ambiance',
    thumbnail: seasideSanctuary,
    ambientType: 'waves'
  },
  {
    id: 'desert-mirage',
    name: 'Desert Mirage',
    description: 'Gentle desert winds with distant sandy whispers and silence',
    thumbnail: desertMirage,
    ambientType: 'desert'
  },
  {
    id: 'tuscan-vista',
    name: 'Tuscan Vista',
    description: 'Soft Italian breeze with distant city murmurs and gentle wind',
    thumbnail: tuscanVista,
    ambientType: 'city'
  },
  {
    id: 'stellar-meditation',
    name: 'Stellar Meditation',
    description: 'Cosmic silence with ethereal space ambiance and celestial sounds',
    thumbnail: stellarMeditation,
    ambientType: 'space'
  },
  {
    id: 'alpine-retreat',
    name: 'Alpine Retreat',
    description: 'Mountain winds whistling through peaceful snow-capped peaks',
    thumbnail: alpineRetreat,
    ambientType: 'wind'
  },
  {
    id: 'woodland-haven',
    name: 'Woodland Haven',
    description: 'Forest sounds with gentle rustling leaves and nature\'s symphony',
    thumbnail: woodlandHaven,
    ambientType: 'forest'
  },
  {
    id: 'russian-winter',
    name: 'Russian Winter',
    description: 'Snow falling gently outside with peaceful winter ambiance',
    thumbnail: russianWinter,
    ambientType: 'snow'
  },
  {
    id: 'chechen-tower',
    name: 'Chechen Tower',
    description: 'Mountain winds around the ancient Vainakh tower',
    thumbnail: chechenTower,
    ambientType: 'mountain'
  },
  {
    id: 'french-eiffel',
    name: 'French Elegance',
    description: 'Parisian streets with distant Eiffel Tower view',
    thumbnail: frenchEiffel,
    ambientType: 'city'
  },
  {
    id: 'norwegian-landscape',
    name: 'Norwegian Sky',
    description: 'Open Norwegian landscape with mountain winds',
    thumbnail: norwegianLandscape,
    ambientType: 'wind'
  },
  {
    id: 'tokyo-neon',
    name: 'Tokyo Nights',
    description: 'Neon-lit cityscape with urban night sounds',
    thumbnail: tokyoNeon,
    ambientType: 'traffic'
  },
  {
    id: 'belgian-grey',
    name: 'Belgian Streets',
    description: 'Grey city atmosphere with gentle rain sounds',
    thumbnail: belgianGrey,
    ambientType: 'rain'
  },
  {
    id: 'german-brown',
    name: 'German Village',
    description: 'Traditional brown-roofed cityscape with peaceful ambiance',
    thumbnail: germanBrown,
    ambientType: 'city'
  },
  {
    id: 'dutch-farm',
    name: 'Dutch Countryside',
    description: 'Peaceful farmland with nature sounds and gentle breeze',
    thumbnail: dutchFarm,
    ambientType: 'nature'
  },
  {
    id: 'chinese-lake',
    name: 'Chinese Serenity',
    description: 'Tranquil lake view with gentle water sounds',
    thumbnail: chineseLake,
    ambientType: 'water'
  },
  {
    id: 'circus-tent',
    name: 'Circus Memories',
    description: 'Inside the big tent with nostalgic circus atmosphere',
    thumbnail: circusTent,
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
    description: 'SpongeBob\'s pineapple with underwater bubble sounds',
    thumbnail: spongebobPineapple,
    ambientType: 'underwater'
  },
  {
    id: 'minecraft-room',
    name: 'Minecraft World',
    description: 'Blocky world with peaceful ambient cube sounds',
    thumbnail: minecraftRoom,
    ambientType: 'electronic'
  },
  {
    id: 'mosque-interior',
    name: 'Sacred Mosque',
    description: 'Peaceful mosque interior with spiritual silence',
    thumbnail: mosqueInterior,
    ambientType: 'silence'
  },
  {
    id: 'library-room',
    name: 'Quiet Library',
    description: 'Silent library with gentle page turning sounds',
    thumbnail: libraryRoom,
    ambientType: 'pages'
  },
  {
    id: 'rgb-room',
    name: 'Disco',
    description: 'Dark room with customizable lighting effects and electronic ambiance',
    thumbnail: rgbRoom,
    ambientType: 'electronic'
  },
  {
    id: 'poland-snow',
    name: 'Polish Winter',
    description: 'Cozy Polish room with peaceful snowy winter sounds',
    thumbnail: polandSnow,
    ambientType: 'snow'
  },
  {
    id: 'antarctic-igloo',
    name: 'Antarctic Igloo',
    description: 'Inside an igloo with cold Antarctic wind sounds',
    thumbnail: antarcticIgloo,
    ambientType: 'wind'
  },
  {
    id: 'space-ship',
    name: 'Space Station',
    description: 'Spaceship with cosmic silence and Earth view',
    thumbnail: spaceShip,
    ambientType: 'space'
  },
  {
    id: 'pink-candy',
    name: 'Sweet Dreams',
    description: 'Pink room with magical candy field view and peaceful silence',
    thumbnail: pinkCandy,
    ambientType: 'silence'
  },
  {
    id: 'prison-cell',
    name: 'Prison Cell',
    description: 'Institutional cell with echoing silence',
    thumbnail: prisonCell,
    ambientType: 'silence'
  },
  {
    id: 'skyscraper-view',
    name: 'Sky High',
    description: 'High-rise room with city sounds from far below',
    thumbnail: skyscraperView,
    ambientType: 'city'
  },
  {
    id: 'submarine-view',
    name: 'Deep Sea',
    description: 'Submarine with underwater bubble sounds and sea plant view',
    thumbnail: submarineView,
    ambientType: 'underwater'
  },
  {
    id: 'pirate-deck-view',
    name: 'Nakama',
    description: 'Standing at the helm with adventure gear around',
    thumbnail: pirateDeckView,
    ambientType: 'waves'
  },
  {
    id: 'naruto-room',
    name: 'Ninja Hideout',
    description: 'Ramen restaurant with ninja weapons and peaceful atmosphere',
    thumbnail: narutoRoom,
    ambientType: 'japanese'
  },
  {
    id: 'tetris-room',
    name: 'Tetris Arcade',
    description: 'Retro gaming room with playable tetris using WASD controls',
    thumbnail: tetrisRoom,
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
  'tetris-room': 'hobbies'
};

export const RoomSelector = ({ onSelectRoom }: RoomSelectorProps) => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedFilter, setSelectedFilter] = useState<FilterCategory>('all');
  
  const ROOMS_PER_PAGE = 24;
  
  const filteredRooms = selectedFilter === 'all' 
    ? rooms 
    : rooms.filter(room => roomCategories[room.id] === selectedFilter);
  
  const totalPages = Math.ceil(filteredRooms.length / ROOMS_PER_PAGE);
  
  const currentRooms = filteredRooms.slice(
    currentPage * ROOMS_PER_PAGE,
    (currentPage + 1) * ROOMS_PER_PAGE
  );
  
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
        
        {/* Filter Buttons */}
        <div className="flex justify-center items-center gap-2 mb-8">
          <Button
            onClick={() => handleFilterChange('all')}
            variant={selectedFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            className="px-4 py-2"
          >
            All
          </Button>
          <Button
            onClick={() => handleFilterChange('places')}
            variant={selectedFilter === 'places' ? 'default' : 'outline'}
            size="sm"
            className="px-4 py-2"
          >
            Places
          </Button>
          <Button
            onClick={() => handleFilterChange('hobbies')}
            variant={selectedFilter === 'hobbies' ? 'default' : 'outline'}
            size="sm"
            className="px-4 py-2"
          >
            Hobbies
          </Button>
          <Button
            onClick={() => handleFilterChange('fantasy')}
            variant={selectedFilter === 'fantasy' ? 'default' : 'outline'}
            size="sm"
            className="px-4 py-2"
          >
            Fantasy
          </Button>
        </div>
        
        {/* Page Navigation */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <Button
            onClick={goToPrevPage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            onClick={goToNextPage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {currentRooms.map((room) => (
            <Card 
              key={room.id}
              className="overflow-hidden shadow-soft hover:shadow-glow transition-all duration-300 hover:scale-[1.02] bg-card border-border"
            >
              <div className="relative">
                <img 
                  src={room.thumbnail} 
                  alt={room.name}
                  className="aspect-video w-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-2 sm:top-4 right-2 sm:right-4 text-2xl sm:text-3xl opacity-80">
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
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-xl sm:text-2xl font-semibold text-card-foreground mb-2">
                  {t(`room.${room.id}.name`)}
                </h3>
                <p className="text-sm sm:text-base text-muted-foreground mb-4 leading-relaxed">
                  {t(`room.${room.id}.description`)}
                </p>
                <Button 
                  onClick={() => onSelectRoom(room.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-2 sm:py-3"
                >
                  {t('main.enter.room')}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Bottom Navigation */}
        <div className="flex justify-center items-center gap-4 mt-12">
          <Button
            onClick={goToPrevPage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </Button>
          
          <span className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </span>
          
          <Button
            onClick={goToNextPage}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </Button>
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