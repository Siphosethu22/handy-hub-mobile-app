
import React, { createContext, useState, useContext, useEffect } from "react";

type Coordinates = {
  latitude: number;
  longitude: number;
};

type LocationContextType = {
  currentLocation: Coordinates | null;
  loading: boolean;
  error: string | null;
  refreshLocation: () => Promise<void>;
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
      
      // Mock location for now - will use Capacitor Geolocation in real app
      // For demo, using a random location near San Francisco
      const mockLat = 37.7749 + (Math.random() - 0.5) * 0.05;
      const mockLng = -122.4194 + (Math.random() - 0.5) * 0.05;
      
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate delay
      
      setCurrentLocation({
        latitude: mockLat,
        longitude: mockLng
      });
    } catch (err) {
      console.error("Error getting location:", err);
      setError("Failed to get your current location");
    } finally {
      setLoading(false);
    }
  };

  const refreshLocation = async () => {
    await getLocation();
  };

  // Get location on initial load
  useEffect(() => {
    getLocation();
  }, []);

  return (
    <LocationContext.Provider value={{ 
      currentLocation, 
      loading, 
      error, 
      refreshLocation 
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
