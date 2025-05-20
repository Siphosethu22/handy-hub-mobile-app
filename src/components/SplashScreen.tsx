
import React, { useEffect, useState } from "react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 500); // Wait for fade animation to complete
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`splash-screen ${fadeOut ? "opacity-0" : "opacity-100"} 
      transition-opacity duration-500 
      min-h-screen bg-gradient-to-b from-primary to-primary-dark
      flex items-center justify-center`}
    >
      <div className="flex flex-col items-center">
        <div className="bg-white p-6 rounded-full shadow-lg mb-4">
          <img 
            src="/lovable-uploads/07ac57f5-6bf7-47c6-b18a-e4fa0b06b24f.png" 
            alt="FixIt" 
            className="w-16 h-16" 
          />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">FixIt</h1>
        <p className="text-white text-sm">Find local services instantly</p>
      </div>
    </div>
  );
};

export default SplashScreen;
