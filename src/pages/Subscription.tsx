import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SubscriptionPlans } from "@/components/subscription/SubscriptionPlans";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Subscription() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to access subscription plans",
          variant: "destructive",
        });
        navigate("/auth/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">{t("subscription.choose_plan")}</h1>
        <SubscriptionPlans />
      </main>
      <Footer />
    </div>
  );
}