
import { supabase } from "../integrations/supabase/client";

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
  workExamples?: WorkExample[];
};

export type WorkExample = {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
};

export const getProvidersByService = async (serviceId: string): Promise<Provider[]> => {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select(`
        id,
        name,
        business_name,
        service_category,
        avatar_url,
        rating,
        total_reviews,
        experience,
        available,
        latitude,
        longitude,
        verified
      `)
      .eq('service_category', serviceId);
    
    if (error) {
      throw error;
    }
    
    // Transform database results into Provider type
    const providers: Provider[] = await Promise.all(data.map(async (provider) => {
      // Fetch work examples for each provider
      const { data: workExamples, error: workError } = await supabase
        .from('work_examples')
        .select('id, image_url, title, description')
        .eq('provider_id', provider.id);
      
      if (workError) {
        console.error('Error fetching work examples:', workError);
      }
      
      return {
        id: provider.id,
        name: provider.business_name,
        services: [provider.service_category], // Array of services
        avatar: provider.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.business_name)}&background=FF5733&color=fff`,
        rating: provider.rating,
        totalReviews: provider.total_reviews,
        experience: provider.experience,
        available: provider.available,
        location: {
          latitude: provider.latitude || 0,
          longitude: provider.longitude || 0
        },
        verified: provider.verified,
        workExamples: workExamples ? workExamples.map(we => ({
          id: we.id,
          imageUrl: we.image_url,
          title: we.title,
          description: we.description
        })) : []
      };
    }));
    
    return providers;
  } catch (error) {
    console.error('Error fetching providers by service:', error);
    return [];
  }
};

export const getNearbyProviders = async (latitude: number, longitude: number, serviceId?: string, maxDistance = 10): Promise<Provider[]> => {
  try {
    let query = supabase
      .from('service_providers')
      .select(`
        id,
        name,
        business_name,
        service_category,
        avatar_url,
        rating,
        total_reviews,
        experience,
        available,
        latitude,
        longitude,
        verified
      `);
    
    // If service ID is provided, filter by it
    if (serviceId) {
      query = query.eq('service_category', serviceId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Transform and filter by distance
    const providers: Provider[] = await Promise.all(
      data
        .filter(provider => provider.latitude && provider.longitude) // Only include providers with location data
        .map(async (provider) => {
          // Calculate distance
          const distance = calculateDistance(
            { latitude, longitude },
            { latitude: provider.latitude, longitude: provider.longitude }
          );
          
          // Fetch work examples for this provider
          const { data: workExamples, error: workError } = await supabase
            .from('work_examples')
            .select('id, image_url, title, description')
            .eq('provider_id', provider.id);
          
          if (workError) {
            console.error('Error fetching work examples:', workError);
          }
          
          return {
            id: provider.id,
            name: provider.business_name,
            services: [provider.service_category], // Array of services
            avatar: provider.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(provider.business_name)}&background=FF5733&color=fff`,
            rating: provider.rating,
            totalReviews: provider.total_reviews,
            experience: provider.experience,
            available: provider.available,
            location: {
              latitude: provider.latitude,
              longitude: provider.longitude
            },
            distance,
            verified: provider.verified,
            workExamples: workExamples ? workExamples.map(we => ({
              id: we.id,
              imageUrl: we.image_url,
              title: we.title,
              description: we.description
            })) : []
          };
        })
    );
    
    // Filter by distance and sort
    return providers
      .filter(provider => provider.distance !== undefined && provider.distance <= maxDistance)
      .sort((a, b) => (a.distance || 999) - (b.distance || 999));
  } catch (error) {
    console.error('Error fetching nearby providers:', error);
    return [];
  }
};

export const getProviderById = async (id: string): Promise<Provider | null> => {
  try {
    const { data, error } = await supabase
      .from('service_providers')
      .select(`
        id,
        name,
        business_name,
        service_category,
        avatar_url,
        rating,
        total_reviews,
        experience,
        available,
        latitude,
        longitude,
        verified
      `)
      .eq('id', id)
      .single();
    
    if (error || !data) {
      throw error;
    }
    
    // Fetch work examples for this provider
    const { data: workExamples, error: workError } = await supabase
      .from('work_examples')
      .select('id, image_url, title, description')
      .eq('provider_id', data.id);
    
    if (workError) {
      console.error('Error fetching work examples:', workError);
    }
    
    // Transform into Provider type
    const provider: Provider = {
      id: data.id,
      name: data.business_name,
      services: [data.service_category], // Array of services
      avatar: data.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.business_name)}&background=FF5733&color=fff`,
      rating: data.rating,
      totalReviews: data.total_reviews,
      experience: data.experience,
      available: data.available,
      location: {
        latitude: data.latitude || 0,
        longitude: data.longitude || 0
      },
      verified: data.verified,
      workExamples: workExamples ? workExamples.map(we => ({
        id: we.id,
        imageUrl: we.image_url,
        title: we.title,
        description: we.description
      })) : []
    };
    
    return provider;
  } catch (error) {
    console.error('Error fetching provider by ID:', error);
    return null;
  }
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
