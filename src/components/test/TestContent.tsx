import { Button } from "@/components/ui/button";
import { TestProgress } from "./TestProgress";
import { QuestionDisplay } from "./QuestionDisplay";
import { questions } from "@/data/testQuestions";

interface TestContentProps {
  currentQuestion: number;
  answers: Record<number, string>;
  onAnswer: (answer: string) => void;
  onPrevious: () => void;
  onNext: () => void;
}

export const TestContent = ({
  currentQuestion,
  answers,
  onAnswer,
  onPrevious,
  onNext,
}: TestContentProps) => {
  return (
    <>
      <TestProgress 
        currentQuestion={currentQuestion} 
        totalQuestions={questions.length} 
      />
      <QuestionDisplay
        question={questions[currentQuestion].question}
        options={questions[currentQuestion].options}
        selectedAnswer={answers[currentQuestion]}
        onAnswerSelect={onAnswer}
      />
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className="px-6"
        >
          Sebelumnya
        </Button>
        <Button
          onClick={onNext}
          className="px-6 bg-indigo-600 hover:bg-indigo-700"
        >
          {currentQuestion === questions.length - 1 ? "Selesai" : "Selanjutnya"}
        </Button>
      </div>
    </>
  );
};