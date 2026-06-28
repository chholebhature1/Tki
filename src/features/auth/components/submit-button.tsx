import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
}

export function SubmitButton({ children, loading, className }: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={cn(
        "w-full rounded-xl bg-primary px-6 py-3.5 text-base font-medium text-white transition-all hover:bg-primary-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          Please wait...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
