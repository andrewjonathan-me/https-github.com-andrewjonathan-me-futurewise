interface ExtractedGrade {
  subject: string;
  grade: number;
  confidence: number;
}

interface GradeExtractionResult {
  grades: Record<string, number>;
  confidence: number;
  missingSubjects: string[];
}

const SUBJECT_PATTERNS = {
  mathematics: [/matematika/i, /math/i, /mtk/i],
  physics: [/fisika/i, /physics/i, /fis/i],
  chemistry: [/kimia/i, /chemistry/i, /kim/i],
  biology: [/biologi/i, /biology/i, /bio/i],
  indonesian: [/bahasa indonesia/i, /indonesian/i, /bind/i],
  english: [/bahasa inggris/i, /english/i, /bing/i],
  history: [/sejarah/i, /history/i, /sej/i],
  economics: [/ekonomi/i, /economics/i, /eko/i]
};

export function extractGradesWithConfidence(text: string): GradeExtractionResult {
  const lines = text.split('\n');
  const extractedGrades: ExtractedGrade[] = [];
  let overallConfidence = 0;
  const grades: Record<string, number> = {};
  const missingSubjects: string[] = [];

  // Process each line
  lines.forEach(line => {
    Object.entries(SUBJECT_PATTERNS).forEach(([subject, patterns]) => {
      patterns.forEach(pattern => {
        if (pattern.test(line)) {
          // Extract numbers from the line
          const numbers = line.match(/\d+/g);
          if (numbers) {
            const grade = parseInt(numbers[0]);
            if (grade >= 0 && grade <= 100) {
              let confidence = 0.8; // Base confidence

              // Boost confidence based on context
              if (line.includes(':') || line.includes('=')) confidence += 0.1;
              if (line.toLowerCase().includes('nilai') || 
                  line.toLowerCase().includes('grade') || 
                  line.toLowerCase().includes('score')) {
                confidence += 0.1;
              }

              extractedGrades.push({
                subject,
                grade,
                confidence
              });
            }
          }
        }
      });
    });
  });

  // Process extracted grades
  Object.keys(SUBJECT_PATTERNS).forEach(subject => {
    const subjectGrades = extractedGrades.filter(g => g.subject === subject);
    
    if (subjectGrades.length > 0) {
      // Use the grade with highest confidence
      const bestGrade = subjectGrades.reduce((prev, current) => 
        current.confidence > prev.confidence ? current : prev
      );
      
      grades[subject] = bestGrade.grade;
      overallConfidence += bestGrade.confidence;
    } else {
      missingSubjects.push(subject);
    }
  });

  // Calculate overall confidence
  const totalSubjects = Object.keys(SUBJECT_PATTERNS).length;
  const foundSubjects = Object.keys(grades).length;
  overallConfidence = (overallConfidence / totalSubjects) * 
                      (foundSubjects / totalSubjects) * 100;

  return {
    grades,
    confidence: Math.round(overallConfidence),
    missingSubjects
  };
}