import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validatePassword } from "@/utils/passwordValidation";
import { cn } from "@/lib/utils";

interface FieldProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isRegistration?: boolean;
}

export const EmailField = ({ value, onChange, error }: FieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="email" className="dark:text-gray-200">Email</Label>
    <Input
      id="email"
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        error && "border-red-500 focus-visible:ring-red-500",
        "dark:bg-gray-800 dark:text-white dark:border-gray-700"
      )}
      required
    />
    {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
  </div>
);

export const PasswordField = ({ value, onChange, error, isRegistration }: FieldProps) => {
  const { errors } = validatePassword(value);
  
  return (
    <div className="space-y-2">
      <Label htmlFor="password" className="dark:text-gray-200">Password</Label>
      <Input
        id="password"
        type="password"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          error && "border-red-500 focus-visible:ring-red-500",
          "dark:bg-gray-800 dark:text-white dark:border-gray-700"
        )}
        required
      />
      {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
      {isRegistration && value && errors.length > 0 && (
        <ul className="text-sm text-amber-600 dark:text-amber-400 list-disc pl-4">
          {errors.map((err, index) => (
            <li key={index}>{err}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export const UsernameField = ({ value, onChange, error }: FieldProps) => (
  <div className="space-y-2">
    <Label htmlFor="username" className="dark:text-gray-200">Username</Label>
    <Input
      id="username"
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn(
        error && "border-red-500 focus-visible:ring-red-500",
        "dark:bg-gray-800 dark:text-white dark:border-gray-700"
      )}
      required
    />
    {error && <p className="text-sm font-medium text-red-500 dark:text-red-400">{error}</p>}
  </div>
);