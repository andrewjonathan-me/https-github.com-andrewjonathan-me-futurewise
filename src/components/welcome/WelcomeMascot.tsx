import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { useLocation } from "react-router-dom";
import { CloseButton } from "./CloseButton";

export const WelcomeMascot = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenDismissed, setHasBeenDismissed] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  useEffect(() => {
    // Check if widget has been dismissed in this session
    const isDismissed = sessionStorage.getItem("welcomeDismissed");
    if (!isDismissed) {
      // Add slight delay for smooth entrance after page load
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setHasBeenDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setHasBeenDismissed(true);
    sessionStorage.setItem("welcomeDismissed", "true");
  };

  // Only show on index page - moved after hooks
  if (location.pathname !== "/") {
    return null;
  }

  if (hasBeenDismissed) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 flex items-end gap-3 transition-all duration-300 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-10 opacity-0 pointer-events-none"
      } ${isMobile ? "flex-col items-end" : "items-end"}`}
    >
      {/* Message Bubble */}
      <div className="relative bg-primary-600 text-white p-4 rounded-lg shadow-lg max-w-[280px]">
        <p className="text-sm font-medium">Welcome to FutureWise, SIUUU!!</p>
      </div>

      {/* Mascot Image Container with Close Button */}
      <div className="relative">
        <CloseButton onClick={handleDismiss} />
        <img
          src="/lovable-uploads/8ed743ac-74e6-42d5-8fba-0da173ab6e2c.png"
          alt="Ronaldo mascot"
          className={`object-cover rounded-full border-2 border-primary-600 ${
            isMobile ? "w-16 h-16" : "w-20 h-20"
          }`}
        />
      </div>
    </div>
  );
};