import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Play, Pause, SkipBack, SkipForward, Volume2, X, BookOpen } from 'lucide-react';

interface QuranReaderProps {
  onClose: () => void;
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

// Sample verse data for Al-Fatihah
const sampleVerses = [
  {
    arabic: "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: "Bismillahi r-rahmani r-raheem",
    translation: "In the name of Allah, the Entirely Merciful, the Especially Merciful."
  },
  {
    arabic: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَٰلَمِينَ",
    transliteration: "Alhamdu lillahi rabbi l-'alameen",
    translation: "All praise is due to Allah, Lord of the worlds."
  },
  {
    arabic: "ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
    transliteration: "Ar-rahmani r-raheem",
    translation: "The Entirely Merciful, the Especially Merciful."
  },
  {
    arabic: "مَٰلِكِ يَوْمِ ٱلدِّينِ",
    transliteration: "Maliki yawmi d-deen",
    translation: "Sovereign of the Day of Recompense."
  },
  {
    arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
    transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
    translation: "It is You we worship and You we ask for help."
  },
  {
    arabic: "ٱهْدِنَا ٱلصِّرَٰطَ ٱلْمُسْتَقِيمَ",
    transliteration: "Ihdina s-sirata l-mustaqeem",
    translation: "Guide us to the straight path."
  },
  {
    arabic: "صِرَٰطَ ٱلَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ ٱلْمَغْضُوبِ عَلَيْهِمْ وَلَا ٱلضَّآلِّينَ",
    transliteration: "Sirata l-ladheena an'amta 'alayhim ghayri l-maghdoobi 'alayhim wa la d-dalleen",
    translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray."
  }
];

export const QuranReader = ({ onClose }: QuranReaderProps) => {
  const [selectedSurah, setSelectedSurah] = useState<string>("1");
  const [currentVerse, setCurrentVerse] = useState(0);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showTranslation, setShowTranslation] = useState(true);
  const [audioVolume, setAudioVolume] = useState([75]);
  const [verses] = useState(sampleVerses);
  const [isAutoReading, setIsAutoReading] = useState(false);
  const [recitationSpeed, setRecitationSpeed] = useState([100]); // 100% = normal speed
  const [wordRepeatCount, setWordRepeatCount] = useState(1);
  const [verseRepeatCount, setVerseRepeatCount] = useState(1);
  const [surahRepeatCount, setSurahRepeatCount] = useState(1);
  const [currentWordRepeat, setCurrentWordRepeat] = useState(0);
  const [currentVerseRepeat, setCurrentVerseRepeat] = useState(0);
  const [currentSurahRepeat, setCurrentSurahRepeat] = useState(0);
  
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
      } else {
        // In a real app, this would load the actual audio file
        // audioRef.current.src = `/quran-audio/mishary/${selectedSurah}/${currentVerse + 1}.mp3`;
        audioRef.current.play();
        setIsAutoReading(true);
        setCurrentWordIndex(0);
        setCurrentWordRepeat(0);
        setCurrentVerseRepeat(0);
        setCurrentSurahRepeat(0);
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
    }
  };

  // Word highlighting rendering helper
  const renderHighlightedText = (arabicText: string, verseIndex: number) => {
    const words = arabicText.split(" ");
    
    return words.map((word, wordIndex) => {
      const isCurrentVerse = verseIndex === currentVerse;
      const isCurrentWord = isCurrentVerse && wordIndex === currentWordIndex && isAutoReading;
      const isPastWord = isCurrentVerse && wordIndex < currentWordIndex && isAutoReading;
      
      return (
        <span
          key={wordIndex}
          className={`inline-block transition-all duration-300 ${
            isCurrentWord 
              ? 'bg-accent text-accent-foreground px-1 rounded scale-110 shadow-glow animate-pulse ring-2 ring-accent' 
              : isPastWord 
              ? 'text-accent/70'
              : ''
          }`}
          style={{
            marginLeft: wordIndex > 0 ? '0.5rem' : '0'
          }}
        >
          {word}
        </span>
      );
    });
  };

  useEffect(() => {
    if (isAutoReading && isPlaying) {
      simulateReading();
    }
  }, [currentWordIndex, currentVerse, isAutoReading, isPlaying, currentWordRepeat, currentVerseRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = audioVolume[0] / 100;
    }
  }, [audioVolume]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden bg-card border-border">
        <DialogHeader className="border-b border-border pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-3 text-2xl text-card-foreground">
              <BookOpen className="w-6 h-6 text-accent" />
              القرآن الكريم - Noble Qur'an
            </DialogTitle>
            <Button
              onClick={onClose}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-card-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex gap-6 h-[70vh]">
          {/* Controls Panel */}
          <div className="w-80 space-y-6">
            {/* Surah Selection */}
            <Card className="p-4">
              <h3 className="font-semibold text-card-foreground mb-3">Select Surah</h3>
              <Select value={selectedSurah} onValueChange={setSelectedSurah}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {surahs.map((surah) => (
                    <SelectItem key={surah.number} value={surah.number.toString()}>
                      {surah.number}. {surah.name} ({surah.englishName})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Card>

            {/* Audio Controls */}
            <Card className="p-4">
              <h3 className="font-semibold text-card-foreground mb-3">Audio Player</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2">
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
                  <span className="text-sm text-muted-foreground min-w-8">
                    {audioVolume[0]}%
                  </span>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Reciter: Sheikh Mishary bin Rashid Al-Afasy | Word-by-word highlighting enabled
                </p>
              </div>
            </Card>

            {/* Speed & Repetition Controls */}
            <Card className="p-4">
              <h3 className="font-semibold text-card-foreground mb-3">Recitation Settings</h3>
              <div className="space-y-4">
                {/* Speed Control */}
                <div>
                  <label className="text-sm text-card-foreground mb-2 block">
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
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Slow</span>
                    <span>Normal</span>
                    <span>Fast</span>
                  </div>
                </div>

                {/* Word Repetition */}
                <div>
                  <label className="text-sm text-card-foreground mb-2 block">
                    Repeat each word:
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setWordRepeatCount(Math.max(1, wordRepeatCount - 1))}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="text-sm min-w-8 text-center">{wordRepeatCount}x</span>
                    <Button
                      onClick={() => setWordRepeatCount(Math.min(10, wordRepeatCount + 1))}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Verse Repetition */}
                <div>
                  <label className="text-sm text-card-foreground mb-2 block">
                    Repeat each verse:
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setVerseRepeatCount(Math.max(1, verseRepeatCount - 1))}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="text-sm min-w-8 text-center">{verseRepeatCount}x</span>
                    <Button
                      onClick={() => setVerseRepeatCount(Math.min(10, verseRepeatCount + 1))}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>

                {/* Surah Repetition */}
                <div>
                  <label className="text-sm text-card-foreground mb-2 block">
                    Repeat entire surah:
                  </label>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setSurahRepeatCount(Math.max(1, surahRepeatCount - 1))}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      -
                    </Button>
                    <span className="text-sm min-w-8 text-center">{surahRepeatCount}x</span>
                    <Button
                      onClick={() => setSurahRepeatCount(Math.min(10, surahRepeatCount + 1))}
                      variant="outline"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Display Options */}
            <Card className="p-4">
              <h3 className="font-semibold text-card-foreground mb-3">Display Options</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-card-foreground">Show Transliteration</label>
                  <Switch 
                    checked={showTransliteration} 
                    onCheckedChange={setShowTransliteration}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <label className="text-sm text-card-foreground">Show Translation</label>
                  <Switch 
                    checked={showTranslation} 
                    onCheckedChange={setShowTranslation}
                  />
                </div>
              </div>
            </Card>

            {/* Progress */}
            <Card className="p-4">
              <h3 className="font-semibold text-card-foreground mb-2">Progress</h3>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Verse {currentVerse + 1} of {verses.length}
                </p>
                {isAutoReading && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>Word repetition: {currentWordRepeat + 1}/{wordRepeatCount}</p>
                    <p>Verse repetition: {currentVerseRepeat + 1}/{verseRepeatCount}</p>
                    <p>Surah repetition: {currentSurahRepeat + 1}/{surahRepeatCount}</p>
                  </div>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <div 
                  className="bg-accent h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentVerse + 1) / verses.length) * 100}%` }}
                />
              </div>
            </Card>
          </div>

          {/* Qur'an Text */}
          <div className="flex-1 bg-gradient-to-br from-background to-secondary/20 rounded-lg p-8 overflow-y-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {selectedSurahData?.name}
              </h2>
              <p className="text-lg text-accent font-semibold">
                {selectedSurahData?.englishName}
              </p>
            </div>

            <div className="space-y-8">
              {verses.map((verse, index) => (
                <div 
                  key={index}
                  className={`p-6 rounded-lg border-2 transition-all duration-500 ${
                    index === currentVerse 
                      ? 'bg-accent/10 border-accent shadow-glow ring-2 ring-accent/30 transform scale-[1.02]' 
                      : 'bg-card border-border hover:border-accent/30'
                  }`}
                >
                  <div className="text-right mb-4">
                    <p className="text-2xl leading-relaxed text-foreground font-arabic">
                      {renderHighlightedText(verse.arabic, index)}
                    </p>
                  </div>
                  
                  {showTransliteration && (
                    <div className="mb-3">
                      <p className="text-lg italic text-muted-foreground leading-relaxed">
                        {verse.transliteration}
                      </p>
                    </div>
                  )}
                  
                  {showTranslation && (
                    <div>
                      <p className="text-base text-card-foreground leading-relaxed">
                        {verse.translation}
                      </p>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-border/50">
                    <span className="text-sm text-muted-foreground">
                      Verse {index + 1}
                    </span>
                    <Button
                      onClick={() => setCurrentVerse(index)}
                      variant="ghost"
                      size="sm"
                      className="text-accent hover:text-accent-foreground"
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
      </DialogContent>
    </Dialog>
  );
};