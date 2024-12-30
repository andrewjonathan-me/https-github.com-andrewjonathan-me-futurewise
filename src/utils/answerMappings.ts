import { CategoryType } from '@/types/database/test';
import { questions } from '@/data/testQuestions';

export interface AnswerMapping {
  questionIndex: number;
  optionIndex: number;
  category: CategoryType;
}

// Map each answer option to its corresponding category
export const answerMappings: AnswerMapping[] = [
  // Questions 1-30 mappings
  ...Array(30).fill(null).map((_, questionIndex) => [
    { questionIndex, optionIndex: 0, category: 'teknik' as CategoryType },
    { questionIndex, optionIndex: 1, category: 'seni' as CategoryType },
    { questionIndex, optionIndex: 2, category: 'sains' as CategoryType },
    { questionIndex, optionIndex: 3, category: 'sosial' as CategoryType }
  ]).flat()
];

export const calculateCategoryScores = (answers: Record<number, string>, language: 'en' | 'id') => {
  console.log('Calculating scores for answers:', answers);
  
  const categories = {
    teknik: 0,
    seni: 0,
    sains: 0,
    sosial: 0
  };

  Object.entries(answers).forEach(([questionIndex, answer]) => {
    const questionData = questions[Number(questionIndex)];
    if (!questionData) {
      console.error('Question not found for index:', questionIndex);
      return;
    }

    const options = questionData.options[language];
    if (!options) {
      console.error('Options not found for language:', language);
      return;
    }

    const optionIndex = options.indexOf(answer);
    console.log('Processing answer:', {
      questionIndex,
      answer,
      optionIndex,
      options
    });

    const mapping = answerMappings.find(
      m => m.questionIndex === Number(questionIndex) && m.optionIndex === optionIndex
    );

    if (mapping) {
      categories[mapping.category]++;
      console.log('Found mapping:', {
        category: mapping.category,
        newCount: categories[mapping.category]
      });
    } else {
      console.error('No mapping found for:', {
        questionIndex,
        optionIndex
      });
    }
  });

  // Calculate percentages (3.33% per question since we have 30 questions)
  const totalQuestions = 30;
  const percentagePerQuestion = 100 / totalQuestions;

  const scores = {
    teknik: Math.round(categories.teknik * percentagePerQuestion),
    seni: Math.round(categories.seni * percentagePerQuestion),
    sains: Math.round(categories.sains * percentagePerQuestion),
    sosial: Math.round(categories.sosial * percentagePerQuestion)
  };

  console.log('Final scores:', scores);
  return scores;
};