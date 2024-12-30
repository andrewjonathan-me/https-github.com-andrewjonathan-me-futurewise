import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useLanguage } from "@/contexts/LanguageContext";

interface QuestionDisplayProps {
  question: string;
  options: string[];
  selectedAnswer: string | undefined;
  onAnswerSelect: (answer: string) => void;
}

export const QuestionDisplay = ({ 
  question, 
  options, 
  selectedAnswer, 
  onAnswerSelect 
}: QuestionDisplayProps) => {
  const { t } = useLanguage();

  console.log("Rendering QuestionDisplay with:", { question, options, selectedAnswer });

  // Add safety check and logging
  if (!question) {
    console.error("No question text provided");
    return (
      <div className="space-y-6">
        <p className="text-red-500">{t("test.errors.noQuestion")}</p>
      </div>
    );
  }

  if (!options || options.length === 0) {
    console.error("No options provided for question:", question);
    return (
      <div className="space-y-6">
        <h3 className="text-lg font-medium mb-4">{question}</h3>
        <p className="text-red-500">{t("test.errors.noOptions")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">{question}</h3>
      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerSelect}
        className="space-y-4"
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label htmlFor={`option-${index}`} className="flex-grow cursor-pointer">
              {option}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};