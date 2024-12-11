import { Button } from "@/components/ui/button";

interface NewsCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: "all", label: "Semua" },
  { id: "General", label: "Umum" },
  { id: "Beasiswa", label: "Beasiswa" },
  { id: "Penelitian", label: "Penelitian" },
  { id: "Jurusan", label: "Jurusan" },
  { id: "Kampus", label: "Kampus" },
  { id: "Karir", label: "Karir" },
];

export function NewsCategories({ selectedCategory, onSelectCategory }: NewsCategoriesProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onSelectCategory(category.id)}
          className="transition-colors"
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
}