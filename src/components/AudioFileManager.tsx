import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Upload, Music, X, Save, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface AudioFile {
  name: string;
  path: string;
  size: number;
}

interface AudioMapping {
  id: string;
  surah_id: number;
  audio_file_path: string;
  audio_file_name: string;
}

interface Surah {
  id: number;
  name_english: string;
  name_arabic: string;
}

interface AudioFileManagerProps {
  surahs: Surah[];
  onMappingUpdate?: () => void;
}

export const AudioFileManager = ({ surahs, onMappingUpdate }: AudioFileManagerProps) => {
  const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
  const [mappings, setMappings] = useState<AudioMapping[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSurah, setSelectedSurah] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    loadAudioFiles();
    loadMappings();
  }, []);

  const loadAudioFiles = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: files, error } = await supabase.storage
      .from('user-audio')
      .list(user.id, { limit: 100 });

    if (error) {
      console.error('Error loading audio files:', error);
      return;
    }

    const audioFiles = files
      ?.filter(file => file.name.toLowerCase().endsWith('.mp3') || file.name.toLowerCase().endsWith('.wav'))
      .map(file => ({
        name: file.name,
        path: `${user.id}/${file.name}`,
        size: file.metadata?.size || 0
      })) || [];

    setAudioFiles(audioFiles);
  };

  const loadMappings = async () => {
    const { data, error } = await supabase
      .from('user_surah_audio')
      .select('*');

    if (error) {
      console.error('Error loading mappings:', error);
      return;
    }

    setMappings(data || []);
  };

  const handleFileUpload = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an audio file to upload.',
        variant: 'destructive',
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to upload files.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploading(true);

    try {
      const filePath = `${user.id}/${selectedFile.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-audio')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) {
        throw uploadError;
      }

      toast({
        title: 'Upload successful',
        description: 'Audio file has been uploaded.',
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      loadAudioFiles();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to upload audio file.',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const isAudio = file.type.startsWith('audio/') || 
                     file.name.toLowerCase().endsWith('.mp3') || 
                     file.name.toLowerCase().endsWith('.wav');
      
      if (isAudio) {
        setSelectedFile(file);
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please select an audio file (MP3, WAV).',
          variant: 'destructive',
        });
      }
    }
  };

  const createMapping = async (audioFile: AudioFile) => {
    if (!selectedSurah) {
      toast({
        title: 'No surah selected',
        description: 'Please select a surah to map this audio file to.',
        variant: 'destructive',
      });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('user_surah_audio')
        .upsert({
          user_id: user.id,
          surah_id: parseInt(selectedSurah),
          audio_file_path: audioFile.path,
          audio_file_name: audioFile.name,
        });

      if (error) {
        throw error;
      }

      toast({
        title: 'Mapping created',
        description: 'Audio file has been mapped to the selected surah.',
      });

      loadMappings();
      onMappingUpdate?.();
      setSelectedSurah('');
      
      // Force recitation context to reload mappings
      window.location.reload();
    } catch (error) {
      console.error('Mapping error:', error);
      toast({
        title: 'Mapping failed',
        description: error.message || 'Failed to create mapping.',
        variant: 'destructive',
      });
    }
  };

  const deleteMapping = async (mappingId: string) => {
    try {
      const { error } = await supabase
        .from('user_surah_audio')
        .delete()
        .eq('id', mappingId);

      if (error) {
        throw error;
      }

      toast({
        title: 'Mapping deleted',
        description: 'Audio mapping has been removed.',
      });

      loadMappings();
      onMappingUpdate?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete mapping.',
        variant: 'destructive',
      });
    }
  };

  const deleteAudioFile = async (audioFile: AudioFile) => {
    try {
      const { error } = await supabase.storage
        .from('user-audio')
        .remove([audioFile.path]);

      if (error) {
        throw error;
      }

      toast({
        title: 'File deleted',
        description: 'Audio file has been deleted.',
      });

      loadAudioFiles();
      loadMappings();
      onMappingUpdate?.();
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: 'Delete failed',
        description: error.message || 'Failed to delete file.',
        variant: 'destructive',
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getSurahName = (surahId: number) => {
    const surah = surahs.find(s => s.id === surahId);
    return surah ? `${surah.name_english} (${surah.name_arabic})` : `Surah ${surahId}`;
  };

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Upload Audio Files</h3>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,.mp3,.wav"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Audio File
              </Button>
              
              {selectedFile && (
                <div className="flex items-center gap-2">
                  <Music className="w-4 h-4 text-primary" />
                  <span className="text-sm">{selectedFile.name}</span>
                  <Button
                    size="sm"
                    onClick={handleFileUpload}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Audio Files & Mapping Section */}
      <Card className="p-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Your Audio Files</h3>
          
          {audioFiles.length === 0 ? (
            <p className="text-muted-foreground">No audio files uploaded yet.</p>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Select Surah for Mapping</label>
                <Select value={selectedSurah} onValueChange={setSelectedSurah}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a surah..." />
                  </SelectTrigger>
                  <SelectContent>
                    {surahs.map((surah) => (
                      <SelectItem key={surah.id} value={surah.id.toString()}>
                        {surah.name_english} - {surah.name_arabic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                {audioFiles.map((file) => {
                  const mapping = mappings.find(m => m.audio_file_path === file.path);
                  
                  return (
                    <div key={file.path} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Music className="w-4 h-4 text-primary" />
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(file.size)}
                            {mapping && (
                              <span className="ml-2 text-primary">
                                → {getSurahName(mapping.surah_id)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {mapping ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteMapping(mapping.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => createMapping(file)}
                            disabled={!selectedSurah}
                          >
                            <Save className="w-4 h-4 mr-2" />
                            Map
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteAudioFile(file)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};