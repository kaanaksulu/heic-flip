import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const TermsOfService = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agreement to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                By accessing and using ImageConverter, you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, 
                please do not use this service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Description</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                ImageConverter is a free, browser-based image conversion service that allows users to:
              </p>
              <ul>
                <li>Convert HEIC files to JPG or PNG format</li>
                <li>Convert between JPG and PNG formats</li>
                <li>Convert between WebP, JPG, and PNG formats</li>
                <li>Process multiple files simultaneously</li>
                <li>Adjust quality settings for lossy formats</li>
              </ul>
              <p>
                All conversions are performed locally in your browser without uploading files to our servers.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acceptable Use</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Permitted Uses</h4>
              <p>You may use our service for:</p>
              <ul>
                <li>Personal image conversion needs</li>
                <li>Commercial projects and business use</li>
                <li>Educational purposes</li>
                <li>Any legal image conversion requirements</li>
              </ul>
              
              <h4>Prohibited Uses</h4>
              <p>You may not use our service for:</p>
              <ul>
                <li>Converting copyrighted images without permission</li>
                <li>Processing illegal or harmful content</li>
                <li>Attempting to reverse engineer our service</li>
                <li>Overloading our servers with excessive requests</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Intellectual Property</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Your Content</h4>
              <p>
                You retain all rights to images you convert using our service. We do not claim 
                any ownership or rights to your images.
              </p>
              
              <h4>Our Service</h4>
              <p>
                The ImageConverter service, including its design, code, and functionality, 
                is protected by copyright and other intellectual property laws.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disclaimer of Warranties</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Our service is provided "as is" without any warranties, expressed or implied. 
                We do not guarantee:
              </p>
              <ul>
                <li>Uninterrupted service availability</li>
                <li>Error-free operation</li>
                <li>Compatibility with all devices or browsers</li>
                <li>Perfect conversion quality in all cases</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Limitation of Liability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                In no event shall ImageConverter be liable for any indirect, incidental, 
                special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Privacy and Data</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Your privacy is important to us. All image processing happens locally in your 
                browser, and we do not store or transmit your images. Please review our 
                Privacy Policy for detailed information about how we handle data.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Availability</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We strive to maintain high service availability but do not guarantee 100% uptime. 
                We may temporarily suspend the service for maintenance, updates, or other 
                operational reasons.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to Terms</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We reserve the right to modify these terms at any time. Changes will be effective 
                immediately upon posting. Your continued use of the service constitutes acceptance 
                of the modified terms.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> legal@imageconverter.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfService;