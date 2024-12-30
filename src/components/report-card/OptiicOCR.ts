import { supabase } from "@/integrations/supabase/client";

interface OptiicResponse {
  text: string;
  confidence: number;
}

export const processWithOptiic = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        console.log('Sending image to Optiic API...');
        
        const { data, error } = await supabase.functions.invoke('optiic-ocr', {
          body: { image: base64Image.split(',')[1] }
        });

        if (error) {
          console.error('Supabase Function Error:', error);
          throw error;
        }
        
        if (!data?.text) {
          console.error('No text in response:', data);
          throw new Error('No text detected');
        }
        
        console.log('Optiic API Result:', data.text);
        return resolve(data.text);
      } catch (error) {
        console.error('Optiic OCR Error:', error);
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

// Rule-based grade extraction with confidence scoring
export const extractGradesWithConfidence = (text: string): { grades: Record<string, number>, confidence: number } => {
  const grades: Record<string, number> = {};
  let totalConfidence = 0;
  let matchCount = 0;

  const subjects = [
    { id: "mathematics", keywords: ["matematika", "math", "mathematics"], weight: 1 },
    { id: "physics", keywords: ["fisika", "physics"], weight: 1 },
    { id: "chemistry", keywords: ["kimia", "chemistry"], weight: 1 },
    { id: "biology", keywords: ["biologi", "biology"], weight: 1 },
    { id: "indonesian", keywords: ["bahasa indonesia", "indonesian"], weight: 1 },
    { id: "english", keywords: ["bahasa inggris", "english"], weight: 1 },
    { id: "history", keywords: ["sejarah", "history"], weight: 0.8 },
    { id: "economics", keywords: ["ekonomi", "economics"], weight: 0.8 }
  ];

  const lines = text.toLowerCase().split('\n');
  
  subjects.forEach(subject => {
    for (const line of lines) {
      const found = subject.keywords.some(keyword => line.includes(keyword.toLowerCase()));
      if (found) {
        // Look for numbers in the line
        const numbers = line.match(/\d+/g);
        if (numbers) {
          const possibleGrades = numbers
            .map(num => parseInt(num))
            .filter(num => num >= 0 && num <= 100);

          if (possibleGrades.length > 0) {
            // Take the most likely grade (first number between 0-100)
            grades[subject.id] = possibleGrades[0];
            
            // Calculate confidence based on various factors
            let confidence = subject.weight;
            
            // Adjust confidence based on number position and context
            if (line.includes(':') || line.includes('=')) confidence += 0.2;
            if (possibleGrades.length === 1) confidence += 0.1;
            
            totalConfidence += confidence;
            matchCount++;
            break;
          }
        }
      }
    }
  });

  // Calculate overall confidence score (0-100%)
  const averageConfidence = matchCount > 0 ? 
    (totalConfidence / matchCount) * 100 : 0;

  return {
    grades,
    confidence: Math.min(100, averageConfidence)
  };
};