import React, { useState } from 'react';
import { FileUpload } from '@/components/FileUpload';
import { ConversionSettings } from '@/components/ConversionSettings';
import { ConversionProgress } from '@/components/ConversionProgress';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import heic2any from 'heic2any';
import heroImage from '@/assets/hero-bg.jpg';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
  error?: string;
}

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useState<'jpeg' | 'png'>('jpeg');
  const [quality, setQuality] = useState(85);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);

  const handleFilesSelected = (files: File[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    toast.success(`${files.length} file(s) added for conversion`);
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.error('Please select files to convert');
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedFiles([]);
    
    const converted: ConvertedFile[] = [];

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      try {
        const convertedBlob = await heic2any({
          blob: file,
          toType: `image/${outputFormat}`,
          quality: outputFormat === 'jpeg' ? quality / 100 : 1,
        }) as Blob;

        const downloadUrl = URL.createObjectURL(convertedBlob);
        const originalName = file.name.replace(/\.(heic|heif)$/i, `.${outputFormat}`);

        converted.push({
          originalName,
          convertedBlob,
          downloadUrl,
        });

        toast.success(`Converted ${file.name}`);
      } catch (error) {
        console.error('Conversion error:', error);
        converted.push({
          originalName: file.name,
          convertedBlob: new Blob(),
          downloadUrl: '',
          error: 'Failed to convert file',
        });
        toast.error(`Failed to convert ${file.name}`);
      }

      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setConvertedFiles(converted);
    setIsConverting(false);
    toast.success('Conversion completed!');
  };

  const handleDownload = (file: ConvertedFile) => {
    const link = document.createElement('a');
    link.href = file.downloadUrl;
    link.download = file.originalName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadAll = () => {
    convertedFiles.forEach(file => {
      if (!file.error) {
        handleDownload(file);
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div 
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url(${heroImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            HEIC to JPG/PNG Converter
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Convert your Apple HEIC images to universal JPG or PNG formats instantly
          </p>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            Fast, secure, and completely free. Your files are processed locally in your browser - no upload to servers required.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* File Upload */}
        <FileUpload
          onFilesSelected={handleFilesSelected}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
        />

        {/* Conversion Settings */}
        {selectedFiles.length > 0 && (
          <ConversionSettings
            outputFormat={outputFormat}
            onFormatChange={setOutputFormat}
            quality={quality}
            onQualityChange={setQuality}
          />
        )}

        {/* Convert Button */}
        {selectedFiles.length > 0 && !isConverting && (
          <div className="text-center">
            <Button
              onClick={convertFiles}
              size="lg"
              className="bg-gradient-to-r from-primary to-primary-glow hover:opacity-90 px-8 py-3 text-lg font-semibold"
            >
              Convert {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
            </Button>
          </div>
        )}

        {/* Conversion Progress */}
        <ConversionProgress
          isConverting={isConverting}
          progress={progress}
          convertedFiles={convertedFiles}
          onDownload={handleDownload}
          onDownloadAll={handleDownloadAll}
        />

        {/* Info Section */}
        <div className="bg-card rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold mb-4">Why Convert HEIC Files?</h3>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-medium mb-2">Universal Compatibility</h4>
              <p className="text-muted-foreground">
                JPG and PNG work on all devices and platforms, while HEIC is primarily supported on Apple devices.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Web Sharing</h4>
              <p className="text-muted-foreground">
                Most websites and social media platforms don't support HEIC format for uploads.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Privacy First</h4>
              <p className="text-muted-foreground">
                All conversion happens in your browser. Your files never leave your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;