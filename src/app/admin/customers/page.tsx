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
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <section style={{ background: "#111111", padding: "48px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ display: "inline-block", background: "#DC2626", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", padding: "4px 10px", marginBottom: "16px" }}>CUSTOMERS</span>
            <h1 style={{ color: "#FFFFFF", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase" }}>REGISTERED CUSTOMERS</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "8px" }}>All users who have signed up on the portal.</p>
          </div>
          <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", padding: "8px 16px", borderRadius: "4px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "#DC2626" }}>{customers?.length ?? 0} Total</p>
          </div>
        </div>
      </section>

      {/* List */}
      <section style={{ padding: "32px 24px 80px", flex: 1 }}>
        {customers && customers.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {customers.map((c) => (
              <div key={c.id} style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", borderLeft: "4px solid #DC2626", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#111111", display: "flex", alignItems: "center", justifyContent: "center", color: "#DC2626", fontSize: "20px", fontWeight: 800, flexShrink: 0 }}>
                    {(c.company_name || c.contact_name || "?").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontSize: "16px", fontWeight: 700, color: "#111111", marginBottom: "4px" }}>{c.company_name || "—"}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
                      {c.contact_name && <span style={{ fontSize: "12px", color: "#555555", display: "flex", alignItems: "center", gap: "4px" }}><Users size={12} color="#DC2626" /> {c.contact_name}</span>}
                      {c.email && <span style={{ fontSize: "12px", color: "#555555", display: "flex", alignItems: "center", gap: "4px" }}><Mail size={12} color="#DC2626" /> {c.email}</span>}
                      {c.phone && <span style={{ fontSize: "12px", color: "#555555", display: "flex", alignItems: "center", gap: "4px" }}><Phone size={12} color="#DC2626" /> {c.phone}</span>}
                      {c.city && <span style={{ fontSize: "12px", color: "#555555" }}>{c.city}, {c.state}</span>}
                    </div>
                    {c.gstin && <p style={{ fontSize: "11px", color: "#AAAAAA", fontFamily: "monospace", marginTop: "4px" }}>GSTIN: {c.gstin}</p>}
                  </div>
                </div>
                <p style={{ fontSize: "12px", color: "#AAAAAA" }}>
                  Joined {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#F5F5F5", borderRadius: "4px", border: "1px dashed #E0E0E0" }}>
            <Building2 size={40} color="#AAAAAA" style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111111", marginBottom: "8px" }}>No customers yet</h3>
            <p style={{ fontSize: "14px", color: "#555555" }}>Customers who sign up at <Link href="/signup" style={{ color: "#DC2626" }}>/signup</Link> will appear here.</p>
          </div>
        )}
      </section>
    </div>
  );
}
