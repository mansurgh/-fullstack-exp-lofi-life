import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Gift, RotateCcw } from 'lucide-react';

const ClickerGame = () => {
  const [clicks, setClicks] = useState(0);
  const [isOpened, setIsOpened] = useState(false);
  const [currentHadith, setCurrentHadith] = useState<{text: string, source: string} | null>(null);
  const [lastHadithIndex, setLastHadithIndex] = useState<number | null>(null);

  const ahadith = [
    {
      text: "The believer is not one who eats his fill while his neighbor goes hungry.",
      source: "Al-Bukhari"
    },
    {
      text: "None of you believes until he loves for his brother what he loves for himself.",
      source: "Al-Bukhari"
    },
    {
      text: "The best of people are those who benefit others.",
      source: "Al-Bukhari"
    },
    {
      text: "Whoever believes in Allah and the Last Day should speak good or remain silent.",
      source: "Al-Bukhari"
    },
    {
      text: "The world is green and beautiful, and Allah has appointed you as His stewards over it.",
      source: "Muslim"
    },
    {
      text: "A good word is charity.",
      source: "Al-Bukhari"
    },
    {
      text: "The strong person is not the one who can wrestle someone else down. The strong person is the one who can control himself when he is angry.",
      source: "Al-Bukhari"
    },
    {
      text: "Whoever does not show mercy to people, Allah will not show mercy to him.",
      source: "Al-Bukhari"
    },
    {
      text: "The best charity is that given when one has little.",
      source: "Al-Bukhari"
    },
    {
      text: "Kindness is a mark of faith, and whoever is not kind has no faith.",
      source: "Muslim"
    }
  ];

  const handleClick = () => {
    if (isOpened) return;
    
    const newClicks = clicks + 1;
    setClicks(newClicks);
    
    if (newClicks >= 100) {
      setIsOpened(true);
      // Ensure we get a different hadith each time
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * ahadith.length);
      } while (randomIndex === lastHadithIndex && ahadith.length > 1);
      
      setLastHadithIndex(randomIndex);
      setCurrentHadith(ahadith[randomIndex]);
    }
  };

  const resetGame = () => {
    setClicks(0);
    setIsOpened(false);
    setCurrentHadith(null);
  };

  const clicksRemaining = Math.max(0, 100 - clicks);
  const progress = (clicks / 100) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-card/90 backdrop-blur-sm">
        <CardContent className="p-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-primary">Clicker Arcade</h2>
          
          {!isOpened ? (
            <>
              <div className="mb-6">
                <p className="text-lg mb-4 text-muted-foreground">
                  Click the gift package to open it!
                </p>
                <p className="text-base mb-2 text-primary font-semibold">
                  Never forget to do dhikr
                </p>
                <p className="text-sm text-muted-foreground">
                  Clicks remaining: <span className="font-bold text-primary">{clicksRemaining}</span>
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
                {clicks > 0 && `You've clicked ${clicks} times!`}
              </p>
            </>
          ) : (
            <>
              <div className="mb-6">
                <div className="text-6xl mb-4">🎁</div>
                <h3 className="text-2xl font-bold mb-4 text-primary">Gift Opened!</h3>
              </div>

              {currentHadith && (
                <div className="bg-secondary/50 rounded-lg p-6 mb-6">
                  <blockquote className="text-lg italic mb-3 text-foreground">
                    "{currentHadith.text}"
                  </blockquote>
                  <cite className="text-sm font-semibold text-primary">
                    - {currentHadith.source}
                  </cite>
                </div>
              )}

              <Button onClick={resetGame} variant="outline" className="mt-4">
                <RotateCcw className="w-4 h-4 mr-2" />
                Open Another Gift
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClickerGame;