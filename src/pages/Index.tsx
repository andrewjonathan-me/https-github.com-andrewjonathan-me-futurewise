import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground dark:bg-slate-900">
      <div className="text-center space-y-6">
        <h1 className="text-5xl font-bold mb-4 dark:text-white">{t("index.welcome")}</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
          {t("index.subtitle")}
        </p>
        <div className="flex gap-4 justify-center mt-8">
          <Button 
            onClick={() => navigate("/auth/register")}
            className="px-6 py-2"
          >
            {t("index.getStarted")}
          </Button>
          <Button 
            variant="outline"
            onClick={() => navigate("/about")}
            className="px-6 py-2"
          >
            {t("index.learnMore")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;