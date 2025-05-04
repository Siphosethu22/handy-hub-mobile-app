
import React, { useEffect } from "react";
import { useNotifications } from "../../context/NotificationContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Bell, ChevronLeft } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Mark notifications as read when this page is viewed
    notifications.forEach(notification => {
      if (!notification.read) {
        markAsRead(notification.id);
      }
    });
  }, [notifications, markAsRead]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "job":
        return "🔨";
      case "payment":
        return "💰";
      default:
        return "🔔";
    }
  };

  const getTimeAgo = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
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
          <h1 className="text-2xl font-bold">Notifications</h1>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="p-4">
        {notifications.length > 0 ? (
          <>
            <div className="flex justify-end mb-4">
              <Button 
                variant="outline" 
                size="sm"
                onClick={markAllAsRead}
              >
                Mark all as read
              </Button>
            </div>
            
            {notifications.map((notification) => (
              <Card 
                key={notification.id} 
                className={`p-4 mb-3 ${notification.read ? "" : "border-l-4 border-primary"}`}
              >
                <div className="flex">
                  <div className="mr-3 text-2xl">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium ${notification.read ? "" : "font-bold"}`}>
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{getTimeAgo(notification.timestamp)}</p>
                  </div>
                </div>
              </Card>
            ))}
          </>
        ) : (
          <div className="text-center py-12">
            <Bell size={48} className="mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Notifications</h3>
            <p className="text-gray-500">You're all caught up!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
