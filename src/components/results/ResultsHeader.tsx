import { useLanguage } from "@/contexts/LanguageContext";

interface ResultsHeaderProps {
  title: string;
  subtitle: string;
}

export const ResultsHeader = ({ title, subtitle }: ResultsHeaderProps) => {
  return (
    <>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {title}
      </h1>
      <p className="text-lg text-gray-800 dark:text-gray-200 mb-6">
        {subtitle}
      </p>
    </>
  );
};