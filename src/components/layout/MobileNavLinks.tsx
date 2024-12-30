import { Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

interface MobileNavLinksProps {
  isAuthenticated: boolean;
  isDashboard: boolean;
  isIndex: boolean;
}

export function MobileNavLinks({ isAuthenticated, isDashboard, isIndex }: MobileNavLinksProps) {
  const { t } = useLanguage();
  
  return (
    <>
      {isAuthenticated && !isDashboard && (
        <Link
          to="/dashboard"
          className="block px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {t('nav.dashboard')}
        </Link>
      )}

      {!isDashboard && !isAuthenticated && (
        <Link
          to="/about"
          className="block px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          {t('nav.aboutUs')}
        </Link>
      )}
    </>
  );
}