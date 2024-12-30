import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/data/testQuestions";
import { TestContent } from "@/components/test/TestContent";
import { TestCompletion } from "@/components/test/TestCompletion";
import { useLanguage } from "@/contexts/LanguageContext";
import { TestQuestion } from "@/data/testQuestions/types";
import { calculateCategoryPercentage } from "@/utils/testCalculations";

export default function TestEnglish() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, { answer: string; questionId: number }>>({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [result, setResult] = useState<{ teknik: number; seni: number; sains: number; sosial: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleAnswer = (answer: string, questionId: number) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: { answer, questionId }
    }));
  };

  const calculateResult = (answers: Record<number, { answer: string; questionId: number }>) => {
    const categories = {
      teknik: 0,
      seni: 0,
      sains: 0,
      sosial: 0
    };

    Object.entries(answers).forEach(([questionIndex, answerData]) => {
      const questionData = questions[Number(questionIndex)] as TestQuestion;
      const options = questionData.options.en;
      
      if (!options || !Array.isArray(options)) {
        console.error("Invalid options for question", questionIndex);
        return;
      }

      const optionIndex = options.indexOf(answerData.answer);

      switch (optionIndex) {
        case 0:
          categories.teknik += 1;
          break;
        case 1:
          categories.seni += 1;
          break;
        case 2:
          categories.sains += 1;
          break;
        case 3:
          categories.sosial += 1;
          break;
        default:
          console.error("Invalid option index:", optionIndex);
      }
    });

    return {
      teknik: calculateCategoryPercentage(categories.teknik),
      seni: calculateCategoryPercentage(categories.seni),
      sains: calculateCategoryPercentage(categories.sains),
      sosial: calculateCategoryPercentage(categories.sosial)
    };
  };

  const saveResults = async () => {
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        toast({
          title: t("common.error"),
          description: t("test.errors.auth"),
          variant: "destructive"
        });
        return false;
      }

      if (!user) {
        toast({
          title: t("common.error"),
          description: t("test.errors.auth"),
          variant: "destructive"
        });
        return false;
      }

      if (!result) {
        toast({
          title: t("common.error"),
          description: t("test.errors.noResult"),
          variant: "destructive"
        });
        return false;
      }

      const { error: insertError } = await supabase
        .from('test_results')
        .insert([{ 
          ...result, 
          user_id: user.id,
          created_at: new Date().toISOString()
        }]);

      if (insertError) {
        toast({
          title: t("common.error"),
          description: t("test.errors.save") + insertError.message,
          variant: "destructive"
        });
        return false;
      }

      toast({
        title: t("common.success"),
        description: t("test.success.save"),
      });
      
      navigate("/results", { state: { result, answers } });
      return true;
    } catch (error) {
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
                forcedLanguage="en"
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
