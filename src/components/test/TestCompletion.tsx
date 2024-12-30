import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface TestCompletionProps {
  onSave: () => void;
}

export const TestCompletion = ({ onSave }: TestCompletionProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="text-center space-y-6">
      <p className="text-lg text-gray-700 dark:text-white">
        {t("test.completion.message")}
      </p>
      <Button
        onClick={onSave}
        className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-lg"
      >
        {t("test.completion.save")}
      </Button>
    </div>
  );
};