import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isOwner } from "@/lib/auth/owner";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const isOwnerEmail = isOwner(user.email);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const isAdminRole = profile?.role === "admin";

  // If user is an admin or owner, they should be in the admin panel, not the portal.
  if (isOwnerEmail || isAdminRole) {
    redirect("/admin");
  }

  return <>{children}</>;
}
