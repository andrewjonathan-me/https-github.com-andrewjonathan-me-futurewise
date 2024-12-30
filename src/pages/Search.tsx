import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Search as SearchIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PaginationControls from "@/components/forum/Pagination";
import { format } from "date-fns";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsMobile } from "@/hooks/use-mobile";

interface SearchResult {
  id?: string;
  title: string;
  category: string;
  summary: string;
  content: string;
  url?: string;
  date?: string;
  source?: string;
}

export default function Search() {
  const { t, language } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useIsMobile();
  const resultsPerPage = 5;

  const getMobilePlaceholder = () => {
    return language === 'en' ? "Search for majors..." : "Cari jurusan...";
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
    setDebouncedQuery(searchQuery);
    setCurrentPage(1);
    setIsSearching(true);
    setTimeout(() => setIsSearching(false), 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const { data: searchResults, isLoading } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: async () => {
      if (!debouncedQuery) return [];
      
      console.log("Fetching search results for:", debouncedQuery);
      try {
        const { data, error } = await supabase.functions.invoke('search-with-gpt', {
          body: { query: debouncedQuery }
        });

        if (error) {
          console.error("Error fetching search results:", error);
          throw error;
        }

        console.log("GPT search results:", data);
        return data.map((result: SearchResult, index: number) => ({
          id: index.toString(),
          title: result.title,
          category: result.category || "Informasi",
          summary: result.summary,
          content: result.content,
          url: result.url,
          date: result.date || new Date().toISOString(),
          source: result.source || "Sumber Pendidikan"
        }));
      } catch (error) {
        console.error("Error in search query:", error);
        return [];
      }
    },
    enabled: !!debouncedQuery
  });

  // Pagination logic
  const totalResults = searchResults?.length || 0;
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const paginatedResults = searchResults?.slice(
    (currentPage - 1) * resultsPerPage,
    currentPage * resultsPerPage
  );

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8 flex flex-col items-center justify-start">
        <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
          <h1 className="text-3xl font-bold mb-12 text-center dark:text-white">
            {t("search.title")}
          </h1>
          
          <div className="w-full mb-12">
            <div className="relative flex items-center justify-center">
              <div className="relative w-full max-w-4xl">
                <Input
                  type="text"
                  placeholder={isMobile ? getMobilePlaceholder() : t("search.placeholder")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full pl-4 pr-20 py-2 text-base rounded-full border-2 focus-visible:ring-primary focus-visible:border-primary h-auto dark:bg-gray-800 dark:text-white dark:border-gray-700 md:pl-8 md:pr-36 md:py-7 md:text-lg"
                />
                <Button 
                  onClick={handleSearch} 
                  variant="ghost"
                  className={`absolute right-1 top-1/2 -translate-y-1/2 rounded-full p-2 md:p-4 transition-colors hover:text-primary active:text-primary-600 ${isSearching ? 'text-primary' : ''}`}
                >
                  <SearchIcon className="size-[18px] md:size-[22px]" />
                </Button>
              </div>
            </div>
          </div>

          <div className="w-full max-w-3xl">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((n) => (
                  <Skeleton key={n} className="h-24 w-full dark:bg-gray-800" />
                ))}
              </div>
            ) : paginatedResults?.length ? (
              <>
                <div className="space-y-4">
                  {paginatedResults.map((result) => (
                    <Card 
                      key={result.id} 
                      className="cursor-pointer hover:shadow-lg transition-shadow dark:bg-gray-800"
                      onClick={() => result.url && window.open(result.url, '_blank')}
                    >
                      <CardHeader>
                        <CardTitle className="text-lg dark:text-white">{result.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{result.summary}</p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {format(new Date(result.date), 'dd MMMM yyyy')}
                          </p>
                          {result.url && (
                            <p className="text-sm text-blue-600 dark:text-blue-400 truncate">
                              {result.url}
                            </p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                {totalPages > 1 && (
                  <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                )}
              </>
            ) : debouncedQuery ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {t("search.noResults")}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                {t("search.start")}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}