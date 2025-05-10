
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index";
import EventDetail from "./pages/events/EventDetail";
import EventsDiscovery from "./pages/events/EventsDiscovery";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EventManagement from "./pages/admin/EventManagement";
import EventForm from "./pages/admin/EventForm";
import UserManagement from "./pages/admin/UserManagement";
import AdminSettings from "./pages/admin/AdminSettings";
import Auth from "./pages/Auth";
import UserDashboard from "./pages/user/UserDashboard";
import BookingConfirmation from "./pages/bookings/BookingConfirmation";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/events" element={<EventsDiscovery />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/auth" element={<Auth />} />
            
            {/* User routes */}
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/booking/confirmation/:id" element={<BookingConfirmation />} />
            
            {/* Admin routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/events" element={<EventManagement />} />
            <Route path="/admin/events/create" element={<EventForm />} />
            <Route path="/admin/events/edit/:id" element={<EventForm />} />
            <Route path="/admin/users" element={<UserManagement />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            
            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
