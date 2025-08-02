import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X, ChevronLeft, ChevronRight, Copy, Share2, Settings } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
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

const hadithCollections = {
  bukhari: {
    name: 'Sahih al-Bukhari',
    hadith: [
      {
        id: 1,
        arabic: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ، وَإِنَّمَا لِكُلِّ امْرِئٍ مَا نَوَى',
        transliteration: 'Innama al-a\'malu bin-niyyat, wa innama li-kulli mri\'in ma nawa',
        translation: 'Actions are only by intention, and every person will only have what they intended.',
        narrator: 'Umar ibn al-Khattab',
        reference: 'Bukhari 1',
        arabicWords: ['إِنَّمَا', 'الْأَعْمَالُ', 'بِالنِّيَّاتِ،', 'وَإِنَّمَا', 'لِكُلِّ', 'امْرِئٍ', 'مَا', 'نَوَى'],
        transliterationWords: ['Innama', 'al-a\'malu', 'bin-niyyat,', 'wa', 'innama', 'li-kulli', 'mri\'in', 'ma', 'nawa'],
        translationWords: ['Actions', 'are', 'only', 'by', 'intention,', 'and', 'every', 'person', 'will', 'only', 'have', 'what', 'they', 'intended.']
      },
      {
        id: 2,
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        transliteration: 'Man kana yu\'minu billahi wal-yawm al-akhir falyaqul khayran aw liyasmut',
        translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
        narrator: 'Abu Hurairah',
        reference: 'Bukhari 6018',
        arabicWords: ['مَنْ', 'كَانَ', 'يُؤْمِنُ', 'بِاللَّهِ', 'وَالْيَوْمِ', 'الْآخِرِ', 'فَلْيَقُلْ', 'خَيْرًا', 'أَوْ', 'لِيَصْمُتْ'],
        transliterationWords: ['Man', 'kana', 'yu\'minu', 'billahi', 'wal-yawm', 'al-akhir', 'falyaqul', 'khayran', 'aw', 'liyasmut'],
        translationWords: ['Whoever', 'believes', 'in', 'Allah', 'and', 'the', 'Last', 'Day', 'should', 'speak', 'good', 'or', 'remain', 'silent.']
      },
      {
        id: 3,
        arabic: 'مَثَلُ الْمُؤْمِنِينَ فِي تَوَادِّهِمْ وَتَرَاحُمِهِمْ وَتَعَاطُفِهِمْ مَثَلُ الْجَسَدِ إِذَا اشْتَكَى مِنْهُ عُضْوٌ تَدَاعَى لَهُ سَائِرُ الْجَسَدِ بِالسَّهَرِ وَالْحُمَّى',
        transliteration: 'Mathalu al-mu\'minin fi tawaddihim wa tarahhumihim wa ta\'atufihim mathalu al-jasad idha ishtaka minhu \'udwun tada\'a lahu sa\'ir al-jasad bil-sahar wal-humma',
        translation: 'The example of the believers in their affection, mercy, and compassion for each other is that of a body. When a limb suffers, the whole body responds to it with wakefulness and fever.',
        narrator: 'An-Nu\'man ibn Bashir',
        reference: 'Bukhari 6011',
        arabicWords: ['مَثَلُ', 'الْمُؤْمِنِينَ', 'فِي', 'تَوَادِّهِمْ', 'وَتَرَاحُمِهِمْ', 'وَتَعَاطُفِهِمْ', 'مَثَلُ', 'الْجَسَدِ', 'إِذَا', 'اشْتَكَى', 'مِنْهُ', 'عُضْوٌ', 'تَدَاعَى', 'لَهُ', 'سَائِرُ', 'الْجَسَدِ', 'بِالسَّهَرِ', 'وَالْحُمَّى'],
        transliterationWords: ['Mathalu', 'al-mu\'minin', 'fi', 'tawaddihim', 'wa', 'tarahhumihim', 'wa', 'ta\'atufihim', 'mathalu', 'al-jasad', 'idha', 'ishtaka', 'minhu', '\'udwun', 'tada\'a', 'lahu', 'sa\'ir', 'al-jasad', 'bil-sahar', 'wal-humma'],
        translationWords: ['The', 'example', 'of', 'the', 'believers', 'in', 'their', 'affection,', 'mercy,', 'and', 'compassion', 'for', 'each', 'other', 'is', 'that', 'of', 'a', 'body.', 'When', 'a', 'limb', 'suffers,', 'the', 'whole', 'body', 'responds', 'to', 'it', 'with', 'wakefulness', 'and', 'fever.']
      },
      {
        id: 4,
        arabic: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
        transliteration: 'Al-muslim man salima al-muslimun min lisanihi wa yadihi',
        translation: 'A Muslim is one from whose tongue and hand the Muslims are safe.',
        narrator: 'Abdullah ibn Amr',
        reference: 'Bukhari 10',
        arabicWords: ['الْمُسْلِمُ', 'مَنْ', 'سَلِمَ', 'الْمُسْلِمُونَ', 'مِنْ', 'لِسَانِهِ', 'وَيَدِهِ'],
        transliterationWords: ['Al-muslim', 'man', 'salima', 'al-muslimun', 'min', 'lisanihi', 'wa', 'yadihi'],
        translationWords: ['A', 'Muslim', 'is', 'one', 'from', 'whose', 'tongue', 'and', 'hand', 'the', 'Muslims', 'are', 'safe.']
      },
      {
        id: 5,
        arabic: 'بُنِيَ الْإِسْلَامُ عَلَى خَمْسٍ شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللَّهُ وَأَنَّ مُحَمَّدًا رَسُولُ اللَّهِ وَإِقَامِ الصَّلَاةِ وَإِيتَاءِ الزَّكَاةِ وَالْحَجِّ وَصَوْمِ رَمَضَانَ',
        transliteration: 'Buniya al-islamu \'ala khams: shahadati an la ilaha illa Allah wa anna Muhammadan rasul Allah, wa iqam as-salah, wa ita\' az-zakah, wal-hajj, wa sawm Ramadan',
        translation: 'Islam is built on five: testifying that there is no god but Allah and that Muhammad is the Messenger of Allah, establishing prayer, giving charity, pilgrimage, and fasting Ramadan.',
        narrator: 'Abdullah ibn Umar',
        reference: 'Bukhari 8',
        arabicWords: ['بُنِيَ', 'الْإِسْلَامُ', 'عَلَى', 'خَمْسٍ', 'شَهَادَةِ', 'أَنْ', 'لَا', 'إِلَهَ', 'إِلَّا', 'اللَّهُ', 'وَأَنَّ', 'مُحَمَّدًا', 'رَسُولُ', 'اللَّهِ', 'وَإِقَامِ', 'الصَّلَاةِ', 'وَإِيتَاءِ', 'الزَّكَاةِ', 'وَالْحَجِّ', 'وَصَوْمِ', 'رَمَضَانَ'],
        transliterationWords: ['Buniya', 'al-islamu', '\'ala', 'khams:', 'shahadati', 'an', 'la', 'ilaha', 'illa', 'Allah', 'wa', 'anna', 'Muhammadan', 'rasul', 'Allah,', 'wa', 'iqam', 'as-salah,', 'wa', 'ita\'', 'az-zakah,', 'wal-hajj,', 'wa', 'sawm', 'Ramadan'],
        translationWords: ['Islam', 'is', 'built', 'on', 'five:', 'testifying', 'that', 'there', 'is', 'no', 'god', 'but', 'Allah', 'and', 'that', 'Muhammad', 'is', 'the', 'Messenger', 'of', 'Allah,', 'establishing', 'prayer,', 'giving', 'charity,', 'pilgrimage,', 'and', 'fasting', 'Ramadan.']
      }
    ]
  },
  muslim: {
    name: 'Sahih Muslim',
    hadith: [
      {
        id: 1,
        arabic: 'الدِّينُ النَّصِيحَةُ قُلْنَا لِمَنْ قَالَ لِلَّهِ وَلِكِتَابِهِ وَلِرَسُولِهِ وَلِأَئِمَّةِ الْمُسْلِمِينَ وَعَامَّتِهِمْ',
        transliteration: 'Ad-dinu an-nasihah, qulna: liman? Qal: lillahi wa li-kitabihi wa li-rasulihi wa li-a\'immati al-muslimina wa \'ammatihim',
        translation: 'Religion is sincere advice. We asked: To whom? He said: To Allah, His Book, His Messenger, the leaders of the Muslims and their common folk.',
        narrator: 'Tamim ibn Aws ad-Dari',
        reference: 'Muslim 55',
        arabicWords: ['الدِّينُ', 'النَّصِيحَةُ', 'قُلْنَا', 'لِمَنْ', 'قَالَ', 'لِلَّهِ', 'وَلِكِتَابِهِ', 'وَلِرَسُولِهِ', 'وَلِأَئِمَّةِ', 'الْمُسْلِمِينَ', 'وَعَامَّتِهِمْ'],
        transliterationWords: ['Ad-dinu', 'an-nasihah,', 'qulna:', 'liman?', 'Qal:', 'lillahi', 'wa', 'li-kitabihi', 'wa', 'li-rasulihi', 'wa', 'li-a\'immati', 'al-muslimina', 'wa', '\'ammatihim'],
        translationWords: ['Religion', 'is', 'sincere', 'advice.', 'We', 'asked:', 'To', 'whom?', 'He', 'said:', 'To', 'Allah,', 'His', 'Book,', 'His', 'Messenger,', 'the', 'leaders', 'of', 'the', 'Muslims', 'and', 'their', 'common', 'folk.']
      },
      {
        id: 2,
        arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        transliteration: 'La yu\'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsihi',
        translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
        narrator: 'Anas ibn Malik',
        reference: 'Muslim 45',
        arabicWords: ['لَا', 'يُؤْمِنُ', 'أَحَدُكُمْ', 'حَتَّى', 'يُحِبَّ', 'لِأَخِيهِ', 'مَا', 'يُحِبُّ', 'لِنَفْسِهِ'],
        transliterationWords: ['La', 'yu\'minu', 'ahadukum', 'hatta', 'yuhibba', 'li-akhihi', 'ma', 'yuhibbu', 'li-nafsihi'],
        translationWords: ['None', 'of', 'you', 'truly', 'believes', 'until', 'he', 'loves', 'for', 'his', 'brother', 'what', 'he', 'loves', 'for', 'himself.']
      },
      {
        id: 3,
        arabic: 'إِنَّ اللَّهَ كَتَبَ الْإِحْسَانَ عَلَى كُلِّ شَيْءٍ فَإِذَا قَتَلْتُمْ فَأَحْسِنُوا الْقِتْلَةَ وَإِذَا ذَبَحْتُمْ فَأَحْسِنُوا الذِّبْحَةَ',
        transliteration: 'Inna Allah kataba al-ihsan \'ala kulli shay\', fa-idha qataltum fa-ahsinu al-qitlah, wa idha dhabahtum fa-ahsinu adh-dhibhah',
        translation: 'Indeed, Allah has prescribed excellence in everything. So when you kill, kill with excellence, and when you slaughter, slaughter with excellence.',
        narrator: 'Shaddad ibn Aws',
        reference: 'Muslim 1955',
        arabicWords: ['إِنَّ', 'اللَّهَ', 'كَتَبَ', 'الْإِحْسَانَ', 'عَلَى', 'كُلِّ', 'شَيْءٍ', 'فَإِذَا', 'قَتَلْتُمْ', 'فَأَحْسِنُوا', 'الْقِتْلَةَ', 'وَإِذَا', 'ذَبَحْتُمْ', 'فَأَحْسِنُوا', 'الذِّبْحَةَ'],
        transliterationWords: ['Inna', 'Allah', 'kataba', 'al-ihsan', '\'ala', 'kulli', 'shay\',', 'fa-idha', 'qataltum', 'fa-ahsinu', 'al-qitlah,', 'wa', 'idha', 'dhabahtum', 'fa-ahsinu', 'adh-dhibhah'],
        translationWords: ['Indeed,', 'Allah', 'has', 'prescribed', 'excellence', 'in', 'everything.', 'So', 'when', 'you', 'kill,', 'kill', 'with', 'excellence,', 'and', 'when', 'you', 'slaughter,', 'slaughter', 'with', 'excellence.']
      },
      {
        id: 4,
        arabic: 'مَنْ صَلَّى الْفَجْرَ فَهُوَ فِي ذِمَّةِ اللَّهِ فَلَا يَطْلُبَنَّكُمُ اللَّهُ مِنْ ذِمَّتِهِ بِشَيْءٍ',
        transliteration: 'Man salla al-fajr fa-huwa fi dhimmat Allah, fa-la yatlubannakum Allah min dhimmatihi bi-shay\'',
        translation: 'Whoever prays Fajr is under Allah\'s protection, so let not Allah find you lacking in anything due from His protection.',
        narrator: 'Jundub ibn Abdullah',
        reference: 'Muslim 657',
        arabicWords: ['مَنْ', 'صَلَّى', 'الْفَجْرَ', 'فَهُوَ', 'فِي', 'ذِمَّةِ', 'اللَّهِ', 'فَلَا', 'يَطْلُبَنَّكُمُ', 'اللَّهُ', 'مِنْ', 'ذِمَّتِهِ', 'بِشَيْءٍ'],
        transliterationWords: ['Man', 'salla', 'al-fajr', 'fa-huwa', 'fi', 'dhimmat', 'Allah,', 'fa-la', 'yatlubannakum', 'Allah', 'min', 'dhimmatihi', 'bi-shay\''],
        translationWords: ['Whoever', 'prays', 'Fajr', 'is', 'under', 'Allah\'s', 'protection,', 'so', 'let', 'not', 'Allah', 'find', 'you', 'lacking', 'in', 'anything', 'due', 'from', 'His', 'protection.']
      },
      {
        id: 5,
        arabic: 'إِذَا أَحَبَّ اللَّهُ عَبْدًا نَادَى جِبْرِيلَ إِنَّ اللَّهَ يُحِبُّ فُلَانًا فَأَحْبِبْهُ فَيُحِبُّهُ جِبْرِيلُ',
        transliteration: 'Idha ahabb Allah \'abdan nada Jibril: inna Allah yuhibbu fulanan fa-ahibbah, fa-yuhibbuhu Jibril',
        translation: 'When Allah loves a servant, He calls to Gabriel: "Indeed, Allah loves so-and-so, so love him," and Gabriel loves him.',
        narrator: 'Abu Hurairah',
        reference: 'Muslim 2637',
        arabicWords: ['إِذَا', 'أَحَبَّ', 'اللَّهُ', 'عَبْدًا', 'نَادَى', 'جِبْرِيلَ', 'إِنَّ', 'اللَّهَ', 'يُحِبُّ', 'فُلَانًا', 'فَأَحْبِبْهُ', 'فَيُحِبُّهُ', 'جِبْرِيلُ'],
        transliterationWords: ['Idha', 'ahabb', 'Allah', '\'abdan', 'nada', 'Jibril:', 'inna', 'Allah', 'yuhibbu', 'fulanan', 'fa-ahibbah,', 'fa-yuhibbuhu', 'Jibril'],
        translationWords: ['When', 'Allah', 'loves', 'a', 'servant,', 'He', 'calls', 'to', 'Gabriel:', 'Indeed,', 'Allah', 'loves', 'so-and-so,', 'so', 'love', 'him,', 'and', 'Gabriel', 'loves', 'him.']
      }
    ]
  }
};

