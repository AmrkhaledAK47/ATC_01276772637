
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

export type UserRole = "admin" | "user";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Sample users data
const sampleUsers: User[] = [
  {
    id: "1",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=250&h=250&auto=format&fit=crop"
  },
  {
    id: "2",
    name: "John Doe",
    email: "user@example.com",
    role: "user",
    avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=250&h=250&auto=format&fit=crop"
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Check if user is logged in from localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("eventHubUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        localStorage.removeItem("eventHubUser");
      }
    }
    setIsLoading(false);
  }, []);
  
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by email (in a real app, this would validate password too)
    const foundUser = sampleUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem("eventHubUser", JSON.stringify(foundUser));
      toast({
        title: "Welcome back!",
        description: `You've successfully logged in as ${foundUser.name}`,
      });
      navigate(foundUser.role === "admin" ? "/admin" : "/user/dashboard");
    } else {
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Invalid email or password. Try user@example.com / admin@example.com with any password.",
      });
    }
    
    setIsLoading(false);
  };
  
  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API request delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if user already exists
    const userExists = sampleUsers.some(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userExists) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "This email is already registered.",
      });
    } else {
      // Create new user (in a real app, this would be saved to a database)
      const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: "user",
      };
      
      setUser(newUser);
      localStorage.setItem("eventHubUser", JSON.stringify(newUser));
      
      toast({
        title: "Registration successful!",
        description: "Your account has been created.",
      });
      navigate("/user/dashboard");
    }
    
    setIsLoading(false);
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("eventHubUser");
    toast({
      title: "Logged out",
      description: "You've been successfully logged out.",
    });
    navigate("/auth");
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      logout,
      isAdmin: user?.role === "admin",
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
