
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();
  const phoneNumber = searchParams.get("phone") || "";
  const [countdown, setCountdown] = useState(60);
  const { verifyOtp, loginWithPhone, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!phoneNumber) {
      navigate("/login");
    }

    // Countdown timer for resend
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [phoneNumber, navigate]);

  const handleVerify = async () => {
    if (!phoneNumber) {
      toast.error("Phone number is missing");
      return;
    }

    if (otp.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    try {
      await verifyOtp(phoneNumber, otp);
      toast.success("Phone number verified successfully");
      navigate("/");
    } catch (error) {
      console.error("OTP verification failed:", error);
    }
  };

  const handleResendCode = async () => {
    if (!phoneNumber) return;
    
    try {
      await loginWithPhone(phoneNumber);
      setCountdown(60);
      toast.success("New verification code sent");
    } catch (error) {
      console.error("Failed to resend code:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">FixIt</h1>
        <p className="text-gray-600 mt-2">Verify your phone number</p>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto w-full">
        <h2 className="text-2xl font-semibold mb-2">Enter verification code</h2>
        <p className="text-gray-500 mb-6">
          We've sent a 6-digit verification code to {phoneNumber}
        </p>
        
        <div className="flex justify-center mb-8">
          <InputOTP maxLength={6} value={otp} onChange={setOtp}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        
        <Button 
          onClick={handleVerify} 
          disabled={loading || otp.length !== 6}
          className="w-full mb-4"
        >
          {loading ? "Verifying..." : "Verify"}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 mb-2">Didn't receive the code?</p>
          {countdown > 0 ? (
            <p className="text-sm">Resend code in {countdown}s</p>
          ) : (
            <Button 
              variant="link" 
              onClick={handleResendCode} 
              disabled={loading}
            >
              Resend Code
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;
