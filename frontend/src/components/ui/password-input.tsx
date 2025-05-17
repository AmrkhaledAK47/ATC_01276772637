import React from "react";
import { Input } from "./input";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showPassword: boolean;
  togglePasswordVisibility: () => void;
  required?: boolean;
  minLength?: number;
  className?: string;
  autoComplete?: string;
  disabled?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  id,
  value,
  onChange,
  placeholder = "••••••••",
  showPassword,
  togglePasswordVisibility,
  required = true,
  minLength,
  className = "h-11 pr-10",
  autoComplete = "current-password",
  disabled = false
}) => {
  return (
    <div className="relative">
      <Input
        id={id}
        type={showPassword ? "text" : "password"}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        className={className}
        minLength={minLength}
        autoComplete={autoComplete}
        disabled={disabled}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground disabled:opacity-50"
        tabIndex={-1}
        disabled={disabled}
      >
        {showPassword ? (
          <EyeOff className="h-5 w-5" />
        ) : (
          <Eye className="h-5 w-5" />
        )}
      </button>
    </div>
  );
};
