import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Settings, CheckCircle, XCircle, MapPin } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [available, setAvailable] = React.useState(true);
  
  if (!user || !user.isProvider) {
    navigate("/login");
    return null;
  }

  const handleAvailabilityChange = (checked: boolean) => {
    setAvailable(checked);
    toast.success(`You are now ${checked ? 'available' : 'unavailable'} for new jobs`);
  };

  const handlePayMembership = () => {
    toast.success("Redirecting to payment gateway...");
    // In a real app, this would navigate to a payment page or open a Stripe checkout
    setTimeout(() => {
      navigate("/provider/payment");
    }, 1000);
  };

  return (
    <div className="pb-20">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Provider Dashboard</h1>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:bg-primary/20"
            onClick={() => navigate("/settings")}
          >
            <Settings size={18} />
          </Button>
        </div>
        <p className="text-sm opacity-90">Welcome back, {user?.name}</p>
      </div>
      
      {/* Provider Actions */}
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate("/")}
            className="flex items-center"
          >
            <ChevronLeft size={16} className="mr-1" />
            User View
          </Button>
          
          <div className="flex items-center">
            <span className="mr-3 text-sm font-medium">Available for Jobs</span>
            <Switch 
              checked={available}
              onCheckedChange={handleAvailabilityChange}
            />
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <h3 className="text-sm text-gray-600">Rating</h3>
            <p className="text-2xl font-bold flex items-center justify-center">
              4.7 <Star className="h-4 w-4 ml-1 text-yellow-500" />
            </p>
          </Card>
          
          <Card className="p-4 text-center">
            <h3 className="text-sm text-gray-600">Jobs Completed</h3>
            <p className="text-2xl font-bold">24</p>
          </Card>
          
          <Card className="p-4 text-center">
            <h3 className="text-sm text-gray-600">Total Earnings</h3>
            <p className="text-2xl font-bold">$1,240</p>
          </Card>
          
          <Card className="p-4 text-center">
            <h3 className="text-sm text-gray-600">Pending Jobs</h3>
            <p className="text-2xl font-bold">2</p>
          </Card>
        </div>
        
        {/* Membership Status */}
        <Card className="p-4 mb-6">
          <h2 className="font-bold text-lg mb-2">Membership Status</h2>
          <div className="flex items-center mb-3">
            <div className="bg-yellow-100 p-2 rounded-full mr-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M7 7h.01" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Free Trial</h3>
              <p className="text-sm text-gray-600">7 days remaining</p>
            </div>
          </div>
          
          <div className="mt-3">
            <Button
              className="w-full"
              onClick={handlePayMembership}
            >
              Upgrade to Premium
            </Button>
          </div>
        </Card>
        
        {/* Active Jobs */}
        <div>
          <h2 className="font-bold text-lg mb-3">Active Job Requests</h2>
          
          {/* Job Card */}
          <Card className="p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium">Plumbing Service Request</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">New</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Fixing a leaking kitchen sink</p>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin size={14} className="mr-1" />
              <span>2.4 km away</span>
              <span className="mx-2">•</span>
              <span>20 minutes ago</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={() => {
                  toast.error("Job rejected");
                }}
              >
                <XCircle size={16} className="mr-1" />
                Reject
              </Button>
              <Button 
                size="sm" 
                className="flex-1 flex items-center justify-center"
                onClick={() => {
                  toast.success("Job accepted! Client has been notified.");
                }}
              >
                <CheckCircle size={16} className="mr-1" />
                Accept
              </Button>
            </div>
          </Card>
          
          <Card className="p-4 mb-3">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-medium">Fix Bathroom Light</h3>
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">New</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">Light fixture not working</p>
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <MapPin size={14} className="mr-1" />
              <span>3.7 km away</span>
              <span className="mx-2">•</span>
              <span>1 hour ago</span>
            </div>
            <div className="flex space-x-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 flex items-center justify-center"
                onClick={() => {
                  toast.error("Job rejected");
                }}
              >
                <XCircle size={16} className="mr-1" />
                Reject
              </Button>
              <Button 
                size="sm" 
                className="flex-1 flex items-center justify-center"
                onClick={() => {
                  toast.success("Job accepted! Client has been notified.");
                }}
              >
                <CheckCircle size={16} className="mr-1" />
                Accept
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

const Star = ({ className }: { className?: string }) => (
  <svg 
    className={className} 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor"
  >
    <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clipRule="evenodd" />
  </svg>
);

export default Dashboard;
