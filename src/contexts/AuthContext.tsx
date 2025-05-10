
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "@/hooks/use-toast";

// Define user types
export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  bookedEvents: string[]; // Array of event IDs
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  bookEvent: (eventId: string) => void;
  isEventBooked: (eventId: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo users for testing
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    bookedEvents: ['2', '5']
  },
  {
    id: '2',
    name: 'Regular User',
    email: 'user@example.com',
    role: 'user',
    bookedEvents: ['1', '3']
  }
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  
  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (in a real app, this would validate the password too)
    const foundUser = demoUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      // Store user in state and localStorage
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
      toast({
        title: "Login successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      // Redirect based on role
      if (foundUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: "Login failed",
        description: "Invalid email or password",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if email already exists
    if (demoUsers.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      toast({
        title: "Registration failed",
        description: "Email already in use",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Create new user
    const newUser: User = {
      id: `${demoUsers.length + 1}`,
      name,
      email,
      role: 'user', // Default role for new users
      bookedEvents: []
    };
    
    // In a real app, you would save this to a database
    demoUsers.push(newUser);
    
    // Log in the new user
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    toast({
      title: "Registration successful",
      description: `Welcome, ${name}!`,
    });
    
    navigate('/');
    setIsLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
    navigate('/');
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };
  
  const bookEvent = (eventId: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to book events",
        variant: "destructive"
      });
      navigate('/auth');
      return;
    }
    
    // Check if already booked
    if (user.bookedEvents.includes(eventId)) {
      toast({
        title: "Already booked",
        description: "You have already booked this event",
        variant: "destructive"
      });
      return;
    }
    
    // Add event to user's booked events
    const updatedUser = {
      ...user,
      bookedEvents: [...user.bookedEvents, eventId]
    };
    
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Update demo user for persistence
    const userIndex = demoUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      demoUsers[userIndex] = updatedUser;
    }
    
    toast({
      title: "Booking successful",
      description: "You have successfully booked this event",
    });
    
    // Navigate to confirmation page
    navigate(`/booking/confirmation/${eventId}`);
  };
  
  const isEventBooked = (eventId: string) => {
    return user ? user.bookedEvents.includes(eventId) : false;
  };
  
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    bookEvent,
    isEventBooked
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
