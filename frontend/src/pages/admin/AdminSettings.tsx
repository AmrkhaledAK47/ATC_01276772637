
import React, { useState } from "react"
import { AdminLayout } from "@/layouts/admin-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, Save } from "lucide-react"

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("general")
  const [saved, setSaved] = useState(false)
  
  // General settings state
  const [generalSettings, setGeneralSettings] = useState({
    siteName: "EventHub",
    siteDescription: "Discover amazing events near you.",
    contactEmail: "support@eventhub.example.com",
    logo: "/path/to/logo.png",
    footerText: "© 2025 EventHub. All rights reserved.",
    enableRegistration: true,
    enableBookings: true,
  })
  
  // Email settings state
  const [emailSettings, setEmailSettings] = useState({
    sendWelcomeEmail: true,
    sendBookingConfirmation: true,
    sendEventReminders: true,
    reminderTime: "1day",
    emailSignature: "The EventHub Team",
  })
  
  // Payment settings state
  const [paymentSettings, setPaymentSettings] = useState({
    currency: "USD",
    paymentGateway: "stripe",
    processingFee: "2.9",
    absorbFees: false,
  })
  
  // Display settings state
  const [displaySettings, setDisplaySettings] = useState({
    eventsPerPage: "12",
    defaultView: "grid",
    showFeaturedEvents: true,
    showEventCountdown: true,
    theme: "dark",
  })
  
  const handleSave = () => {
    // Here would be API calls to save settings
    console.log({
      generalSettings,
      emailSettings,
      paymentSettings,
      displaySettings,
    })
    
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }
  
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Configure your application settings and preferences.
        </p>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full md:w-auto bg-card/50 backdrop-blur">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="display">Display</TabsTrigger>
        </TabsList>
        
        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage your site information and basic functionality.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Name</Label>
                  <Input 
                    id="siteName"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Contact Email</Label>
                  <Input 
                    id="contactEmail"
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="siteDescription">Site Description</Label>
                <Textarea 
                  id="siteDescription"
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="footerText">Footer Text</Label>
                <Input 
                  id="footerText"
                  value={generalSettings.footerText}
                  onChange={(e) => setGeneralSettings({...generalSettings, footerText: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableRegistration">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register accounts</p>
                  </div>
                  <Switch 
                    id="enableRegistration"
                    checked={generalSettings.enableRegistration}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableRegistration: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="enableBookings">Enable Event Bookings</Label>
                    <p className="text-sm text-muted-foreground">Allow users to book events</p>
                  </div>
                  <Switch 
                    id="enableBookings"
                    checked={generalSettings.enableBookings}
                    onCheckedChange={(checked) => setGeneralSettings({...generalSettings, enableBookings: checked})}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Email Settings */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>
                Configure when and how to send emails to users.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendWelcomeEmail">Welcome Email</Label>
                    <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                  </div>
                  <Switch 
                    id="sendWelcomeEmail"
                    checked={emailSettings.sendWelcomeEmail}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendWelcomeEmail: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendBookingConfirmation">Booking Confirmation</Label>
                    <p className="text-sm text-muted-foreground">Send email when user books an event</p>
                  </div>
                  <Switch 
                    id="sendBookingConfirmation"
                    checked={emailSettings.sendBookingConfirmation}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendBookingConfirmation: checked})}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sendEventReminders">Event Reminders</Label>
                    <p className="text-sm text-muted-foreground">Send reminders before booked events</p>
                  </div>
                  <Switch 
                    id="sendEventReminders"
                    checked={emailSettings.sendEventReminders}
                    onCheckedChange={(checked) => setEmailSettings({...emailSettings, sendEventReminders: checked})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="reminderTime">Reminder Time</Label>
                <Select 
                  value={emailSettings.reminderTime}
                  onValueChange={(value) => setEmailSettings({...emailSettings, reminderTime: value})}
                  disabled={!emailSettings.sendEventReminders}
                >
                  <SelectTrigger id="reminderTime" className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1hour">1 hour before</SelectItem>
                    <SelectItem value="3hours">3 hours before</SelectItem>
                    <SelectItem value="1day">1 day before</SelectItem>
                    <SelectItem value="3days">3 days before</SelectItem>
                    <SelectItem value="1week">1 week before</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="emailSignature">Email Signature</Label>
                <Textarea 
                  id="emailSignature"
                  value={emailSettings.emailSignature}
                  onChange={(e) => setEmailSettings({...emailSettings, emailSignature: e.target.value})}
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Payment Settings */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Payment Settings</CardTitle>
              <CardDescription>
                Configure payment options and processing fees.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select 
                    value={paymentSettings.currency}
                    onValueChange={(value) => setPaymentSettings({...paymentSettings, currency: value})}
                  >
                    <SelectTrigger id="currency" className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="CAD">CAD ($)</SelectItem>
                      <SelectItem value="AUD">AUD ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="paymentGateway">Payment Gateway</Label>
                  <Select 
                    value={paymentSettings.paymentGateway}
                    onValueChange={(value) => setPaymentSettings({...paymentSettings, paymentGateway: value})}
                  >
                    <SelectTrigger id="paymentGateway" className="w-full">
                      <SelectValue placeholder="Select gateway" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="processingFee">Processing Fee (%)</Label>
                <Input 
                  id="processingFee"
                  type="number"
                  min="0"
                  step="0.01"
                  value={paymentSettings.processingFee}
                  onChange={(e) => setPaymentSettings({...paymentSettings, processingFee: e.target.value})}
                  className="w-full sm:w-[200px]"
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="absorbFees">Absorb Processing Fees</Label>
                  <p className="text-sm text-muted-foreground">Platform absorbs payment processing fees</p>
                </div>
                <Switch 
                  id="absorbFees"
                  checked={paymentSettings.absorbFees}
                  onCheckedChange={(checked) => setPaymentSettings({...paymentSettings, absorbFees: checked})}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Display Settings */}
        <TabsContent value="display">
          <Card>
            <CardHeader>
              <CardTitle>Display Settings</CardTitle>
              <CardDescription>
                Customize how events and content are displayed.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="eventsPerPage">Events Per Page</Label>
                  <Input 
                    id="eventsPerPage"
                    type="number"
                    min="4"
                    value={displaySettings.eventsPerPage}
                    onChange={(e) => setDisplaySettings({...displaySettings, eventsPerPage: e.target.value})}
                    className="w-full sm:w-[200px]"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="defaultView">Default View</Label>
                  <Select 
                    value={displaySettings.defaultView}
                    onValueChange={(value) => setDisplaySettings({...displaySettings, defaultView: value})}
                  >
                    <SelectTrigger id="defaultView" className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Select view" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grid">Grid</SelectItem>
                      <SelectItem value="list">List</SelectItem>
                      <SelectItem value="calendar">Calendar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showFeaturedEvents">Featured Events</Label>
                  <p className="text-sm text-muted-foreground">Show featured events section on home page</p>
                </div>
                <Switch 
                  id="showFeaturedEvents"
                  checked={displaySettings.showFeaturedEvents}
                  onCheckedChange={(checked) => setDisplaySettings({...displaySettings, showFeaturedEvents: checked})}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="showEventCountdown">Event Countdown</Label>
                  <p className="text-sm text-muted-foreground">Show countdown timer for upcoming events</p>
                </div>
                <Switch 
                  id="showEventCountdown"
                  checked={displaySettings.showEventCountdown}
                  onCheckedChange={(checked) => setDisplaySettings({...displaySettings, showEventCountdown: checked})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select 
                  value={displaySettings.theme}
                  onValueChange={(value) => setDisplaySettings({...displaySettings, theme: value})}
                >
                  <SelectTrigger id="theme" className="w-full sm:w-[200px]">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Save Button */}
      <div className="fixed bottom-8 right-8 z-10">
        <Button onClick={handleSave} className="px-8 shadow-lg" disabled={saved}>
          {saved ? (
            <>
              <Check className="mr-2 h-4 w-4" /> Saved
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" /> Save Changes
            </>
          )}
        </Button>
      </div>
    </AdminLayout>
  )
}

export default AdminSettings
