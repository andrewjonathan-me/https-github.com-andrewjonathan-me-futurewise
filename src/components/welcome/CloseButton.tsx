import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CloseButtonProps {
  onClick: () => void;
}

export const CloseButton = ({ onClick }: CloseButtonProps) => {
  const isMobile = useIsMobile();

  return (
    <button
      onClick={onClick}
      className={`
        absolute z-10 bg-white text-gray-800 rounded-full shadow-md 
        hover:bg-gray-100 transition-all duration-300 
        flex items-center justify-center
        ${
          isMobile
            ? "bottom-0 right-0 p-1 min-w-[24px] min-h-[24px]" // Mobile: Smaller touch target
            : "-right-2 top-0 p-1" // Desktop: Original position
        }
      `}
      aria-label="Close welcome message"
    >
      <X className={`${isMobile ? "h-3 w-3" : "h-4 w-4"}`} />
    </button>
  );
};