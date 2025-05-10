
import React from "react";
import { MainLayout } from "@/layouts/main-layout";

const TermsOfService = () => {
  return (
    <MainLayout>
      <div className="container max-w-4xl py-12">
        <h1 className="text-3xl font-bold mb-8">Terms of Service</h1>
        
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using EventHub, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service.
          </p>
          
          <h2>2. Description of Service</h2>
          <p>
            EventHub provides a platform for users to discover, create, and book events. The service includes event listings, booking functionality, user accounts, and related features.
          </p>
          
          <h2>3. User Accounts</h2>
          <p>
            To access certain features of the service, you must register for an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account.
          </p>
          
          <h2>4. User Conduct</h2>
          <p>
            You agree not to use the service for any illegal purpose or to conduct any activity that could damage, disable, or impair the service's functionality. You also agree not to attempt to gain unauthorized access to any part of the service.
          </p>
          
          <h2>5. Event Listings and Bookings</h2>
          <p>
            EventHub does not guarantee the accuracy of event listings or the availability of tickets. Users are responsible for verifying event details. All bookings are final, subject to the cancellation policy of specific events.
          </p>
          
          <h2>6. Payment and Fees</h2>
          <p>
            EventHub may charge service fees for event bookings. All fees are non-refundable unless otherwise specified. Payment processing is handled by third-party payment processors, and you agree to their terms of service.
          </p>
          
          <h2>7. Intellectual Property</h2>
          <p>
            The service and its original content, features, and functionality are owned by EventHub and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
          </p>
          
          <h2>8. Termination</h2>
          <p>
            EventHub may terminate or suspend your account at any time, without prior notice or liability, for any reason, including breach of these Terms of Service.
          </p>
          
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall EventHub, its officers, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or relating to your use of the service.
          </p>
          
          <h2>10. Changes to Terms</h2>
          <p>
            EventHub reserves the right to modify these terms at any time. We will provide notice of significant changes by updating the date at the top of this document and, where appropriate, notifying you by email.
          </p>
          
          <h2>11. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.
          </p>
          
          <h2>12. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at terms@eventhub.com.
          </p>
        </div>
        
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <p className="text-center">Last updated: May 10, 2025</p>
        </div>
      </div>
    </MainLayout>
  );
};

export default TermsOfService;
