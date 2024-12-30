import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Card } from "@/components/ui/card";
import { PaymentForm } from "@/components/payment/PaymentForm";
import { useLanguage } from "@/contexts/LanguageContext";
import { useParams } from "react-router-dom";

export default function Payment() {
  const { t } = useLanguage();
  const { planType } = useParams();

  const getTitle = () => {
    if (planType === "basic") {
      return `${t("payment.form.payment_details")} - Basic`;
    }
    return `${t("payment.form.payment_details")} - Pro`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container max-w-2xl mx-auto py-8 px-4">
        <Card className="p-6">
          <h1 className="text-2xl font-bold mb-6">
            {getTitle()}
          </h1>
          <PaymentForm />
        </Card>
      </main>
      <Footer />
    </div>
  );
}