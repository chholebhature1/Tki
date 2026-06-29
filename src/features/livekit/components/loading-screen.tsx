export function LoadingScreen({ message = "Connecting to session..." }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary/20 border-t-primary" />
      <p className="mt-4 text-sm text-text-secondary">{message}</p>
    </div>
  );
}
