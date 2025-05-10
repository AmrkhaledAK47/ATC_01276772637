
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";

// Pages
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
import BookingSuccess from "./pages/bookings/BookingSuccess";
import UserBookings from "./pages/user/UserBookings";
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" enableSystem>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Index />} />
              <Route path="/events" element={<EventsDiscovery />} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* User routes */}
              <Route path="/user" element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                <Route path="dashboard" element={<UserDashboard />} />
                <Route path="bookings" element={<UserBookings />} />
              </Route>
              <Route path="/booking/confirmation/:id" element={<BookingSuccess />} />
              
              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route index element={<AdminDashboard />} />
                <Route path="events" element={<EventManagement />} />
                <Route path="events/create" element={<EventForm />} />
                <Route path="events/edit/:id" element={<EventForm />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
              
              {/* Catch-all route for 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
