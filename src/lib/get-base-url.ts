/**
 * Returns the base URL of the application.
 * Automatically detects the correct URL for both local and production environments.
 *
 * Priority:
 * 1. NEXT_PUBLIC_SITE_URL (explicit override, useful for custom domains)
 * 2. VERCEL_URL (automatically set by Vercel on all deployments)
 * 3. Fallback to localhost:3000 (local development)
 */
export function getBaseUrl(): string {
  // Explicit override takes priority (for custom domains)
  if (process.env.NEXT_PUBLIC_SITE_URL && process.env.NEXT_PUBLIC_SITE_URL !== "http://localhost:3000") {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  // Vercel automatically provides this on all deployments
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Local development fallback
  return "http://localhost:3000";
}
