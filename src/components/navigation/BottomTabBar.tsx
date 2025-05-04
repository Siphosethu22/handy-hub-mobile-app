
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, Bell, Settings } from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import { cn } from "@/lib/utils";

const BottomTabBar = () => {
  const location = useLocation();
  const { unreadCount } = useNotifications();
  
  const tabs = [
    { path: "/", icon: <Home size={24} />, label: "Home" },
    { path: "/search", icon: <Search size={24} />, label: "Search" },
    { 
      path: "/notifications", 
      icon: (
        <div className="relative">
          <Bell size={24} />
          {unreadCount > 0 && (
            <span className="notification-badge">{unreadCount > 9 ? "9+" : unreadCount}</span>
          )}
        </div>
      ), 
      label: "Notifications" 
    },
    { path: "/settings", icon: <Settings size={24} />, label: "Settings" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-16 px-4">
      {tabs.map((tab) => (
        <Link 
          key={tab.path} 
          to={tab.path}
          className={cn(
            "bottom-tab w-full",
            location.pathname === tab.path ? "active-tab" : "text-gray-500"
          )}
        >
          {tab.icon}
          <span className="text-xs mt-1">{tab.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default BottomTabBar;
