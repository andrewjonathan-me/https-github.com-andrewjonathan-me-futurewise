export interface TestResult {
  id: string;
  user_id: string;
  teknik: number;
  seni: number;
  sains: number;
  sosial: number;
  created_at: string;
  test_type?: string;
  score?: number;
  recommendations?: string[];
}