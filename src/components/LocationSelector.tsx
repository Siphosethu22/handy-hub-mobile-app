import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { MapPin } from "lucide-react";
import { useLocation } from "@/context/LocationContext";

const popularLocations = [
  { name: "San Francisco", latitude: 37.7749, longitude: -122.4194 },
  { name: "New York", latitude: 40.7128, longitude: -74.0060 },
  { name: "Los Angeles", latitude: 34.0522, longitude: -118.2437 },
  { name: "Chicago", latitude: 41.8781, longitude: -87.6298 },
  { name: "Miami", latitude: 25.7617, longitude: -80.1918 }
];

const LocationSelector = () => {
  const { selectLocation } = useLocation();
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);

  const handleLocationSelect = (location: { latitude: number; longitude: number }) => {
    selectLocation(location);
    setOpen(false);
  };

  const filteredLocations = popularLocations.filter(location =>
    location.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <MapPin size={16} />
          <span>Select Location</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Choose Location</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="Search locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="space-y-2">
            {filteredLocations.map((location) => (
              <Button
                key={location.name}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleLocationSelect(location)}
              >
                <MapPin size={16} className="mr-2" />
                {location.name}
              </Button>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;