
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type User = {
  id: string;
  email: string;
  name: string;
  isProvider: boolean;
  avatar?: string;
  // Provider profile fields
  serviceCategory?: string;
  experience?: string;
  businessName?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, isProvider?: boolean) => Promise<void>;
  register: (email: string, password: string, name: string, isProvider: boolean, providerDetails?: ProviderDetails) => Promise<void>;
  logout: () => void;
};

// Provider details type for registration
type ProviderDetails = {
  businessName: string;
  serviceCategory: string;
  experience: string;
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

  // These will be replaced with Supabase implementation
  const login = async (email: string, password: string, isProvider: boolean = false) => {
    try {
      setLoading(true);
      // This would be a Supabase auth call
      // For now, we'll simulate a successful login with temporary data until Supabase is integrated
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Force provider status based on the login form selection
      const tempUser = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        name: email.split('@')[0],
        isProvider,
        avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=4A80F0&color=fff`
      };
      
      setUser(tempUser);
      localStorage.setItem("user", JSON.stringify(tempUser));
      toast.success(`Logged in as ${isProvider ? "provider" : "customer"}`);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Failed to login. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isProvider: boolean, providerDetails?: ProviderDetails) => {
    try {
      setLoading(true);
      // This would be a Supabase auth sign-up call
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newUser: User = {
        id: "user-" + Math.random().toString(36).substring(2, 9),
        email,
        name,
        isProvider,
        avatar: `https://ui-avatars.com/api/?name=${name}&background=4A80F0&color=fff`,
      };

      // Add provider details if registering as a provider
      if (isProvider && providerDetails) {
        newUser.businessName = providerDetails.businessName;
        newUser.serviceCategory = providerDetails.serviceCategory;
        newUser.experience = providerDetails.experience;
      }
      
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
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
