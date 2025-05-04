
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SplashScreen from "../components/SplashScreen";
import BottomTabBar from "../components/navigation/BottomTabBar";
import Home from "./user/Home";
import Search from "./user/Search";
import Notifications from "./user/Notifications";
import Settings from "./user/Settings";
import { useLocation as useLocationRoute } from "react-router-dom";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocationRoute();
  
  useEffect(() => {
    // Check if user is logged in after splash screen completes
    if (!showSplash && !loading) {
      if (!user) {
        navigate("/login");
      } else if (user.isProvider) {
        // Redirect providers to their dashboard
        navigate("/provider/dashboard");
      }
    }
  }, [showSplash, user, loading, navigate]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Determine which component to render based on the current path
  const renderCurrentPage = () => {
    const path = location.pathname;
    
    if (path === "/" || path === "/home") {
      return <Home />;
    } else if (path === "/search") {
      return <Search />;
    } else if (path === "/notifications") {
      return <Notifications />;
    } else if (path === "/settings") {
      return <Settings />;
    }
    
    return <Home />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If logged in as a regular user, show the main UI with bottom tabs
  if (user && !user.isProvider) {
    return (
      <div className="min-h-screen bg-gray-50">
        {renderCurrentPage()}
        <BottomTabBar />
      </div>
    );
  }

  return null;
};

export default Index;
