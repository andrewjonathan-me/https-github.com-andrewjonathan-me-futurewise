import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name" className="dark:text-gray-200">Nama</Label>
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
        <Label htmlFor="phone">Nomor Telepon (Opsional)</Label>
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
        <Label htmlFor="category">Kategori</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
          required
        >
          <SelectTrigger>
            <SelectValue placeholder="Pilih kategori" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Pesan (Maksimal 300 karakter)</Label>
        <Textarea
          id="message"
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          maxLength={300}
          className="h-32"
          required
        />
        <p className="text-sm text-gray-500">
          {formData.message.length}/300 karakter
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
          Dengan mengisi formulir ini, saya setuju bahwa data dan/atau informasi saya dapat digunakan oleh FutureWise atau pihak yang ditunjuk untuk menindaklanjuti keluhan/tanggapan saya, termasuk disimpan atau dihubungi jika diperlukan.
        </label>
      </div>
    </>
  );
}