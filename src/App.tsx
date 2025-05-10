
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
import { AuthProvider } from "./context/AuthContext";
import { EventProvider } from "./context/EventContext";
import ProtectedRoute from "./components/shared/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <EventProvider>
              <Toaster />
              <Sonner />
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Index />} />
                <Route path="/events" element={<EventsDiscovery />} />
                <Route path="/events/:id" element={<EventDetail />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* User routes */}
                <Route path="/user/dashboard" element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/booking/confirmation/:id" element={
                  <ProtectedRoute>
                    <BookingConfirmation />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute requireAdmin>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin/events" element={
                  <ProtectedRoute requireAdmin>
                    <EventManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/events/create" element={
                  <ProtectedRoute requireAdmin>
                    <EventForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/events/edit/:id" element={
                  <ProtectedRoute requireAdmin>
                    <EventForm />
                  </ProtectedRoute>
                } />
                <Route path="/admin/users" element={
                  <ProtectedRoute requireAdmin>
                    <UserManagement />
                  </ProtectedRoute>
                } />
                <Route path="/admin/settings" element={
                  <ProtectedRoute requireAdmin>
                    <AdminSettings />
                  </ProtectedRoute>
                } />
                
                {/* Catch-all route for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </EventProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
