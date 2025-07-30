import React, { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Music, Loader2, Check, Copy } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface StoredTranscript {
  id: string;
  filename: string;
  transcript: string;
  timestamp: Date;
}

export const PromptBlock = () => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [storedTranscripts, setStoredTranscripts] = useState<StoredTranscript[]>(() => {
    const stored = localStorage.getItem('promptblock-transcripts');
    return stored ? JSON.parse(stored) : [];
  });

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('audio')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file.",
        variant: "destructive",
      });
      return;
    }

    setCurrentFile(file);
    setIsProcessing(true);

    try {
      toast({
        title: "Processing audio",
        description: "Transcribing your audio file...",
      });

      const base64Audio = await convertFileToBase64(file);

      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: {
          audio: base64Audio
        }
      });

      if (error) throw error;

      const newTranscript: StoredTranscript = {
        id: Date.now().toString(),
        filename: file.name,
        transcript: data.text,
        timestamp: new Date()
      };

      const updatedTranscripts = [newTranscript, ...storedTranscripts];
      setStoredTranscripts(updatedTranscripts);
      localStorage.setItem('promptblock-transcripts', JSON.stringify(updatedTranscripts));

      toast({
        title: "Transcription complete",
        description: "Audio has been transcribed and stored.",
      });

    } catch (error) {
      console.error('Transcription error:', error);
      toast({
        title: "Transcription failed",
        description: error instanceof Error ? error.message : "Failed to transcribe audio",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
      setCurrentFile(null);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const copyTranscript = (transcript: string) => {
    navigator.clipboard.writeText(transcript);
    toast({
      title: "Copied",
      description: "Transcript copied to clipboard",
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Audio Prompt Block</h3>
        
        <div
          className="border-2 border-dashed border-border rounded-lg p-8 text-center transition-colors hover:border-primary/50"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          {isProcessing ? (
            <div className="space-y-3">
              <Loader2 className="w-12 h-12 mx-auto text-primary animate-spin" />
              <p className="text-foreground font-medium">Processing {currentFile?.name}...</p>
              <p className="text-sm text-muted-foreground">Transcribing audio with AI</p>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-foreground font-medium">
                  Drop audio file here or click to upload
                </p>
                <p className="text-sm text-muted-foreground">
                  Automatic transcription will start immediately
                </p>
              </div>
              <Button 
                onClick={() => fileInputRef.current?.click()} 
                variant="default"
                disabled={isProcessing}
              >
                <Upload className="w-4 h-4 mr-2" />
                Choose Audio File
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </Card>

      {storedTranscripts.length > 0 && (
        <Card className="p-6">
          <h4 className="text-lg font-semibold text-foreground mb-4">Stored Transcripts</h4>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {storedTranscripts.map((item) => (
              <div key={item.id} className="border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-medium text-foreground">{item.filename}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.timestamp.toLocaleString()}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyTranscript(item.transcript)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <div className="bg-muted/50 rounded p-3 text-sm">
                  {item.transcript}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
};