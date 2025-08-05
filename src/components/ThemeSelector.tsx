import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useTranslation } from '@/contexts/TranslationContext';
import { LanguageSelector } from './LanguageSelector';
import { 
  Sun, 
  Moon, 
  Flower, 
  TreePine, 
  Leaf, 
  Snowflake, 
  CloudRain,
  Palette
} from 'lucide-react';

type ThemeType = 'default' | 'spring' | 'summer' | 'autumn' | 'winter' | 'day' | 'night' | 'rainy';

const themes = {
  default: { name: 'Default', icon: Palette, color: 'text-primary' },
  spring: { name: 'Spring', icon: Flower, color: 'text-pink-500' },
  summer: { name: 'Summer', icon: Sun, color: 'text-green-500' },
  autumn: { name: 'Autumn', icon: Leaf, color: 'text-orange-500' },
  winter: { name: 'Winter', icon: Snowflake, color: 'text-blue-200' },
  day: { name: 'Day Cycle', icon: Sun, color: 'text-yellow-400' },
  night: { name: 'Night Cycle', icon: Moon, color: 'text-blue-300' },
  rainy: { name: 'Rainy Days', icon: CloudRain, color: 'text-gray-400' }
};

export const ThemeSelector = () => {
  const { t } = useTranslation();
  const [selectedTheme, setSelectedTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('selectedTheme');
    return (savedTheme as ThemeType) || 'default';
  });

  // Apply saved theme on component mount
  useEffect(() => {
    const applyTheme = (theme: ThemeType) => {
      // Remove all theme classes
      document.documentElement.classList.remove(
        'theme-spring', 'theme-summer', 'theme-autumn', 'theme-winter',
        'theme-day', 'theme-night', 'theme-rainy'
      );
      
      // Add new theme class
      if (theme !== 'default') {
        document.documentElement.classList.add(`theme-${theme}`);
      }
    };

    applyTheme(selectedTheme);
  }, [selectedTheme]);

  const handleThemeChange = (theme: ThemeType) => {
    setSelectedTheme(theme);
    localStorage.setItem('selectedTheme', theme);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Card className="w-full">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold mb-2">{t('theme.title')}</h3>
            <p className="text-sm text-muted-foreground">
              {t('theme.subtitle')}
            </p>
            <div className="flex justify-end mt-4">
              <LanguageSelector />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {Object.entries(themes).map(([key, theme]) => {
              const IconComponent = theme.icon;
              const isSelected = selectedTheme === key;
              
              return (
                <Button
                  key={key}
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => handleThemeChange(key as ThemeType)}
                  className={`h-auto py-4 px-3 flex flex-col items-center gap-2 ${
                    isSelected ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <IconComponent className={`h-5 w-5 ${theme.color}`} />
                  <span className="text-xs font-medium">{t(`theme.${key}`)}</span>
                </Button>
              );
            })}
          </div>
          
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              {t('theme.current')}: <span className="font-medium">{t(`theme.${selectedTheme}`)}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};