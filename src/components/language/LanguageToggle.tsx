import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages } from "lucide-react";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleLanguage}
      className="relative"
      title={language === 'en' ? 'Switch to Indonesian' : 'Ganti ke Bahasa Inggris'}
    >
      <Languages className="h-5 w-5" />
      <span className="absolute -bottom-1 right-0 text-xs font-bold">
        {language.toUpperCase()}
      </span>
    </Button>
  );
}