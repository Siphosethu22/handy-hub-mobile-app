
import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import GoogleAuthButton from "./GoogleAuthButton";
import AuthDivider from "./AuthDivider";
import AuthMethodTabs from "./AuthMethodTabs";

interface UserTypeTabProps {
  value: "user" | "provider";
  authMethod: "email" | "phone";
  onAuthMethodChange: (value: "email" | "phone") => void;
  handleOAuthLogin: (provider: 'google') => Promise<void>;
  loading: boolean;
  emailForm: React.ReactNode;
  phoneForm: React.ReactNode;
}

const UserTypeTab = ({
  value,
  authMethod,
  onAuthMethodChange,
  handleOAuthLogin,
  loading,
  emailForm,
  phoneForm
}: UserTypeTabProps) => {
  const text = value === "provider" ? "Sign in with Google as Provider" : "Sign in with Google";
  
  return (
    <TabsContent value={value}>
      <div className="grid grid-cols-1 gap-4 mb-6">
        <GoogleAuthButton 
          onClick={() => handleOAuthLogin('google')}
          loading={loading}
          text={text}
        />
      </div>
      
      <AuthDivider />
      
      <AuthMethodTabs
        authMethod={authMethod}
        onValueChange={onAuthMethodChange}
        emailForm={emailForm}
        phoneForm={phoneForm}
      />
    </TabsContent>
  );
};

export default UserTypeTab;
