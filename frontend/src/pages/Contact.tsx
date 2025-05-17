
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { MapPin, Mail, Phone } from "lucide-react";

const Contact = () => {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [subject, setSubject] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Message sent",
        description: "We'll get back to you as soon as possible.",
      });
      // Reset form
      setName("");
      setEmail("");
      setMessage("");
      setSubject("");
    }, 1500);
  };

  return (
    <MainLayout>
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-center text-muted-foreground mb-12">
          Have questions or need assistance? We're here to help!
        </p>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="col-span-1 space-y-8">
            <div className="flex items-start space-x-4">
              <MapPin className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Our Location</h3>
                <p className="text-muted-foreground mt-1">
                  123 Event Street<br />
                  San Francisco, CA 94105<br />
                  United States
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Mail className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Email Us</h3>
                <p className="text-muted-foreground mt-1">
                  support@eventhub.com<br />
                  info@eventhub.com
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <Phone className="h-6 w-6 text-primary mt-1" />
              <div>
                <h3 className="font-medium">Call Us</h3>
                <p className="text-muted-foreground mt-1">
                  +1 (555) 123-4567<br />
                  Monday-Friday: 9AM-5PM PST
                </p>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card rounded-lg border shadow-sm">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Your Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com" 
                    required 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input 
                  id="subject" 
                  value={subject} 
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="How can we help you?" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  value={message} 
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Please enter your message here..." 
                  rows={6} 
                  required 
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                    Sending...
                  </>
                ) : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Contact;
