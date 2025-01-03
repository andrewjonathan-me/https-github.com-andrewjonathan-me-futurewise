import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsCategories } from "@/components/news/NewsCategories";
import { NewsGrid } from "@/components/news/NewsGrid";
import { NewsHeader } from "@/components/news/NewsHeader";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button"; // Added this import
import { supabase } from "@/integrations/supabase/client";
import { assignCategory, filterNewsByCategory, filterOutSpecificArticles } from "@/utils/newsUtils";
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
  url?: string;
}

// Fetch news from our Supabase Edge Function
const fetchNews = async (): Promise<Article[]> => {
  console.log("Fetching news articles...");
  try {
    const { data, error } = await supabase.functions.invoke('fetch-news')
    
    if (error) {
      console.error("Error calling edge function:", error);
      throw error;
    }

    console.log("Raw API Response:", data);

    const processedNews = data.map((article: any, index: number) => {
      const category = assignCategory(article.title, article.content);
      console.log(`Processing article: "${article.title}" -> Category: ${category}`);
      
      return {
        id: index.toString(),
        title: article.title,
        category: category,
        image: article.urlToImage || `https://source.unsplash.com/random/800x600/?education&sig=${index}`,
        summary: article.description,
        date: article.publishedAt,
        source: article.source.name,
        content: article.content,
        url: article.url
      };
    });

    const filteredNews = filterOutSpecificArticles(processedNews);
    console.log("Processed and filtered news articles:", filteredNews);
    return filteredNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const { data: news, isLoading, error, refetch } = useQuery({
    queryKey: ["news"],
    queryFn: fetchNews,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  console.log("Selected category:", selectedCategory);
  console.log("Current news data:", news);

  if (error) {
    toast({
      title: "Error",
      description: "Gagal memuat berita. Silakan coba lagi nanti.",
      variant: "destructive",
    });
  }

  const filteredNews = filterNewsByCategory(news || [], selectedCategory);

  // Function to clean and truncate content
  const formatContent = (text: string) => {
    const cleanText = text.replace(/\s*\[\+\d+\s*chars\]\s*$/, '');
    return cleanText.length < text.length ? `${cleanText}...` : cleanText;
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <NewsHeader onRefresh={refetch} />
        
        <NewsCategories 
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        <div className="mt-8">
          <NewsGrid 
            isLoading={isLoading}
            news={filteredNews}
            onSelectArticle={setSelectedArticle}
          />
        </div>
      </main>

      <Dialog open={!!selectedArticle} onOpenChange={() => setSelectedArticle(null)}>
        <DialogContent className="w-[90vw] max-w-2xl mx-auto h-auto max-h-[90vh] overflow-y-auto dark:bg-gray-800 sm:w-[85vw] md:w-[75vw]">
          {selectedArticle && (
            <div className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold dark:text-white">
                {selectedArticle.title}
              </h2>
              <div className="aspect-video relative overflow-hidden rounded-lg">
                <img
                  src={selectedArticle.image}
                  alt={selectedArticle.title}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(selectedArticle.date).toLocaleDateString("id-ID")}</span>
                <span>Sumber: {selectedArticle.source}</span>
              </div>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm sm:text-base">
                {formatContent(selectedArticle.content || selectedArticle.summary)}
              </p>
              {selectedArticle.url && (
                <Button
                  className="w-full mt-4"
                  onClick={() => window.open(selectedArticle.url, '_blank')}
                >
                  Baca Selengkapnya
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}