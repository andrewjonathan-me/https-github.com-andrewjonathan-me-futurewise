import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { EmailField, PasswordField } from "./FormFields";
import { getAuthErrorMessage } from "@/utils/authErrors";
import { useLanguage } from "@/contexts/LanguageContext";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});
    console.log("Attempting login with email:", email);

    setLoading(true);

    try {
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error("Sign in error:", signInError);
        const { fieldErrors: errors, toastMessage } = getAuthErrorMessage(signInError.message);
        
        // Set field-specific errors
        setFieldErrors(errors);
        
        // Show toast with error message
        toast({
          title: "Login failed",
          description: toastMessage,
          variant: "destructive",
        });
        return;
      }

      console.log("Login successful, fetching profile...");
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", signInData.user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
      } else {
        console.log("Profile fetched:", profile);
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully signed in.",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during authentication",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-6">
      <EmailField
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
      />
      
      <div className="space-y-2">
        <PasswordField
          value={password}
          onChange={setPassword}
          error={fieldErrors.password}
        />
        <div className="text-sm text-right">
          <Link 
            to="/auth/forgot-password" 
            className="text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300"
          >
            {t("auth.forgot.password")}
          </Link>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {t("auth.signin.button")}
      </Button>
    </form>
  );
}