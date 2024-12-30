import { useLanguage } from "@/contexts/LanguageContext";

interface ResultsCardProps {
  testType: string;
  score: number;
  recommendations: Array<{
    name: string;
    majors: string[];
  }>;
}

export const ResultsCard = ({ testType, score, recommendations }: ResultsCardProps) => {
  const { t } = useLanguage();
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
        {testType}
      </h2>
      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300">
            {t('results.score')}:
          </h3>
          <p className="text-2xl font-bold text-primary">{score}%</p>
        </div>
        
        <div>
          <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-4">
            {t('results.recommendations')}:
          </h3>
          <div className="space-y-6">
            {recommendations.map((uni, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-0">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {index + 1}) {uni.name}
                </h4>
                <ul className="list-disc pl-8 space-y-1">
                  {uni.majors.map((major, majorIndex) => (
                    <li key={majorIndex} className="text-gray-600 dark:text-gray-300">
                      {major}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};