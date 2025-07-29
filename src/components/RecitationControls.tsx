import { Play, Pause, Square, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useRecitation } from '@/contexts/RecitationContext';
import { useTranslation } from '@/contexts/TranslationContext';

interface RecitationControlsProps {
  className?: string;
}

export const RecitationControls = ({ className = '' }: RecitationControlsProps) => {
  const { t } = useTranslation();
  const {
    isReciting,
    currentSurah,
    currentVerse,
    isPlaying,
    startRecitation,
    pauseRecitation,
    resumeRecitation,
    stopRecitation,
    nextVerse,
    previousVerse
  } = useRecitation();

  if (!isReciting) {
    return (
      <Card className={`p-3 bg-background/90 backdrop-blur-sm ${className}`}>
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">Start Qur'an Recitation</p>
          <Button
            onClick={() => startRecitation(1, 1)}
            size="sm"
            className="gap-2"
          >
            <Play size={16} />
            Start Al-Fatihah
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-3 bg-background/90 backdrop-blur-sm ${className}`}>
      <div className="space-y-2">
        <div className="text-center">
          <div className="text-sm font-medium">Surah {currentSurah}, Verse {currentVerse}</div>
        </div>
        
        <div className="flex items-center justify-center gap-2">
          <Button
            onClick={previousVerse}
            size="sm"
            variant="outline"
            className="p-2"
          >
            <SkipBack size={14} />
          </Button>
          
          <Button
            onClick={isPlaying ? pauseRecitation : resumeRecitation}
            size="sm"
            className="p-2"
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </Button>
          
          <Button
            onClick={nextVerse}
            size="sm"
            variant="outline"
            className="p-2"
          >
            <SkipForward size={14} />
          </Button>
          
          <Button
            onClick={stopRecitation}
            size="sm"
            variant="outline"
            className="p-2"
          >
            <Square size={14} />
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground">
          ⚠️ Audio files not included - add to /public/quran-audio/
        </div>
      </div>
    </Card>
  );
};