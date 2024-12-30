import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface DashboardMenuProps {
  isHovering: boolean;
  setIsHovering: (value: boolean) => void;
}

export function DashboardMenu({ isHovering, setIsHovering }: DashboardMenuProps) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [showTestAlert, setShowTestAlert] = useState(false);

  const handleTestClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowTestAlert(true);
  };

  const handleTestConfirm = () => {
    setShowTestAlert(false);
    navigate('/test');
  };

  const dashboardItems = [
    { title: t('nav.dashboard.test'), path: '/test', onClick: handleTestClick },
    { title: t('nav.dashboard.report'), path: '/rapor' },
    { title: t('nav.dashboard.search'), path: '/search' },
    { title: t('nav.dashboard.forum'), path: '/forum' },
    { title: t('nav.dashboard.results'), path: '/results' },
  ];

  return (
    <div
      className="relative group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setTimeout(() => {
          if (!document.querySelector('.dashboard-menu:hover')) {
            setIsHovering(false);
          }
        }, 500);
      }}
    >
      <Button variant="ghost" className="group">
        {t('nav.dashboard')}
      </Button>
      <div 
        className={`
          dashboard-menu
          absolute left-0 mt-1 w-48 rounded-md shadow-lg 
          bg-white dark:bg-[#2C3440] ring-1 ring-black ring-opacity-5 
          transition-all duration-300 ease-in-out
          py-1 z-[100]
          ${isHovering 
            ? 'opacity-100 visible translate-y-0' 
            : 'opacity-0 invisible -translate-y-2'
          }
        `}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setTimeout(() => setIsHovering(false), 500);
        }}
      >
        <div className="py-0.5" role="menu" aria-orientation="vertical">
          {dashboardItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={item.onClick}
              className="block px-3 py-1.5 text-sm text-gray-600 hover:bg-slate-50 dark:text-gray-200 dark:hover:bg-[#343B48] transition-colors duration-150"
              role="menuitem"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>

      <AlertDialog open={showTestAlert} onOpenChange={setShowTestAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("test.alert.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("test.alert.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleTestConfirm}>{t("common.ok")}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}