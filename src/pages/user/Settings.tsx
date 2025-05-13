import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Settings as SettingsIcon, User, LogOut, Bell, ChevronLeft, Camera } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [loading, setLoading] = useState(false);
  
  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const handleProfileUpdate = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({ name })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast.success("Profile updated successfully");
      setEditMode(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pb-20">
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

      <div className="p-4">
        <Card className="p-4 mb-6">
          <div className="flex items-center">
            <Dialog>
              <DialogTrigger asChild>
                <div className="relative cursor-pointer">
                  <img 
                    src={user?.avatar || "https://ui-avatars.com/api/?name=User"} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full"
                  />
                  <div className="absolute bottom-0 right-0 bg-primary rounded-full p-1">
                    <Camera size={12} className="text-white" />
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Update Profile Picture</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input type="file" accept="image/*" />
                  <Button onClick={() => toast.success("Profile picture updated")}>
                    Upload
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <div className="ml-4 flex-1">
              {editMode ? (
                <div className="space-y-2">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={handleProfileUpdate}
                      disabled={loading}
                    >
                      Save
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditMode(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="font-bold text-lg">{user?.name}</h2>
                  <p className="text-gray-600 text-sm">{user?.email}</p>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-xs flex items-center"
                      onClick={() => setEditMode(true)}
                    >
                      <User size={14} className="mr-1" />
                      Edit Profile
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </Card>

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