import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  title?: string;
  subtitle?: string;
  faqs?: FAQItem[];
}

const FAQ: React.FC<FAQProps> = ({ 
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about HEIC conversion",
  faqs = [
    {
      question: 'What is HEIC format and why do I need to convert it?',
      answer: 'HEIC (High Efficiency Image Container) is Apple\'s modern image format that provides better compression than JPEG while maintaining quality. However, it\'s not widely supported outside of Apple devices, making conversion necessary for sharing and web use.',
    },
    {
      question: 'Is my data safe? Do you store my images?',
      answer: 'Absolutely safe! All conversions happen locally in your browser using WebAssembly. Your images never leave your device or get uploaded to any server. We have zero access to your files.',
    },
    {
      question: 'What\'s the difference between JPG and PNG output?',
      answer: 'JPG is better for photos with smaller file sizes but uses lossy compression. PNG is lossless and supports transparency but creates larger files. Choose JPG for photos and PNG when you need perfect quality or transparency.',
    },
    {
      question: 'Can I convert multiple files at once?',
      answer: 'Yes! You can select multiple HEIC files and convert them all in one batch. The tool will process them efficiently and allow you to download all converted files at once.',
    },
    {
      question: 'What quality setting should I use for JPG?',
      answer: 'For most photos, 85% quality provides an excellent balance between file size and image quality. Use 95%+ for professional work or 70-80% for web sharing where smaller file sizes are preferred.',
    },
    {
      question: 'Does this work on mobile devices?',
      answer: 'Yes! Our converter is fully responsive and works on all modern browsers including mobile Safari, Chrome, and Firefox on both iOS and Android devices.',
    },
  ]
}) => {

  return (
    <section className="py-16 bg-background">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {title}
          </h2>
          <p className="text-lg text-muted-foreground">
            {subtitle}
          </p>
        </div>
        
        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
              <AccordionTrigger className="text-left hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

export default FAQ;