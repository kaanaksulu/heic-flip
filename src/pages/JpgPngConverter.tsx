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
import { useLocalStorage } from '@/hooks/useLocalStorage';
import JSZip from 'jszip';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
  error?: string;
  originalFile?: File;
}

const JpgPngConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useLocalStorage<'jpeg' | 'png'>('jpgPngOutputFormat', 'png');
  const [quality, setQuality] = useLocalStorage<number>('jpgPngQuality', 85);
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [delayMessage, setDelayMessage] = useState('');

  const handleFilesSelected = (files: File[]) => {
    // Filter for JPG/PNG files
    const validFiles = files.filter(file => 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.png')
    );

    if (validFiles.length !== files.length) {
      toast.error('Please select only JPG or PNG files');
    }

    if (validFiles.length === 0) {
      toast.error('No valid image files selected');
      return;
    }

    setSelectedFiles(prev => [...prev, ...validFiles]);
    toast.success(`${validFiles.length} file(s) added for conversion`);
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
    
    // Delay stages for better UX
    const delayStages = [
      { message: 'Preparing conversion...', duration: 1000 },
      { message: 'Processing images...', duration: 1500 },
      { message: 'Optimizing quality...', duration: 1500 },
      { message: 'Finalizing conversion...', duration: 1000 }
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
        const convertedBlob = await convertImageFile(file, outputFormat, quality);
        const downloadUrl = URL.createObjectURL(convertedBlob);
        const extension = outputFormat === 'jpeg' ? 'jpg' : 'png';
        const originalName = file.name.replace(/\.(jpg|jpeg|png)$/i, `.${extension}`);

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

  const convertImageFile = (file: File, format: 'jpeg' | 'png', quality: number): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        const mimeType = format === 'jpeg' ? 'image/jpeg' : 'image/png';
        const qualityValue = format === 'jpeg' ? quality / 100 : 1;

        canvas.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert image'));
          }
        }, mimeType, qualityValue);

        // Clean up
        URL.revokeObjectURL(img.src);
      };

      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };

      img.src = URL.createObjectURL(file);
    });
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
      handleDownload(successfulFiles[0]);
      return;
    }

    try {
      toast.info('Creating zip file...');

      const zip = new JSZip();

      successfulFiles.forEach((file) => {
        zip.file(file.originalName, file.convertedBlob);
      });

      const zipBlob = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: { level: 6 },
      });

      const zipUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = zipUrl;
      const ext = outputFormat === 'jpeg' ? 'JPG' : 'PNG';
      link.download = `converted-${ext}-${successfulFiles.length}-files-${new Date().toISOString().slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(zipUrl), 1000);

      toast.success(`Downloaded ${successfulFiles.length} files as zip`);
    } catch (error) {
      console.error('Zip creation error:', error);
      toast.error('Failed to create zip file. Downloading files individually...');
      successfulFiles.forEach(handleDownload);
    }
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background to-secondary">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20" />
        <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            JPG ⇄ PNG Converter
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8">
            Convert between JPG and PNG formats with ease
          </p>
          <p className="text-lg opacity-75 max-w-2xl mx-auto">
            High-quality conversion between JPEG and PNG formats. Perfect for optimizing images for web or preserving transparency.
          </p>
        </div>
      </div>

      {/* Top Ad Banner */}
      <AdBanner adSlot="1234567891" className="bg-card/50 rounded-lg" />

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
        {/* File Upload */}
        <FileUpload
          onFilesSelected={handleFilesSelected}
          selectedFiles={selectedFiles}
          onRemoveFile={handleRemoveFile}
          acceptedTypes={{
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png']
          }}
          title="Upload JPG/PNG Files"
          description="Drag & drop your JPG or PNG files here, or click to browse"
          supportText="Supports .jpg, .jpeg, and .png formats"
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
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 px-8 py-3 text-lg font-semibold"
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

        {/* Bottom Ad Banner */}
        <AdBanner adSlot="0987654322" adFormat="horizontal" className="bg-card/50 rounded-lg" />
      </div>

      {/* Feature Section */}
      <FeatureSection 
        title="Why Use Our JPG/PNG Converter?"
        subtitle="Professional-grade conversion with privacy and speed at the forefront"
        features={[
          {
            icon: 'Shield',
            title: 'Privacy First',
            description: 'All conversions happen locally in your browser. Your files never leave your device.',
          },
          {
            icon: 'Zap',
            title: 'Lightning Fast',
            description: 'Convert multiple JPG and PNG files simultaneously with optimized processing.',
          },
          {
            icon: 'Globe',
            title: 'Universal Compatibility',
            description: 'Convert between JPG and PNG formats that work everywhere.',
          },
          {
            icon: 'Download',
            title: 'Batch Processing',
            description: 'Download all converted files at once or individually.',
          },
          {
            icon: 'Smartphone',
            title: 'Mobile Friendly',
            description: 'Works perfectly on all devices - desktop, tablet, and mobile.',
          },
          {
            icon: 'Image',
            title: 'Quality Control',
            description: 'Adjust compression settings for the perfect balance of quality and file size.',
          },
        ]}
      />

      {/* FAQ Section */}
      <div id="faq">
        <FAQ 
          title="Frequently Asked Questions"
          subtitle="Everything you need to know about JPG/PNG conversion"
          faqs={[
            {
              question: 'When should I convert JPG to PNG?',
              answer: 'Convert JPG to PNG when you need transparency support, lossless quality, or when working with graphics that have sharp edges and text. PNG is ideal for logos, screenshots, and images with transparent backgrounds.',
            },
            {
              question: 'When should I convert PNG to JPG?',
              answer: 'Convert PNG to JPG when you need smaller file sizes for web use, email, or storage. JPG is perfect for photographs and images with many colors where slight quality loss is acceptable for significant size reduction.',
            },
            {
              question: 'Will converting between formats affect image quality?',
              answer: 'Converting from JPG to PNG maintains the current quality but won\'t restore lost detail. Converting PNG to JPG may reduce quality due to compression, but you can control this with the quality slider.',
            },
            {
              question: 'What happens to transparency when converting PNG to JPG?',
              answer: 'JPG doesn\'t support transparency, so transparent areas will be filled with a solid color (usually white). If you need transparency, keep the PNG format.',
            },
            {
              question: 'Can I convert multiple files at once?',
              answer: 'Yes! You can select multiple JPG and PNG files and convert them all in one batch. The tool will process them efficiently and let you download all converted files at once.',
            },
            {
              question: 'Are my images uploaded to a server?',
              answer: 'No, all processing happens locally in your browser. Your images never leave your device, ensuring complete privacy and security.',
            },
          ]}
        />
      </div>
      </div>
    </Layout>
  );
};

export default JpgPngConverter;