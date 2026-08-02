import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { isOwner } from "@/lib/auth/owner";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function getSupabaseClient() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll() {
          // Route handler — no response to attach refreshed cookies to.
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  const supabase = getSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  const isAdmin = isOwner(user.email) || profile?.role === "admin";
  if (!isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (!resend) {
    console.warn("RESEND_API_KEY not set — cannot send quote reply email");
    return NextResponse.json({ error: "Email sending isn't configured yet (RESEND_API_KEY missing)." }, { status: 503 });
  }

  const { quoteId, to, message } = await request.json();
  if (!to || !message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Missing recipient or message" }, { status: 400 });
  }

  const reference = typeof quoteId === "string" ? `Q-${quoteId.slice(0, 8).toUpperCase()}` : undefined;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "OneShot Manufacturing <onboarding@resend.dev>",
      to,
      subject: reference ? `Regarding your quote request ${reference}` : "Regarding your quote request",
      text: message,
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to send quote reply email:", err);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
