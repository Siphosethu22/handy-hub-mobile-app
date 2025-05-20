
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { LocationProvider } from "./context/LocationContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ResetPassword from "./pages/auth/ResetPassword";
import Home from "./pages/user/Home";
import Search from "./pages/user/Search";
import Notifications from "./pages/user/Notifications";
import Settings from "./pages/user/Settings";
import ServiceDetail from "./pages/user/ServiceDetail";
import ProviderDetail from "./pages/user/ProviderDetail";
import Dashboard from "./pages/provider/Dashboard";
import Payment from "./pages/provider/Payment";
import BusinessDetails from "./pages/provider/BusinessDetails";
import VerifyOtp from "./pages/auth/VerifyOtp";
import AuthCallback from "./pages/auth/AuthCallback";
import Messaging from "./pages/messaging/Messaging";

// Create a new QueryClient instance
const queryClient = new QueryClient();

// Make App a proper function component
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <NotificationProvider>
            <LocationProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/verify-otp" element={<VerifyOtp />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/search" element={<Search />} />
                  <Route path="/notifications" element={<Notifications />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/service/:id" element={<ServiceDetail />} />
                  <Route path="/provider/:id" element={<ProviderDetail />} />
                  <Route path="/provider/dashboard" element={<Dashboard />} />
                  <Route path="/provider/payment" element={<Payment />} />
                  <Route path="/provider/business-details" element={<BusinessDetails />} />
                  <Route path="/messaging" element={<Messaging />} />
                  <Route path="/messaging/:id" element={<Messaging />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </LocationProvider>
          </NotificationProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
