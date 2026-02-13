import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from '@/contexts/TranslationContext';
import { ChevronLeft, ChevronRight, Copy, Loader2, Share2, X } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface HadithReaderProps {
  isVisible: boolean;
  onClose: () => void;
  collection: 'bukhari' | 'muslim';
}

interface Hadith {
  id: number;
  arabic: string;
  transliteration: string;
  translation: string;
  narrator: string;
  reference: string;
  arabicWords?: string[];
  transliterationWords?: string[];
  translationWords?: string[];
}

// Fallback hadith data in case API fails
const fallbackHadith: Record<string, Hadith[]> = {
  bukhari: [
    {
      id: 1,
      arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
      transliteration: 'Innama al-a\'malu bin-niyyat, wa innama li-kulli mri\'in ma nawa',
      translation: 'Actions are only by intention, and every person will only have what they intended.',
      narrator: 'Umar ibn al-Khattab',
      reference: 'Bukhari 1',
    },
    {
      id: 2,
      arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
      transliteration: 'Man kana yu\'minu billahi wal-yawm al-akhir falyaqul khayran aw liyasmut',
      translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
      narrator: 'Abu Hurairah',
      reference: 'Bukhari 6018',
    },
    {
      id: 3,
      arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
      transliteration: 'Al-muslim man salima al-muslimun min lisanihi wa yadihi',
      translation: 'A Muslim is one from whose tongue and hand the Muslims are safe.',
      narrator: 'Abdullah ibn Amr',
      reference: 'Bukhari 10',
    },
    {
      id: 4,
      arabic: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ وَإِقَامِ الصَّلَاةِ وَإِيتَاءِ الزَّكَاةِ وَالْحَجِّ وَصَوْمِ رَمَضَانَ',
      transliteration: 'Buniya al-islamu \'ala khams: shahadati an la ilaha illa Allah wa anna Muhammadan rasul Allah, wa iqam as-salah, wa ita\' az-zakah, wal-hajj, wa sawm Ramadan',
      translation: 'Islam is built on five: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, giving charity, pilgrimage, and fasting Ramadan.',
      narrator: 'Abdullah ibn Umar',
      reference: 'Bukhari 8',
    },
    {
      id: 5,
      arabic: 'مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى',
      transliteration: 'Mathalu al-mu\'minin fi tawaddihim wa tarahhumihim wa ta\'atufihim mathalu al-jasad idha ishtaka minhu \'udwun tada\'a lahu sa\'ir al-jasad bil-sahar wal-humma',
      translation: 'The example of the believers in their affection, mercy, and compassion for each other is that of a body. When a limb suffers, the whole body responds to it with wakefulness and fever.',
      narrator: 'An-Nu\'man ibn Bashir',
      reference: 'Bukhari 6011',
    },
  ],
  muslim: [
    {
      id: 1,
      arabic: 'الدِّينُ النَّصِيحَةُ قُلْنَا لِمَنْ قَالَ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ',
      transliteration: 'Ad-dinu an-nasihah, qulna: liman? Qal: lillahi wa li-kitabihi wa li-rasulihi wa li-a\'immati al-muslimina wa \'ammatihim',
      translation: 'Religion is sincere advice. We asked: To whom? He said: To Allah, His Book, His Messenger, the leaders of the Muslims and their common folk.',
      narrator: 'Tamim ibn Aws ad-Dari',
      reference: 'Muslim 55',
    },
    {
      id: 2,
      arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
      transliteration: 'La yu\'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsihi',
      translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
      narrator: 'Anas ibn Malik',
      reference: 'Muslim 45',
    },
    {
      id: 3,
      arabic: 'إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ',
      transliteration: 'Inna Allah kataba al-ihsan \'ala kulli shay\'',
      translation: 'Indeed, Allah has prescribed excellence in everything.',
      narrator: 'Shaddad ibn Aws',
      reference: 'Muslim 1955',
    },
    {
      id: 4,
      arabic: 'مَنْ صَلَّى الْفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ',
      transliteration: 'Man salla al-fajr fa-huwa fi dhimmat Allah',
      translation: 'Whoever prays Fajr is under Allah\'s protection.',
      narrator: 'Jundub ibn Abdullah',
      reference: 'Muslim 657',
    },
    {
      id: 5,
      arabic: 'إِذَا أَحَبَّ اللَّهُ عَبْدًا نَادَى جِبْرِيلَ إِنَّ اللَّهَ يُحِبُّ فُلَانًا فَأَحْبِبْهُ فَيُحِبُّهُ جِبْرِيلُ',
      transliteration: 'Idha ahabb Allah \'abdan nada Jibril: inna Allah yuhibbu fulanan fa-ahibbah, fa-yuhibbuhu Jibril',
      translation: 'When Allah loves a servant, He calls to Gabriel: "Indeed, Allah loves so-and-so, so love him," and Gabriel loves him.',
      narrator: 'Abu Hurairah',
      reference: 'Muslim 2637',
    },
  ],
};

