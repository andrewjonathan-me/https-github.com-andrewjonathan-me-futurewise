import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DashboardCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  description,
  icon,
  className,
  onClick,
}: DashboardCardProps) {
  return (
    <Card
      className={cn(
        "p-6 hover:shadow-lg transition-shadow cursor-pointer bg-gray-50 dark:bg-gray-700 h-[160px]",
        className
      )}
      onClick={onClick}
    >
      <div className="flex items-start space-x-4">
        <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{description}</p>
        </div>
      </div>
    </Card>
  );
}