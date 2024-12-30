import { createWorker, createScheduler } from 'tesseract.js';
import { preprocessImage } from './imagePreprocessing';

interface OCRResult {
  text: string;
  confidence: number;
}

export async function performOCR(file: File): Promise<OCRResult> {
  try {
    // Preprocess the image
    const processedImage = await preprocessImage(file);
    
    // Create a scheduler for multiple workers
    const scheduler = createScheduler();
    
    // Create workers for both languages
    const workerInd = await createWorker('ind');
    const workerEng = await createWorker('eng');
    
    // Add workers to scheduler
    scheduler.addWorker(workerInd);
    scheduler.addWorker(workerEng);
    
    // Process with both languages
    const results = await Promise.all([
      scheduler.addJob('recognize', processedImage),
      scheduler.addJob('recognize', processedImage)
    ]);
    
    // Clean up
    await scheduler.terminate();
    
    // Get the result with highest confidence
    const bestResult = results.reduce((prev, current) => 
      current.data.confidence > prev.data.confidence ? current : prev
    );
    
    return {
      text: bestResult.data.text,
      confidence: bestResult.data.confidence
    };
  } catch (error) {
    console.error('OCR Processing Error:', error);
    throw error;
  }
}