
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProviderById, Provider } from "../../data/providers";
import { getServiceById } from "../../data/services";
import { Button } from "@/components/ui/button";
import { ChevronLeft, MapPin, Clock, Star, CheckCircle, XCircle, MessageSquare } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationContext";
import WorkExampleCarousel from "../../components/WorkExampleCarousel";
import BottomTabBar from "../../components/navigation/BottomTabBar";

const ProviderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadProvider = async () => {
      try {
        if (!id) return;
        
        const providerData = await getProviderById(id);
        setProvider(providerData);
      } catch (error) {
        console.error("Error loading provider:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadProvider();
  }, [id]);
  
  if (!user) {
    navigate("/login");
    return null;
  }
  
  if (loading) {
    return (
      <div>
        <div className="p-4 text-center">Loading provider details...</div>
        <BottomTabBar />
      </div>
    );
  }
  
  if (!provider) {
    return (
      <div>
        <div className="p-4 text-center">
          <p>Provider not found</p>
          <Button 
            onClick={() => navigate("/")}
            variant="outline"
            className="mt-4"
          >
            Back to Home
          </Button>
        </div>
        <BottomTabBar />
      </div>
    );
  }

  const getServiceNames = async () => {
    try {
      const servicePromises = provider.services.map(async (serviceId) => {
        const serviceData = await getServiceById(serviceId);
        return serviceData ? serviceData.name : serviceId;
      });
      
      const serviceNames = await Promise.all(servicePromises);
      return serviceNames.join(", ");
    } catch (error) {
      console.error("Error getting service names:", error);
      return provider.services.join(", ");
    }
  };

  const handleBookService = () => {
    setLoading(true);
    
    // Simulate API call for booking
    setTimeout(() => {
      addNotification({
        title: `Booking Request Sent`,
        message: `Your booking request has been sent to ${provider.name}. They will respond shortly.`,
        type: "job"
      });
      
      setLoading(false);
      navigate("/notifications");
    }, 1500);
  };

  const handleMessageProvider = () => {
    navigate(`/messaging/${provider.id}`);
  };

  return (
    <div className="pb-20">
      {/* Header with provider image */}
      <div 
        className="relative bg-primary text-white p-4 pt-16 pb-20"
        style={{
          background: `linear-gradient(to bottom, rgba(74, 128, 240, 0.9), rgba(74, 128, 240, 1))`,
        }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-white mb-2 pl-0 hover:bg-primary/20"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={18} className="mr-1" />
          Back
        </Button>
        
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2">
          <div className="relative">
            <img 
              src={provider.avatar} 
              alt={provider.name} 
              className="w-24 h-24 rounded-full border-4 border-white" 
            />
            {provider.verified && (
              <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Provider info */}
      <div className="px-4 pt-16 mt-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold">{provider.name}</h1>
          <div className="flex items-center justify-center mt-1">
            <Star size={16} className="text-yellow-500 mr-1" />
            <span className="mr-1">{provider.rating}</span>
            <span className="text-sm text-gray-500">({provider.totalReviews} reviews)</span>
          </div>
          <div className="text-sm text-gray-600 mt-1 flex items-center justify-center">
            <MapPin size={14} className="mr-1" />
            <span>{provider.distance ? `${provider.distance} km away` : "Distance unknown"}</span>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">About</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Services: </span>
                {provider.services.join(", ")}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-700">
                <span className="font-medium">Experience: </span>
                {provider.experience}
              </p>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-sm mr-2">Availability: </span>
              {provider.available ? (
                <div className="flex items-center text-green-600">
                  <CheckCircle size={16} className="mr-1" />
                  <span className="text-sm">Available now</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <XCircle size={16} className="mr-1" />
                  <span className="text-sm">Currently unavailable</span>
                </div>
              )}
            </div>
            <div className="flex items-center">
              <span className="font-medium text-sm mr-2">Verification: </span>
              {provider.verified ? (
                <span className="text-sm text-green-600">Verified provider</span>
              ) : (
                <span className="text-sm text-orange-500">Verification pending</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Work Examples Section */}
        {provider.workExamples && provider.workExamples.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-lg mb-3">Previous Work</h2>
            <WorkExampleCarousel workExamples={provider.workExamples} />
          </div>
        )}
        
        {/* Working Hours */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Working Hours</h2>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="flex items-center mb-2">
              <Clock size={16} className="mr-2 text-gray-600" />
              <span className="text-sm font-medium">Hours of operation</span>
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Monday - Friday</span>
                <span>9:00 AM - 5:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Saturday</span>
                <span>10:00 AM - 4:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span>Sunday</span>
                <span>Closed</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="mt-8 mb-4 flex space-x-2">
          <Button 
            className="flex-1" 
            size="lg"
            disabled={!provider.available || loading}
            onClick={handleBookService}
          >
            {loading ? "Sending Request..." : "Book Service"}
          </Button>
          
          <Button
            className="flex-1"
            size="lg"
            variant="outline"
            onClick={handleMessageProvider}
          >
            <MessageSquare size={16} className="mr-2" />
            Message
          </Button>
        </div>
        
        {!provider.available && (
          <p className="text-center text-sm text-red-500 mt-2">
            This provider is currently unavailable
          </p>
        )}
      </div>
      
      {/* Bottom Tab Bar */}
      <BottomTabBar />
    </div>
  );
};

export default ProviderDetail;
