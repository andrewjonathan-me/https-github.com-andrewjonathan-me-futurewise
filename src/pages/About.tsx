import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLanguage } from "@/contexts/LanguageContext";

export default function About() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col" id="about">
      <Navbar />
      
      <main className="flex-grow py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">{t("about.title")}</h1>
          
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              {t("about.intro")}
            </p>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("about.vision.title")}</h2>
              <p className="text-gray-600 dark:text-gray-300">
                {t("about.vision.content")}
              </p>
            </section>

            <section className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("about.mission.title")}</h2>
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("about.mission.personalized")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("about.mission.personalized.desc")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("about.mission.access")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("about.mission.access.desc")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("about.mission.forum")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("about.mission.forum.desc")}
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {t("about.mission.evaluation")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t("about.mission.evaluation.desc")}
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}