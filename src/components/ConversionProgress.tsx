import React from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, Download, AlertCircle, FileCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/utils/fileValidation';
import { ImagePreview } from '@/components/ImagePreview';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
  error?: string;
  originalFile?: File;
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
            <div className="flex items-center gap-2">
              <FileCheck className="h-5 w-5 text-green-500" />
              <span className="font-medium">
                Converted Files ({convertedFiles.filter(f => !f.error).length}/{convertedFiles.length})
              </span>
            </div>
            {convertedFiles.filter(f => !f.error).length > 1 && (
              <Button onClick={onDownloadAll} size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {convertedFiles.map((file, index) => (
              <div key={index}>
                {file.error ? (
                  <Card className="p-4 border-destructive/50">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-destructive" />
                      <div>
                        <p className="font-medium">{file.originalName}</p>
                        <p className="text-sm text-destructive font-medium">{file.error}</p>
                      </div>
                    </div>
                  </Card>
                ) : file.originalFile ? (
                  <ImagePreview
                    file={file.originalFile}
                    convertedBlob={file.convertedBlob}
                    convertedName={file.originalName}
                    onDownload={() => onDownload(file)}
                    isConverted={true}
                  />
                ) : (
                  <Card className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">{file.originalName}</p>
                          <p className="text-sm text-muted-foreground">
                            Size: {formatFileSize(file.convertedBlob.size)} • Ready to download
                          </p>
                        </div>
                      </div>
                      <Button
                        onClick={() => onDownload(file)}
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </Card>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};