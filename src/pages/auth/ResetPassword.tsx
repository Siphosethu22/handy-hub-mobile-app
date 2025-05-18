
import React, { useState, useEffect } from "react";
import { supabase } from "../../integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { KeyRound, ArrowLeft, Mail } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"requestCode" | "enterCode" | "resetPassword">("requestCode");
  const navigate = useNavigate();
  const location = useLocation();

  const handleSendVerificationCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    try {
      setLoading(true);
      
      // Send a password reset email which will include a verification code
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      toast.success("Verification code sent to your email");
      setStep("enterCode");
    } catch (error: any) {
      console.error("Error sending verification code:", error);
      toast.error(error.message || "Failed to send verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!verificationCode || verificationCode.length < 6) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);
      
      // Verify the OTP code
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: verificationCode,
        type: 'recovery'
      });
      
      if (error) throw error;
      
      toast.success("Code verified successfully");
      setStep("resetPassword");
    } catch (error: any) {
      console.error("Error verifying code:", error);
      toast.error(error.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      
      const { error } = await supabase.auth.updateUser({
        password: password
      });
      
      if (error) throw error;
      
      toast.success("Password updated successfully");
      navigate("/login");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  // Check URL hash for recovery token
  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes("type=recovery")) {
      // If there's a recovery token in the URL, go straight to reset password step
      setStep("resetPassword");
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col justify-center p-4 bg-gray-50">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-primary">FixIt</h1>
        <p className="text-gray-600 mt-2">Reset your password</p>
      </div>
      
      <Card className="max-w-md mx-auto w-full p-6">
        <Button 
          variant="ghost" 
          className="mb-4 p-0" 
          onClick={() => navigate("/login")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to login
        </Button>
        
        {step === "requestCode" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
            <form onSubmit={handleSendVerificationCode} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Sending Code..." : "Send Verification Code"}
              </Button>
            </form>
          </div>
        )}

        {step === "enterCode" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Enter Verification Code</h2>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a verification code to {email}. Please check your email and enter the code below.
            </p>
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Verification Code
                </label>
                <InputOTP maxLength={6} value={verificationCode} onChange={setVerificationCode}>
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
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>

              <div className="text-center mt-2">
                <Button 
                  type="button" 
                  variant="link"
                  onClick={() => setStep("requestCode")} 
                  className="text-sm"
                >
                  Didn't receive a code? Try again
                </Button>
              </div>
            </form>
          </div>
        )}

        {step === "resetPassword" && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Set New Password</h2>
            <form onSubmit={handleSetNewPassword} className="space-y-4">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your new password"
                  disabled={loading}
                  minLength={6}
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  disabled={loading}
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full" 
                disabled={loading}
              >
                {loading ? "Updating Password..." : "Update Password"}
              </Button>
            </form>
          </div>
        )}
        
        {step === "requestCode" && (
          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-center">
            <Mail className="h-4 w-4 text-primary" />
            <span>We'll send a verification code to your email</span>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ResetPassword;
