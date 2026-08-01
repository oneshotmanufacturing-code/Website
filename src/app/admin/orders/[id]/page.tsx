import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Truck, MapPin, Mail, Phone } from "lucide-react";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export const metadata = { title: "Order Detail | Admin — OneShot Manufacturing" };

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

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, profiles(company_name, contact_name, email, phone, gstin)")
    .eq("id", params.id)
    .single();

  if (!order) notFound();

  const { data: events } = await supabase
    .from("order_events")
    .select("*")
    .eq("order_id", params.id)
    .order("created_at", { ascending: true });

  const { data: documents } = await supabase
    .from("documents")
    .select("*")
    .eq("order_id", params.id)
    .order("created_at", { ascending: false });

  const customer = order.profiles as { company_name: string; contact_name: string; email: string; phone: string; gstin: string } | null;
  const sc = STATUS_COLOR[order.status] ?? { bg: "#F5F5F5", color: "#555555", border: "#E0E0E0" };

  const card = { background: "#FFFFFF", border: "1px solid #E0E0E0", borderRadius: "4px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)", padding: "24px", marginBottom: "16px" };
  const sectionLabel = { fontSize: "11px", fontWeight: 700, textTransform: "uppercase" as const, letterSpacing: "0.10em", color: "#DC2626", marginBottom: "16px", display: "block" };
  const fieldLabel = { fontSize: "11px", color: "#AAAAAA", marginBottom: "4px" };
  const fieldValue = { fontSize: "14px", color: "#111111", fontWeight: 500 };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5" }}>
      {/* Breadcrumb */}
      <div style={{ background: "#F5F5F5", borderBottom: "1px solid #E0E0E0", padding: "12px 24px" }}>
        <div style={{ maxWidth: "1050px", margin: "0 auto" }}>
          <Link href="/admin/orders" style={{ color: "#555555", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeft size={14} /> Orders
          </Link>
        </div>
      </div>

      {/* Header */}
      <section style={{ background: "#111111", padding: "40px 24px 32px" }}>
        <div style={{ maxWidth: "1050px", margin: "0 auto", display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
          <div>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", marginBottom: "8px" }}>Order Details</p>
            <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "0.05em" }}>{order.order_number}</h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px", marginTop: "4px" }}>{customer?.company_name}</p>
          </div>
          <span style={{ fontSize: "13px", fontWeight: 600, padding: "6px 16px", borderRadius: "999px", background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, alignSelf: "flex-start" }}>
            {STATUS_LABEL[order.status] ?? order.status}
          </span>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "24px", maxWidth: "1050px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px", alignItems: "start" }}>
          {/* Left Column: Order Specs and Timeline */}
          <div>
            <div style={card}>
              <span style={sectionLabel}>Order Specifications</span>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                  <p style={fieldLabel}>Description</p>
                  <p style={fieldValue}>{order.description}</p>
                </div>
                <div>
                  <p style={fieldLabel}>Quantity</p>
                  <p style={fieldValue}>{order.quantity ?? "—"}</p>
                </div>
                <div>
                  <p style={fieldLabel}>Agreed Amount</p>
                  <p style={{ ...fieldValue, fontWeight: 700 }}>{order.amount ? `₹${Number(order.amount).toLocaleString("en-IN")}` : "—"}</p>
                </div>
                <div>
                  <p style={fieldLabel}>Expected Delivery</p>
                  <p style={fieldValue}>{order.expected_delivery ? new Date(order.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "—"}</p>
                </div>
              </div>
              {order.pickup_required && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E0E0E0" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "12px", color: "#DC2626", background: "#FEF2F2", border: "1px solid #FECACA", padding: "6px 12px", borderRadius: "4px", fontWeight: 600 }}>
                    <Truck size={14} /> Free door-step pickup required from customer
                  </span>
                </div>
              )}
              {order.delivery_address && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E0E0E0" }}>
                  <p style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: "4px" }}><MapPin size={11} /> Delivery Address</p>
                  <p style={fieldValue}>{order.delivery_address}</p>
                </div>
              )}
              {order.internal_notes && (
                <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E0E0E0" }}>
                  <p style={fieldLabel}>Internal Notes</p>
                  <p style={{ ...fieldValue, color: "#555555", fontStyle: "italic" }}>{order.internal_notes}</p>
                </div>
              )}
            </div>

            {/* Timeline */}
            <div style={card}>
              <span style={sectionLabel}>Status Timeline & Events</span>
              {events && events.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  {events.map((ev, i) => (
                    <div key={ev.id} style={{ display: "flex", gap: "14px", alignItems: "flex-start", position: "relative" }}>
                      {i < events.length - 1 && <div style={{ position: "absolute", left: "5px", top: "14px", bottom: "-16px", width: "2px", background: "#E0E0E0" }} />}
                      <div style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#DC2626", flexShrink: 0, marginTop: "3px", zIndex: 2 }} />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: 700, color: "#111111", margin: 0 }}>{STATUS_LABEL[ev.status] ?? ev.status}</p>
                        {ev.note && <p style={{ fontSize: "13px", color: "#555555", margin: "4px 0 0", background: "#F9F9F9", padding: "8px 12px", borderRadius: "4px", border: "1px solid #EFEFEF" }}>{ev.note}</p>}
                        <p style={{ fontSize: "11px", color: "#AAAAAA", marginTop: "4px" }}>{new Date(ev.created_at).toLocaleString("en-IN")}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ fontSize: "14px", color: "#AAAAAA" }}>No events recorded yet.</p>
              )}
            </div>
          </div>

          {/* Right Column: Customer Info & Status Updater / Uploads */}
          <div>
            <div style={{ ...card, marginBottom: 0 }}>
              <span style={sectionLabel}>Customer Information</span>
              <p style={{ fontSize: "17px", fontWeight: 800, color: "#111111", marginBottom: "4px" }}>{customer?.company_name ?? "—"}</p>
              <p style={{ fontSize: "13px", color: "#555555", marginBottom: "16px" }}>{customer?.contact_name}</p>
              {customer?.email && (
                <a href={`mailto:${customer.email}`} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#DC2626", textDecoration: "none", marginBottom: "10px", fontWeight: 500 }}>
                  <Mail size={14} /> {customer.email}
                </a>
              )}
              {customer?.phone && (
                <a href={`tel:${customer.phone}`} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#555555", textDecoration: "none", marginBottom: "10px", fontWeight: 500 }}>
                  <Phone size={14} /> {customer.phone}
                </a>
              )}
              {customer?.gstin && (
                <p style={{ fontSize: "11px", color: "#777777", fontFamily: "monospace", marginTop: "12px", background: "#F5F5F5", padding: "6px 10px", borderRadius: "4px", display: "inline-block" }}>GSTIN: {customer.gstin}</p>
              )}
              <div style={{ marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #E0E0E0" }}>
                <p style={fieldLabel}>Order Date</p>
                <p style={{ fontSize: "13px", color: "#111111" }}>{new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
              </div>
            </div>

            {/* Order Status & Documents Upload Component */}
            <OrderStatusUpdater orderId={order.id} currentStatus={order.status} documents={documents ?? []} />
          </div>
        </div>
      </section>
    </div>
  );
}
