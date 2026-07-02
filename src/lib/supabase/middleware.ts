import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Protected routes
  const protectedPaths = ["/dashboard", "/therapist", "/admin", "/consultation"];
  const authPaths = ["/login", "/register", "/forgot-password", "/reset-password"];
  const pathname = request.nextUrl.pathname;

  const isProtectedRoute = protectedPaths.some((path) =>
    pathname.startsWith(path)
  ) && pathname !== "/admin-login";
  const isAuthRoute = authPaths.some((path) => pathname.startsWith(path));

  // Redirect unauthenticated users from protected routes
  if (isProtectedRoute && !user) {
    const url = request.nextUrl.clone();
    // Admin routes redirect to admin-specific login
    if (pathname.startsWith("/admin")) {
      url.pathname = "/admin-login";
    } else {
      url.pathname = "/login";
      // Only pass safe relative paths as redirect
      if (pathname.startsWith("/") && !pathname.startsWith("//")) {
        url.searchParams.set("redirect", pathname);
      }
    }
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}
