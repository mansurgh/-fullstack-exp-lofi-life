import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Music, X, Save } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AudioUploadProps {
  onFileSelect?: (file: File) => void;
}

export const AudioUpload = ({ onFileSelect }: AudioUploadProps) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleFileSelect = (file: File) => {
    if (file && (file.type === 'audio/mpeg' || file.type === 'audio/mp3' || file.name.toLowerCase().endsWith('.mp3'))) {
      setSelectedFile(file);
      onFileSelect?.(file);
    } else {
      alert('Please select a valid MP3 file');
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const saveToSupabase = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Generate unique filename
      const timestamp = Date.now();
      const filename = `${timestamp}-${selectedFile.name}`;

      // Upload to Supabase storage
      const { data, error } = await supabase.storage
        .from('audio-uploads')
        .upload(filename, selectedFile);

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('audio-uploads')
        .getPublicUrl(filename);

      setUploadedUrl(publicUrl);
      toast({
        title: "Success",
        description: "Audio file saved to Supabase successfully!"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to save audio file to Supabase",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setUploadedUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Upload Audio</h3>
        
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
            ${selectedFile ? 'bg-success/5 border-success' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="space-y-3">
              <Music className="w-12 h-12 mx-auto text-success" />
              <div>
                <p className="font-medium text-foreground">{selectedFile.name}</p>
                <p className="text-sm text-muted-foreground">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
              <audio 
                controls 
                className="w-full max-w-md"
                src={URL.createObjectURL(selectedFile)}
              >
                Your browser does not support the audio element.
              </audio>
              
              {uploadedUrl && (
                <div className="p-3 bg-success/10 border border-success/20 rounded-lg">
                  <p className="text-sm text-success font-medium">✓ Saved to Supabase</p>
                  <p className="text-xs text-muted-foreground break-all">{uploadedUrl}</p>
                </div>
              )}
              
              <div className="flex gap-2 justify-center">
                <Button 
                  onClick={saveToSupabase}
                  disabled={isUploading || uploadedUrl !== null}
                  size="sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isUploading ? 'Saving...' : uploadedUrl ? 'Saved' : 'Save to Supabase'}
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFile}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-foreground font-medium">
                  Drop your MP3 file here or click to browse
                </p>
                <p className="text-sm text-muted-foreground">
                  Only MP3 files are supported
                </p>
              </div>
              <Button onClick={handleButtonClick} variant="default">
                <Upload className="w-4 h-4 mr-2" />
                Choose File
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".mp3,audio/mpeg"
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </Card>
  );
};