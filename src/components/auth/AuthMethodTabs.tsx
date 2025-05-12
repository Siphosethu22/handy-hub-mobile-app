
import React from "react";
import { Mail, Phone } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AuthMethodTabsProps {
  authMethod: "email" | "phone";
  onValueChange: (value: "email" | "phone") => void;
  emailForm: React.ReactNode;
  phoneForm: React.ReactNode;
}

const AuthMethodTabs = ({
  authMethod,
  onValueChange,
  emailForm,
  phoneForm
}: AuthMethodTabsProps) => {
  return (
    <Tabs defaultValue={authMethod} onValueChange={(value) => onValueChange(value as "email" | "phone")}>
      <TabsList className="w-full mb-4">
        <TabsTrigger value="email" className="flex-1"><Mail className="h-4 w-4 mr-2" /> Email</TabsTrigger>
        <TabsTrigger value="phone" className="flex-1"><Phone className="h-4 w-4 mr-2" /> Phone</TabsTrigger>
      </TabsList>
      
      <TabsContent value="email">
        {emailForm}
      </TabsContent>
      
      <TabsContent value="phone">
        {phoneForm}
      </TabsContent>
    </Tabs>
  );
};

export default AuthMethodTabs;
