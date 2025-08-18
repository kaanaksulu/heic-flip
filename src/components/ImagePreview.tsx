import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/utils/fileValidation';

interface ImagePreviewProps {
  file: File;
  onRemove?: () => void;
  showRemoveButton?: boolean;
  convertedBlob?: Blob;
  convertedName?: string;
  onDownload?: () => void;
  isConverted?: boolean;
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
  file,
  onRemove,
  showRemoveButton = false,
  convertedBlob,
  convertedName,
  onDownload,
  isConverted = false
}) => {
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [convertedPreviewUrl, setConvertedPreviewUrl] = useState<string>('');
  const [showOriginal, setShowOriginal] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Create preview URL for original file
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    // Create preview URL for converted file
    if (convertedBlob) {
      const url = URL.createObjectURL(convertedBlob);
      setConvertedPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [convertedBlob]);

  const handleImageError = () => {
    setImageError(true);
  };

  const getFileFormat = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toUpperCase();
    return extension || 'Unknown';
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline">
            {getFileFormat(file.name)}
          </Badge>
          {isConverted && convertedName && (
            <>
              <span className="text-muted-foreground">→</span>
              <Badge variant="default">
                {getFileFormat(convertedName)}
              </Badge>
            </>
          )}
        </div>
        {showRemoveButton && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-medium text-sm truncate" title={file.name}>
            {file.name}
          </h4>
          {isConverted && convertedBlob && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowOriginal(!showOriginal)}
                className="h-8 px-2"
              >
                {showOriginal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                <span className="ml-1 text-xs">
                  {showOriginal ? 'Show Converted' : 'Show Original'}
                </span>
              </Button>
              {onDownload && (
                <Button
                  onClick={onDownload}
                  size="sm"
                  className="h-8 px-2"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>

        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="text-center text-muted-foreground">
                <Eye className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Preview not available</p>
              </div>
            </div>
          ) : (
            <img
              src={showOriginal || !convertedPreviewUrl ? previewUrl : convertedPreviewUrl}
              alt={file.name}
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
          )}
        </div>

        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Original: {formatFileSize(file.size)}</span>
          {isConverted && convertedBlob && (
            <span>Converted: {formatFileSize(convertedBlob.size)}</span>
          )}
        </div>
      </div>
    </Card>
  );
};