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
      <Card className={`p-2 sm:p-3 bg-background/90 backdrop-blur-sm ${className}`}>
        <div className="text-center">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 hidden sm:block">{t('recitation.start')}</p>
          <Button
            onClick={() => startRecitation(1, 1)}
            size="sm"
            className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
          >
            <Play size={12} className="sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">{t('recitation.start.fatihah')}</span>
            <span className="sm:hidden">Quran</span>
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-2 sm:p-3 bg-background/90 backdrop-blur-sm ${className}`}>
      <div className="space-y-1 sm:space-y-2">
        <div className="text-center hidden sm:block">
          <div className="text-xs sm:text-sm font-medium">{t('recitation.surah.verse').replace('{surah}', currentSurah.toString()).replace('{verse}', currentVerse.toString())}</div>
        </div>
        
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <Button
            onClick={previousVerse}
            size="sm"
            variant="outline"
            className="p-1 sm:p-2"
          >
            <SkipBack size={12} className="sm:w-3.5 sm:h-3.5" />
          </Button>
          
          <Button
            onClick={isPlaying ? pauseRecitation : resumeRecitation}
            size="sm"
            className="p-1 sm:p-2"
          >
            {isPlaying ? <Pause size={12} className="sm:w-3.5 sm:h-3.5" /> : <Play size={12} className="sm:w-3.5 sm:h-3.5" />}
          </Button>
          
          <Button
            onClick={nextVerse}
            size="sm"
            variant="outline"
            className="p-1 sm:p-2"
          >
            <SkipForward size={12} className="sm:w-3.5 sm:h-3.5" />
          </Button>
          
          <Button
            onClick={stopRecitation}
            size="sm"
            variant="outline"
            className="p-1 sm:p-2"
          >
            <Square size={12} className="sm:w-3.5 sm:h-3.5" />
          </Button>
        </div>
        
        <div className="text-xs text-center text-muted-foreground hidden sm:block">
          {t('recitation.audio.warning')}
        </div>
      </div>
    </Card>
  );
};