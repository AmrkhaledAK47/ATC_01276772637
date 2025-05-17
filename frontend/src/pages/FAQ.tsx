
import React from "react";
import { MainLayout } from "@/layouts/main-layout";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ = () => {
  return (
    <MainLayout>
      <div className="container max-w-3xl py-12">
        <h1 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h1>
        
        <Accordion type="single" collapsible className="space-y-4">
          <AccordionItem value="item-1" className="border rounded-lg p-2">
            <AccordionTrigger className="text-lg font-medium px-2">
              How do I book an event?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-2">
              To book an event, simply browse our events page, select the event you're interested in, 
              and click the "Book Now" button. Follow the prompts to complete your booking. You'll 
              receive a confirmation email once your booking is successful.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-2" className="border rounded-lg p-2">
            <AccordionTrigger className="text-lg font-medium px-2">
              Can I cancel my booking?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-2">
              Yes, you can cancel your booking up to 48 hours before the event starts. Go to your 
              user dashboard, find the booking you want to cancel, and click the "Cancel Booking" button. 
              Please note that some events may have different cancellation policies.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-3" className="border rounded-lg p-2">
            <AccordionTrigger className="text-lg font-medium px-2">
              How do I create an account?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-2">
              Click on the "Sign up" button in the top right corner of the page. Enter your name, email address, 
              and create a password. Once you submit the form, you'll receive a verification email. Click the link 
              in the email to verify your account, and you're all set!
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-4" className="border rounded-lg p-2">
            <AccordionTrigger className="text-lg font-medium px-2">
              How can I host my own event?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-2">
              To host your own event, you need to register as an event organizer. Contact us through the 
              Contact page, and our team will guide you through the process of becoming an event host.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-5" className="border rounded-lg p-2">
            <AccordionTrigger className="text-lg font-medium px-2">
              Are there any fees for using EventHub?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-2">
              EventHub is free for users to create accounts and browse events. When booking an event, 
              there may be a small service fee added to the ticket price. Event organizers may have 
              different fee structures depending on their membership level.
            </AccordionContent>
          </AccordionItem>
          
          <AccordionItem value="item-6" className="border rounded-lg p-2">
            <AccordionTrigger className="text-lg font-medium px-2">
              How do I contact an event organizer?
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-2">
              On each event page, you'll find a "Contact Organizer" button. Click on it to send a 
              message directly to the event organizer. Alternatively, if you have a booking for the event, 
              you can access the organizer's contact information from your booking details.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </MainLayout>
  );
};

export default FAQ;
