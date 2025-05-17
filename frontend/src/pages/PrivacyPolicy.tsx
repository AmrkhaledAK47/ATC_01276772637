
import React from "react";
import { MainLayout } from "@/layouts/main-layout";

const PrivacyPolicy = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, book an event, contact customer support, or otherwise communicate with us. This information may include your name, email address, phone number, and payment information.
          </p>
          
          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and updates, respond to your comments and questions, and communicate with you about events, offers, and promotions.
          </p>
          
          <h2>3. Information Sharing</h2>
          <p>
            We may share your information with event organizers when you book an event, with service providers who perform services on our behalf, and as required by law or to comply with legal processes.
          </p>
          
          <h2>4. Your Choices</h2>
          <p>
            You can update your account information and email preferences at any time through your account settings. You may opt out of receiving promotional communications from us by following the instructions in those communications.
          </p>
          
          <h2>5. Data Security</h2>
          <p>
            We take reasonable measures to help protect information about you from loss, theft, misuse, unauthorized access, disclosure, alteration, and destruction.
          </p>
          
          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar technologies to collect information about your browsing activities and to distinguish you from other users of our website. You can set your browser to refuse all or some browser cookies, but this may prevent you from accessing certain features.
          </p>
          
          <h2>7. Data Retention</h2>
          <p>
            We store the information we collect about you for as long as is necessary for the purpose for which we originally collected it, or for other legitimate business purposes, including to meet our legal, regulatory, or other compliance obligations.
          </p>
          
          <h2>8. Children's Privacy</h2>
          <p>
            Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
          </p>
          
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this privacy policy from time to time. If we make material changes, we will notify you by email or through a notice on our website.
          </p>
          
          <h2>10. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact us at privacy@eventhub.com.
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-center">Last updated: May 10, 2025</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrivacyPolicy;
