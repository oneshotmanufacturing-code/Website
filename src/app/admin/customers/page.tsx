import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Users, Building2, Mail, Phone } from "lucide-react";

export const metadata = { title: "Customers | Admin — OneShot Manufacturing" };

export default async function AdminCustomersPage() {
  const supabase = await createClient();

  const { data: customers } = await supabase
    .from("profiles")
    .select("id, company_name, contact_name, email, phone, gstin, city, state, created_at")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <section className="bg-navy px-6 py-12 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="amber-badge mb-4">CUSTOMERS</span>
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight">REGISTERED CUSTOMERS</h1>
            <p className="text-white/50 text-sm mt-2">All users who have signed up on the portal.</p>
          </div>
          <div className="bg-amber-light/20 border border-amber/30 px-4 py-2 rounded">
            <p className="text-[11px] font-bold uppercase tracking-announcement text-amber">{customers?.length ?? 0} Total</p>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="px-6 py-8 lg:px-8 flex-1">
        {customers && customers.length > 0 ? (
          <div className="flex flex-col gap-4">
            {customers.map((c) => (
              <div key={c.id} className="bg-white border border-gray-300-cl border-l-4 border-l-amber rounded shadow-card p-5 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-amber text-xl font-black shrink-0">
                    {(c.company_name || c.contact_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-base font-bold text-text-dark mb-1">{c.company_name || "—"}</p>
                    <div className="flex flex-wrap gap-3">
                      {c.contact_name && <span className="text-xs text-text-mid flex items-center gap-1"><Users size={12} className="text-amber" /> {c.contact_name}</span>}
                      {c.email && <span className="text-xs text-text-mid flex items-center gap-1"><Mail size={12} className="text-amber" /> {c.email}</span>}
                      {c.phone && <span className="text-xs text-text-mid flex items-center gap-1"><Phone size={12} className="text-amber" /> {c.phone}</span>}
                      {c.city && <span className="text-xs text-text-mid">{c.city}, {c.state}</span>}
                    </div>
                    {c.gstin && <p className="text-[11px] text-text-light font-mono mt-1">GSTIN: {c.gstin}</p>}
                  </div>
                </div>
                <p className="text-xs text-text-light">
                  Joined {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-100-cl rounded border border-dashed border-gray-300-cl">
            <Building2 size={40} className="mx-auto mb-4 text-text-light opacity-40" />
            <h3 className="text-lg font-bold text-text-dark mb-2">No customers yet</h3>
            <p className="text-text-mid text-sm">Customers who sign up at <Link href="/signup" className="text-amber hover:underline">/signup</Link> will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
