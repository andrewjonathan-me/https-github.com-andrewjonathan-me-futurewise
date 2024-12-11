import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { supabase } from "@/integrations/supabase/client";
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

  useEffect(() => {
    checkTestResults();
  }, []);

  const checkTestResults = async () => {
    try {
      console.log("Checking for test results...");
      const { data: testResults } = await supabase
        .from('test_results')
        .select('*')
        .limit(1)
        .single();

      console.log("Test results found:", testResults);
      setHasTestResults(!!testResults);
    } catch (error) {
      console.log("No test results found or error occurred:", error);
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
      title: "Tes Minat & Bakat",
      description: "Temukan potensi terbaikmu melalui tes komprehensif",
      icon: <Brain className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: handleTestClick,
    },
    {
      title: "Input Nilai Rapor",
      description: "Upload dan analisis nilai akademikmu",
      icon: <BookOpen className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/rapor"),
    },
    {
      title: "Cari Informasi",
      description: "Eksplorasi informasi jurusan dan universitas",
      icon: <Search className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/search"),
    },
    {
      title: "Forum Diskusi",
      description: "Diskusi dengan siswa lain dan para ahli",
      icon: <MessageSquare className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/forum"),
    },
    {
      title: "Berita Pendidikan",
      description: "Update terkini seputar dunia pendidikan",
      icon: <Newspaper className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: () => navigate("/news"),
    },
    {
      title: "Hasil & Rekomendasi",
      description: hasTestResults === false 
        ? "Selesaikan tes untuk melihat hasil dan rekomendasi"
        : "Lihat hasil tes dan rekomendasi jurusan",
      icon: <Trophy className="w-6 h-6 text-primary dark:text-primary-400" />,
      onClick: handleResultsClick,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
              Selamat datang! Pilih fitur yang ingin Anda gunakan.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <DashboardCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
                icon={feature.icon}
                onClick={feature.onClick}
              />
            ))}
          </div>
        </div>
      </main>

      <AlertDialog open={showTestAlert} onOpenChange={setShowTestAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Perhatian</AlertDialogTitle>
            <AlertDialogDescription>
              Setelah Anda mengklik, Anda harus menjawab semua 30 pertanyaan. Luangkan waktu sekitar 15 menit untuk menyelesaikannya.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleTestConfirm}>OK</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}