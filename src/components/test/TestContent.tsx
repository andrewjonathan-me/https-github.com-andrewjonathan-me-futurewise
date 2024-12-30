import { Button } from "@/components/ui/button";
import { TestProgress } from "./TestProgress";
import { QuestionDisplay } from "./QuestionDisplay";
import { questions } from "@/data/testQuestions";
import { useLanguage } from "@/contexts/LanguageContext";
import { TestQuestion } from "@/data/testQuestions/types";
import { useState, useEffect } from "react";
import { randomizeTest } from "@/utils/testRandomizer";

interface TestContentProps {
  currentQuestion: number;
  answers: Record<number, { answer: string; questionId: number }>;
  onAnswer: (answer: string, questionId: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  forcedLanguage?: 'en' | 'id';
}

export const TestContent = ({
  currentQuestion,
  answers,
  onAnswer,
  onPrevious,
  onNext,
  forcedLanguage,
}: TestContentProps) => {
  const { t, language } = useLanguage();
  const effectiveLanguage = forcedLanguage || language;
  const [randomizedQuestions, setRandomizedQuestions] = useState<TestQuestion[]>([]);

  useEffect(() => {
    // Now using all questions instead of just first 5
    const randomized = randomizeTest(questions);
    setRandomizedQuestions(randomized);
    console.log("Questions randomized:", randomized);
  }, []);

  console.log("TestContent rendering with:", {
    currentQuestion,
    effectiveLanguage,
    answers
  });

  const currentQuestionData = randomizedQuestions[currentQuestion];
  
  if (!currentQuestionData) {
    console.error("No question data found for index:", currentQuestion);
    return null;
  }

  const questionText = currentQuestionData.question[effectiveLanguage];
  const questionOptions = currentQuestionData.options[effectiveLanguage];

  console.log("Current question data:", {
    questionText,
    questionOptions,
    effectiveLanguage,
    questionId: currentQuestionData.id
  });

  if (!questionText || !questionOptions) {
    console.error("Missing translation for question or options:", {
      questionText,
      questionOptions,
      effectiveLanguage,
      currentQuestion
    });
    return null;
  }

  const handleAnswerSelect = (answer: string) => {
    onAnswer(answer, currentQuestionData.id);
  };

  return (
    <>
      <TestProgress 
        currentQuestion={currentQuestion} 
        totalQuestions={randomizedQuestions.length} 
      />
      <QuestionDisplay
        question={questionText}
        options={questionOptions}
        selectedAnswer={answers[currentQuestion]?.answer}
        onAnswerSelect={handleAnswerSelect}
      />
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={currentQuestion === 0}
          className="px-6"
        >
          {t("test.previous")}
        </Button>
        <Button
          onClick={onNext}
          className="px-6 bg-indigo-600 hover:bg-indigo-700"
        >
          {currentQuestion === randomizedQuestions.length - 1 ? t("test.finish") : t("test.next")}
        </Button>
      </div>
    </>
  );
};