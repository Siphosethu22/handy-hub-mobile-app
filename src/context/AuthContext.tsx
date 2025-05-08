
import React, { createContext, useState, useContext, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "../integrations/supabase/client";
import { toast } from "sonner";

type UserProfile = {
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
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isProvider: boolean, providerDetails?: ProviderDetails) => Promise<void>;
  logout: () => Promise<void>;
};

// Provider details type for registration
type ProviderDetails = {
  businessName: string;
  serviceCategory: string;
  experience: string;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          fetchUserProfile(newSession.user);
        } else {
          setUser(null);
        }
      }
    );

    // Check for existing session
    const fetchInitialSession = async () => {
      try {
        setLoading(true);
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        setSession(initialSession);
        
        if (initialSession?.user) {
          await fetchUserProfile(initialSession.user);
        }
      } catch (error) {
        console.error("Error fetching initial session:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialSession();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      // First check if user is a provider
      const { data: providerData, error: providerError } = await supabase
        .from('service_providers')
        .select('*')
        .eq('id', authUser.id)
        .single();

      // Then get the user profile
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError && !profileData) {
        console.error("Error fetching user profile:", profileError);
        return;
      }

      const isProvider = profileData?.is_provider || false;
      
      const userProfile: UserProfile = {
        id: authUser.id,
        email: authUser.email || '',
        name: profileData?.name || authUser.email?.split('@')[0] || 'User',
        isProvider,
        avatar: profileData?.avatar_url || `https://ui-avatars.com/api/?name=${profileData?.name || 'User'}&background=4A80F0&color=fff`
      };

      // Add provider-specific fields if user is a provider
      if (isProvider && providerData) {
        userProfile.businessName = providerData.business_name;
        userProfile.serviceCategory = providerData.service_category;
        userProfile.experience = providerData.experience;
      }

      setUser(userProfile);
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Logged in successfully");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error(error.message || "Failed to login. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string, isProvider: boolean, providerDetails?: ProviderDetails) => {
    try {
      setLoading(true);
      
      // Create the metadata with user information
      const metadata: Record<string, string> = { 
        name,
        isProvider: isProvider.toString() // Supabase metadata must be string or number
      };
      
      // Add provider details to metadata if registering as a provider
      if (isProvider && providerDetails) {
        metadata.businessName = providerDetails.businessName;
        metadata.serviceCategory = providerDetails.serviceCategory;
        metadata.experience = providerDetails.experience;
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Registration successful!");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast.error(error.message || "Failed to register. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }
      
      setUser(null);
      setSession(null);
      toast.info("You have been logged out");
    } catch (error: any) {
      console.error("Logout error:", error);
      toast.error(error.message || "Failed to logout.");
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, login, register, logout }}>
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
