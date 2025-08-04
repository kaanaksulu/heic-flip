import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, FileImage, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { formatFileSize } from '@/utils/fileValidation';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void;
  selectedFiles: File[];
  onRemoveFile: (index: number) => void;
  acceptedTypes?: Record<string, string[]>;
  title?: string;
  description?: string;
  supportText?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({ 
  onFilesSelected, 
  selectedFiles, 
  onRemoveFile,
  acceptedTypes = {
    'image/heic': ['.heic'],
    'image/heif': ['.heif']
  },
  title = 'Upload HEIC Files',
  description = 'Drag & drop your HEIC files here, or click to browse',
  supportText = 'Supports .heic and .heif formats'
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const validTypes = Object.keys(acceptedTypes);
      const validExtensions = Object.values(acceptedTypes).flat();
      
      return validTypes.includes(file.type) || 
             validExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
    }
    );
    
    if (validFiles.length !== acceptedFiles.length) {
      // Show error for invalid files
    }
    
    onFilesSelected(validFiles);
    setIsDragOver(false);
  }, [onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    onDragEnter: () => setIsDragOver(true),
    onDragLeave: () => setIsDragOver(false),
    accept: {
      ...acceptedTypes
    },
    multiple: true
  });

  return (
    <div className="w-full space-y-4">
      <Card
        {...getRootProps()}
        className={`
          border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-300
          ${isDragActive || isDragOver 
            ? 'border-primary bg-upload-active' 
            : 'border-upload-border hover:border-primary hover:bg-upload-hover'
          }
        `}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-4">
          <div className={`
            p-4 rounded-full transition-colors duration-300
            ${isDragActive || isDragOver ? 'bg-primary/20' : 'bg-secondary'}
          `}>
            <Upload className={`h-8 w-8 ${isDragActive || isDragOver ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isDragActive ? `Drop your files here` : title}
            </h3>
            <p className="text-muted-foreground">
              {description}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              {supportText}
            </p>
          </div>
        </div>
      </Card>

      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium">Selected Files:</h4>
          {selectedFiles.map((file, index) => (
            <Card key={index} className="p-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileImage className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {formatFileSize(file.size)}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};