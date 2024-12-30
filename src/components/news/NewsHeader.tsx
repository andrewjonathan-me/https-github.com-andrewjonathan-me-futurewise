import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface NewsHeaderProps {
  onRefresh: () => void;
}

export function NewsHeader({ onRefresh }: NewsHeaderProps) {
  const { t } = useLanguage();

  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold dark:text-white">{t('news.title')}</h1>
      <Button
        onClick={onRefresh}
        variant="outline"
        className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
      >
        <RefreshCw className="w-4 h-4" />
        {t('news.refresh')}
      </Button>
    </div>
  );
}