// API slug mapping
const collectionSlugs: Record<string, string> = {
  bukhari: 'bukhari',
  muslim: 'muslim',
};

const collectionNames: Record<string, string> = {
  bukhari: 'Sahih al-Bukhari',
  muslim: 'Sahih Muslim',
};

// Cache for API hadith
const hadithCache = new Map<string, Hadith[]>();

// Muslim hadith #1-92 are empty introduction entries, real content starts at #93
const COLLECTION_OFFSET: Record<string, number> = { bukhari: 0, muslim: 92 };
const COLLECTION_TOTALS: Record<string, number> = { bukhari: 7275, muslim: 7190 };

async function fetchHadithFromAPI(collection: string, page: number, limit: number = 10): Promise<{ hadith: Hadith[], total: number }> {
  const cacheKey = `${collection}_${page}_${limit}`;
  if (hadithCache.has(cacheKey)) {
    return { hadith: hadithCache.get(cacheKey)!, total: COLLECTION_TOTALS[collection] || 7000 };
  }

  try {
    const slug = collectionSlugs[collection];
    const offset = COLLECTION_OFFSET[collection] || 0;
    const start = (page - 1) * limit + 1 + offset; // skip intro entries
    const hadithList: Hadith[] = [];

    // Fetch in smaller batches of 5 to reduce load
    const BATCH = 5;
    for (let b = 0; b < limit; b += BATCH) {
      const batchSize = Math.min(BATCH, limit - b);
      const engBatch = [];
      const arBatch = [];
      for (let i = 0; i < batchSize; i++) {
        const num = start + b + i;
        engBatch.push(
          fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/eng-${slug}/${num}.json`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        );
        arBatch.push(
          fetch(`https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/ara-${slug}/${num}.json`)
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
        );
      }

      const [engResults, arResults] = await Promise.all([
        Promise.all(engBatch),
        Promise.all(arBatch),
      ]);

      for (let idx = 0; idx < engResults.length; idx++) {
        const data = engResults[idx];
        const arabicData = arResults[idx];
        if (!data) continue;

        // hadiths is an array — take first element
        const h = Array.isArray(data.hadiths) ? data.hadiths[0] : data.hadiths;
        const ar = arabicData?.hadiths ? (Array.isArray(arabicData.hadiths) ? arabicData.hadiths[0] : arabicData.hadiths) : null;

        if (!h) continue;

        const arabicText = ar?.text || '';
        const translationText = h.text || '';

        // Skip empty hadith (e.g. Muslim introduction entries)
        if (!translationText && !arabicText) continue;

        const hadithNum = start + b + idx;
        const ref = `${collectionNames[collection]} ${h.hadithnumber || h.reference?.hadith || hadithNum}`;

        hadithList.push({
          id: hadithNum,
          arabic: arabicText,
          transliteration: '',
          translation: translationText,
          narrator: '',
          reference: ref,
          arabicWords: arabicText ? arabicText.split(/\s+/) : undefined,
          translationWords: translationText ? translationText.split(/\s+/) : undefined,
        });
      }
    }

    if (hadithList.length > 0) {
      hadithCache.set(cacheKey, hadithList);
      return { hadith: hadithList, total: COLLECTION_TOTALS[collection] || 7000 };
    }
  } catch (err) {
    console.warn('Failed to fetch hadith from API:', err);
  }

  return { hadith: fallbackHadith[collection] || [], total: fallbackHadith[collection]?.length || 5 };
}

export const HadithReader: React.FC<HadithReaderProps> = ({ isVisible, onClose, collection }) => {
  const { t, language } = useTranslation();
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);
  const [hadithList, setHadithList] = useState<Hadith[]>(fallbackHadith[collection] || []);
  const [totalHadith, setTotalHadith] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showJumpDialog, setShowJumpDialog] = useState(false);
  const [jumpInput, setJumpInput] = useState('');
  const PAGE_SIZE = 10;

  const currentHadith = hadithList[currentHadithIndex % hadithList.length];

  // Load initial hadith from API
  const targetIndexRef = useRef<number | null>(null);
  const loadHadith = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const result = await fetchHadithFromAPI(collection, page, PAGE_SIZE);
      setHadithList(result.hadith);
      setTotalHadith(result.total);
      if (targetIndexRef.current !== null) {
        setCurrentHadithIndex(targetIndexRef.current);
        targetIndexRef.current = null;
      } else {
        setCurrentHadithIndex(0);
      }
    } catch {
      // Keep fallback data
    }
    setLoading(false);
  }, [collection]);

  useEffect(() => {
    if (isVisible) {
      loadHadith(currentPage);
    }
  }, [isVisible, currentPage, loadHadith]);

  const handleNext = () => {
    if (currentHadithIndex < hadithList.length - 1) {
      setCurrentHadithIndex(currentHadithIndex + 1);
    } else {
      // Load next page
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentHadithIndex > 0) {
      setCurrentHadithIndex(currentHadithIndex - 1);
    } else if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleJumpToHadith = () => {
    const num = parseInt(jumpInput, 10);
    const max = totalHadith || (collection === 'bukhari' ? 7275 : 7190);
    if (isNaN(num) || num < 1 || num > max) return;
    const targetPage = Math.ceil(num / PAGE_SIZE);
    const indexInPage = (num - 1) % PAGE_SIZE;
    targetIndexRef.current = indexInPage;
    if (targetPage === currentPage) {
      // Same page — just update index
      setCurrentHadithIndex(indexInPage);
      targetIndexRef.current = null;
    } else {
      setCurrentPage(targetPage);
    }
    setShowJumpDialog(false);
    setJumpInput('');
  };

  const handleCopy = async () => {
    const text = `${currentHadith.arabic}\n\n${currentHadith.transliteration}\n\n${currentHadith.translation}\n\n- ${currentHadith.narrator} (${currentHadith.reference})`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success(t('hadith.copied'));
    } catch {
      toast.error(t('hadith.copy.error'));
    }
  };

  const handleShare = async () => {
    const text = `${currentHadith.translation}\n\n- ${currentHadith.narrator} (${currentHadith.reference})`;
    if (navigator.share) {
      try {
        await navigator.share({ text });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  const handleWordClick = (wordIndex: number) => {
    setSelectedWordIndex(selectedWordIndex === wordIndex ? null : wordIndex);
  };

  const renderTextWithHighlight = (text: string, words: string[] | undefined, type: 'arabic' | 'transliteration' | 'translation') => {
    if (!words) {
      return <span>{text}</span>;
    }

    return (
      <span>
        {words.map((word, index) => (
          <span
            key={index}
            onClick={() => handleWordClick(index)}
            className={`cursor-pointer transition-colors duration-200 ${selectedWordIndex === index
              ? 'bg-amber-500/15 text-amber-200 font-medium rounded px-1'
              : 'hover:bg-muted/50 rounded px-1'
              }`}
            style={{
              marginLeft: type === 'arabic' ? '0.25rem' : '0',
              marginRight: type === 'arabic' ? '0' : '0.25rem'
            }}
          >
            {word}
          </span>
        ))}
      </span>
    );
  };

  // Reset word selection when hadith changes
  useEffect(() => {
    setSelectedWordIndex(null);
  }, [currentHadithIndex]);

  if (!isVisible) return null;

  const globalIndex = (currentPage - 1) * PAGE_SIZE + currentHadithIndex + 1;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
          <div>
            <h2 className="text-xl font-bold text-foreground">{collectionNames[collection]}</h2>
            <p className="text-sm text-muted-foreground">
              {loading ? t('quran.loading') : `${t('hadith.number')} ${globalIndex} ${t('hadith.of')} ${totalHadith || hadithList.length}`}
            </p>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : currentHadith ? (
          <div className="p-6 overflow-y-auto flex-1 min-h-0">
            {/* Arabic Text */}
            <div
              className="text-right mb-6 leading-relaxed font-arabic"
              style={{ fontSize: `${fontSize + 4}px`, lineHeight: 2.2, whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word' }}
              dir="rtl"
            >
              {renderTextWithHighlight(currentHadith.arabic, currentHadith.arabicWords, 'arabic')}
            </div>

            <Separator className="my-4" />

            {/* Transliteration */}
            {showTransliteration && (
              <>
                <div
                  className="mb-4 text-muted-foreground italic leading-relaxed"
                  style={{ fontSize: `${fontSize}px`, whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word' }}
                >
                  {renderTextWithHighlight(currentHadith.transliteration, currentHadith.transliterationWords, 'transliteration')}
                </div>
                <Separator className="my-4" />
              </>
            )}

            {/* Translation */}
            <div
              className="mb-6 leading-relaxed text-foreground"
              style={{ fontSize: `${fontSize}px`, whiteSpace: 'normal', overflowWrap: 'break-word', wordBreak: 'break-word' }}
            >
              {renderTextWithHighlight(currentHadith.translation, currentHadith.translationWords, 'translation')}
            </div>

            {/* Attribution */}
            <div className="text-sm text-white bg-gray-800/80 p-3 rounded-md border border-gray-600">
              {currentHadith.narrator && <p><strong className="text-gray-200">{t('hadith.narrator')}:</strong> <span className="text-white">{currentHadith.narrator}</span></p>}
              <p><strong className="text-gray-200">{t('hadith.reference')}:</strong> <span className="text-white">{currentHadith.reference}</span></p>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center text-muted-foreground">
            No hadith available.
          </div>
        )}
        <div className="border-t border-border p-4 space-y-4 shrink-0">
          {/* Settings */}
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">A</span>
                <Button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  disabled={fontSize <= 12}
                >
                  -
                </Button>
                <Button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 p-0"
                  disabled={fontSize >= 24}
                >
                  +
                </Button>
                <span className="text-xs text-muted-foreground">A</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={handleCopy}
                variant="outline"
                size="sm"
                className="text-xs h-8"
              >
                <Copy className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">{t('hadith.copy')}</span>
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="text-xs h-8"
              >
                <Share2 className="w-3 h-3 sm:mr-1" />
                <span className="hidden sm:inline">{t('hadith.share')}</span>
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentHadithIndex === 0 && currentPage === 1}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('hadith.previous')}
            </Button>

            <div className="flex items-center gap-2">
              {showJumpDialog ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min={1}
                    max={totalHadith || 7275}
                    value={jumpInput}
                    onChange={(e) => setJumpInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') handleJumpToHadith(); if (e.key === 'Escape') setShowJumpDialog(false); }}
                    placeholder="#"
                    className="w-20 h-8 text-sm text-center border border-border rounded bg-background px-2"
                    autoFocus
                  />
                  <Button onClick={handleJumpToHadith} variant="outline" size="sm" className="h-8 px-2">
                    OK
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={() => setShowJumpDialog(true)}
                  variant="ghost"
                  size="sm"
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  {globalIndex} / {totalHadith || hadithList.length}
                </Button>
              )}
            </div>

            <Button
              onClick={handleNext}
              disabled={loading}
              variant="outline"
              size="sm"
            >
              {t('hadith.next')}
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};