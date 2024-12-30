import { useNavigate } from "react-router-dom";
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

interface ResultsActionsProps {
  onRetakeTest: () => void;
}

export const ResultsActions = ({ onRetakeTest }: ResultsActionsProps) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [showTestAlert, setShowTestAlert] = useState(false);

  const handleTestClick = () => {
    setShowTestAlert(true);
  };

  const handleTestConfirm = () => {
    setShowTestAlert(false);
    onRetakeTest();
  };

  return (
    <>
      <div className="flex justify-center space-x-4">
        <Button onClick={handleTestClick}>
          {t('results.actions.retake')}
        </Button>
        <Button variant="outline" onClick={() => navigate('/dashboard')}>
          {t('results.actions.dashboard')}
        </Button>
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
    </>
  );
};