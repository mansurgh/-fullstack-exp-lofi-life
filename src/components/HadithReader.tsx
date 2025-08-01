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
        reference: 'Bukhari 1'
      },
      {
        id: 2,
        arabic: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الْآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
        transliteration: 'Man kana yu\'minu billahi wal-yawm al-akhir falyaqul khayran aw liyasmut',
        translation: 'Whoever believes in Allah and the Last Day should speak good or remain silent.',
        narrator: 'Abu Hurairah',
        reference: 'Bukhari 6018'
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
        reference: 'Muslim 55'
      },
      {
        id: 2,
        arabic: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
        transliteration: 'La yu\'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu li-nafsihi',
        translation: 'None of you truly believes until he loves for his brother what he loves for himself.',
        narrator: 'Anas ibn Malik',
        reference: 'Muslim 45'
      }
    ]
  }
};

export const HadithReader: React.FC<HadithReaderProps> = ({ isVisible, onClose, collection }) => {
  const { t, language } = useTranslation();
  const [currentHadithIndex, setCurrentHadithIndex] = useState(0);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [fontSize, setFontSize] = useState(16);

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
            {currentHadith.arabic}
          </div>

          <Separator className="my-4" />

          {/* Transliteration */}
          {showTransliteration && (
            <>
              <div 
                className="mb-4 text-muted-foreground italic leading-relaxed"
                style={{ fontSize: `${fontSize}px` }}
              >
                {currentHadith.transliteration}
              </div>
              <Separator className="my-4" />
            </>
          )}

          {/* Translation */}
          <div 
            className="mb-6 leading-relaxed text-foreground"
            style={{ fontSize: `${fontSize}px` }}
          >
            {currentHadith.translation}
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