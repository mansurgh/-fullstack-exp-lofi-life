import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { AudioUpload } from '@/components/AudioUpload';
import { supabase } from '@/integrations/supabase/client';
import { Mic, FileAudio, Languages, Copy, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Auto-detect' },
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'ru', name: 'Russian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ar', name: 'Arabic' },
];

export const TranscriptionPipeline = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [detectedLanguage, setDetectedLanguage] = useState('');
  const { toast } = useToast();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setTranscription('');
    setDetectedLanguage('');
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Remove the data URL prefix (data:audio/...;base64,)
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleTranscribe = async () => {
    if (!selectedFile) {
      toast({
        title: 'No file selected',
        description: 'Please select an audio file to transcribe.',
        variant: 'destructive',
      });
      return;
    }

    setIsTranscribing(true);
    
    try {
      // Convert file to base64
      const base64Audio = await convertFileToBase64(selectedFile);
      
      // Call the transcription edge function
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: {
          audio: base64Audio,
          language: selectedLanguage === 'auto' ? undefined : selectedLanguage,
        },
      });

      if (error) {
        throw error;
      }

      setTranscription(data.text);
      if (data.language) {
        setDetectedLanguage(data.language);
      }

      toast({
        title: 'Transcription complete',
        description: 'Audio has been successfully transcribed.',
      });
    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: 'Transcription failed',
        description: error.message || 'An error occurred during transcription.',
        variant: 'destructive',
      });
    } finally {
      setIsTranscribing(false);
    }
  };

  const copyToClipboard = async () => {
    if (transcription) {
      await navigator.clipboard.writeText(transcription);
      toast({
        title: 'Copied to clipboard',
        description: 'Transcription text has been copied.',
      });
    }
  };

  const downloadTranscription = () => {
    if (transcription) {
      const blob = new Blob([transcription], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transcription-${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mic className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">Audio Transcription Pipeline</h2>
          </div>
          
          <p className="text-muted-foreground">
            Upload an audio file and get an accurate transcription using OpenAI Whisper.
          </p>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Languages className="w-4 h-4" />
              Language
            </label>
            <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Audio Upload */}
          <AudioUpload onFileSelect={handleFileSelect} />

          {/* Transcribe Button */}
          {selectedFile && (
            <Button 
              onClick={handleTranscribe} 
              disabled={isTranscribing}
              className="w-full"
            >
              <FileAudio className="w-4 h-4 mr-2" />
              {isTranscribing ? 'Transcribing...' : 'Transcribe Audio'}
            </Button>
          )}
        </div>
      </Card>

      {/* Transcription Results */}
      {transcription && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Transcription Result</h3>
              <div className="flex gap-2">
                {detectedLanguage && (
                  <Badge variant="secondary">
                    Detected: {SUPPORTED_LANGUAGES.find(l => l.code === detectedLanguage)?.name || detectedLanguage}
                  </Badge>
                )}
              </div>
            </div>
            
            <Textarea
              value={transcription}
              onChange={(e) => setTranscription(e.target.value)}
              className="min-h-32 resize-none"
              placeholder="Transcription will appear here..."
            />
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={copyToClipboard}>
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button variant="outline" onClick={downloadTranscription}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};