import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { validateName, validatePhone } from "@/components/contact/validation";

interface PersonalInfoProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  errors: {
    name?: string;
    phone?: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export function PersonalInfoSection({ formData, errors, handleInputChange }: PersonalInfoProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">{t("payment.form.name")}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={errors.name}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name}</p>
        )}
      </div>

      <div>
        <Label htmlFor="email">{t("payment.form.email")}</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="phone">{t("payment.form.phone")}</Label>
        <Input
          id="phone"
          value={formData.phone}
          onChange={(e) => handleInputChange("phone", e.target.value)}
          error={errors.phone}
          required
        />
        {errors.phone && (
          <p className="text-sm text-red-500 mt-1">{errors.phone}</p>
        )}
      </div>
    </div>
  );
}