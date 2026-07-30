import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { Resend } from "resend";
import { COMPANY } from "@/lib/constants";

// Plain anon client — no cookies, no session, always runs as `anon` role.
// Used for public endpoints so RLS policies for `anon` apply correctly
// regardless of whether the caller has an admin session.
const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

async function sendNotificationEmail(fields: {
  name: string;
  email: string;
  phone: string;
  company?: string;
  message: string;
}) {
  if (!resend) {
    console.warn("RESEND_API_KEY not set — skipping contact notification email");
    return;
  }

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM || "OneShot Manufacturing <onboarding@resend.dev>",
      to: COMPANY.email,
      replyTo: fields.email,
      subject: `New contact form submission from ${fields.name}`,
      text: [
        `Name: ${fields.name}`,
        `Email: ${fields.email}`,
        `Phone: ${fields.phone}`,
        `Company: ${fields.company || "-"}`,
        "",
        "Message:",
        fields.message,
      ].join("\n"),
    });
  } catch (err) {
    console.error("Failed to send contact notification email:", err);
  }
}

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
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, company, message } = body;

    if (!name || !email || !phone || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { data, error } = await anonClient
      .from("messages")
      .insert([
        {
          name,
          email,
          phone,
          company: company || "",
          message,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      throw error;
    }

    await sendNotificationEmail({ name, email, phone, company, message });

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.error("Contact API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const supabase = getSupabaseClient();

    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);
      throw error;
    }

    return NextResponse.json({ data: data || [] });
  } catch (err) {
    console.error("Error fetching messages:", err);
    return NextResponse.json({ data: [] });
  }
}
