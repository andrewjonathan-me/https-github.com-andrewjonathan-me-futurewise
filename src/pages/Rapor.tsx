import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ReportCardForm } from "@/components/report-card/ReportCardForm";
import { PreviousReportCards } from "@/components/report-card/PreviousReportCards";
import { OCRInput } from "@/components/report-card/OCRInput";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FileText, Camera, History } from "lucide-react";

type InputMethod = "manual" | "ocr" | "view" | null;

export default function Rapor() {
  const [selectedMethod, setSelectedMethod] = useState<InputMethod>(null);
  const [ocrGrades, setOcrGrades] = useState<Record<string, number>>({});

  const handleSubmitSuccess = () => {
    setSelectedMethod("view");
  };

  const handleOCRResults = (grades: Record<string, number>) => {
    setOcrGrades(grades);
    setSelectedMethod("manual");
  };

  const renderContent = () => {
    switch (selectedMethod) {
      case "manual":
        return (
          <ReportCardForm 
            onBack={() => setSelectedMethod(null)} 
            onSubmitSuccess={handleSubmitSuccess}
            initialGrades={ocrGrades}
          />
        );
      case "ocr":
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">OCR Input</h2>
              <Button onClick={() => setSelectedMethod(null)} variant="outline">
                Back to Menu
              </Button>
            </div>
            <OCRInput onResultsDetected={handleOCRResults} />
          </div>
        );
      case "view":
        return <PreviousReportCards onBack={() => setSelectedMethod(null)} />;
      default:
        return (
          <div className="grid gap-4 md:grid-cols-3">
            <Card
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors dark:bg-gray-800"
              onClick={() => setSelectedMethod("manual")}
            >
              <FileText className="w-12 h-12 text-primary dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">Manual Input</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Manually enter your grades for each subject
              </p>
            </Card>

            <Card
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors dark:bg-gray-800"
              onClick={() => setSelectedMethod("ocr")}
            >
              <Camera className="w-12 h-12 text-primary dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">OCR Input</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Scan your report card to automatically input grades
              </p>
            </Card>

            <Card
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors dark:bg-gray-800"
              onClick={() => setSelectedMethod("view")}
            >
              <History className="w-12 h-12 text-primary dark:text-primary-400 mb-4" />
              <h3 className="text-lg font-semibold mb-2 dark:text-white">View Previous Results</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Check your previously submitted report cards
              </p>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow py-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Input Nilai Rapor</h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Input your grades or view previous report cards
            </p>
          </div>

          {renderContent()}
        </div>
      </main>

      <Footer />
    </div>
  );
}