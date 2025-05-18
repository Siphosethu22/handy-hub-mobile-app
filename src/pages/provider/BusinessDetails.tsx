
import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const BusinessDetails = () => {
  const { user, updateProviderProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [businessName, setBusinessName] = useState(user?.businessName || "");
  const [serviceCategory, setServiceCategory] = useState(user?.serviceCategory || "");
  const [experience, setExperience] = useState(user?.experience || "");
  const [description, setDescription] = useState(user?.description || "");
  const [address, setAddress] = useState(user?.address || "");
  
  useEffect(() => {
    if (user) {
      setBusinessName(user.businessName || "");
      setServiceCategory(user.serviceCategory || "");
      setExperience(user.experience || "");
      setDescription(user.description || "");
      setAddress(user.address || "");
    }
  }, [user]);
  
  if (!user || !user.isProvider) {
    navigate("/login");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await updateProviderProfile({
        businessName,
        serviceCategory,
        experience,
        description,
        address
      });
      
      toast.success("Provider profile updated successfully");
      navigate("/provider/dashboard");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const serviceCategories = [
    "Plumbing",
    "Electrical",
    "Carpentry",
    "Cleaning",
    "Painting",
    "Landscaping",
    "Moving",
    "HVAC",
    "Appliance Repair",
    "Other"
  ];
  
  const experienceLevels = [
    "Less than 1 year",
    "1-3 years",
    "3-5 years",
    "5-10 years",
    "10+ years"
  ];

  return (
    <div className="pb-20">
      <div className="bg-primary text-white p-4">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-2 pl-0 hover:bg-primary/20"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Business Details</h1>
      </div>
      
      <div className="p-4">
        <form onSubmit={handleSubmit}>
          <Card className="p-4 space-y-4 mb-4">
            <div>
              <label htmlFor="business-name" className="block text-sm font-medium mb-1">
                Business Name
              </label>
              <Input 
                id="business-name"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="Your business name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="service-category" className="block text-sm font-medium mb-1">
                Service Category
              </label>
              <Select value={serviceCategory} onValueChange={setServiceCategory} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a service category" />
                </SelectTrigger>
                <SelectContent>
                  {serviceCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="experience" className="block text-sm font-medium mb-1">
                Experience
              </label>
              <Select value={experience} onValueChange={setExperience} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  {experienceLevels.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label htmlFor="address" className="block text-sm font-medium mb-1">
                Business Address
              </label>
              <Input 
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Your business address"
              />
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">
                Business Description
              </label>
              <Textarea 
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your services, specialties, and experience..."
                rows={4}
              />
            </div>
          </Card>
          
          <Button 
            type="submit" 
            className="w-full flex items-center justify-center"
            disabled={loading}
          >
            <Save size={18} className="mr-2" />
            {loading ? "Saving..." : "Save Business Details"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default BusinessDetails;
