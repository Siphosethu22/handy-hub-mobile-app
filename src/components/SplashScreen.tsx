
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
    <div className={`splash-screen ${fadeOut ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
      <div className="flex flex-col items-center">
        <div className="bg-white p-6 rounded-full shadow-lg mb-4">
          <div className="text-5xl">🛠️</div>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">HandyHub</h1>
        <p className="text-white text-sm">Find local services instantly</p>
      </div>
    </div>
  );
};

export default SplashScreen;
