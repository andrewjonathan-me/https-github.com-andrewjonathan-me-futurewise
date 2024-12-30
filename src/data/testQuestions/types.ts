export interface TestQuestion {
  id: number;
  question: {
    en: string;
    id: string;
  };
  options: {
    en: string[];
    id: string[];
  };
}

export type TestQuestions = TestQuestion[];