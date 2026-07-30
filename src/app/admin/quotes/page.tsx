import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList, Eye, Mail, Phone, Calendar } from "lucide-react";

export const metadata = { title: "Quote Requests | Admin — OneShot Manufacturing" };

const STATUS_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  new: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  contacted: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  converted: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
  closed: { bg: "#F5F5F5", color: "#777777", border: "#E0E0E0" },
};

const STATUS_LABEL: Record<string, string> = {
  new: "New Inquiry",
  contacted: "Contacted",
  converted: "Converted to Order",
  closed: "Closed",
};

export default async function AdminQuotesPage() {
  const supabase = await createClient();

  const { data: quotes } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, background: "#111111", zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 800, letterSpacing: "0.10em", textDecoration: "none", textTransform: "uppercase" }}>ONESHOT</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link href="/admin" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Dashboard</Link>
            <Link href="/admin/messages" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Messages</Link>
            <Link href="/admin/customers" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Customers</Link>
            <Link href="/admin/orders" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Orders</Link>
            <Link href="/admin/quotes" style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none", borderBottom: "2px solid #DC2626", paddingBottom: "4px" }}>Quotes</Link>
            <Link href="/" style={{ background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 20px", borderRadius: "4px", textDecoration: "none" }}>← BACK TO SITE</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{ background: "#111111", padding: "48px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ display: "inline-block", background: "#DC2626", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", padding: "4px 10px", marginBottom: "16px" }}>QUOTES</span>
            <h1 style={{ color: "#FFFFFF", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase" }}>QUOTE REQUESTS</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "8px" }}>Review custom manufacturing estimates and specs.</p>
          </div>
          <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", padding: "8px 16px", borderRadius: "4px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "#DC2626" }}>{quotes?.length ?? 0} Total</p>
          </div>
        </div>
      </section>

      {/* List */}
      <section style={{ padding: "32px 24px 80px", flex: 1 }}>
        {quotes && quotes.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "14px", maxWidth: "100%", margin: "0 auto" }}>
            {quotes.map((q) => {
              const sc = STATUS_COLOR[q.status || "new"] ?? STATUS_COLOR.new;
              return (
                <Link key={q.id} href={`/admin/quotes/${q.id}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <div style={{ background: "#FFFFFF", border: "1px solid #E0E0E0", borderLeft: "4px solid #DC2626", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", transition: "box-shadow 0.2s" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
                        <span style={{ fontSize: "16px", fontWeight: 800, color: "#111111" }}>{q.company_name || "Anonymous Company"}</span>
                        <span style={{ fontSize: "11px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                          {STATUS_LABEL[q.status || "new"] ?? q.status}
                        </span>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", color: "#555555", fontSize: "13px" }}>
                        {q.contact_name && <span style={{ fontWeight: 600 }}>{q.contact_name}</span>}
                        {q.email && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Mail size={13} color="#DC2626" /> {q.email}</span>}
                        {q.phone && <span style={{ display: "flex", alignItems: "center", gap: "4px" }}><Phone size={13} color="#DC2626" /> {q.phone}</span>}
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "10px" }}>
                        <span style={{ display: "inline-block", background: "#F5F5F5", color: "#333333", fontSize: "11px", fontWeight: 700, padding: "3px 8px", borderRadius: "3px", textTransform: "uppercase" }}>
                          {q.service_type === "pcb" ? "PCB Assembly" : "Wire & Cable Prep"}
                        </span>
                        {q.quantity && <span style={{ fontSize: "12px", color: "#777777" }}>Qty: <strong style={{ color: "#111111" }}>{q.quantity}</strong></span>}
                        {q.gstin && <span style={{ fontSize: "11px", color: "#888888", fontFamily: "monospace" }}>GSTIN: {q.gstin}</span>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                      <span style={{ fontSize: "12px", color: "#888888", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Calendar size={13} /> {new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span style={{ fontSize: "12px", fontWeight: 700, color: "#DC2626", display: "flex", alignItems: "center", gap: "4px" }}>
                        View Details <Eye size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#F5F5F5", borderRadius: "4px", border: "1px dashed #E0E0E0" }}>
            <ClipboardList size={40} color="#AAAAAA" style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111111", marginBottom: "8px" }}>No quote requests yet</h3>
            <p style={{ fontSize: "14px", color: "#555555", maxWidth: "340px", margin: "0 auto" }}>
              Inquiries and quote builder submissions from the services page will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
