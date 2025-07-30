import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Play, Pause, SkipBack, SkipForward, Volume2, X, BookOpen, Settings, Minus, Maximize2 } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface QuranReaderProps {
  onClose: () => void;
  isVisible: boolean;
}

interface Surah {
  number: number;
  name: string;
  englishName: string;
  verses: number;
}

// Sample surahs data - in a real app, this would come from an API
const surahs: Surah[] = [
  { number: 1, name: "الفاتحة", englishName: "Al-Fatihah", verses: 7 },
  { number: 2, name: "البقرة", englishName: "Al-Baqarah", verses: 286 },
  { number: 3, name: "آل عمران", englishName: "Ali 'Imran", verses: 200 },
  { number: 112, name: "الإخلاص", englishName: "Al-Ikhlas", verses: 4 },
  { number: 113, name: "الفلق", englishName: "Al-Falaq", verses: 5 },
  { number: 114, name: "الناس", englishName: "An-Nas", verses: 6 },
];

// Sample verse data for Al-Fatihah - using translation keys
const getSampleVerses = (t: (key: string) => string) => [
  {
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: t('quran.1.1.transliteration'),
    translation: t('quran.1.1.translation')
  },
  {
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    transliteration: t('quran.1.2.transliteration'),
    translation: t('quran.1.2.translation')
  },
  {
    arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: t('quran.1.3.transliteration'),
    translation: t('quran.1.3.translation')
  },
  {
    arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
    transliteration: t('quran.1.4.transliteration'),
    translation: t('quran.1.4.translation')
  },
  {
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: t('quran.1.5.transliteration'),
    translation: t('quran.1.5.translation')
  },
  {
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    transliteration: t('quran.1.6.transliteration'),
    translation: t('quran.1.6.translation')
  },
  {
    arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    transliteration: t('quran.1.7.transliteration'),
    translation: t('quran.1.7.translation')
  }
];

