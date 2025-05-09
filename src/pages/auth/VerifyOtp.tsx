
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

type LocationState = {
  phoneNumber: string;
  isRegistration?: boolean;
};

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [remainingTime, setRemainingTime] = useState(60);
  const { verifyOtp, loginWithPhone, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { phoneNumber, isRegistration } = (location.state as LocationState) || {};
  
  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
      return;
    }
    
    // Set up countdown timer
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => {
      clearInterval(timer);
    };
  }, [phoneNumber, navigate]);
  
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp || otp.length < 6) {
      toast.error("Please enter a valid verification code");
      return;
    }
    
    try {
      await verifyOtp(phoneNumber, otp);
      
      // If this is a registration and user is a provider, redirect to business details
      const isProvider = localStorage.getItem('phone_registration_is_provider') === 'true';
      
      if (isRegistration && isProvider) {
        localStorage.removeItem('phone_registration_is_provider');
        navigate("/provider/business-details");
      } else {
        navigate("/");
      }
      
      toast.success("Phone number verified successfully");
    } catch (error) {
      console.error("OTP verification failed:", error);
      toast.error("Verification failed. Please try again.");
    }
  };
  
  const handleResendCode = async () => {
    try {
      await loginWithPhone(phoneNumber);
      setRemainingTime(60);
      toast.success("New verification code sent");
    } catch (error) {
      console.error("Failed to resend code:", error);
      toast.error("Failed to resend code. Please try again.");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-4 bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={16} className="mr-1" />
          Back
        </Button>
        
        <h2 className="text-2xl font-semibold mb-6 text-center">Verify Your Phone</h2>
        
        <p className="text-gray-600 mb-6 text-center">
          We've sent a verification code to <span className="font-medium">{phoneNumber}</span>
        </p>
        
        <form onSubmit={handleVerify}>
          <div className="mb-6">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter verification code
            </label>
            <Input
              id="otp"
              type="text"
              placeholder="6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="text-center text-lg letter-spacing-wide"
              maxLength={6}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full mb-4"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify"}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Didn't receive a code?{" "}
              {remainingTime > 0 ? (
                <span>Resend in {remainingTime}s</span>
              ) : (
                <Button 
                  variant="link" 
                  className="p-0 h-auto" 
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Resend code
                </Button>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
