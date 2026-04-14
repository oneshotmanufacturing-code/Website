import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "@/components/portal/ProfileClient";

export const metadata = { title: "My Profile | Portal" };

export default async function PortalProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Create a blank profile if one doesn't exist yet
  if (!profile) {
    await supabase.from("profiles").insert({
      id: user.id,
      email: user.email,
      company_name: "",
      contact_name: "",
      role: "customer",
    });
    const { data: newProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = newProfile;
  }

  if (!profile) redirect("/portal");

  return <ProfileClient profile={profile} />;
}

