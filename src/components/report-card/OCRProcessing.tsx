import { createWorker } from "tesseract.js";
import { toast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const processWithAPI = async (file: File): Promise<string> => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onload = async () => {
      try {
        const base64Image = reader.result as string;
        console.log('Sending image to OCR API...');
        
        const { data, error } = await supabase.functions.invoke('ocr-process', {
          body: { image: base64Image.split(',')[1] } // Remove data:image/...;base64,
        });

        if (error) throw error;
        if (!data.text) throw new Error('No text detected');
        
        console.log('OCR API Result:', data.text);
        return resolve(data.text);
      } catch (error) {
        console.error('API OCR Error:', error);
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

export const processWithTesseract = async (file: File): Promise<string> => {
  console.log('Falling back to Tesseract OCR...');
  const worker = await createWorker('eng');
  try {
    await worker.load();
    const { data: { text } } = await worker.recognize(file);
    console.log('Tesseract OCR Result:', text);
    return text;
  } finally {
    await worker.terminate();
  }
};

export const parseGrades = (text: string): Record<string, number> => {
  const grades: Record<string, number> = {};
  const subjects = [
    { id: "mathematics", keywords: ["matematika", "math"] },
    { id: "physics", keywords: ["fisika", "physics"] },
    { id: "chemistry", keywords: ["kimia", "chemistry"] },
    { id: "biology", keywords: ["biologi", "biology"] },
    { id: "indonesian", keywords: ["bahasa indonesia", "indonesian"] },
    { id: "english", keywords: ["bahasa inggris", "english"] },
    { id: "history", keywords: ["sejarah", "history"] },
    { id: "economics", keywords: ["ekonomi", "economics"] },
  ];

  const lines = text.split('\n');
  lines.forEach(line => {
    subjects.forEach(subject => {
      const found = subject.keywords.some(keyword => 
        line.toLowerCase().includes(keyword.toLowerCase())
      );
      if (found) {
        const match = line.match(/\d+/);
        if (match) {
          const value = parseInt(match[0]);
          if (value >= 0 && value <= 100) {
            grades[subject.id] = value;
          }
        }
      }
    });
  });

  return grades;
};