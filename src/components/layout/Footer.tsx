import { Link, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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
import { useState } from "react";

export function Footer() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showTestAlert, setShowTestAlert] = useState(false);

  const handleFeatureClick = async (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      toast({
        title: t("common.warning"),
        description: "Please sign in to access this feature. If you don't have an account yet, you can create one for free.",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    
    if (path === "/test") {
      setShowTestAlert(true);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      navigate(path);
    }
  };

  const handleTestConfirm = () => {
    setShowTestAlert(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate("/test");
  };

  const handleLinkClick = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(path);
  };

  return (
    <>
      <footer className="bg-white dark:bg-gray-900 border-t dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Section 1: FutureWise */}
            <div>
              <h3 className="text-lg font-bold text-[#0066FF] mb-4">
                FutureWise
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("footer.description")}
              </p>
            </div>

            {/* Section 2: Company */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
                {t("footer.company")}
              </h3>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => handleLinkClick("/about")}
                  className="text-left text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.about")}
                </button>
                <button 
                  onClick={() => handleLinkClick("/privacy")}
                  className="text-left text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.privacy")}
                </button>
                <button 
                  onClick={() => handleLinkClick("/contact")}
                  className="text-left text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.contact")}
                </button>
              </div>
            </div>

            {/* Section 3: Features */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
                {t("footer.features")}
              </h3>
              <div className="flex flex-col space-y-2">
                <a
                  href="#"
                  onClick={(e) => handleFeatureClick("/test", e)}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.test")}
                </a>
                <a
                  href="#"
                  onClick={(e) => handleFeatureClick("/rapor", e)}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.report")}
                </a>
                <a
                  href="#"
                  onClick={(e) => handleFeatureClick("/forum", e)}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.forum")}
                </a>
                <a
                  href="#"
                  onClick={(e) => handleFeatureClick("/news", e)}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.news")}
                </a>
                <a
                  href="#"
                  onClick={(e) => handleFeatureClick("/search", e)}
                  className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                >
                  {t("footer.search")}
                </a>
              </div>
            </div>

            {/* Section 4: Social Media */}
            <div>
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
                Social Media
              </h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Facebook className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Instagram className="h-5 w-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                  <Linkedin className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright Notice */}
          <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
            <p className="text-sm text-center text-gray-500 dark:text-gray-400">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </footer>

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
    </>
  );
}