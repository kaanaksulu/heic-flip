import React from 'react';
import { Shield, Zap, Globe, Download, Smartphone, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const FeatureSection = () => {
  const features = [
    {
      icon: Shield,
      title: 'Privacy First',
      description: 'All conversions happen locally in your browser. Your files never leave your device.',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Convert multiple HEIC files simultaneously with optimized processing.',
    },
    {
      icon: Globe,
      title: 'Universal Compatibility',
      description: 'Convert to JPG or PNG formats that work everywhere.',
    },
    {
      icon: Download,
      title: 'Batch Download',
      description: 'Download all converted files at once or individually.',
    },
    {
      icon: Smartphone,
      title: 'Mobile Friendly',
      description: 'Works perfectly on all devices - desktop, tablet, and mobile.',
    },
    {
      icon: Image,
      title: 'Quality Control',
      description: 'Adjust compression quality to balance file size and image quality.',
    },
  ];

  return (
    <section className="py-16 bg-gradient-subtle">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose Our HEIC Converter?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Professional-grade conversion with privacy and speed at the forefront
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;