import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface PaymentDetailsSectionProps {
  formData: {
    cardNumber: string;
    expiry: string;
    cvc: string;
  };
  errors: {
    cardNumber?: string;
    expiry?: string;
    cvc?: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export function PaymentDetailsSection({ formData, errors, handleInputChange }: PaymentDetailsSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="border-t pt-4 mt-4">
      <h2 className="text-lg font-semibold mb-4">{t("payment.form.payment_details")}</h2>
      
      <div>
        <Label htmlFor="cardNumber">{t("payment.form.card_number")}</Label>
        <Input
          id="cardNumber"
          value={formData.cardNumber}
          onChange={(e) => handleInputChange("cardNumber", e.target.value)}
          placeholder={t("payment.form.card_number.placeholder")}
          error={errors.cardNumber}
          required
        />
        {errors.cardNumber && (
          <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <Label htmlFor="expiry">{t("payment.form.expiry")}</Label>
          <Input
            id="expiry"
            value={formData.expiry}
            onChange={(e) => handleInputChange("expiry", e.target.value)}
            placeholder={t("payment.form.expiry.placeholder")}
            error={errors.expiry}
            required
          />
          {errors.expiry && (
            <p className="text-sm text-red-500 mt-1">{errors.expiry}</p>
          )}
        </div>
        <div>
          <Label htmlFor="cvc">{t("payment.form.cvc")}</Label>
          <Input
            id="cvc"
            value={formData.cvc}
            onChange={(e) => handleInputChange("cvc", e.target.value)}
            placeholder={t("payment.form.cvc.placeholder")}
            error={errors.cvc}
            required
          />
          {errors.cvc && (
            <p className="text-sm text-red-500 mt-1">{errors.cvc}</p>
          )}
        </div>
      </div>
    </div>
  );
}