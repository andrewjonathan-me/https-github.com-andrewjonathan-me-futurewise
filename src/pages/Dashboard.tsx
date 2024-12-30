import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Brain,
  BookOpen,
  Search,
  MessageSquare,
  Newspaper,
  Trophy,
} from "lucide-react";

interface TestResult {
  teknik: number;
  seni: number;
  sains: number;
  sosial: number;
  created_at: string;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [hasTestResults, setHasTestResults] = useState<boolean | null>(null);
  const [showTestAlert, setShowTestAlert] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    checkTestResults();
  }, []);

  const checkTestResults = async () => {
    try {
      console.log("Checking for test results...");
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session?.user) {
        console.log("No authenticated user found");
        setHasTestResults(false);
        return;
      }

      const { data: testResults, error } = await supabase
        .from('test_results')
        .select('*')
        .eq('user_id', session.session.user.id)
        .limit(1);

      if (error) {
        console.error("Error fetching test results:", error);
        setHasTestResults(false);
        return;
      }

      console.log("Test results found:", testResults);
      setHasTestResults(testResults && testResults.length > 0);
    } catch (error) {
      console.error("Error in checkTestResults:", error);
      setHasTestResults(false);
    }
  };

  const handleTestClick = () => {
    setShowTestAlert(true);
  };

  const handleTestConfirm = () => {
    setShowTestAlert(false);
    navigate("/test");
  };

  const handleResultsClick = () => {
    navigate("/results");
  };

  const features = [
    {
      title: t("dashboard.test.title"),
      description: t("dashboard.test.description"),
      icon: <Brain className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: handleTestClick,
      path: "test"
    },
    {
      title: t("dashboard.report.title"),
      description: t("dashboard.report.description"),
      icon: <BookOpen className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/rapor"),
      path: "rapor"
    },
    {
      title: t("dashboard.search.title"),
      description: t("dashboard.search.description"),
      icon: <Search className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/search"),
      path: "search"
    },
    {
      title: t("dashboard.forum.title"),
      description: t("dashboard.forum.description"),
      icon: <MessageSquare className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/forum"),
      path: "forum"
    },
    {
      title: t("dashboard.news.title"),
      description: t("dashboard.news.description"),
      icon: <Newspaper className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/news"),
      path: "news"
    },
    {
      title: t("dashboard.results.title"),
      description: hasTestResults === false 
        ? t("dashboard.results.noTest")
        : t("dashboard.results.description"),
      icon: <Trophy className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: handleResultsClick,
      path: "results"
    },
  ];

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const section = params.get('section');
    
    if (section) {
      const targetSection = document.querySelector(`[data-section="${section}"]`);
      if (targetSection) {
        setTimeout(() => {
          targetSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }
  }, [location.search]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("dashboard.title")}</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              {t("dashboard.welcome")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div key={feature.title} data-section={feature.path}>
                <DashboardCard
                  title={feature.title}
                  description={feature.description}
                  icon={feature.icon}
                  onClick={feature.onClick}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <AlertDialog open={showTestAlert} onOpenChange={setShowTestAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("test.alert.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("test.alert.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleTestConfirm}>{t("common.ok")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <ScrollToTop />
      <Footer />
    </div>
  );
}