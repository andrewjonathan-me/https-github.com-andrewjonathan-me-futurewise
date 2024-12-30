import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { PersonalInfoSection } from "./PersonalInfoSection";
import { AddressSection } from "./AddressSection";
import { PaymentDetailsSection } from "./PaymentDetailsSection";
import { FormData, FormErrors } from "./types";
import { supabase } from "@/integrations/supabase/client";

export function PaymentForm() {
  const { planType } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    country: "",
    province: "",
    district: "",
    city: "",
    address: "",
    cardNumber: "",
    expiry: "",
    cvc: "",
  });

  const handleInputChange = (field: string, value: string) => {
    let processedValue = value;

    switch (field) {
      case 'cardNumber':
        processedValue = value.replace(/\D/g, '').substring(0, 16);
        processedValue = processedValue.replace(/(\d{4})/g, '$1 ').trim();
        break;
      case 'expiry':
        const cleanValue = value.replace(/\D/g, '');
        if (value.length < formData.expiry.length && formData.expiry.endsWith('/')) {
          processedValue = cleanValue.substring(0, cleanValue.length - 1);
        } else {
          if (cleanValue.length >= 2) {
            processedValue = cleanValue.substring(0, 2) + '/' + cleanValue.substring(2, 4);
          } else {
            processedValue = cleanValue;
          }
        }
        break;
      case 'cvc':
        processedValue = value.replace(/\D/g, '').substr(0, 3);
        break;
      case 'phone':
        processedValue = value.replace(/\D/g, '');
        break;
      case 'province':
      case 'district':
      case 'city':
      case 'address':
        processedValue = value.replace(/[^a-zA-Z\s]/g, '');
        break;
    }

    setFormData(prev => ({ ...prev, [field]: processedValue }));
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name) newErrors.name = t("common.required");
    if (!formData.phone) {
      newErrors.phone = t("common.required");
    } else if (!/^\d+$/.test(formData.phone)) {
      newErrors.phone = t("payment.form.phone.numbers_only");
    }

    const addressFieldsValidation = (value: string, field: keyof FormErrors) => {
      if (!value) {
        newErrors[field] = t("common.required");
      } else if (/[^a-zA-Z\s]/.test(value)) {
        newErrors[field] = t("payment.form.address.letters_only");
      }
    };

    addressFieldsValidation(formData.province, "province");
    addressFieldsValidation(formData.district, "district");
    addressFieldsValidation(formData.city, "city");
    addressFieldsValidation(formData.address, "address");

    if (!formData.country) newErrors.country = t("common.required");
    if (!/^\d{16}$/.test(formData.cardNumber.replace(/\D/g, ''))) {
      newErrors.cardNumber = t("payment.form.card_number.error");
    }

    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(formData.expiry)) {
      newErrors.expiry = t("payment.form.expiry.error");
    }

    if (!/^\d{3}$/.test(formData.cvc)) {
      newErrors.cvc = t("payment.form.cvc.error");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          subscription_plan: planType 
        })
        .eq('id', user.id);

      if (updateError) throw updateError;

      const planName = planType === "basic" ? "Basic" : "Pro";
      toast({
        title: t("payment.success"),
        description: `${t("payment.success.description")}. ${t("common.congratulations")} ${planName} ${t("subscription.package")}!`,
      });
      navigate("/dashboard");
    } catch (error) {
      toast({
        title: t("payment.error"),
        description: t("payment.error.description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PersonalInfoSection 
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />
      
      <AddressSection 
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />
      
      <PaymentDetailsSection 
        formData={formData}
        errors={errors}
        handleInputChange={handleInputChange}
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? t("common.processing") : t("payment.form.submit")}
      </Button>
    </form>
  );
}
