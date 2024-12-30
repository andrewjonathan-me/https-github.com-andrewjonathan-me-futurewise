export const calculateCategoryPercentage = (points: number): number => {
  // Each answer now contributes ~3.33% to the total score (30 questions total)
  const percentagePerPoint = (100 / 30);
  return Math.round(points * percentagePerPoint);
};