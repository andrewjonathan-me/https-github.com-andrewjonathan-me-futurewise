import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface NewsCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
}

const categories = [
  { id: "all", translationKey: "news.categories.all" },
  { id: "General", translationKey: "news.categories.general" },
  { id: "Beasiswa", translationKey: "news.categories.scholarship" },
  { id: "Penelitian", translationKey: "news.categories.research" },
  { id: "Jurusan", translationKey: "news.categories.major" },
  { id: "Kampus", translationKey: "news.categories.campus" },
  { id: "Karir", translationKey: "news.categories.career" },
];

export function NewsCategories({ selectedCategory, onSelectCategory }: NewsCategoriesProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap gap-2">
      {categories.map(category => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? "default" : "outline"}
          onClick={() => onSelectCategory(category.id)}
          className="transition-colors"
        >
          {t(category.translationKey)}
        </Button>
      ))}
    </div>
  );
}