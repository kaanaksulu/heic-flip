import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FileUpload } from '@/components/FileUpload';
import { ConversionSettings } from '@/components/ConversionSettings';
import { ConversionProgress } from '@/components/ConversionProgress';
import FeatureSection from '@/components/FeatureSection';
import FAQ from '@/components/FAQ';
import Footer from '@/components/Footer';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import heic2any from 'heic2any';
import JSZip from 'jszip';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { validateFiles } from '@/utils/fileValidation';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
  error?: string;
  originalFile?: File;
}

const Index = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useLocalStorage<'jpeg' | 'png'>('outputFormat', 'jpeg');
  const [quality, setQuality] = useLocalStorage<number>('quality', 85);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [delayMessage, setDelayMessage] = useState('');

  const handleFilesSelected = (files: File[]) => {
    const validation = validateFiles(files);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

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

    const validation = validateFiles(selectedFiles);
    if (!validation.isValid) {
      toast.error(validation.error);
      return;
    }

    setIsConverting(true);
    setProgress(0);
    setConvertedFiles([]);
    
    // 10-second delay with staged messages
    const delayStages = [
      { message: 'Preparing conversion...', duration: 2000 },
      { message: 'Analyzing HEIC files...', duration: 3000 },
      { message: 'Optimizing output quality...', duration: 3000 },
      { message: 'Finalizing conversion setup...', duration: 2000 }
    ];

    for (const stage of delayStages) {
      setDelayMessage(stage.message);
      await new Promise(resolve => setTimeout(resolve, stage.duration));
    }
    
    setDelayMessage('Converting files...');
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
          originalFile: file,
        });

        toast.success(`Converted ${file.name}`);
      } catch (error) {
        console.error('Conversion error:', error);
        converted.push({
          originalName: file.name,
          convertedBlob: new Blob(),
          downloadUrl: '',
          error: 'Failed to convert file',
          originalFile: file,
        });
        toast.error(`Failed to convert ${file.name}`);
      }

      setProgress(Math.round(((i + 1) / selectedFiles.length) * 100));
    }

    setConvertedFiles(converted);
    setIsConverting(false);
    setDelayMessage('');
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

  const handleDownloadAll = async () => {
    const successfulFiles = convertedFiles.filter(file => !file.error);
    
    if (successfulFiles.length === 0) {
      toast.error('No successful conversions to download');
      return;
    }

    if (successfulFiles.length === 1) {
      // Single file - download directly
      handleDownload(successfulFiles[0]);
      return;
    }

    // Multiple files - create and download zip
    try {
      toast.info('Creating zip file...');
      
      const zip = new JSZip();
      
      // Add each converted file to the zip
      successfulFiles.forEach((file, index) => {
        const fileName = file.originalName;
        zip.file(fileName, file.convertedBlob);
      });

      // Generate zip file
      const zipBlob = await zip.generateAsync({ 
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 }
      });

      // Create download link for zip
      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      link.download = `heic-converted-${outputFormat.toUpperCase()}-${successfulFiles.length}-files-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the zip URL
      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);

      toast.success(`Downloaded ${successfulFiles.length} files as zip`);
    } catch (error) {
      console.error('Zip creation error:', error);
      toast.error('Failed to create zip file. Downloading files individually...');
      
      // Fallback to individual downloads
      successfulFiles.forEach(file => {
        handleDownload(file);
      });
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary to-primary-glow text-primary-foreground">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary-glow/20" />
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

      {/* Top Ad Banner */}
      <AdBanner adSlot="1234567890" className="bg-card/50 rounded-lg" />

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
          delayMessage={delayMessage}
        />

        {/* Info Section */}
        {/* Bottom Ad Banner */}
        <AdBanner adSlot="0987654321" adFormat="horizontal" className="bg-card/50 rounded-lg" />
      </div>

      {/* Feature Section */}
      <FeatureSection />

      {/* FAQ Section */}
      <div id="faq">
        <FAQ 
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about HEIC conversion"
        />
      </div>
      </div>
    </Layout>
  );
};

export default Index;