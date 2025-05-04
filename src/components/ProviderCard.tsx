
import React from "react";
import { Link } from "react-router-dom";
import { Provider } from "../data/providers";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ProviderCardProps {
  provider: Provider;
}

const ProviderCard: React.FC<ProviderCardProps> = ({ provider }) => {
  return (
    <Link to={`/provider/${provider.id}`} className="block w-full">
      <Card className={cn(
        "p-4 mb-3 transition-all hover:shadow-md",
        !provider.available && "opacity-60"
      )}>
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={provider.avatar} 
              alt={provider.name} 
              className="w-16 h-16 rounded-full" 
            />
            {provider.verified && (
              <div className="absolute -right-1 -bottom-1 bg-blue-500 rounded-full p-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="font-medium">{provider.name}</h3>
            <div className="flex items-center text-sm text-gray-500">
              <span className="flex items-center">
                ⭐ {provider.rating}
                <span className="ml-1 text-xs">({provider.totalReviews})</span>
              </span>
              <span className="mx-2">•</span>
              <span>{provider.experience}</span>
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                {provider.distance ? `${provider.distance} km away` : "Distance unknown"}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${provider.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {provider.available ? "Available" : "Unavailable"}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default ProviderCard;
