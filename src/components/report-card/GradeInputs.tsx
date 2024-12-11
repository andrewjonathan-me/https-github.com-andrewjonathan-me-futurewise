import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const subjects = [
  { id: "mathematics", label: "Mathematics" },
  { id: "physics", label: "Physics" },
  { id: "chemistry", label: "Chemistry" },
  { id: "biology", label: "Biology" },
  { id: "indonesian", label: "Indonesian Language" },
  { id: "english", label: "English Language" },
  { id: "history", label: "History" },
  { id: "economics", label: "Economics" },
];

interface GradeInputsProps {
  grades: Record<string, number | null>;
  onGradeChange: (subject: string, value: string) => void;
}

export function GradeInputs({ grades, onGradeChange }: GradeInputsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <div key={subject.id} className="space-y-2">
          <Label htmlFor={subject.id}>{subject.label}</Label>
          <Input
            id={subject.id}
            type="text"
            placeholder="Enter grade (0-100)"
            value={grades[subject.id] === null ? "" : (grades[subject.id] ?? "")}
            onChange={(e) => onGradeChange(subject.id, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}