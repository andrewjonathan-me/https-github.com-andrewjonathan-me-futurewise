import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { questions } from "@/data/testQuestions";
import { TestContent } from "@/components/test/TestContent";
import { TestCompletion } from "@/components/test/TestCompletion";

export default function Test() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [result, setResult] = useState<{ teknik: number; seni: number; sains: number; sosial: number } | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleAnswer = (answer: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion]: answer
    }));
  };

  const calculateResult = (answers: Record<number, string>) => {
    const categories = {
      teknik: 0,
      seni: 0,
      sains: 0,
      sosial: 0
    };

    Object.values(answers).forEach((answer, index) => {
      const optionIndex = questions[index].options.indexOf(answer);
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
      }
    });

    return categories;
  };

  const saveResults = async () => {
    try {
      console.log("Starting to save test results...");
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('Error getting user:', userError);
        toast({
          title: "Error",
          description: "Terjadi kesalahan saat memverifikasi pengguna. Silakan coba masuk kembali.",
          variant: "destructive"
        });
        return false;
      }

      if (!user) {
        console.error('No authenticated user found');
        toast({
          title: "Error",
          description: "Anda harus login terlebih dahulu untuk menyimpan hasil tes.",
          variant: "destructive"
        });
        return false;
      }

      if (!result) {
        console.error('No test result to save');
        toast({
          title: "Error",
          description: "Tidak ada hasil tes untuk disimpan.",
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
          title: "Error",
          description: "Gagal menyimpan hasil tes. Detail: " + insertError.message,
          variant: "destructive"
        });
        return false;
      }

      console.log("Test results saved successfully");
      toast({
        title: "Berhasil",
        description: "Hasil tes berhasil disimpan.",
      });
      
      navigate("/results", { state: { result, answers } });
      return true;
    } catch (error) {
      console.error('Unexpected error saving test results:', error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
        variant: "destructive"
      });
      return false;
    }
  };

  const handleNext = async () => {
    if (!answers[currentQuestion]) {
      toast({
        title: "Peringatan",
        description: "Silakan pilih salah satu jawaban",
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
              Tes Minat dan Bakat - {showSaveButton ? 'Selesai' : `Pertanyaan ${currentQuestion + 1}/${questions.length}`}
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