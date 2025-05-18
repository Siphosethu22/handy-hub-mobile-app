
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

interface EmailLoginFormProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  isProvider?: boolean;
}

const EmailLoginForm = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  loading,
  isProvider = false
}: EmailLoginFormProps) => {
  const navigate = useNavigate();

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${isProvider ? "provider-" : ""}email`} className="block text-sm font-medium text-gray-700 mb-1">
            {isProvider ? "Business " : ""}Email
          </label>
          <Input
            id={`${isProvider ? "provider-" : ""}email`}
            type="email"
            placeholder={`Your ${isProvider ? "business " : ""}email`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div>
          <label htmlFor={`${isProvider ? "provider-" : ""}password`} className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <Input
            id={`${isProvider ? "provider-" : ""}password`}
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className="text-right mt-1">
            <a 
              onClick={() => navigate("/reset-password")} 
              className="text-sm text-primary hover:underline cursor-pointer"
            >
              Forgot password?
            </a>
          </div>
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Logging in..." : `Login ${isProvider ? "as Provider" : "with Email"}`}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default EmailLoginForm;
