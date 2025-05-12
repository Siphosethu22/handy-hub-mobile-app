
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhoneLoginFormProps {
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  isProvider?: boolean;
}

const PhoneLoginForm = ({
  phoneNumber,
  setPhoneNumber,
  handleSubmit,
  loading,
  isProvider = false
}: PhoneLoginFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor={`${isProvider ? "provider-" : ""}phone`} className="block text-sm font-medium text-gray-700 mb-1">
            {isProvider ? "Business " : ""}Phone Number
          </label>
          <Input
            id={`${isProvider ? "provider-" : ""}phone`}
            type="tel"
            placeholder="+1 (123) 456-7890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />
        </div>
        
        <div className="pt-2">
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading}
          >
            {loading ? "Sending code..." : "Continue with Phone"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default PhoneLoginForm;
