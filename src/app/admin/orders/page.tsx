import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, Plus } from "lucide-react";

export const metadata = { title: "Orders | Admin — OneShot Manufacturing" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  material_ready: "Material Ready",
  in_production: "In Production",
  quality_check: "Quality Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const STATUS_COLOR: Record<string, { bg: string; color: string; border: string }> = {
  confirmed: { bg: "#EFF6FF", color: "#2563EB", border: "#BFDBFE" },
  material_ready: { bg: "#FFFBEB", color: "#D97706", border: "#FDE68A" },
  in_production: { bg: "#FFF7ED", color: "#EA580C", border: "#FED7AA" },
  quality_check: { bg: "#F5F3FF", color: "#7C3AED", border: "#DDD6FE" },
  dispatched: { bg: "#FEF2F2", color: "#DC2626", border: "#FECACA" },
  delivered: { bg: "#F0FDF4", color: "#16A34A", border: "#BBF7D0" },
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, description, quantity, amount, status, expected_delivery, created_at, profiles(company_name, contact_name)")
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
            <Link href="/admin/orders" style={{ color: "#FFFFFF", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none", borderBottom: "2px solid #DC2626", paddingBottom: "4px" }}>Orders</Link>
            <Link href="/admin/quotes" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>Quotes</Link>
            <Link href="/" style={{ background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 20px", borderRadius: "4px", textDecoration: "none" }}>← BACK TO SITE</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{ background: "#111111", padding: "48px 24px 40px" }}>
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <span style={{ display: "inline-block", background: "#DC2626", color: "#FFFFFF", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", padding: "4px 10px", marginBottom: "16px" }}>ORDERS</span>
            <h1 style={{ color: "#FFFFFF", fontSize: "clamp(24px, 3.5vw, 36px)", fontWeight: 900, lineHeight: 1.1, textTransform: "uppercase" }}>ORDER MANAGEMENT</h1>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginTop: "8px" }}>Track and manage all manufacturing orders.</p>
          </div>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div style={{ background: "rgba(220,38,38,0.15)", border: "1px solid rgba(220,38,38,0.3)", padding: "8px 16px", borderRadius: "4px" }}>
              <p style={{ fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", color: "#DC2626" }}>{orders?.length ?? 0} Total</p>
            </div>
            <Link href="/admin/orders/new" style={{ background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 20px", borderRadius: "4px", textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
              <Plus size={14} /> NEW ORDER
            </Link>
          </div>
        </div>
      </section>

      {/* List */}
      <section style={{ padding: "32px 24px 80px", flex: 1 }}>
        {orders && orders.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {orders.map((o) => {
              const customer = o.profiles as unknown as { company_name: string; contact_name: string } | null;
              const sc = STATUS_COLOR[o.status] ?? { bg: "#F5F5F5", color: "#555555", border: "#E0E0E0" };
              return (
                <Link key={o.id} href={`/admin/orders/${o.id}`} style={{ textDecoration: "none", display: "flex" }}>
                  <div style={{ width: "100%", background: "#FFFFFF", border: "1px solid #E0E0E0", borderLeft: "4px solid #DC2626", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px", cursor: "pointer", transition: "box-shadow 0.2s" }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "4px" }}>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#DC2626", fontFamily: "monospace" }}>{o.order_number}</p>
                        <span style={{ fontSize: "11px", fontWeight: 600, padding: "2px 10px", borderRadius: "999px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}` }}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                      <p style={{ fontSize: "14px", fontWeight: 600, color: "#111111" }}>{customer?.company_name ?? "—"}</p>
                      <p style={{ fontSize: "12px", color: "#555555", marginTop: "2px" }}>
                        {o.description?.slice(0, 70)}{(o.description?.length ?? 0) > 70 ? "…" : ""}
                        {o.quantity ? ` · Qty: ${o.quantity}` : ""}
                        {o.amount ? ` · ₹${Number(o.amount).toLocaleString("en-IN")}` : ""}
                      </p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      {o.expected_delivery && (
                        <>
                          <p style={{ fontSize: "11px", color: "#AAAAAA" }}>Expected</p>
                          <p style={{ fontSize: "12px", fontWeight: 600, color: "#555555" }}>
                            {new Date(o.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "80px 24px", background: "#F5F5F5", borderRadius: "4px", border: "1px dashed #E0E0E0" }}>
            <Package size={40} color="#AAAAAA" style={{ margin: "0 auto 16px", opacity: 0.4 }} />
            <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#111111", marginBottom: "8px" }}>No orders yet</h3>
            <p style={{ fontSize: "14px", color: "#555555", marginBottom: "16px" }}>Orders will appear here once created.</p>
            <Link href="/admin/orders/new" style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#DC2626", color: "#FFFFFF", padding: "10px 20px", borderRadius: "4px", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>
              <Plus size={14} /> Create First Order
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
