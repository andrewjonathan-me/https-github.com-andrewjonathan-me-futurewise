import { TestQuestion } from "@/data/testQuestions/types";

/**
 * Shuffles an array using Fisher-Yates algorithm
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Randomizes both questions and their options while maintaining answer relationships
 */
export function randomizeTest(questions: TestQuestion[]): TestQuestion[] {
  // First, create a deep copy of the questions array to avoid modifying original data
  const randomizedQuestions = questions.map(question => {
    // For each question, we need to maintain the relationship between options in both languages
    const optionsEn = question.options.en;
    const optionsId = question.options.id;
    
    // Create pairs of options to maintain their relationships
    const optionPairs = optionsEn.map((opt, idx) => ({
      en: opt,
      id: optionsId[idx]
    }));
    
    // Shuffle the pairs
    const shuffledPairs = shuffleArray(optionPairs);
    
    // Reconstruct the options object with shuffled options
    return {
      ...question,
      options: {
        en: shuffledPairs.map(pair => pair.en),
        id: shuffledPairs.map(pair => pair.id)
      }
    };
  });
  
  // Finally, shuffle the questions themselves
  return shuffleArray(randomizedQuestions);
}

/**
 * Helper function to get the index of the correct answer after randomization
 * This can be used if you need to track the correct answer index
 */
export function getCorrectAnswerIndex(
  originalOptions: string[], 
  randomizedOptions: string[], 
  originalCorrectIndex: number
): number {
  const correctAnswer = originalOptions[originalCorrectIndex];
  return randomizedOptions.indexOf(correctAnswer);
}