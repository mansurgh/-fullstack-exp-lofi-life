import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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

interface Room {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  ambientType: 'rain' | 'birds' | 'fire' | 'night' | 'waves' | 'desert' | 'city' | 'space' | 'wind' | 'forest';
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
    name: 'Seaside Sanctuary',
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
  }
];

export const RoomSelector = ({ onSelectRoom }: RoomSelectorProps) => {
  const { t } = useTranslation();
  
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
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {rooms.map((room) => (
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
        
        <div className="text-center mt-12 sm:mt-16 px-4">
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