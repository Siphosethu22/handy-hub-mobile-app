
import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Settings as SettingsIcon, User, LogOut, Bell, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="pb-20">
      {/* Header with Back Button */}
      <div className="bg-primary text-white p-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-white mr-2 hover:bg-primary/90" 
            onClick={() => navigate(-1)}
          >
            <ChevronLeft size={24} />
          </Button>
          <h1 className="text-2xl font-bold">Settings</h1>
        </div>
      </div>

      {/* Profile Card */}
      <div className="p-4">
        <Card className="p-4 mb-6">
          <div className="flex items-center">
            <img 
              src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
              alt="Profile" 
              className="w-16 h-16 rounded-full"
            />
            <div className="ml-4">
              <h2 className="font-bold text-lg">{user?.name}</h2>
              <p className="text-gray-600 text-sm">{user?.email}</p>
              <div className="mt-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="text-xs flex items-center"
                >
                  <User size={14} className="mr-1" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Settings Options */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Bell size={20} className="mr-3 text-gray-600" />
              <span>Push Notifications</span>
            </div>
            <Switch defaultChecked />
          </div>
          
          {user.isProvider && (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <SettingsIcon size={20} className="mr-3 text-gray-600" />
                <span>Switch to Provider View</span>
              </div>
              <Button 
                variant="outline"
                size="sm"
                onClick={() => navigate("/provider/dashboard")}
              >
                Switch
              </Button>
            </div>
          )}

          <div className="pt-4">
            <Button 
              variant="destructive" 
              className="w-full flex items-center justify-center"
              onClick={handleLogout}
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
