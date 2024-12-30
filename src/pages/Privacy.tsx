import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Privacy() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" id="privacy">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
            {t("privacy.title")}
          </h1>
          
          <div className="prose prose-lg max-w-none space-y-6 text-gray-600 dark:text-gray-300">
            <p>{t("privacy.last")}: {new Date().toLocaleDateString()}</p>
            
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("privacy.intro.title")}
              </h2>
              <p className="dark:text-gray-300">
                {t("privacy.intro.content")}
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("privacy.collect.title")}
              </h2>
              <p>{t("privacy.collect.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("privacy.use.title")}
              </h2>
              <p>{t("privacy.use.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("privacy.security.title")}
              </h2>
              <p>{t("privacy.security.content")}</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {t("privacy.contact.title")}
              </h2>
              <p>{t("privacy.contact.content")}</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}