import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/data/testQuestions";
import { TestContent } from "@/components/test/TestContent";
import { TestCompletion } from "@/components/test/TestCompletion";
import { useLanguage } from "@/contexts/LanguageContext";
import { calculateCategoryScores } from "@/utils/answerMappings";

interface Answer {
  answer: string;
  questionId: number;
}

export default function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, Answer>>({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [result, setResult] = useState<{ teknik: number; seni: number; sains: number; sosial: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t, language } = useLanguage();

  const handleAnswer = (answer: string, questionId: number) => {
    console.log("Selected answer:", { answer, questionId });
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: { answer, questionId }
    }));
  };

  const calculateResult = (answers: Record<number, Answer>) => {
    console.log("Calculating results for language:", language);
    console.log("Answers with question IDs:", answers);
    
    // Convert answers to format expected by calculateCategoryScores
    const formattedAnswers: Record<number, string> = {};
    Object.entries(answers).forEach(([index, answerData]) => {
      formattedAnswers[answerData.questionId - 1] = answerData.answer;
    });
    
    return calculateCategoryScores(formattedAnswers, language);
  };

  const saveResults = async () => {
    try {
      console.log("Starting to save test results...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        toast({
          title: t("common.error"),
          description: t("test.errors.auth"),
          variant: "destructive"
        });
        return false;
      }

      if (!user) {
        console.error('No authenticated user found');
        toast({
          title: t("common.error"),
          description: t("test.errors.auth"),
          variant: "destructive"
        });
        return false;
      }

      if (!result) {
        console.error('No test result to save');
        toast({
          title: t("common.error"),
          description: t("test.errors.noResult"),
          variant: "destructive"
        });
        return false;
      }

      console.log("Attempting to save results for user:", user.id);
      const { error: insertError } = await supabase
        .from('test_results')
        .insert([{ 
          ...result, 
          user_id: user.id,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        console.error('Error saving test results:', insertError);
        toast({
          title: t("common.error"),
          description: t("test.errors.save") + insertError.message,
          variant: "destructive"
        });
        return false;
      }

      console.log("Test results saved successfully");
      toast({
        title: t("common.success"),
        description: t("test.success.save"),
      });
      
      navigate("/results", { state: { result, answers } });
      return true;
    } catch (error) {
      console.error('Unexpected error saving test results:', error);
      toast({
        title: t("common.error"),
        description: t("test.errors.unexpected"),
        variant: "destructive"
      });
      return false;
    }
  };

  const handleNext = async () => {
    if (!answers[currentQuestion]) {
      toast({
        title: t("common.warning"),
        description: t("test.warnings.answer"),
        variant: "destructive"
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
    } else {
      const calculatedResult = calculateResult(answers);
      console.log("Calculated result:", calculatedResult);
      setResult(calculatedResult);
      setShowSaveButton(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl dark:text-white">
              {showSaveButton ? t("test.completion") : `${t("test.progress")} ${currentQuestion + 1}/${questions.length}`}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showSaveButton ? (
              <TestContent
                currentQuestion={currentQuestion}
                answers={answers}
                onAnswer={handleAnswer}
                onPrevious={handlePrevious}
                onNext={handleNext}
              />
            ) : (
              <TestCompletion onSave={saveResults} />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}