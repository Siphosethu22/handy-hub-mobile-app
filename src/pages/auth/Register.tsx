
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import reusable components
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import AuthDivider from "@/components/auth/AuthDivider";
import AuthMethodTabs from "@/components/auth/AuthMethodTabs";
import EmailRegisterForm from "@/components/auth/EmailRegisterForm";
import PhoneRegisterForm from "@/components/auth/PhoneRegisterForm";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProvider, setIsProvider] = useState(true);  // Default to provider
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  
  const { register, loading, user, registerWithPhone, loginWithOAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect accordingly
    if (user) {
      redirectBasedOnUserType(user);
    }
  }, [user, navigate]);

  const redirectBasedOnUserType = (user: any) => {
    if (user.isProvider) {
      // If provider, check if they need to complete business details
      if (!user.businessName || !user.serviceCategory) {
        navigate("/provider/business-details");
      } else {
        navigate("/provider/dashboard");
      }
    } else {
      navigate("/home");
    }
  }

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      await register(email, password, name, isProvider);
      toast.success("Registration successful!");
      
      // The redirect will happen in useEffect when user state is updated
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const handlePhoneRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      await registerWithPhone(phoneNumber, name, isProvider);
      toast.success("Verification code sent to your phone");
      // Store isProvider in localStorage to use after OTP verification
      localStorage.setItem('phone_registration_is_provider', isProvider.toString());
      navigate("/verify-otp", { 
        state: { 
          phoneNumber,
          isRegistration: true
        } 
      });
    } catch (error) {
      console.error("Phone registration failed:", error);
    }
  };

  const handleOAuthRegister = async (provider: 'google') => {
    try {
      // Store isProvider choice in localStorage to use after OAuth callback
      localStorage.setItem('registering_as_provider', isProvider.toString());
      await loginWithOAuth(provider);
      toast.success(`Signing up with ${provider}...`);
    } catch (error) {
      console.error(`${provider} registration failed:`, error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">FixIt</h1>
        <p className="text-gray-600 mt-2">Find local services instantly</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-6">Create an Account</h2>
        
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm">Register as a service provider?</span>
          <Switch 
            checked={isProvider}
            onCheckedChange={setIsProvider}
          />
        </div>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <GoogleAuthButton 
            onClick={() => handleOAuthRegister('google')}
            loading={loading}
            text="Sign up with Google"
          />
        </div>
        
        <AuthDivider />
        
        <AuthMethodTabs
          authMethod={authMethod}
          onValueChange={setAuthMethod}
          emailForm={
            <EmailRegisterForm
              name={name}
              setName={setName}
              email={email}
              setEmail={setEmail}
              password={password}
              setPassword={setPassword}
              handleSubmit={handleEmailRegister}
              loading={loading}
              isProvider={isProvider}
            />
          }
          phoneForm={
            <PhoneRegisterForm
              name={name}
              setName={setName}
              phoneNumber={phoneNumber}
              setPhoneNumber={setPhoneNumber}
              handleSubmit={handlePhoneRegister}
              loading={loading}
              isProvider={isProvider}
            />
          }
        />
        
        <div className="mt-4 text-center text-sm">
          <p>
            Already have an account?{" "}
            <a 
              onClick={() => navigate("/login")}
              className="text-primary hover:underline cursor-pointer"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
