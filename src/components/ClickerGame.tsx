import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, RotateCcw } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

const ClickerGame = () => {
  const { t } = useTranslation();
  const [clicks, setClicks] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [currentHadithIndex, setCurrentHadithIndex] = useState<number | null>(null);
  const [lastHadithIndex, setLastHadithIndex] = useState<number | null>(null);

  // Total number of ahadith available
  const totalAhadith = 10;

  const handleClick = () => {
    if (isOpened) return;
    
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks >= 100) {
      setIsOpened(true);
      // Ensure we get a different hadith each time
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * totalAhadith) + 1;
      } while (randomIndex === lastHadithIndex && totalAhadith > 1);
      
      setLastHadithIndex(randomIndex);
      setCurrentHadithIndex(randomIndex);
    }
  };

  const resetGame = () => {
    setClicks(0);
    setIsOpened(false);
    setCurrentHadithIndex(null);
  };

  const clicksRemaining = Math.max(0, 100 - clicks);
  const progress = (clicks / 100) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">{t('clicker.title')}</h2>
          
          {!isOpened ? (
            <>
              <div className="mb-6">
                <p className="text-lg mb-4 text-muted-foreground">
                  {t('clicker.instruction')}
                </p>
                <p className="text-base mb-2 text-primary font-semibold">
                  {t('clicker.dhikr.reminder')}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('clicker.clicks.remaining')}: <span className="font-bold text-primary">{clicksRemaining}</span>
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-secondary rounded-full h-3 mb-6">
                <div 
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              {/* Gift package */}
              <div className="mb-6">
                <Button
                  onClick={handleClick}
                  size="lg"
                  className="w-32 h-32 rounded-full text-6xl hover:scale-110 transition-transform duration-200 bg-gradient-to-br from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
                >
                  <Gift className="w-16 h-16" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                {clicks > 0 && t('clicker.clicked.times').replace('{count}', clicks.toString())}
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-4 text-primary">{t('clicker.gift.opened')}</h3>
              </div>

              {currentHadithIndex && (
                <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                  <blockquote className="text-lg italic mb-3 text-foreground">
                    "{t(`hadith.${currentHadithIndex}.text`)}"
                  </blockquote>
                  <cite className="text-sm font-semibold text-primary">
                    - {t(`hadith.${currentHadithIndex}.source`)}
                  </cite>
                </div>
              )}

              <Button onClick={resetGame} variant="outline" className="mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                {t('clicker.open.another')}
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClickerGame;