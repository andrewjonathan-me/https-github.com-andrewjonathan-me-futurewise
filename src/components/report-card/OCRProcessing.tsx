import { toast } from "@/components/ui/use-toast";
import { performOCR } from "@/utils/tesseractProcessor";
import { extractGradesWithConfidence } from "@/utils/gradeExtractor";

export const processWithAPI = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('/api/ocr', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('OCR API request failed');
    }

    const result = await response.json();
    return result.text;
  } catch (error) {
    console.error('API OCR Error:', error);
    throw error;
  }
};

export const processWithTesseract = async (file: File): Promise<string> => {
  try {
    const result = await performOCR(file);
    console.log('Tesseract OCR Result:', result);
    
    if (result.confidence < 50) {
      toast({
        title: "Low Quality Detection",
        description: "The image quality might be too low for accurate detection.",
        variant: "destructive"
      });
    }
    
    return result.text;
  } catch (error) {
    console.error('Tesseract OCR Error:', error);
    throw error;
  }
};

export const parseGrades = (text: string): Record<string, number> => {
  const { grades, confidence, missingSubjects } = extractGradesWithConfidence(text);
  
  // Show confidence level to user
  if (confidence < 70) {
    toast({
      title: "Low Confidence Detection",
      description: "Some grades might not be accurate. Please verify the results.",
      variant: "destructive"
    });
  } else if (confidence >= 90) {
    toast({
      title: "High Confidence Detection",
      description: "Grades detected with high confidence.",
      variant: "default"
    });
  }

  // Notify about missing subjects
  if (missingSubjects.length > 0) {
    toast({
      title: "Missing Subjects",
      description: `Could not detect grades for: ${missingSubjects.join(', ')}`,
      variant: "destructive"
    });
  }
  
  return grades;
};