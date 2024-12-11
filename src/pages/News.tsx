import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { NewsCategories } from "@/components/news/NewsCategories";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { assignCategory, filterNewsByCategory } from "@/utils/newsUtils";
import { NewsGrid } from "@/components/news/NewsGrid";

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

    console.log("Processed news articles:", processedNews);
    return processedNews;
  } catch (error) {
    console.error("Error fetching news:", error);
    // Return mock data as fallback
    return mockNews;
  }
};

// Mock data as fallback
const mockNews = [
  {
    id: "1",
    title: "Beasiswa S2 Dalam Negeri 2024 Telah Dibuka",
    category: "Beasiswa",
    image: "https://source.unsplash.com/random/800x600/?university",
    summary: "Program beasiswa magister untuk universitas dalam negeri tahun 2024 telah dibuka dengan kuota lebih besar.",
    date: "2024-03-10",
    source: "Kemendikbud",
    content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  },
  {
    id: "2",
    title: "Fakultas Kedokteran UI Rilis Penelitian Breakthrough",
    category: "Penelitian",
    image: "https://source.unsplash.com/random/800x600/?medical",
    summary: "Tim peneliti dari Fakultas Kedokteran Universitas Indonesia berhasil mengembangkan metode baru dalam penanganan diabetes.",
    date: "2024-03-09",
    source: "UI News",
    content: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  },
  {
    id: "3",
    title: "Program Studi Digital Business Semakin Diminati",
    category: "Jurusan",
    image: "https://source.unsplash.com/random/800x600/?business",
    summary: "Tren peminatan jurusan di 2024 menunjukkan peningkatan signifikan pada program studi terkait bisnis digital.",
    date: "2024-03-08",
    source: "Kompas Edu",
    content: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.",
  },
];

export default function News() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const { toast } = useToast();
  
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
    // Remove the [+XXXX chars] pattern from the end of the text
    const cleanText = text.replace(/\s*\[\+\d+\s*chars\]\s*$/, '');
    
    // If the text was truncated (had the pattern removed), add ellipsis
    if (cleanText.length < text.length) {
      return `${cleanText}...`;
    }
    
    return cleanText;
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold dark:text-white">Berita Pendidikan</h1>
          <Button
            onClick={() => refetch()}
            variant="outline"
            className="flex items-center gap-2 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        
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
              <h2 className="text-xl sm:text-2xl font-bold dark:text-white">{selectedArticle.title}</h2>
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