import { useParams } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export default function Auth() {
  const { type } = useParams<{ type: string }>();
  const isLogin = type === "login";

  return (
    <div className="min-h-screen flex flex-col dark:bg-gray-900">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
              {isLogin ? "Masuk ke akun Anda" : "Buat akun baru"}
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {isLogin ? (
                <>
                  Belum punya akun?{" "}
                  <a href="/auth/register" className="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                    Daftar sekarang
                  </a>
                </>
              ) : (
                <>
                  Sudah punya akun?{" "}
                  <a href="/auth/login" className="font-medium text-primary hover:text-primary-600 dark:text-primary-400 dark:hover:text-primary-300">
                    Masuk
                  </a>
                </>
              )}
            </p>
          </div>

          <AuthForm type={isLogin ? "login" : "register"} />
        </div>
      </main>

      <Footer />
    </div>
  );
}