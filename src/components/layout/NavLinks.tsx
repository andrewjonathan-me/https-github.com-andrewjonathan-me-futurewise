import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

interface NavLinksProps {
  isAuthenticated: boolean;
  isDashboard: boolean;
  isIndex: boolean;
}

export function NavLinks({ isAuthenticated, isDashboard, isIndex }: NavLinksProps) {
  const { t } = useLanguage();
  
  return (
    <>
      {!isDashboard && !isAuthenticated && (
        <Link to="/about">
          <Button variant="ghost">{t('nav.aboutUs')}</Button>
        </Link>
      )}
    </>
  );
}