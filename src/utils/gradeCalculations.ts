export const calculateRecommendedMajor = (grades: Record<string, number | null>): string => {
  // Convert null values to 0 for calculations
  const {
    mathematics = 0,
    physics = 0,
    chemistry = 0,
    biology = 0,
    indonesian = 0,
    english = 0,
    history = 0,
    economics = 0,
  } = Object.fromEntries(
    Object.entries(grades).map(([key, value]) => [key, value === null ? 0 : value])
  );

  // Check if all grades are 0
  const allZeros = Object.values(grades).every(grade => grade === 0);
  if (allZeros) {
    return "Invalid Input - All Zeros";
  }

  // Calculate weighted scores for each major
  const teknikScore = 
    mathematics * 0.30 +
    physics * 0.25 +
    chemistry * 0.20 +
    biology * 0.25;

  const seniScore = 
    indonesian * 0.50 +
    english * 0.50;

  const sainsScore = 
    mathematics * 0.20 +
    physics * 0.20 +
    biology * 0.30 +
    chemistry * 0.30;

  const sosialScore = 
    history * 0.50 +
    economics * 0.50;

  console.log("Major Scores:", {
    teknik: teknikScore,
    seni: seniScore,
    sains: sainsScore,
    sosial: sosialScore
  });

  // Find the highest scoring category
  const scores = [
    { category: "Teknik", score: teknikScore },
    { category: "Seni", score: seniScore },
    { category: "Sains", score: sainsScore },
    { category: "Sosial", score: sosialScore }
  ];

  const highestScore = scores.reduce((prev, current) => 
    current.score > prev.score ? current : prev
  );

  return highestScore.category;
};