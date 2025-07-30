import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';

interface ConversionSettingsProps {
  outputFormat: 'jpeg' | 'png';
  onFormatChange: (format: 'jpeg' | 'png') => void;
  quality: number;
  onQualityChange: (quality: number) => void;
}

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({
  outputFormat,
  onFormatChange,
  quality,
  onQualityChange
}) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4">Conversion Settings</h3>
      
      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">Output Format</Label>
          <RadioGroup
            value={outputFormat}
            onValueChange={(value: 'jpeg' | 'png') => onFormatChange(value)}
            className="flex gap-6"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="jpeg" id="jpeg" />
              <Label htmlFor="jpeg" className="cursor-pointer">
                JPEG
                <span className="text-xs text-muted-foreground block">
                  Smaller file size, good compression
                </span>
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="png" id="png" />
              <Label htmlFor="png" className="cursor-pointer">
                PNG
                <span className="text-xs text-muted-foreground block">
                  Lossless, preserves transparency
                </span>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {outputFormat === 'jpeg' && (
          <div>
            <Label className="text-base font-medium mb-3 block">
              Quality: {quality}%
            </Label>
            <Slider
              value={[quality]}
              onValueChange={(value) => onQualityChange(value[0])}
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
  );
};