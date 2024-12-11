import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GoogleButton } from "@/components/ui/GoogleButton";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { EmailField, PasswordField, UsernameField } from "./FormFields";
import { validatePassword } from "@/utils/passwordValidation";
import { LoginForm } from "./LoginForm";

interface AuthFormProps {
  type: "login" | "register";
}

export function AuthForm({ type }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGoogleAuth = async () => {
    try {
      setLoading(true);
      console.log("Starting Google auth...");
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        console.error("Google auth error:", error);
        throw error;
      }

      console.log("Google auth response:", data);
      
      toast({
        title: "Redirecting to Google...",
        description: "Please complete the authentication process.",
      });
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred with Google authentication",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldErrors({});

    const { isValid } = validatePassword(password);
    if (!isValid) {
      setFieldErrors(prev => ({
        ...prev,
        password: "Password does not meet requirements"
      }));
      return;
    }

    setLoading(true);

    try {
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      });

      if (signUpError) throw signUpError;

      toast({
        title: "Registration successful!",
        description: "Please check your email to verify your account.",
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Error",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (type === "login") {
    return (
      <div className="space-y-6 w-full max-w-sm">
        <LoginForm />
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
              Or continue with
            </span>
          </div>
        </div>
        <GoogleButton onClick={handleGoogleAuth} disabled={loading} />
      </div>
    );
  }

  return (
    <form onSubmit={handleRegistration} className="space-y-6 w-full max-w-sm">
      <UsernameField
        value={username}
        onChange={setUsername}
        error={fieldErrors.username}
      />
      
      <EmailField
        value={email}
        onChange={setEmail}
        error={fieldErrors.email}
      />
      
      <PasswordField
        value={password}
        onChange={setPassword}
        error={fieldErrors.password}
        isRegistration={true}
      />

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        Sign Up
      </Button>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
            Or continue with
          </span>
        </div>
      </div>

      <GoogleButton onClick={handleGoogleAuth} disabled={loading} />
    </form>
  );
}