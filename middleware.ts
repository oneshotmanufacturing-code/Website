import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const isDummyEnv =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy-project") ?? false;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Local testing: skip all auth checks ──
  if (isDummyEnv) {
    return NextResponse.next({ request });
  }

  // ── Production: normal Supabase auth ──
  let supabaseResponse = NextResponse.next({ request });

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
          supabaseResponse = NextResponse.next({ request });
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

  // Not logged in → redirect to /login
  if (!user && (pathname.startsWith("/portal") || pathname.startsWith("/admin"))) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Logged in — check role for /admin routes
  if (user && pathname.startsWith("/admin")) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  // Logged-in users visiting /login or /signup → redirect to portal
  if (user && (pathname === "/login" || pathname === "/signup")) {
    return NextResponse.redirect(new URL("/portal", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/login", "/signup"],
};
