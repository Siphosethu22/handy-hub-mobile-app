
import { supabase } from "../integrations/supabase/client";

export type Service = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const getServiceCategories = async (): Promise<Service[]> => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*');
    
    if (error) {
      throw error;
    }
    
    return data as Service[];
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
};

export const getServiceById = async (id: string): Promise<Service | null> => {
  try {
    const { data, error } = await supabase
      .from('service_categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      throw error;
    }
    
    return data as Service;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    return null;
  }
};

// Legacy variable for backward compatibility during transition
// This will be removed once all components are updated to use async functions
export const serviceCategories: Service[] = [
  {
    id: "mechanics",
    name: "Mechanics",
    icon: "🔧",
    color: "#FF5733",
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: "⚡",
    color: "#FFD700",
  },
  {
    id: "tow-trucks",
    name: "Tow Trucks",
    icon: "🚚",
    color: "#4169E1",
  },
  {
    id: "plumbers",
    name: "Plumbers",
    icon: "🚿",
    color: "#1E90FF",
  },
  {
    id: "salons",
    name: "Salons",
    icon: "💇",
    color: "#FF69B4",
  },
  {
    id: "handyman",
    name: "Handyman",
    icon: "🔨",
    color: "#8B4513",
  },
  {
    id: "cleaners",
    name: "Cleaners",
    icon: "🧹",
    color: "#20B2AA",
  },
  {
    id: "painters",
    name: "Painters",
    icon: "🎨",
    color: "#9932CC",
  },
  {
    id: "locksmith",
    name: "Locksmith",
    icon: "🔑",
    color: "#DAA520",
  },
  {
    id: "gardeners",
    name: "Gardeners",
    icon: "🌱",
    color: "#228B22",
  },
  {
    id: "pest-control",
    name: "Pest Control",
    icon: "🐜",
    color: "#A52A2A",
  },
  {
    id: "movers",
    name: "Movers",
    icon: "📦",
    color: "#CD853F",
  }
];
