
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Mail, Phone, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
      if (user.isProvider) {
        // If provider, check if they need to complete business details
        if (!user.businessName || !user.serviceCategory) {
          navigate("/provider/business-details");
        } else {
          navigate("/provider/dashboard");
        }
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      await register(email, password, name, isProvider);
      
      if (isProvider) {
        navigate("/provider/business-details");
      } else {
        // Navigation will happen in the useEffect when the user state updates
        toast.success("Registration successful! Redirecting...");
      }
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
          <Button 
            variant="outline" 
            type="button" 
            onClick={() => handleOAuthRegister('google')}
            disabled={loading}
            className="flex items-center justify-center py-6"
          >
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Sign up with Google
          </Button>
        </div>
        
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-white px-2 text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <Tabs defaultValue="email" onValueChange={(value) => setAuthMethod(value as "email" | "phone")}>
          <TabsList className="w-full mb-4">
            <TabsTrigger value="email" className="flex-1"><Mail className="h-4 w-4 mr-2" /> Email</TabsTrigger>
            <TabsTrigger value="phone" className="flex-1"><Phone className="h-4 w-4 mr-2" /> Phone</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email">
            <form onSubmit={handleEmailRegister}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password *
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Creating account..." : `Register${isProvider ? ' as Provider' : ''}`}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="phone">
            <form onSubmit={handlePhoneRegister}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="name-phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name *
                  </label>
                  <Input
                    id="name-phone"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (123) 456-7890"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Sending code..." : "Continue with Phone"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
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
