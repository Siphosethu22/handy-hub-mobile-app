
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { serviceCategories } from "../../data/services";
import { getNearbyProviders } from "../../data/providers";
import { useLocation as useLocationContext } from "../../context/LocationContext";
import ProviderCard from "../../components/ProviderCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { currentLocation } = useLocationContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [service, setService] = useState(serviceCategories.find(s => s.id === id) || null);
  const [providers, setProviders] = useState([]);
  
  useEffect(() => {
    if (!currentLocation || !id) return;
    
    const serviceProviders = getNearbyProviders(
      currentLocation.latitude,
      currentLocation.longitude,
      id
    );
    setProviders(serviceProviders);
  }, [currentLocation, id]);

  if (!user) {
    navigate("/login");
    return null;
  }
  
  if (!service) {
    return (
      <div className="p-4 text-center">
        <p>Service not found</p>
        <Button 
          onClick={() => navigate("/")}
          variant="outline"
          className="mt-4"
        >
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="pb-20">
      {/* Header */}
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
        <h1 className="text-2xl font-bold flex items-center">
          <span className="text-4xl mr-2">{service.icon}</span>
          {service.name}
        </h1>
      </div>
      
      {/* Providers list */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">
          Available {service.name} Providers ({providers.length})
        </h2>
        
        {providers.length > 0 ? (
          <div>
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No {service.name} providers found nearby</p>
            <Button 
              onClick={() => navigate("/search")} 
              variant="outline"
              className="mt-4"
            >
              Search All Services
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceDetail;
