import { useParams } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Auth() {
  const { type } = useParams<{ type: string }>();
  const isLogin = type === "login";
  const { language } = useLanguage();

  const getTitle = () => {
    if (isLogin) {
      return language === 'en' ? "Sign in to your account" : "Masuk ke akun Anda";
    }
    return language === 'en' ? "Create new account" : "Buat akun baru";
  };

  const getSubtitle = () => {
    if (isLogin) {
      return language === 'en' ? (
        <>
          Don't have an account?{" "}
          <a href="/auth/register" className="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
            Register now
          </a>
        </>
      ) : (
        <>
          Belum punya akun?{" "}
          <a href="/auth/register" className="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
            Daftar sekarang
          </a>
        </>
      );
    }
    return language === 'en' ? (
      <>
        Already have an account?{" "}
        <a href="/auth/login" className="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
          Sign in
        </a>
      </>
    ) : (
      <>
        Sudah punya akun?{" "}
        <a href="/auth/login" className="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
          Masuk
        </a>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {getTitle()}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {getSubtitle()}
            </p>
          </div>

          <AuthForm type={isLogin ? "login" : "register"} />
        </div>
      </main>

      <Footer />
    </div>
  );
}