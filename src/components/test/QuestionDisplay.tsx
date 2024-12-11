import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium mb-4">{question}</h3>
      <RadioGroup
        value={selectedAnswer}
        onValueChange={onAnswerSelect}
        className="space-y-4"
      >
        {options.map((option, index) => (
          <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-colors">
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