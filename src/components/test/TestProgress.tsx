interface TestProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

export const TestProgress = ({ currentQuestion, totalQuestions }: TestProgressProps) => {
  return (
    <div className="mb-8">
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};