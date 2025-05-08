
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isProvider, setIsProvider] = useState(false);
  
  // Provider specific fields
  const [businessName, setBusinessName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [serviceCategories, setServiceCategories] = useState<Array<{id: string, name: string}>>([]);
  
  const { register, loading, user } = useAuth();
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
    
    // Fetch service categories from Supabase
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('service_categories')
          .select('id, name');
        
        if (error) {
          throw error;
        }
        
        setServiceCategories(data || []);
      } catch (error) {
        console.error("Error fetching service categories:", error);
        toast.error("Failed to load service categories");
      }
    };
    
    fetchCategories();
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !email || !password) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Additional validation for provider fields
    if (isProvider) {
      if (!businessName || !serviceCategory || !experience) {
        toast.error("Please complete your provider profile");
        return;
      }
    }
    
    try {
      if (isProvider) {
        await register(
          email, 
          password, 
          name, 
          true, 
          { businessName, serviceCategory, experience }
        );
        // Navigation will happen in the useEffect when the user state updates
      } else {
        await register(email, password, name, false);
        // Navigation will happen in the useEffect when the user state updates
      }
      
      toast.success("Registration successful! Redirecting...");
    } catch (error) {
      console.error("Registration failed:", error);
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
        
        <form onSubmit={handleSubmit}>
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
            
            <div className="flex items-center justify-between">
              <span className="text-sm">Register as a service provider?</span>
              <Switch 
                checked={isProvider}
                onCheckedChange={setIsProvider}
              />
            </div>
            
            {/* Provider specific fields */}
            {isProvider && (
              <>
                <Separator className="my-4" />
                
                <h3 className="font-medium text-lg mb-3">Provider Details</h3>
                
                <div>
                  <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
                    Business Name *
                  </label>
                  <Input
                    id="businessName"
                    type="text"
                    placeholder="Your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-1">
                    Service Category *
                  </label>
                  <Select
                    value={serviceCategory}
                    onValueChange={setServiceCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a service category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-1">
                    Experience *
                  </label>
                  <Select 
                    value={experience}
                    onValueChange={setExperience}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Years of experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1-2 years">1-2 years</SelectItem>
                      <SelectItem value="3-5 years">3-5 years</SelectItem>
                      <SelectItem value="5-10 years">5-10 years</SelectItem>
                      <SelectItem value="10+ years">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            
            <div className="pt-2">
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Creating account..." : "Register"}
              </Button>
            </div>
          </div>
        </form>
        
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
