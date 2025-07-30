import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Music, Play } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useRecitation } from '@/contexts/RecitationContext';

interface AudioFile {
  name: string;
  path: string;
  surahMatch?: {
    id: number;
    name_english: string;
    name_arabic: string;
  };
}

export const AudioFileMatcher = () => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [surahs, setSurahs] = useState<any[]>([]);
  const { startRecitation } = useRecitation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch surahs from database
      const { data: surahData, error: surahError } = await supabase
        .from('surahs')
        .select('*')
        .order('id');

      if (surahError) throw surahError;
      setSurahs(surahData || []);

      // Fetch audio files from storage
      const { data: files, error: storageError } = await supabase.storage
        .from('quran-audio')
        .list('', {
          limit: 1000,
          sortBy: { column: 'name', order: 'asc' }
        });

      if (storageError) throw storageError;

      // Match audio files with surahs based on name similarity
      const matchedFiles = files
        ?.filter(file => file.name.includes('.mp3') || file.name.includes('.wav'))
        .map(file => {
          const audioFile: AudioFile = {
            name: file.name,
            path: file.name
          };

          // Try to match with surah by name
          const matchedSurah = surahData?.find(surah => {
            const fileName = file.name.toLowerCase();
            const surahEnglish = surah.name_english.toLowerCase();
            const surahArabic = surah.name_arabic.toLowerCase();
            
            return fileName.includes(surahEnglish.replace(/['-]/g, '')) ||
                   fileName.includes(surahArabic) ||
                   fileName.includes(`surah_${surah.id.toString().padStart(3, '0')}`) ||
                   fileName.includes(`${surah.id.toString().padStart(3, '0')}`);
          });

          if (matchedSurah) {
            audioFile.surahMatch = matchedSurah;
          }

          return audioFile;
        }) || [];

      setAudioFiles(matchedFiles);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const playAudio = (audioFile: AudioFile) => {
    if (audioFile.surahMatch) {
      startRecitation(audioFile.surahMatch.id, 1, audioFile.path);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin mr-2" />
          <span>Loading audio files...</span>
        </div>
      </Card>
    );
  }

  const matchedFiles = audioFiles.filter(f => f.surahMatch);
  const unmatchedFiles = audioFiles.filter(f => !f.surahMatch);

  return (
    <div className="space-y-4">
      {matchedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-primary" />
            Matched Quran Audio Files ({matchedFiles.length})
          </h3>
          <div className="grid gap-3">
            {matchedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium text-foreground">
                    {file.surahMatch?.name_english} ({file.surahMatch?.name_arabic})
                  </p>
                  <p className="text-sm text-muted-foreground">{file.name}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => playAudio(file)}
                  className="gap-2"
                >
                  <Play className="w-3 h-3" />
                  Play
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {unmatchedFiles.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Music className="w-5 h-5 text-muted-foreground" />
            Unmatched Audio Files ({unmatchedFiles.length})
          </h3>
          <div className="grid gap-2">
            {unmatchedFiles.map((file, index) => (
              <div key={index} className="p-2 bg-muted/30 rounded text-sm text-muted-foreground">
                {file.name}
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            These files couldn't be automatically matched with surahs. Consider renaming them to include surah names.
          </p>
        </Card>
      )}

      {audioFiles.length === 0 && (
        <Card className="p-6">
          <div className="text-center">
            <Music className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Audio Files Found</h3>
            <p className="text-muted-foreground">
              Upload audio files to the 'quran-audio' bucket in Supabase Storage to get started.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};