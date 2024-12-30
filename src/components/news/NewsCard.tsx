import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  date: string;
  source: string;
  content?: string;
}

interface NewsCardProps {
  article: Article;
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case "Beasiswa":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "Penelitian":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
    case "Jurusan":
      return "bg-green-100 text-green-800 hover:bg-green-200";
    case "Kampus":
      return "bg-purple-100 text-purple-800 hover:bg-purple-200";
    case "Karir":
      return "bg-red-100 text-red-800 hover:bg-red-200";
    case "General":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const getCategoryTranslationKey = (category: string) => {
  switch (category) {
    case "General":
      return "news.categories.general";
    case "Beasiswa":
      return "news.categories.scholarship";
    case "Penelitian":
      return "news.categories.research";
    case "Jurusan":
      return "news.categories.major";
    case "Kampus":
      return "news.categories.campus";
    case "Karir":
      return "news.categories.career";
    default:
      return "news.categories.general";
  }
};

export function NewsCard({ article }: NewsCardProps) {
  const [imageError, setImageError] = useState(false);
  const { t } = useLanguage();

  const handleImageError = () => {
    console.log('Image failed to load:', article.image);
    setImageError(true);
  };

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
      <div className="aspect-video relative overflow-hidden">
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <div className="text-2xl font-bold text-gray-400 text-center p-4">
              FutureWise
            </div>
          </div>
        ) : (
          <img
            src={article.image}
            alt={article.title}
            className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
            onError={handleImageError}
          />
        )}
      </div>
      
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge 
            variant="secondary"
            className={`${getCategoryColor(article.category)} transition-colors`}
          >
            {t(getCategoryTranslationKey(article.category))}
          </Badge>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(article.date).toLocaleDateString("id-ID")}
          </div>
        </div>
        
        <CardTitle className="line-clamp-2 hover:text-primary transition-colors">
          {article.title}
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <p className="text-gray-600 line-clamp-3 mb-4">{article.summary}</p>
        <p className="text-sm text-gray-500">Sumber: {article.source}</p>
      </CardContent>
    </Card>
  );
}