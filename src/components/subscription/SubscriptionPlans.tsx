import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Check } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useNavigate } from "react-router-dom";

export function SubscriptionPlans() {
  const [loading, setLoading] = useState<"basic" | "pro" | null>(null);
  const { toast } = useToast();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const handleSubscribe = async (plan: "basic" | "pro") => {
    try {
      setLoading(plan);
      navigate(`/payment/${plan}`);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Failed to proceed to payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const basicFeatures = [
    "Interest & Talent Test",
    "Report Input",
    "Discussion Forum",
    "Education News",
    "Search Information"
  ];

  const proFeatures = [
    "All Basic Features",
    "Premium OCR API Integration",
    "Exclusive 1 on 1 Psychology Coaching",
    "SBMPTN Preparation Course Vouchers",
    "Exclusive Community Access and Networking",
    "Priority access to platform updates",
    "Regular webinars with education experts"
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-2xl font-bold mb-4">{t("subscription.basic.title")}</h2>
        <p className="text-3xl font-bold mb-6">
          {language === 'id' ? '0 IDR' : '$0'}
          <span className="text-sm font-normal">/month</span>
        </p>
        <ul className="space-y-3 mb-6">
          {basicFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span>{t(`subscription.basic.features.${index}`)}</span>
            </li>
          ))}
        </ul>
        <Button 
          className="w-full" 
          onClick={() => handleSubscribe("basic")}
          disabled={loading === "basic"}
        >
          {loading === "basic" ? t("common.processing") : t("subscription.subscribe")}
        </Button>
      </Card>

      <Card className="p-6 hover:shadow-lg transition-shadow border-primary">
        <h2 className="text-2xl font-bold mb-4">{t("subscription.pro.title")}</h2>
        <p className="text-3xl font-bold mb-6">
          {language === 'id' ? '50.000 IDR' : '$50'}
          <span className="text-sm font-normal">/month</span>
        </p>
        <ul className="space-y-3 mb-6">
          {proFeatures.map((feature, index) => (
            <li key={index} className="flex items-center gap-2">
              <Check className="h-5 w-5 text-primary" />
              <span>{t(`subscription.pro.features.${index}`)}</span>
            </li>
          ))}
        </ul>
        <Button 
          className="w-full" 
          variant="default"
          onClick={() => handleSubscribe("pro")}
          disabled={loading === "pro"}
        >
          {loading === "pro" ? t("common.processing") : t("subscription.subscribe")}
        </Button>
      </Card>
    </div>
  );
}