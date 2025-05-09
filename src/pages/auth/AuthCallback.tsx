
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const AuthCallback = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Process the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        if (!data.session) {
          navigate("/login");
          return;
        }
        
        // Check if this was a registration or login
        const isRegistering = localStorage.getItem('registering_as_provider');
        
        if (isRegistering) {
          const isProvider = isRegistering === 'true';
          
          // Update the user profile to mark as provider if needed
          if (isProvider) {
            await supabase
              .from('user_profiles')
              .update({ is_provider: true })
              .eq('id', data.session.user.id);
              
            // Create an empty provider profile if it doesn't exist
            const { data: existingProvider } = await supabase
              .from('service_providers')
              .select('id')
              .eq('id', data.session.user.id)
              .single();
              
            if (!existingProvider) {
              const { error: providerError } = await supabase
                .from('service_providers')
                .insert({
                  id: data.session.user.id,
                  name: data.session.user.user_metadata.full_name || data.session.user.email?.split('@')[0] || 'User',
                  business_name: data.session.user.email?.split('@')[0] + "'s Business" || 'New Business',
                  service_category: 'Other'
                });
                
              if (providerError) {
                console.error("Error creating provider profile:", providerError);
              }
            }
            
            // Remove the registration flag
            localStorage.removeItem('registering_as_provider');
            
            // Redirect to complete business details
            toast.success("Please complete your business details");
            navigate("/provider/business-details");
            return;
          }
          
          // Remove the registration flag
          localStorage.removeItem('registering_as_provider');
        }
        
        // Handle normal login navigation based on user type
        toast.success("Successfully logged in");
        
        // Navigation will happen in the main app based on user state
        navigate("/");
      } catch (error) {
        console.error("Auth callback error:", error);
        toast.error("Authentication failed. Please try again.");
        navigate("/login");
      } finally {
        setProcessing(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold mb-2">Processing your login</h2>
        <p className="text-gray-500">Please wait while we complete the authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
