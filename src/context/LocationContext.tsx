
import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  currentLocation: Coordinates | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
  selectLocation: (location: Coordinates) => void;
};

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For demo purposes, using San Francisco as default location
      const defaultLocation = {
        latitude: 37.7749,
        longitude: -122.4194
      };
      
      setCurrentLocation(defaultLocation);
      
    } catch (err) {
      console.error("Error getting location:", err);
      setError("Failed to get your current location");
      toast.error("Failed to get your location");
    } finally {
      setLoading(false);
    }
  };

  const selectLocation = (location: Coordinates) => {
    setCurrentLocation(location);
    toast.success("Location updated successfully");
  };

  const refreshLocation = async () => {
    await getLocation();
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ 
      currentLocation, 
      loading, 
      error, 
      refreshLocation,
      selectLocation
    }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};
