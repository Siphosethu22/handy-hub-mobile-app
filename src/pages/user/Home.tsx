import React, { useEffect, useState } from "react";
import { useLocation as useLocationContext } from "../../context/LocationContext";
import { getServiceCategories } from "../../data/services";
import { getNearbyProviders, Provider } from "../../data/providers";
import ServiceCard from "../../components/ServiceCard";
import ProviderCard from "../../components/ProviderCard";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import LocationSelector from "@/components/LocationSelector";

const Home = () => {
  const { currentLocation, loading: locationLoading } = useLocationContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [nearbyProviders, setNearbyProviders] = useState<Provider[]>([]);
  const [servicesList, setServicesList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        const services = await getServiceCategories();
        setServicesList(services);
      } catch (error) {
        console.error("Error loading services:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    const fetchProviders = async () => {
      if (currentLocation) {
        try {
          const providers = await getNearbyProviders(
            currentLocation.latitude,
            currentLocation.longitude
          );
          setNearbyProviders(providers.slice(0, 3));
        } catch (error) {
          console.error("Error fetching nearby providers:", error);
        }
      }
    };
    
    fetchProviders();
  }, [currentLocation]);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="pb-20">
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">FixIt</h1>
            <p className="text-sm opacity-90">Hello, {user?.name}</p>
          </div>
          <img 
            src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
            alt="Profile" 
            className="w-10 h-10 rounded-full cursor-pointer"
            onClick={() => navigate("/settings")}
          />
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <LocationSelector />
          {locationLoading && (
            <span className="text-sm">Finding your location...</span>
          )}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Services</h2>
          <Button 
            onClick={() => navigate("/search")}
            variant="ghost" 
            className="text-sm flex items-center"
          >
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">Loading services...</div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {servicesList.slice(0, 4).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Nearby Providers</h2>
          <Button 
            onClick={() => navigate("/search")}
            variant="ghost" 
            className="text-sm flex items-center"
          >
            View All <ChevronRight size={16} className="ml-1" />
          </Button>
        </div>
        
        {nearbyProviders.length > 0 ? (
          <div>
            {nearbyProviders.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            {locationLoading ? (
              <p>Finding providers near you...</p>
            ) : (
              <p>No providers found nearby</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;