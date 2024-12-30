import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

export const subjects = [
  { id: "mathematics", label: "subject.mathematics" },
  { id: "physics", label: "subject.physics" },
  { id: "chemistry", label: "subject.chemistry" },
  { id: "biology", label: "subject.biology" },
  { id: "indonesian", label: "subject.indonesian" },
  { id: "english", label: "subject.english" },
  { id: "history", label: "subject.history" },
  { id: "economics", label: "subject.economics" },
];

interface GradeInputsProps {
  grades: Record<string, number | null>;
  onGradeChange: (subject: string, value: string) => void;
}

export function GradeInputs({ grades, onGradeChange }: GradeInputsProps) {
  const { t } = useLanguage();

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {subjects.map((subject) => (
        <div key={subject.id} className="space-y-2">
          <Label htmlFor={subject.id}>{t(subject.label)}</Label>
          <Input
            id={subject.id}
            type="text"
            placeholder={t("report.grade.placeholder")}
            value={grades[subject.id] === null ? "" : (grades[subject.id] ?? "")}
            onChange={(e) => onGradeChange(subject.id, e.target.value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}