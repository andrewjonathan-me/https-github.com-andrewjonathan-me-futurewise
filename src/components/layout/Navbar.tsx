import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { UserMenu } from "./UserMenu";
import { ThemeToggle } from "../theme/ThemeToggle";
import { LanguageToggle } from "../language/LanguageToggle";
import { supabase } from "@/integrations/supabase/client";
import { useLanguage } from "@/contexts/LanguageContext";
import { NavLinks } from "./NavLinks";
import { MobileNavLinks } from "./MobileNavLinks";
import { DashboardMenu } from "./DashboardMenu";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const location = useLocation();

  const isDashboard = location.pathname === '/dashboard';
  const isIndex = location.pathname === '/';

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth state changed:", event, session);
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-white shadow-sm dark:bg-gray-900 transition-colors relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <a href="#" onClick={handleLogoClick} className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-primary">FutureWise</span>
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:flex sm:items-center sm:space-x-4">
            {isAuthenticated && <DashboardMenu isHovering={isHovering} setIsHovering={setIsHovering} />}
            <NavLinks isAuthenticated={isAuthenticated} isDashboard={isDashboard} isIndex={isIndex} />
            {isAuthenticated ? (
              <UserMenu />
            ) : (
              <Link to="/auth/login">
                <Button variant="ghost">{t('nav.signin')}</Button>
              </Link>
            )}
            <LanguageToggle />
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button and Icons */}
          <div className="flex items-center space-x-2 sm:hidden">
            <LanguageToggle />
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {isAuthenticated && (
              <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                <UserMenu isMobile={true} />
              </div>
            )}
            <MobileNavLinks isAuthenticated={isAuthenticated} isDashboard={isDashboard} isIndex={isIndex} />
            {!isAuthenticated && (
              <Link
                to="/auth/login"
                className="block px-6 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {t('nav.signin')}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
