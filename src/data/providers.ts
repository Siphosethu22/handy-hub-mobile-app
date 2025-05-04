
export type Provider = {
  id: string;
  name: string;
  services: string[];
  avatar: string;
  rating: number;
  totalReviews: number;
  experience: string;
  available: boolean;
  location: {
    latitude: number;
    longitude: number;
  };
  distance?: number; // Calculated based on user location
  verified: boolean;
};

export const providers: Provider[] = [
  {
    id: "p1",
    name: "John's Mechanical Services",
    services: ["mechanics"],
    avatar: "https://ui-avatars.com/api/?name=John+Smith&background=FF5733&color=fff",
    rating: 4.9,
    totalReviews: 124,
    experience: "10+ years",
    available: true,
    location: {
      latitude: 37.773972,
      longitude: -122.431297
    },
    verified: true
  },
  {
    id: "p2",
    name: "ElectroPro Solutions",
    services: ["electrical"],
    avatar: "https://ui-avatars.com/api/?name=Sarah+Johnson&background=FFD700&color=000",
    rating: 4.7,
    totalReviews: 89,
    experience: "8 years",
    available: true,
    location: {
      latitude: 37.783587,
      longitude: -122.408227
    },
    verified: true
  },
  {
    id: "p3",
    name: "Quick Tow Services",
    services: ["tow-trucks"],
    avatar: "https://ui-avatars.com/api/?name=Mike+Johnson&background=4169E1&color=fff",
    rating: 4.5,
    totalReviews: 67,
    experience: "5 years",
    available: true,
    location: {
      latitude: 37.761226,
      longitude: -122.423210
    },
    verified: false
  },
  {
    id: "p4",
    name: "Master Plumbers Co.",
    services: ["plumbers"],
    avatar: "https://ui-avatars.com/api/?name=Robert+Davis&background=1E90FF&color=fff",
    rating: 4.8,
    totalReviews: 112,
    experience: "12 years",
    available: false,
    location: {
      latitude: 37.765823,
      longitude: -122.439239
    },
    verified: true
  },
  {
    id: "p5",
    name: "Style & Scissors Salon",
    services: ["salons"],
    avatar: "https://ui-avatars.com/api/?name=Emma+Clark&background=FF69B4&color=fff",
    rating: 4.7,
    totalReviews: 98,
    experience: "7 years",
    available: true,
    location: {
      latitude: 37.786526,
      longitude: -122.412941
    },
    verified: true
  },
  {
    id: "p6",
    name: "DIY Handy Solutions",
    services: ["handyman"],
    avatar: "https://ui-avatars.com/api/?name=Tom+Wilson&background=8B4513&color=fff",
    rating: 4.6,
    totalReviews: 76,
    experience: "9 years",
    available: true,
    location: {
      latitude: 37.775384,
      longitude: -122.417046
    },
    verified: true
  },
  {
    id: "p7",
    name: "Spotless Cleaning Services",
    services: ["cleaners"],
    avatar: "https://ui-avatars.com/api/?name=Lisa+Wong&background=20B2AA&color=fff",
    rating: 4.4,
    totalReviews: 58,
    experience: "4 years",
    available: true,
    location: {
      latitude: 37.779432,
      longitude: -122.418298
    },
    verified: true
  },
  {
    id: "p8",
    name: "Perfect Painters",
    services: ["painters"],
    avatar: "https://ui-avatars.com/api/?name=David+Brown&background=9932CC&color=fff",
    rating: 4.5,
    totalReviews: 63,
    experience: "6 years",
    available: false,
    location: {
      latitude: 37.772851,
      longitude: -122.427455
    },
    verified: false
  }
];

export const getProvidersByService = (serviceId: string) => {
  return providers.filter(provider => provider.services.includes(serviceId));
};

export const getNearbyProviders = (latitude: number, longitude: number, serviceId?: string, maxDistance = 10) => {
  return providers
    .map(provider => {
      const distance = calculateDistance(
        { latitude, longitude },
        provider.location
      );
      
      return {
        ...provider,
        distance
      };
    })
    .filter(provider => 
      provider.distance <= maxDistance && 
      (serviceId ? provider.services.includes(serviceId) : true)
    )
    .sort((a, b) => (a.distance || 999) - (b.distance || 999));
};

// Haversine formula to calculate distance between two points
function calculateDistance(
  point1: { latitude: number; longitude: number },
  point2: { latitude: number; longitude: number }
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(point2.latitude - point1.latitude);
  const dLon = toRad(point2.longitude - point1.longitude);
  const lat1 = toRad(point1.latitude);
  const lat2 = toRad(point2.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  
  return parseFloat(distance.toFixed(1));
}

function toRad(value: number): number {
  return (value * Math.PI) / 180;
}
