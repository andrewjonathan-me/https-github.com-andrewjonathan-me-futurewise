import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddressSectionProps {
  formData: {
    country: string;
    province: string;
    district: string;
    city: string;
    address: string;
  };
  errors: {
    country?: string;
    province?: string;
    district?: string;
    city?: string;
    address?: string;
  };
  handleInputChange: (field: string, value: string) => void;
}

export function AddressSection({ formData, errors, handleInputChange }: AddressSectionProps) {
  const { t } = useLanguage();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">{t("payment.form.country")}</Label>
          <Select
            value={formData.country}
            onValueChange={(value) => handleInputChange("country", value)}
          >
            <SelectTrigger id="country">
              <SelectValue placeholder={t("payment.form.select_country")} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="indonesia">Indonesia</SelectItem>
            </SelectContent>
          </Select>
          {errors.country && (
            <p className="text-sm text-red-500 mt-1">{errors.country}</p>
          )}
        </div>

        <div>
          <Label htmlFor="province">{t("payment.form.province")}</Label>
          <Input
            id="province"
            value={formData.province}
            onChange={(e) => handleInputChange("province", e.target.value)}
            error={errors.province}
            required
          />
          {errors.province && (
            <p className="text-sm text-red-500 mt-1">{errors.province}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="district">{t("payment.form.district")}</Label>
          <Input
            id="district"
            value={formData.district}
            onChange={(e) => handleInputChange("district", e.target.value)}
            error={errors.district}
            required
          />
          {errors.district && (
            <p className="text-sm text-red-500 mt-1">{errors.district}</p>
          )}
        </div>

        <div>
          <Label htmlFor="city">{t("payment.form.city")}</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            error={errors.city}
            required
          />
          {errors.city && (
            <p className="text-sm text-red-500 mt-1">{errors.city}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="address">{t("payment.form.address")}</Label>
        <Input
          id="address"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          error={errors.address}
          required
        />
        {errors.address && (
          <p className="text-sm text-red-500 mt-1">{errors.address}</p>
        )}
      </div>
    </div>
  );
}