import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, Music, X } from 'lucide-react';
import { useTranslation } from '@/contexts/TranslationContext';

interface AudioUploadProps {
  onFileSelect?: (file: File) => void;
}

export const AudioUpload = ({ onFileSelect }: AudioUploadProps) => {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

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

  const clearFile = () => {
    setSelectedFile(null);
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
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearFile}
                className="mt-2"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </Button>
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