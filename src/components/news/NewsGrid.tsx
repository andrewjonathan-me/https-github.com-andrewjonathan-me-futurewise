import { NewsCard } from "./NewsCard";
import { Skeleton } from "@/components/ui/skeleton";

interface Article {
  id: string;
  title: string;
  category: string;
  image: string;
  summary: string;
  date: string;
  source: string;
  content?: string;
  url?: string;
}

interface NewsGridProps {
  isLoading: boolean;
  news: Article[] | undefined;
  onSelectArticle: (article: Article) => void;
}

export function NewsGrid({ isLoading, news, onSelectArticle }: NewsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="space-y-4">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (!news?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No news matching this category.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map(article => (
        <div
          key={article.id}
          onClick={() => onSelectArticle(article)}
          className="cursor-pointer"
        >
          <NewsCard article={article} />
        </div>
      ))}
    </div>
  );
}