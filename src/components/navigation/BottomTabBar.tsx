
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, MessageSquare, User } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount } = useNotifications();
  
  const tabs = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Messages", icon: MessageSquare, path: "/messaging" },
    { 
      label: "Notifications", 
      icon: Bell, 
      path: "/notifications",
      badge: unreadCount > 0 
    },
    { label: "Settings", icon: User, path: "/settings" },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-100 z-10">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <div 
            key={tab.label}
            className={`flex flex-col items-center justify-center cursor-pointer py-1 ${
              location.pathname === tab.path ? 'text-primary' : 'text-gray-500'
            }`}
            onClick={() => navigate(tab.path)}
          >
            <div className="relative">
              <tab.icon size={20} />
              {tab.badge && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </div>
            <span className="text-xs mt-1">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomTabBar;