export const HadithReader: React.FC<HadithReaderProps> = ({ isVisible, onClose, collection }) => {
  const { t, language } = useTranslation();
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [fontSize, setFontSize] = useState(16);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number | null>(null);

  const collectionData = hadithCollections[collection];
  const currentHadith = collectionData.hadith[currentHadithIndex];

  const handleNext = () => {
    if (currentHadithIndex < collectionData.hadith.length - 1) {
      setCurrentHadithIndex(currentHadithIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentHadithIndex > 0) {
      setCurrentHadithIndex(currentHadithIndex - 1);
    }
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
            className={`cursor-pointer transition-colors duration-200 ${
              selectedWordIndex === index 
                ? 'bg-primary/20 text-primary font-medium rounded px-1' 
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

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div>
            <h2 className="text-xl font-bold text-foreground">{collectionData.name}</h2>
            <p className="text-sm text-muted-foreground">
              {t('hadith.number')} {currentHadithIndex + 1} {t('hadith.of')} {collectionData.hadith.length}
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
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Arabic Text */}
          <div 
            className="text-right mb-6 leading-relaxed font-arabic"
            style={{ fontSize: `${fontSize + 4}px`, lineHeight: 2.2 }}
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
                style={{ fontSize: `${fontSize}px` }}
              >
                {renderTextWithHighlight(currentHadith.transliteration, currentHadith.transliterationWords, 'transliteration')}
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Translation */}
          <div 
            className="mb-6 leading-relaxed text-foreground"
            style={{ fontSize: `${fontSize}px` }}
          >
            {renderTextWithHighlight(currentHadith.translation, currentHadith.translationWords, 'translation')}
          </div>

          {/* Attribution */}
          <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
            <p><strong>{t('hadith.narrator')}:</strong> {currentHadith.narrator}</p>
            <p><strong>{t('hadith.reference')}:</strong> {currentHadith.reference}</p>
          </div>
        </div>

        {/* Footer Controls */}
        <div className="border-t border-border p-4 space-y-4">
          {/* Settings */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => setShowTransliteration(!showTransliteration)}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                {showTransliteration ? t('hadith.hide.transliteration') : t('hadith.show.transliteration')}
              </Button>
              
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
                className="text-xs"
              >
                <Copy className="w-3 h-3 mr-1" />
                {t('hadith.copy')}
              </Button>
              <Button
                onClick={handleShare}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                <Share2 className="w-3 h-3 mr-1" />
                {t('hadith.share')}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              onClick={handlePrevious}
              disabled={currentHadithIndex === 0}
              variant="outline"
              size="sm"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {t('hadith.previous')}
            </Button>

            <span className="text-sm text-muted-foreground">
              {currentHadithIndex + 1} / {collectionData.hadith.length}
            </span>

            <Button
              onClick={handleNext}
              disabled={currentHadithIndex === collectionData.hadith.length - 1}
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