import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormData, FormErrors } from "./types";

interface ContactFormFieldsProps {
  formData: FormData;
  errors: FormErrors;
  handleNameChange: (value: string) => void;
  handlePhoneChange: (value: string) => void;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  categories: string[];
}

export function ContactFormFields({
  formData,
  errors,
  handleNameChange,
  handlePhoneChange,
  setFormData,
  categories,
}: ContactFormFieldsProps) {
  const { t } = useLanguage();

  const getCategoryTranslationKey = (category: string) => {
    return `contact.form.category.${category.toLowerCase().replace(/ /g, '')}`;
  };

  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="dark:text-gray-200">{t("contact.form.name")}</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleNameChange(e.target.value)}
          className={`${errors.name ? "border-red-500" : ""} dark:bg-gray-800 dark:text-gray-200`}
          required
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">{t("contact.form.phone")}</Label>
        <Input
          id="phone"
          type="tel"
          value={formData.phone}
          onChange={(e) => handlePhoneChange(e.target.value)}
          className={errors.phone ? "border-red-500" : ""}
        />
        {errors.phone && (
          <p className="text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">{t("contact.form.category")}</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder={t("contact.form.category.placeholder")} />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {t(getCategoryTranslationKey(category))}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("contact.form.message")}</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          maxLength={300}
          className="h-32"
          required
        />
        <p className="text-sm text-gray-500">
          {formData.message.length}/300 {t("contact.form.characters")}
        </p>
      </div>

      <div className="flex items-start space-x-2">
        <Checkbox
          id="consent"
          checked={formData.consent}
          onCheckedChange={(checked) => 
            setFormData({ ...formData, consent: checked as boolean })
          }
          required
        />
        <label
          htmlFor="consent"
          className="text-sm text-gray-600 dark:text-gray-300 leading-tight"
        >
          {t("contact.form.consent")}
        </label>
      </div>
    </>
  );
}