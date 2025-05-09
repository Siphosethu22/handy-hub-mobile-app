import React, { createContext, useState, useContext, useEffect } from "react";
import { Session, User, Provider } from "@supabase/supabase-js";
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
  description?: string;
  address?: string;
};

type AuthContextType = {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string, isProvider: boolean, providerDetails?: ProviderDetails) => Promise<void>;
  logout: () => Promise<void>;
  loginWithPhone: (phone: string) => Promise<void>;
  registerWithPhone: (phone: string, name: string, isProvider: boolean) => Promise<void>;
  verifyOtp: (phone: string, token: string) => Promise<void>;
  loginWithOAuth: (provider: Provider) => Promise<void>;
  updateProviderProfile: (details: ProviderProfileUpdate) => Promise<void>;
};

// Provider details type for registration
type ProviderDetails = {
  businessName: string;
  serviceCategory: string;
  experience: string;
};

// Provider profile update type
type ProviderProfileUpdate = {
  businessName: string;
  serviceCategory: string;
  experience: string;
  description?: string;
  address?: string;
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
        name: profileData?.name || authUser.email?.split('@')[0] || authUser.phone || 'User',
        isProvider,
        avatar: profileData?.avatar_url || `https://ui-avatars.com/api/?name=${profileData?.name || 'User'}&background=4A80F0&color=fff`
      };

      // Add provider-specific fields if user is a provider
      if (isProvider && providerData) {
        userProfile.businessName = providerData.business_name;
        userProfile.serviceCategory = providerData.service_category;
        userProfile.experience = providerData.experience;
        // Check for optional fields
        if ('description' in providerData) {
          userProfile.description = (providerData as any).description;
        }
        if ('address' in providerData) {
          userProfile.address = (providerData as any).address;
        }
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

  const loginWithPhone = async (phone: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      console.error("Phone login error:", error);
      toast.error(error.message || "Failed to send verification code. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const registerWithPhone = async (phone: string, name: string, isProvider: boolean) => {
    try {
      setLoading(true);
      
      // Store registration info in localStorage to use after OTP verification
      localStorage.setItem('phone_registration_data', JSON.stringify({
        name,
        isProvider
      }));
      
      const { data, error } = await supabase.auth.signInWithOtp({
        phone
      });
      
      if (error) {
        throw error;
      }
      
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      console.error("Phone registration error:", error);
      toast.error(error.message || "Failed to send verification code. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (phone: string, token: string) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.verifyOtp({
        phone,
        token,
        type: 'sms'
      });
      
      if (error) {
        throw error;
      }
      
      // If this is a new registration (we have stored data), update the user profile
      const registrationDataString = localStorage.getItem('phone_registration_data');
      if (registrationDataString) {
        const registrationData = JSON.parse(registrationDataString);
        
        // Update the user profile with the registration data
        await supabase
          .from('user_profiles')
          .upsert({
            id: data.user?.id,
            name: registrationData.name,
            is_provider: registrationData.isProvider
          });
          
        // If the user is a provider, create an empty provider profile
        if (registrationData.isProvider && data.user) {
          await supabase
            .from('service_providers')
            .upsert({
              id: data.user.id,
              name: registrationData.name,
              business_name: registrationData.name + "'s Business",
              service_category: "Other"
            });
        }
        
        // Clear the registration data
        localStorage.removeItem('phone_registration_data');
      }
      
      toast.success("Phone number verified successfully");
    } catch (error: any) {
      console.error("OTP verification error:", error);
      toast.error(error.message || "Failed to verify code. Please try again.");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loginWithOAuth = async (provider: Provider) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        throw error;
      }
    } catch (error: any) {
      console.error(`${provider} login error:`, error);
      toast.error(error.message || `Failed to login with ${provider}. Please try again.`);
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

  const updateProviderProfile = async (details: ProviderProfileUpdate) => {
    try {
      if (!user) throw new Error("No authenticated user");
      
      setLoading(true);
      
      const { error } = await supabase
        .from('service_providers')
        .update({
          business_name: details.businessName,
          service_category: details.serviceCategory,
          experience: details.experience,
          description: details.description,
          address: details.address
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Update the local user state
      setUser(prev => {
        if (!prev) return null;
        return {
          ...prev,
          businessName: details.businessName,
          serviceCategory: details.serviceCategory,
          experience: details.experience,
          description: details.description,
          address: details.address
        };
      });
      
      toast.success("Provider profile updated successfully");
    } catch (error: any) {
      console.error("Update provider profile error:", error);
      toast.error(error.message || "Failed to update profile. Please try again.");
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
    <AuthContext.Provider value={{ 
      user, 
      session, 
      loading, 
      login,
      register, 
      logout,
      loginWithPhone,
      registerWithPhone,
      verifyOtp,
      loginWithOAuth,
      updateProviderProfile
    }}>
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
