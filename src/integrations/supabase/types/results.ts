export interface TestResultsTable {
  Row: {
    id: string;
    user_id: string;
    teknik: number;
    seni: number;
    sains: number;
    sosial: number;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    teknik?: number;
    seni?: number;
    sains?: number;
    sosial?: number;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    teknik?: number;
    seni?: number;
    sains?: number;
    sosial?: number;
    created_at?: string;
  };
}

export interface ReportCardsTable {
  Row: {
    id: string;
    user_id: string;
    mathematics: number | null;
    physics: number | null;
    chemistry: number | null;
    biology: number | null;
    indonesian: number | null;
    english: number | null;
    history: number | null;
    economics: number | null;
    recommended_major: string | null;
    created_at: string;
  };
  Insert: {
    id?: string;
    user_id: string;
    mathematics?: number | null;
    physics?: number | null;
    chemistry?: number | null;
    biology?: number | null;
    indonesian?: number | null;
    english?: number | null;
    history?: number | null;
    economics?: number | null;
    recommended_major?: string | null;
    created_at?: string;
  };
  Update: {
    id?: string;
    user_id?: string;
    mathematics?: number | null;
    physics?: number | null;
    chemistry?: number | null;
    biology?: number | null;
    indonesian?: number | null;
    english?: number | null;
    history?: number | null;
    economics?: number | null;
    recommended_major?: string | null;
    created_at?: string;
  };
}