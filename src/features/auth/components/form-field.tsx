import { forwardRef, type InputHTMLAttributes } from "react";
import { type FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  children: React.ReactNode;
  className?: string;
}

export function FormField({ label, error, children, className }: FormFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <label className="text-sm font-medium text-text">{label}</label>
      {children}
      {error && (
        <p className="text-xs text-danger" role="alert">
          {error.message}
        </p>
      )}
    </div>
  );
}

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input({ hasError, className, ...props }, ref) {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-white px-4 py-3 text-sm text-text placeholder:text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
          hasError
            ? "border-danger focus:border-danger"
            : "border-border focus:border-primary",
          className
        )}
        {...props}
      />
    );
  }
);
