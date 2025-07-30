import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
  error?: string;
}

interface ConversionProgressProps {
  isConverting: boolean;
  progress: number;
  convertedFiles: ConvertedFile[];
  onDownload: (file: ConvertedFile) => void;
  onDownloadAll: () => void;
  delayMessage?: string;
}

export const ConversionProgress: React.FC<ConversionProgressProps> = ({
  isConverting,
  progress,
  convertedFiles,
  onDownload,
  onDownloadAll,
  delayMessage
}) => {
  if (!isConverting && convertedFiles.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Conversion Progress</h3>
      
      {isConverting && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">
              {delayMessage || 'Converting files...'}
            </span>
            <span className="text-sm text-muted-foreground">
              {delayMessage ? 'Please wait...' : `${progress}%`}
            </span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {convertedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Converted Files</span>
            {convertedFiles.length > 1 && (
              <Button onClick={onDownloadAll} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {convertedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center gap-3">
                  {file.error ? (
                    <AlertCircle className="h-5 w-5 text-destructive" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  )}
                  <div>
                    <p className="font-medium">{file.originalName}</p>
                    {file.error ? (
                      <p className="text-sm text-destructive">{file.error}</p>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        {(file.convertedBlob.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                </div>
                {!file.error && (
                  <Button
                    onClick={() => onDownload(file)}
                    size="sm"
                    variant="outline"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};