
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { Building, MapPin } from "lucide-react";

const BusinessDetails = () => {
  const [businessName, setBusinessName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("");
  const [experience, setExperience] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [serviceCategories, setServiceCategories] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const { user, updateProviderProfile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // If user is not logged in or not a provider, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    if (user && !user.isProvider) {
      navigate("/");
      return;
    }
    
    // If provider has already completed business details, redirect to dashboard
    if (user && user.isProvider && user.businessName && user.serviceCategory) {
      navigate("/provider/dashboard");
      return;
    }

    // Fetch service categories
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
      } finally {
        setPageLoading(false);
      }
    };
    
    fetchCategories();
  }, [user, navigate]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!businessName || !serviceCategory || !experience) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setLoading(true);
      
      // Update the provider profile with business details
      await updateProviderProfile({
        businessName,
        serviceCategory,
        experience,
        description,
        address
      });
      
      toast.success("Business details updated successfully");
      navigate("/provider/dashboard");
    } catch (error) {
      console.error("Error updating business details:", error);
      toast.error("Failed to update business details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-center">Complete Your Business Profile</h1>
          <p className="text-gray-500 text-center mt-2">This information will be visible to potential clients</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="businessName" className="block text-sm font-medium text-gray-700 mb-1">
              Business Name *
            </label>
            <div className="relative">
              <Input
                id="businessName"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                className="pl-10"
                required
              />
              <Building className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
            </div>
          </div>
          
          <div>
            <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-700 mb-1">
              Service Category *
            </label>
            <Select
              value={serviceCategory}
              onValueChange={setServiceCategory}
              required
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
              required
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
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Business Address
            </label>
            <div className="relative">
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Business address"
                className="pl-10"
              />
              <MapPin className="absolute top-2.5 left-3 h-5 w-5 text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 mt-1">We'll use this to show your business to nearby customers</p>
          </div>
          
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Business Description
            </label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell customers about your business and services"
              rows={4}
            />
          </div>
          
          <Button 
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Saving..." : "Complete Setup & Go to Dashboard"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetails;
