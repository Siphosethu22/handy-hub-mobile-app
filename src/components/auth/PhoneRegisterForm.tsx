
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhoneRegisterFormProps {
  name: string;
  setName: (name: string) => void;
  phoneNumber: string;
  setPhoneNumber: (phone: string) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  loading: boolean;
  isProvider: boolean;
}

const PhoneRegisterForm = ({
  name,
  setName,
  phoneNumber,
  setPhoneNumber,
  handleSubmit,
  loading,
  isProvider
}: PhoneRegisterFormProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div>
          <label htmlFor="name-phone" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <Input
            id="name-phone"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="+1 (123) 456-7890"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
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

export default PhoneRegisterForm;
