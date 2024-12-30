import { questions1To10 } from './questions1-10';
import { questions11To20 } from './questions11-20';
import { questions21To30 } from './questions21-30';
import { TestQuestions } from './types';

// Combine all question sets
const questions: TestQuestions = [
  ...questions1To10,
  ...questions11To20,
  ...questions21To30,
];

// Validate questions
questions.forEach((q, index) => {
  console.log(`Validating question ${index + 1}`);
  if (!q.question.en || !q.question.id) {
    console.error(`Missing translation for question ${index + 1}`);
  }
  if (!q.options.en || !q.options.id) {
    console.error(`Missing options for question ${index + 1}`);
  }
  if (q.options.en.length !== q.options.id.length) {
    console.error(`Mismatched option counts for question ${index + 1}`);
  }
});

export { questions };