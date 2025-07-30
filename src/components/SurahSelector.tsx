import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlayCircle, Book } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRecitation } from '@/contexts/RecitationContext';

interface Surah {
  id: number;
  name_arabic: string;
  name_english: string;
  verses_count: number;
  revelation_place: string;
}

export const SurahSelector = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { startRecitation } = useRecitation();

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const { data, error } = await supabase
        .from('surahs')
        .select('*')
        .order('id');

      if (error) throw error;
      setSurahs(data || []);
    } catch (error) {
      console.error('Error fetching surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartRecitation = () => {
    if (selectedSurah) {
      const surahId = parseInt(selectedSurah);
      startRecitation(surahId, 1);
    }
  };

  const selectedSurahData = surahs.find(s => s.id.toString() === selectedSurah);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Book className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Quran Recitation</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-foreground mb-2 block">
              Select Surah
            </label>
            <Select value={selectedSurah} onValueChange={setSelectedSurah}>
              <SelectTrigger>
                <SelectValue placeholder={loading ? "Loading surahs..." : "Choose a surah"} />
              </SelectTrigger>
              <SelectContent>
                {surahs.map((surah) => (
                  <SelectItem key={surah.id} value={surah.id.toString()}>
                    <div className="flex items-center justify-between w-full">
                      <span>{surah.id}. {surah.name_english}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        ({surah.verses_count} verses)
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedSurahData && (
            <div className="bg-muted/50 rounded-lg p-3">
              <div className="text-sm space-y-1">
                <p><strong>Arabic:</strong> {selectedSurahData.name_arabic}</p>
                <p><strong>English:</strong> {selectedSurahData.name_english}</p>
                <p><strong>Verses:</strong> {selectedSurahData.verses_count}</p>
                <p><strong>Revelation:</strong> {selectedSurahData.revelation_place}</p>
              </div>
            </div>
          )}

          <Button 
            onClick={handleStartRecitation}
            disabled={!selectedSurah || loading}
            className="w-full gap-2"
          >
            <PlayCircle className="w-4 h-4" />
            Start Recitation
          </Button>
        </div>
      </div>
    </Card>
  );
};