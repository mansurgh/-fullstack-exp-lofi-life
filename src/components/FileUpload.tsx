import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Upload, File, X } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface FileUploadProps {
  onFileSelect?: (file: File) => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  multiple?: boolean;
  title?: string;
  description?: string;
}

export const FileUpload = ({ 
  onFileSelect, 
  acceptedTypes = ['*'],
  maxSize = 10,
  multiple = false,
  title = "Upload File",
  description = "Drag and drop your file here or click to browse"
}: FileUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return false;
    }

    // Check file type if specified
    if (acceptedTypes.length > 0 && !acceptedTypes.includes('*')) {
      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
      const isValidType = acceptedTypes.some(type => 
        type === fileExtension || 
        file.type.includes(type.replace('.', '')) ||
        type === file.type
      );
      
      if (!isValidType) {
        alert(`File type not supported. Accepted types: ${acceptedTypes.join(', ')}`);
        return false;
      }
    }

    return true;
  };

  const handleFileSelect = (files: FileList) => {
    const validFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      if (validateFile(file)) {
        validFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      if (multiple) {
        setSelectedFiles(prev => [...prev, ...validFiles]);
        validFiles.forEach(file => onFileSelect?.(file));
      } else {
        setSelectedFiles([validFiles[0]]);
        onFileSelect?.(validFiles[0]);
      }
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      handleFileSelect(files);
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
    
    const files = event.dataTransfer.files;
    if (files) {
      handleFileSelect(files);
    }
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const clearAllFiles = () => {
    setSelectedFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        
        <div
          className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragging ? 'border-primary bg-primary/5' : 'border-border'}
            ${selectedFiles.length > 0 ? 'bg-success/5 border-success' : ''}
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {selectedFiles.length > 0 ? (
            <div className="space-y-4">
              <File className="w-12 h-12 mx-auto text-success" />
              <div className="space-y-2">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-background rounded border">
                    <div className="flex items-center space-x-2">
                      <File className="w-4 h-4 text-muted-foreground" />
                      <div className="text-left">
                        <p className="font-medium text-foreground text-sm">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeFile(index)}
                      className="h-8 w-8 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              
              {isUploading && (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                </div>
              )}
              
              <div className="flex gap-2">
                {multiple && (
                  <Button onClick={handleButtonClick} variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Add More
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  onClick={clearAllFiles}
                >
                  <X className="w-4 h-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
              <div>
                <p className="text-foreground font-medium">{description}</p>
                <p className="text-sm text-muted-foreground">
                  Max size: {maxSize}MB
                  {acceptedTypes.length > 0 && !acceptedTypes.includes('*') && 
                    ` • Accepted: ${acceptedTypes.join(', ')}`
                  }
                </p>
              </div>
              <Button onClick={handleButtonClick} variant="default">
                <Upload className="w-4 h-4 mr-2" />
                Choose File{multiple ? 's' : ''}
              </Button>
            </div>
          )}
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          multiple={multiple}
          onChange={handleFileInputChange}
          className="hidden"
        />
      </div>
    </Card>
  );
};