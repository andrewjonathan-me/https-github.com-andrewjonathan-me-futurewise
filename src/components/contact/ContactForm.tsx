import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ContactFormFields } from "./ContactFormFields";
import { FormData, FormErrors } from "./types";
import { validateName, validatePhone } from "./validation";

export function ContactForm() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    category: "",
    message: "",
    consent: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    phone: "",
  });

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    checkUser();
  }, []);

  const categories = [
    "General Inquiry",
    "Technical Issue",
    "Feedback or Suggestions",
  ];

  const handleNameChange = (value: string) => {
    const nameError = validateName(value);
    setErrors(prev => ({ ...prev, name: nameError }));
    setFormData(prev => ({ ...prev, name: value }));
  };

  const handlePhoneChange = (value: string) => {
    const phoneError = validatePhone(value);
    setErrors(prev => ({ ...prev, phone: phoneError }));
    setFormData(prev => ({ ...prev, phone: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Validating form data...");

    const nameError = validateName(formData.name);
    const phoneError = validatePhone(formData.phone);

    if (nameError || phoneError) {
      setErrors({
        name: nameError,
        phone: phoneError,
      });
      console.log("Validation failed:", { nameError, phoneError });
      return;
    }

    setIsSubmitting(true);
    console.log("Submitting form data:", formData);

    try {
      const { error } = await supabase.from("contacts").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          category: formData.category,
          message: formData.message,
          consent: formData.consent,
          user_id: userId,
        },
      ]);

      if (error) {
        console.error("Error submitting form:", error);
        throw error;
      }

      toast({
        title: "Terima kasih!",
        description: "Pesan Anda telah berhasil dikirim. Kami akan menghubungi Anda segera.",
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        category: "",
        message: "",
        consent: false,
      });

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <ContactFormFields
        formData={formData}
        errors={errors}
        handleNameChange={handleNameChange}
        handlePhoneChange={handlePhoneChange}
        setFormData={setFormData}
        categories={categories}
      />

      <Button type="submit" disabled={isSubmitting || !!errors.name || !!errors.phone}>
        {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
      </Button>
    </form>
  );
}