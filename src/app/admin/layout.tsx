import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminNav from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Not logged in -> must authenticate
  if (!user) {
    redirect("/login");
  }

  // 2. Check if user email belongs to authorized owner accounts
  const email = user.email?.toLowerCase() ?? "";
  const isOwnerEmail =
    email.includes("oneshot") ||
    email.includes("swaraj");

  // 3. Check profile role from DB
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdminRole = profile?.role === "admin";

  // 4. If not owner email and not admin role -> bounce to customer portal
  if (!isOwnerEmail && !isAdminRole) {
    redirect("/portal");
  }

  // 5. Auto-repair: if owner email logged in but DB role is not 'admin', upgrade it silently
  if (isOwnerEmail && !isAdminRole) {
    await supabase
      .from("profiles")
      .update({ role: "admin" })
      .eq("id", user.id);
  }

  return (
    <>
      <AdminNav userEmail={user.email ?? ""} />
      {children}
    </>
  );
}
