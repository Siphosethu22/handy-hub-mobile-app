
import React, { useState, useEffect } from "react";
import { useLocation as useLocationContext } from "../../context/LocationContext";
import { getServiceCategories } from "../../data/services";
import { getNearbyProviders, Provider } from "../../data/providers";
import ServiceCard from "../../components/ServiceCard";
import ProviderCard from "../../components/ProviderCard";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Search = () => {
  const { currentLocation } = useLocationContext();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [serviceCategories, setServiceCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Load service categories
  useEffect(() => {
    const loadServices = async () => {
      try {
        const categories = await getServiceCategories();
        setServiceCategories(categories);
      } catch (error) {
        console.error("Error loading service categories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadServices();
  }, []);
  
  // Load providers based on search/filter criteria
  useEffect(() => {
    const fetchProviders = async () => {
      if (!currentLocation) return;
      
      try {
        const fetchedProviders = await getNearbyProviders(
          currentLocation.latitude,
          currentLocation.longitude,
          selectedService || undefined
        );

        // Apply search term filter if exists
        if (searchTerm) {
          const filteredProviders = fetchedProviders.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
          );
          setProviders(filteredProviders);
        } else {
          setProviders(fetchedProviders);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders([]);
      }
    };
    
    fetchProviders();
  }, [currentLocation, selectedService, searchTerm]);

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="pb-20">
      {/* Search Header with Back Button */}
      <div className="bg-primary p-4">
        <div className="flex items-center mb-3">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white mr-2 hover:bg-primary/90" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-xl font-bold text-white">Search</h1>
        </div>
        <div className="relative">
          <SearchIcon 
            size={18} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" 
          />
          <Input
            type="text"
            placeholder="Search for services or providers..."
            className="pl-10 pr-4 py-2 w-full bg-white rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Service Categories */}
      {loading ? (
        <div className="p-4 text-center">Loading services...</div>
      ) : (
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-3">Service Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {serviceCategories.map((service) => (
              <div 
                key={service.id} 
                onClick={() => setSelectedService(prev => prev === service.id ? null : service.id)}
                className={`cursor-pointer rounded-lg border p-3 transition-all ${selectedService === service.id ? 'ring-2 ring-primary border-primary' : 'border-gray-200'}`}
                style={{ borderLeft: `4px solid ${service.color}` }}
              >
                <div className="text-3xl mb-2">{service.icon}</div>
                <h3 className="text-sm font-medium">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Results */}
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-3">
          {selectedService 
            ? `${providers.length} ${selectedService && serviceCategories.find(s => s.id === selectedService)?.name || ''} providers found` 
            : `${providers.length} providers found`}
        </h2>
        
        {providers.length > 0 ? (
          <div>
            {providers.map((provider) => (
              <ProviderCard key={provider.id} provider={provider} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>No providers match your search criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Search;
