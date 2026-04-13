import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, ArrowLeft, Plus, Building2 } from "lucide-react";

export const metadata = { title: "Customers | Admin" };

export default async function AdminCustomersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

  const { data: customers } = await supabase
    .from("profiles")
    .select("*, orders(count)")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">Admin Panel</p>
        </div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold text-text-primary flex items-center gap-3">
            <Users className="w-7 h-7 text-accent-primary" /> Customers
          </h1>
          <span className="text-text-muted text-sm">{customers?.length ?? 0} registered</span>
        </div>

        {customers && customers.length > 0 ? (
          <div className="space-y-3">
            {customers.map((c) => (
              <Link key={c.id} href={`/admin/customers/${c.id}`}
                className="glass-card p-5 flex items-center justify-between hover:border-accent-primary/30 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-5 h-5 text-accent-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                      {c.company_name}
                    </p>
                    <p className="text-sm text-text-secondary">{c.contact_name} · {c.email}</p>
                    <div className="flex items-center gap-3 mt-0.5">
                      {c.gstin && <span className="text-xs font-mono text-text-muted">GSTIN: {c.gstin}</span>}
                      {c.city && <span className="text-xs text-text-muted">{c.city}, {c.state}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-xs text-text-muted">Joined</p>
                  <p className="text-xs text-text-secondary">
                    {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <Users className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No customers yet</p>
            <p className="text-text-muted text-sm mt-1">
              Customers who sign up at{" "}
              <Link href="/signup" className="text-accent-primary hover:underline">/signup</Link>{" "}
              will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
