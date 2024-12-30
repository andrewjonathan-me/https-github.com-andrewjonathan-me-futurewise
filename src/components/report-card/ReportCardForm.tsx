import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { GradeInputs, subjects } from "./GradeInputs";
import { calculateRecommendedMajor } from "@/utils/gradeCalculations";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReportCardFormProps {
  onBack: () => void;
  onSubmitSuccess: () => void;
  initialGrades?: Record<string, number>;
}

export function ReportCardForm({ onBack, onSubmitSuccess, initialGrades = {} }: ReportCardFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();
  const [grades, setGrades] = useState<Record<string, number | null>>(initialGrades);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGradeChange = (subject: string, value: string) => {
    // Handle empty input
    if (value === "") {
      setGrades((prev) => ({ ...prev, [subject]: null }));
      setError("");
      return;
    }

    const numValue = parseInt(value);
    // Check if the value is a valid number and within range (including 0)
    if (!isNaN(numValue) && numValue >= 0 && numValue <= 100) {
      setGrades((prev) => ({ ...prev, [subject]: numValue }));
      setError("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all grades are filled
    const allGradesFilled = subjects.every(subject => 
      grades[subject.id] !== null && grades[subject.id] !== undefined
    );

    if (!allGradesFilled) {
      setError("Please fill in all grades before submitting");
      toast({
        title: "Error",
        description: "Please fill in all grades before submitting",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get the current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("User not authenticated");
      }

      const recommendedMajor = calculateRecommendedMajor(grades);
      
      // Check if all grades are 0
      const allZeros = Object.values(grades).every(grade => grade === 0);
      if (allZeros) {
        toast({
          title: "Invalid Input",
          description: "All grades cannot be 0. Please provide valid grades.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const reportCardData = {
        ...Object.fromEntries(
          Object.entries(grades).map(([key, value]) => [key, value === null ? null : value])
        ),
        recommended_major: recommendedMajor,
        user_id: user.id
      };

      console.log("Inserting report card data:", reportCardData);
      
      const { error } = await supabase
        .from("report_cards")
        .insert(reportCardData);

      if (error) throw error;

      toast({
        title: "Success!",
        description: "Your report card has been saved successfully.",
      });

      // Call onSubmitSuccess to switch to view mode
      onSubmitSuccess();
    } catch (error) {
      console.error("Error saving report card:", error);
      toast({
        title: "Error",
        description: "Failed to save your report card. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Check if all grades are filled for submit button state
  const isFormComplete = subjects.every(subject => 
    grades[subject.id] !== null && grades[subject.id] !== undefined
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{t("report.manual.input")}</h2>
        <Button onClick={onBack} variant="outline">
          {t("report.back.menu")}
        </Button>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <GradeInputs 
          grades={grades}
          onGradeChange={handleGradeChange}
        />

        <Button 
          type="submit" 
          className="w-full" 
          disabled={loading || !isFormComplete}
        >
          {loading ? t("common.loading") : t("report.submit")}
        </Button>
      </form>
    </div>
  );
}