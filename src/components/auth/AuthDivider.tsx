
import React from "react";
import { Separator } from "@/components/ui/separator";

const AuthDivider = () => {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <Separator className="w-full" />
      </div>
      <div className="relative flex justify-center text-xs uppercase">
        <span className="bg-white px-2 text-gray-500">Or continue with</span>
      </div>
    </div>
  );
};

export default AuthDivider;
