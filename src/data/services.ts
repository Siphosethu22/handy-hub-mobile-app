
export type Service = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

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
  }
];
