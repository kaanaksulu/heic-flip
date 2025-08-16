import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Your Privacy is Our Priority</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                At ImageConverter, we are committed to protecting your privacy. This Privacy Policy 
                explains how we handle your information when you use our image conversion services.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Data Processing</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Local Processing Only</h4>
              <p>
                All image conversions happen entirely in your browser using client-side JavaScript. 
                Your images are never uploaded to our servers or any third-party services.
              </p>
              
              <h4>No File Storage</h4>
              <p>
                We do not store, save, or retain any of your images or converted files. Once you 
                close your browser or navigate away from our site, all processed data is permanently deleted.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Information We Collect</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Usage Analytics</h4>
              <p>
                We may collect anonymous usage statistics to improve our service, including:
              </p>
              <ul>
                <li>Number of files converted</li>
                <li>Conversion formats used</li>
                <li>General usage patterns</li>
                <li>Browser and device information</li>
              </ul>
              
              <h4>Local Storage</h4>
              <p>
                We store your conversion preferences (output format, quality settings) locally 
                in your browser to improve your experience. This data never leaves your device.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Third-Party Services</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <h4>Analytics</h4>
              <p>
                We may use Google Analytics or similar services to understand how our service 
                is used. These services may collect anonymous usage data.
              </p>
              
              <h4>Advertising</h4>
              <p>
                We may display advertisements through Google AdSense or similar services. 
                These services may use cookies to show relevant ads.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Your Rights</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>Since we don't collect or store personal data, you have complete control over your information:</p>
              <ul>
                <li>Your images never leave your device</li>
                <li>You can clear browser data at any time</li>
                <li>No account creation or personal information required</li>
                <li>Complete anonymity while using our service</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                Since all processing happens locally in your browser, your images are as secure 
                as your own device. We use HTTPS encryption for all web traffic and follow 
                industry-standard security practices.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Changes to This Policy</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                We may update this Privacy Policy from time to time. Any changes will be posted 
                on this page with an updated revision date.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Contact Us</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <strong>Email:</strong> privacy@imageconverter.com
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;