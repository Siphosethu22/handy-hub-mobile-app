
import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginType, setLoginType] = useState<"user" | "provider">("user");
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    try {
      // Add provider flag to login based on tab selection
      await login(email, password, loginType === "provider");
      navigate("/");
      toast.success(`Logged in successfully as ${loginType}`);
    } catch (error) {
      console.error("Login failed:", error);
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
          
          <TabsContent value="user">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login as Customer"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="provider">
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="provider-email" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Email
                  </label>
                  <Input
                    id="provider-email"
                    type="email"
                    placeholder="Your business email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="provider-password" className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <Input
                    id="provider-password"
                    type="password"
                    placeholder="Your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                  >
                    {loading ? "Logging in..." : "Login as Provider"}
                  </Button>
                </div>
              </div>
            </form>
          </TabsContent>
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
        </div>
        
        {/* Demo accounts for quick testing */}
        <div className="mt-8 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Demo Accounts:</p>
          <div className="space-y-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setEmail("user@example.com");
                setPassword("password");
                setLoginType("user");
              }}
            >
              Use Customer Demo
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                setEmail("provider@example.com");
                setPassword("password");
                setLoginType("provider");
              }}
            >
              Use Provider Demo
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
