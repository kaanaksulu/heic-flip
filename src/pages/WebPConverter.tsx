import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { FileUpload } from '@/components/FileUpload';
import { ConversionSettings } from '@/components/ConversionSettings';
import { ConversionProgress } from '@/components/ConversionProgress';
import FeatureSection from '@/components/FeatureSection';
import FAQ from '@/components/FAQ';
import AdBanner from '@/components/AdBanner';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { toast } from 'sonner';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ConvertedFile {
  originalName: string;
  convertedBlob: Blob;
  downloadUrl: string;
  error?: string;
}

const WebPConverter = () => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [outputFormat, setOutputFormat] = useLocalStorage<'webp' | 'jpeg' | 'png'>('webpOutputFormat', 'webp');
  const [quality, setQuality] = useLocalStorage<number>('webpQuality', 85);
  const [compressionType, setCompressionType] = useLocalStorage<'lossy' | 'lossless'>('webpCompressionType', 'lossy');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedFiles, setConvertedFiles] = useState<ConvertedFile[]>([]);
  const [delayMessage, setDelayMessage] = useState('');

  const handleFilesSelected = (files: File[]) => {
    // Filter for WebP/JPG/PNG files
    const validFiles = files.filter(file => 
      file.type === 'image/webp' || 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' ||
      file.type === 'image/png' ||
      file.name.toLowerCase().endsWith('.webp') ||
      file.name.toLowerCase().endsWith('.jpg') ||
      file.name.toLowerCase().endsWith('.jpeg') ||
      file.name.toLowerCase().endsWith('.png')
    );

    if (validFiles.length !== files.length) {
      toast.error('Please select only WebP, JPG, or PNG files');
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
        const convertedBlob = await convertImageFile(file, outputFormat, quality, compressionType);
        const downloadUrl = URL.createObjectURL(convertedBlob);
        const extension = outputFormat === 'jpeg' ? 'jpg' : outputFormat;
        const originalName = file.name.replace(/\.(webp|jpg|jpeg|png)$/i, `.${extension}`);

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
    setDelayMessage('');
    toast.success('Conversion completed!');
  };

  const convertImageFile = (
    file: File, 
    format: 'webp' | 'jpeg' | 'png', 
    quality: number, 
    compressionType: 'lossy' | 'lossless'
  ): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);

        let mimeType: string;
        let qualityValue: number;

        if (format === 'webp') {
          mimeType = 'image/webp';
          qualityValue = compressionType === 'lossless' ? 1 : quality / 100;
        } else if (format === 'jpeg') {
          mimeType = 'image/jpeg';
          qualityValue = quality / 100;
        } else {
          mimeType = 'image/png';
          qualityValue = 1; // PNG is always lossless
        }

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

  const handleDownloadAll = () => {
    convertedFiles.forEach(file => {
      if (!file.error) {
        handleDownload(file);
      }
    });
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-background to-secondary">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-teal-600 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/20 to-teal-600/20" />
          <div className="relative max-w-4xl mx-auto px-6 py-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              WebP ⇄ JPG/PNG Converter
            </h1>
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              Convert between WebP, JPG, and PNG with advanced quality control
            </p>
            <p className="text-lg opacity-75 max-w-2xl mx-auto">
              Modern WebP format with superior compression and quality. Choose between lossy and lossless compression for optimal results.
            </p>
          </div>
        </div>

        {/* Top Ad Banner */}
        <AdBanner adSlot="1234567892" className="bg-card/50 rounded-lg" />

        {/* Main Content */}
        <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">
          {/* File Upload */}
          <FileUpload
            onFilesSelected={handleFilesSelected}
            selectedFiles={selectedFiles}
            onRemoveFile={handleRemoveFile}
            acceptedTypes={{
              'image/webp': ['.webp'],
              'image/jpeg': ['.jpg', '.jpeg'],
              'image/png': ['.png']
            }}
            title="Upload WebP/JPG/PNG Files"
            description="Drag & drop your WebP, JPG, or PNG files here, or click to browse"
            supportText="Supports .webp, .jpg, .jpeg, and .png formats"
          />

          {/* Conversion Settings */}
          {selectedFiles.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
              
              <div className="space-y-6">
                <div>
                  <Label className="text-base font-medium mb-3 block">Output Format</Label>
                  <RadioGroup
                    value={outputFormat}
                    onValueChange={(value: 'webp' | 'jpeg' | 'png') => setOutputFormat(value)}
                    className="flex gap-6"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="webp" id="webp" />
                      <Label htmlFor="webp" className="cursor-pointer">
                        WebP
                        <span className="text-xs text-muted-foreground block">
                          Modern format, best compression
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="jpeg" id="jpeg" />
                      <Label htmlFor="jpeg" className="cursor-pointer">
                        JPEG
                        <span className="text-xs text-muted-foreground block">
                          Universal compatibility
                        </span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="png" id="png" />
                      <Label htmlFor="png" className="cursor-pointer">
                        PNG
                        <span className="text-xs text-muted-foreground block">
                          Lossless, supports transparency
                        </span>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {outputFormat === 'webp' && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">Compression Type</Label>
                    <RadioGroup
                      value={compressionType}
                      onValueChange={(value: 'lossy' | 'lossless') => setCompressionType(value)}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lossy" id="lossy" />
                        <Label htmlFor="lossy" className="cursor-pointer">
                          Lossy
                          <span className="text-xs text-muted-foreground block">
                            Smaller files, adjustable quality
                          </span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="lossless" id="lossless" />
                        <Label htmlFor="lossless" className="cursor-pointer">
                          Lossless
                          <span className="text-xs text-muted-foreground block">
                            Perfect quality, larger files
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {((outputFormat === 'webp' && compressionType === 'lossy') || outputFormat === 'jpeg') && (
                  <div>
                    <Label className="text-base font-medium mb-3 block">
                      Quality: {quality}%
                    </Label>
                    <Slider
                      value={[quality]}
                      onValueChange={(value) => setQuality(value[0])}
                      max={100}
                      min={10}
                      step={5}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground mt-1">
                      <span>Lower quality (smaller file)</span>
                      <span>Higher quality (larger file)</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Convert Button */}
          {selectedFiles.length > 0 && !isConverting && (
            <div className="text-center">
              <Button
                onClick={convertFiles}
                size="lg"
                className="bg-gradient-to-r from-green-600 to-teal-600 hover:opacity-90 px-8 py-3 text-lg font-semibold"
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
          <AdBanner adSlot="0987654323" adFormat="horizontal" className="bg-card/50 rounded-lg" />
        </div>

        {/* Feature Section */}
        <FeatureSection 
          title="Why Use Our WebP Converter?"
          subtitle="Next-generation image format with superior compression and quality"
          features={[
            {
              icon: 'Zap',
              title: 'Superior Compression',
              description: 'WebP provides 25-35% better compression than JPEG while maintaining the same quality.',
            },
            {
              icon: 'Shield',
              title: 'Privacy First',
              description: 'All conversions happen locally in your browser. Your files never leave your device.',
            },
            {
              icon: 'Image',
              title: 'Lossy & Lossless',
              description: 'Choose between lossy compression for smaller files or lossless for perfect quality.',
            },
            {
              icon: 'Globe',
              title: 'Modern Standard',
              description: 'WebP is supported by all modern browsers and offers the best of both JPEG and PNG.',
            },
            {
              icon: 'Download',
              title: 'Batch Processing',
              description: 'Convert multiple files simultaneously and download them all at once.',
            },
            {
              icon: 'Smartphone',
              title: 'Mobile Optimized',
              description: 'Perfect for web optimization and mobile applications with faster loading times.',
            },
          ]}
        />

        {/* FAQ Section */}
        <div id="faq">
          <FAQ 
            title="Frequently Asked Questions"
            subtitle="Everything you need to know about WebP conversion"
            faqs={[
              {
                question: 'What is WebP and why should I use it?',
                answer: 'WebP is a modern image format developed by Google that provides superior compression compared to JPEG and PNG. It can reduce file sizes by 25-35% while maintaining the same quality, making it perfect for web optimization.',
              },
              {
                question: 'What\'s the difference between lossy and lossless WebP?',
                answer: 'Lossy WebP uses compression similar to JPEG, allowing you to adjust quality for smaller file sizes. Lossless WebP preserves perfect image quality like PNG but with better compression than traditional PNG.',
              },
              {
                question: 'When should I convert to WebP vs JPG/PNG?',
                answer: 'Use WebP for web applications and modern browsers for best compression. Convert to JPG for universal compatibility and photos. Use PNG when you need transparency or are working with older systems.',
              },
              {
                question: 'Is WebP supported by all browsers?',
                answer: 'WebP is supported by all modern browsers including Chrome, Firefox, Safari, and Edge. For older browser support, you might want to keep JPG/PNG versions as fallbacks.',
              },
              {
                question: 'Can I convert multiple files at once?',
                answer: 'Yes! You can select multiple WebP, JPG, and PNG files and convert them all in one batch. The tool will process them efficiently and let you download all converted files at once.',
              },
              {
                question: 'Are my images uploaded to a server?',
                answer: 'No, all processing happens locally in your browser using HTML5 Canvas API. Your images never leave your device, ensuring complete privacy and security.',
              },
            ]}
          />
        </div>
      </div>
    </Layout>
  );
};

export default WebPConverter;