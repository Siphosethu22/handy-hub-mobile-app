
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
  isProvider: boolean;
  avatar?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isProvider?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string, isProvider: boolean) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if the user is logged in on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Failed to parse user from localStorage", error);
      }
    }
    
    setLoading(false);
  }, []);

  // Mock functions for authentication (will be replaced with Supabase)
  const login = async (email: string, password: string, isProvider: boolean = false) => {
    try {
      setLoading(true);
      // This would be a Supabase auth call
      // For now, we'll simulate a successful login with mock data
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force provider status based on the login form selection
      const mockUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        isProvider,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=4A80F0&color=fff`
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success(`Logged in as ${isProvider ? "provider" : "customer"}`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isProvider: boolean) => {
    try {
      setLoading(true);
      // This would be a Supabase auth sign-up call
      // For now, we'll simulate a successful registration
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        name,
        isProvider,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=4A80F0&color=fff`
      };
      
      setUser(mockUser);
      localStorage.setItem("user", JSON.stringify(mockUser));
      toast.success("Registration successful!");
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Failed to register. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    toast.info("You have been logged out");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
