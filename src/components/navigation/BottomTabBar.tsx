
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Home, Search, Bell, MessageSquare, User } from "lucide-react";
import { useNotification } from "../../context/NotificationContext";

const BottomTabBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasUnreadNotifications } = useNotification();
  
  const tabs = [
    { label: "Home", icon: Home, path: "/home" },
    { label: "Search", icon: Search, path: "/search" },
    { label: "Messages", icon: MessageSquare, path: "/messaging" },
    { 
      label: "Notifications", 
      icon: Bell, 
      path: "/notifications",
      badge: hasUnreadNotifications 
    },
    { label: "Settings", icon: User, path: "/settings" },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-md border-t border-gray-100 z-10">
      <div className="flex justify-around items-center h-16">
        {tabs.map((tab) => (
          <div 
            key={tab.label}
            className={`bottom-tab flex-1 ${location.pathname === tab.path ? 'active-tab' : 'text-gray-500'}`}
            onClick={() => navigate(tab.path)}
          >
            <div className="relative">
              <tab.icon size={20} />
              {tab.badge && <span className="notification-badge">!</span>}
            </div>
            <span className="text-xs mt-1">{tab.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BottomTabBar;
