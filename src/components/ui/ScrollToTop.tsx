import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <button
          onClick={scrollToTop}
          className={cn(
            "fixed bottom-4 right-4 p-2 rounded-full",
            "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm",
            "border border-gray-200 dark:border-gray-700",
            "text-gray-600 dark:text-gray-300",
            "hover:bg-white dark:hover:bg-gray-800",
            "transition-all duration-300 ease-in-out",
            "hover:scale-110",
            "focus:outline-none focus:ring-2 focus:ring-primary",
            "shadow-lg",
            "animate-fade-in",
            "sm:hidden" // Only show on mobile
          )}
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </>
  );
}