export const QuranReader = ({ onClose, isVisible }: QuranReaderProps) => {
  const { t } = useTranslation();
  const [selectedSurah, setSelectedSurah] = useState<string>("1");
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [audioVolume, setAudioVolume] = useState([75]);
  const [verses] = useState(() => getSampleVerses(t));
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [recitationSpeed, setRecitationSpeed] = useState([100]); // 100% = normal speed
  const [wordRepeatCount, setWordRepeatCount] = useState(1);
  const [verseRepeatCount, setVerseRepeatCount] = useState(1);
  const [surahRepeatCount, setSurahRepeatCount] = useState(1);
  const [currentWordRepeat, setCurrentWordRepeat] = useState(0);
  const [currentVerseRepeat, setCurrentVerseRepeat] = useState(0);
  const [currentSurahRepeat, setCurrentSurahRepeat] = useState(0);
  const [clickedWordIndex, setClickedWordIndex] = useState<number | null>(null);
  const [isWordClickMode, setIsWordClickMode] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAudioPlayer, setShowAudioPlayer] = useState(true);
  
  const audioRef = useRef<HTMLAudioElement>(null);

  const selectedSurahData = surahs.find(s => s.number.toString() === selectedSurah);

  // Simulate word-by-word reading with speed and repetition control
  const simulateReading = () => {
    if (!isAutoReading) return;
    
    const currentVerseText = verses[currentVerse]?.arabic || "";
    const words = currentVerseText.split(" ");
    
    // Calculate delay based on speed (100% = 800ms, 50% = 1600ms, 200% = 400ms)
    const baseDelay = 800;
    const speedMultiplier = recitationSpeed[0] / 100;
    const wordDelay = baseDelay / speedMultiplier;
    
    // Handle word repetition
    if (currentWordRepeat < wordRepeatCount - 1) {
      setTimeout(() => {
        setCurrentWordRepeat(prev => prev + 1);
      }, wordDelay);
      return;
    }
    
    // Move to next word or handle verse completion
    if (currentWordIndex < words.length - 1) {
      setTimeout(() => {
        setCurrentWordIndex(prev => prev + 1);
        setCurrentWordRepeat(0);
      }, wordDelay);
    } else {
      // Handle verse repetition
      if (currentVerseRepeat < verseRepeatCount - 1) {
        setTimeout(() => {
          setCurrentWordIndex(0);
          setCurrentWordRepeat(0);
          setCurrentVerseRepeat(prev => prev + 1);
        }, wordDelay * 1.5);
        return;
      }
      
      // Move to next verse or handle surah completion
      if (currentVerse < verses.length - 1) {
        setTimeout(() => {
          setCurrentVerse(prev => prev + 1);
          setCurrentWordIndex(0);
          setCurrentWordRepeat(0);
          setCurrentVerseRepeat(0);
        }, wordDelay * 2);
      } else {
        // Handle surah repetition
        if (currentSurahRepeat < surahRepeatCount - 1) {
          setTimeout(() => {
            setCurrentVerse(0);
            setCurrentWordIndex(0);
            setCurrentWordRepeat(0);
            setCurrentVerseRepeat(0);
            setCurrentSurahRepeat(prev => prev + 1);
          }, wordDelay * 3);
        } else {
          // Finished all repetitions
          setIsAutoReading(false);
          setIsPlaying(false);
          setCurrentSurahRepeat(0);
        }
      }
    }
  };

  const handlePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsAutoReading(false);
        setIsWordClickMode(false);
        setClickedWordIndex(null);
      } else {
        // In a real app, this would load the actual audio file
        // audioRef.current.src = `/quran-audio/mishary/${selectedSurah}/${currentVerse + 1}.mp3`;
        audioRef.current.play();
        setIsAutoReading(true);
        setIsWordClickMode(false);
        setCurrentWordIndex(0);
        setCurrentWordRepeat(0);
        setCurrentVerseRepeat(0);
        setCurrentSurahRepeat(0);
        setClickedWordIndex(null);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextVerse = () => {
    if (currentVerse < verses.length - 1) {
      setCurrentVerse(currentVerse + 1);
      setCurrentWordIndex(0);
      setCurrentWordRepeat(0);
      setCurrentVerseRepeat(0);
      setIsPlaying(false);
      setIsAutoReading(false);
      setIsWordClickMode(false);
      setClickedWordIndex(null);
    }
  };

  const prevVerse = () => {
    if (currentVerse > 0) {
      setCurrentVerse(currentVerse - 1);
      setCurrentWordIndex(0);
      setCurrentWordRepeat(0);
      setCurrentVerseRepeat(0);
      setIsPlaying(false);
      setIsAutoReading(false);
      setIsWordClickMode(false);
      setClickedWordIndex(null);
    }
  };

  // Handle clicking on a specific word
  const handleWordClick = (verseIndex: number, wordIndex: number) => {
    if (verseIndex === currentVerse) {
      // Set up word click mode
      setIsWordClickMode(true);
      setClickedWordIndex(wordIndex);
      setCurrentWordIndex(wordIndex);
      setCurrentWordRepeat(0);
      setIsAutoReading(true);
      setIsPlaying(true);
      
      // Stop any existing audio and start word repetition
      if (audioRef.current) {
        audioRef.current.play();
      }
    }
  };

  // Enhanced word repetition for clicked words
  const simulateWordClickRepetition = () => {
    if (!isWordClickMode || clickedWordIndex === null) return;
    
    const baseDelay = 800;
    const speedMultiplier = recitationSpeed[0] / 100;
    const wordDelay = baseDelay / speedMultiplier;
    
    if (currentWordRepeat < wordRepeatCount - 1) {
      setTimeout(() => {
        setCurrentWordRepeat(prev => prev + 1);
      }, wordDelay);
    } else {
      // Finished repeating the clicked word
      setTimeout(() => {
        setIsWordClickMode(false);
        setClickedWordIndex(null);
        setIsAutoReading(false);
        setIsPlaying(false);
      }, wordDelay);
    }
  };

  // Word highlighting rendering helper with click functionality
  const renderHighlightedText = (arabicText: string, verseIndex: number) => {
    const words = arabicText.split(" ");
    
    return words.map((word, wordIndex) => {
      const isCurrentVerse = verseIndex === currentVerse;
      const isCurrentWord = isCurrentVerse && wordIndex === currentWordIndex && (isAutoReading || isWordClickMode);
      const isPastWord = isCurrentVerse && wordIndex < currentWordIndex && isAutoReading && !isWordClickMode;
      const isClickedWord = isCurrentVerse && wordIndex === clickedWordIndex && isWordClickMode;
      
      return (
        <span
          key={wordIndex}
          onClick={() => handleWordClick(verseIndex, wordIndex)}
          className={`inline-block transition-all duration-300 cursor-pointer hover:scale-105 hover:text-accent ${
            isClickedWord 
              ? 'bg-accent text-accent-foreground px-1 rounded scale-110 shadow-glow animate-pulse ring-2 ring-accent' 
              : isCurrentWord 
              ? 'bg-accent/80 text-accent-foreground px-1 rounded scale-105 shadow-glow ring-1 ring-accent' 
              : isPastWord 
              ? 'text-accent/70'
              : isCurrentVerse
              ? 'hover:bg-accent/20 hover:px-1 hover:rounded'
              : 'hover:bg-accent/10'
          }`}
          style={{
            marginRight: wordIndex > 0 ? '0.5rem' : '0'
          }}
          title={`Click to repeat this word ${wordRepeatCount} time(s)`}
        >
          {word}
        </span>
      );
    });
  };

  useEffect(() => {
    if (isAutoReading && isPlaying) {
      if (isWordClickMode) {
        simulateWordClickRepetition();
      } else {
        simulateReading();
      }
    }
  }, [currentWordIndex, currentVerse, isAutoReading, isPlaying, currentWordRepeat, currentVerseRepeat, isWordClickMode]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume[0] / 100;
    }
  }, [audioVolume]);

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-4 right-4 bg-card border border-border rounded-lg shadow-lg transition-all duration-300 z-50 ${
      isMinimized ? 'w-80 h-16' : 'w-[95vw] max-w-4xl h-[70vh]'
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-card/95 backdrop-blur-sm rounded-t-lg">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-card-foreground">
            {isMinimized ? 'القرآن الكريم' : `${t('quran.title')} - القرآن الكريم`}
          </span>
          {isPlaying && isMinimized && (
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Settings className="w-3 h-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="end">
              <div className="space-y-3">
                <h4 className="font-medium text-sm">Recitation Settings</h4>
                
                {/* Speed Control */}
                <div>
                  <label className="text-xs text-card-foreground mb-1 block">
                    Speed: {recitationSpeed[0]}%
                  </label>
                  <Slider
                    value={recitationSpeed}
                    onValueChange={setRecitationSpeed}
                    max={200}
                    min={25}
                    step={25}
                    className="flex-1"
                  />
                </div>

                {/* Word Repetition */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Repeat words:</span>
                  <div className="flex items-center gap-1">
                    <Button
                      onClick={() => setWordRepeatCount(Math.max(1, wordRepeatCount - 1))}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      -
                    </Button>
                    <span className="text-xs min-w-6 text-center">{wordRepeatCount}x</span>
                    <Button
                      onClick={() => setWordRepeatCount(Math.min(10, wordRepeatCount + 1))}
                      variant="outline"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Audio Player Toggle */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show audio player:</span>
                  <Switch
                    checked={showAudioPlayer}
                    onCheckedChange={setShowAudioPlayer}
                  />
                </div>

                {/* Display Options */}
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show transliteration:</span>
                  <Switch
                    checked={showTransliteration}
                    onCheckedChange={setShowTransliteration}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs">Show translation:</span>
                  <Switch
                    checked={showTranslation}
                    onCheckedChange={setShowTranslation}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
          
          <Button
            onClick={() => setIsMinimized(!isMinimized)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            {isMinimized ? <Maximize2 className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
          </Button>
          
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-muted-foreground hover:text-card-foreground"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Content Area */}
      {!isMinimized && (
        <div className="flex flex-col h-[calc(70vh-4rem)] p-3">
          {/* Surah Selection */}
          <div className="mb-3">
            <Select value={selectedSurah} onValueChange={setSelectedSurah}>
              <SelectTrigger className="text-sm w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card border-border z-50">
                {surahs.map((surah) => (
                  <SelectItem key={surah.number} value={surah.number.toString()}>
                    {surah.number}. {surah.name} ({surah.englishName})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audio Player (conditionally shown) */}
          {showAudioPlayer && (
            <div className="mb-3 p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Button onClick={prevVerse} variant="outline" size="sm" disabled={currentVerse === 0}>
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button onClick={handlePlay} variant="default" size="sm">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button onClick={nextVerse} variant="outline" size="sm" disabled={currentVerse === verses.length - 1}>
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-muted-foreground" />
                <Slider
                  value={audioVolume}
                  onValueChange={setAudioVolume}
                  max={100}
                  min={0}
                  step={1}
                  className="flex-1"
                />
                <span className="text-xs text-muted-foreground min-w-8">
                  {audioVolume[0]}%
                </span>
              </div>
            </div>
          )}

          {/* Qur'an Text */}
          <div className="flex-1 bg-gradient-to-br from-background to-secondary/20 rounded-lg p-4 overflow-y-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {selectedSurahData?.name}
              </h2>
              <p className="text-lg text-accent font-semibold">
                {selectedSurahData?.englishName}
              </p>
            </div>

            <div className="space-y-6">
              {verses.map((verse, index) => (
                <div 
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all duration-500 ${
                    index === currentVerse 
                      ? 'bg-accent/10 border-accent shadow-glow ring-2 ring-accent/30 transform scale-[1.02]' 
                      : 'bg-card border-border hover:border-accent/30'
                  }`}
                >
                  <div className="text-right mb-3" dir="rtl">
                    <p className="text-xl leading-relaxed text-foreground font-arabic" style={{ direction: 'rtl', textAlign: 'right' }}>
                      {renderHighlightedText(verse.arabic, index)}
                    </p>
                  </div>
                  
                  {showTransliteration && (
                    <div className="mb-2">
                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                        {verse.transliteration}
                      </p>
                    </div>
                  )}
                  
                  {showTranslation && (
                    <div>
                      <p className="text-sm text-card-foreground leading-relaxed">
                        {verse.translation}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-border/50">
                    <span className="text-xs text-muted-foreground">
                      Verse {index + 1}
                    </span>
                    <Button
                      onClick={() => setCurrentVerse(index)}
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent-foreground h-6"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Play
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element - in production, this would have actual audio sources */}
      <audio
        ref={audioRef}
        onEnded={() => {
          setIsPlaying(false);
          if (currentVerse < verses.length - 1) {
            setCurrentVerse(currentVerse + 1);
          }
        }}
      />
    </div>
  );
};