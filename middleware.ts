import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isOwner } from "@/lib/auth/owner";

const isDummyEnv =
  process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("dummy-project") ?? false;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── Local testing with dummy env: skip checks ──
  if (isDummyEnv) {
    return NextResponse.next({ request });
  }

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
    const isOwnerEmail = isOwner(user.email);

    if (!isOwnerEmail) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        return NextResponse.redirect(new URL("/portal", request.url));
      }
    }
  }

  // Logged-in users visiting /login or /signup → redirect to appropriate dashboard
  if (user && (pathname === "/login" || pathname === "/signup")) {
    const isOwnerEmail = isOwner(user.email);

    if (isOwnerEmail) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profile?.role === "admin") {
      return NextResponse.redirect(new URL("/admin", request.url));
    } else {
      return NextResponse.redirect(new URL("/portal", request.url));
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/portal/:path*", "/admin/:path*", "/login", "/signup"],
};
