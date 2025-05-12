import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import our new components
import UserTypeTab from "@/components/auth/UserTypeTab";
import EmailLoginForm from "@/components/auth/EmailLoginForm";
import PhoneLoginForm from "@/components/auth/PhoneLoginForm";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginType, setLoginType] = useState<"user" | "provider">("user");
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  const { login, loading, user, loginWithPhone, loginWithOAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is already logged in, redirect accordingly
    if (user) {
      if (user.isProvider) {
        navigate("/provider/dashboard");
      } else {
        navigate("/");
      }
    }
  }, [user, navigate]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim whitespace from inputs
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    // Validate inputs
    if (!trimmedEmail || !trimmedPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (trimmedPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }
    
    try {
      await login(trimmedEmail, trimmedPassword);
      
      // Note: Navigation will happen in the useEffect when the user state updates
      toast.success("Logging in...");
    } catch (error: any) {
      console.error("Login failed:", error);
      
      // Handle specific error cases
      if (error.message?.includes("invalid_credentials")) {
        toast.error("Invalid email or password. Please try again.");
      } else if (error.message?.includes("email not confirmed")) {
        toast.error("Please verify your email address before logging in.");
      } else {
        toast.error("Login failed. Please try again later.");
      }
    }
  };

  const handlePhoneLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedPhone = phoneNumber.trim();
    
    if (!trimmedPhone) {
      toast.error("Please enter your phone number");
      return;
    }
    
    try {
      await loginWithPhone(trimmedPhone);
      toast.success("Verification code sent to your phone");
    } catch (error: any) {
      console.error("Phone login failed:", error);
      toast.error(error.message || "Failed to send verification code. Please try again.");
    }
  };

  const handleOAuthLogin = async (provider: 'google') => {
    try {
      await loginWithOAuth(provider);
      toast.success(`Signing in with ${provider}...`);
    } catch (error: any) {
      console.error(`${provider} login failed:`, error);
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">FixIt</h1>
        <p className="text-gray-600 mt-2">Find local services instantly</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
        <Tabs defaultValue="user" onValueChange={(value) => setLoginType(value as "user" | "provider")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="user">Customer</TabsTrigger>
            <TabsTrigger value="provider">Service Provider</TabsTrigger>
          </TabsList>
          
          <UserTypeTab 
            value="user"
            authMethod={authMethod}
            onAuthMethodChange={setAuthMethod}
            handleOAuthLogin={handleOAuthLogin}
            loading={loading}
            emailForm={
              <EmailLoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleEmailLogin}
                loading={loading}
              />
            }
            phoneForm={
              <PhoneLoginForm
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleSubmit={handlePhoneLogin}
                loading={loading}
              />
            }
          />
          
          <UserTypeTab 
            value="provider"
            authMethod={authMethod}
            onAuthMethodChange={setAuthMethod}
            handleOAuthLogin={handleOAuthLogin}
            loading={loading}
            emailForm={
              <EmailLoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleEmailLogin}
                loading={loading}
                isProvider={true}
              />
            }
            phoneForm={
              <PhoneLoginForm
                phoneNumber={phoneNumber}
                setPhoneNumber={setPhoneNumber}
                handleSubmit={handlePhoneLogin}
                loading={loading}
                isProvider={true}
              />
            }
          />
        </Tabs>
        
        <div className="mt-4 text-center text-sm">
          <p>
            Don't have an account?{" "}
            <a 
              onClick={() => navigate("/register")}
              className="text-primary hover:underline cursor-pointer"
            >
              Register
            </a>
          </p>
          <p className="mt-2">
            <a 
              onClick={() => navigate("/reset-password")}
              className="text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;