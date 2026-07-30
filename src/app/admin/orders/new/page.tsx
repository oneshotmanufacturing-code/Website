"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  company_name: string;
  contact_name: string | null;
}

const input = {
  width: "100%",
  padding: "12px 16px",
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  borderRadius: "4px",
  fontSize: "14px",
  color: "#111111",
  outline: "none",
  boxSizing: "border-box" as const,
};

const label = {
  display: "block",
  fontSize: "12px",
  fontWeight: 700,
  color: "#111111",
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  marginBottom: "8px",
};

const card = {
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  borderRadius: "4px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "24px",
  marginBottom: "16px",
};

const sectionLabel = {
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.10em",
  color: "#DC2626",
  marginBottom: "20px",
};

function NewOrderForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [form, setForm] = useState({
    customer_id: searchParams.get("customer_id") ?? "",
    order_number: "",
    description: searchParams.get("description") ?? "",
    quantity: searchParams.get("quantity") ?? "",
    amount: "",
    expected_delivery: "",
    delivery_address: "",
    pickup_required: false,
    internal_notes: searchParams.get("quote_id") ? `Converted from quote #${searchParams.get("quote_id")}` : "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("profiles").select("id, company_name, contact_name").eq("role", "customer")
      .then(({ data }: any) => setCustomers(data ?? []));
    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900) + 100;
    setForm(f => ({ ...f, order_number: `MP-${year}-${rand}` }));
  }, []);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(f => ({ ...f, [field]: e.target.type === "checkbox" ? (e.target as HTMLInputElement).checked : e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.customer_id) { setError("Please select a customer."); return; }
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error: insertError } = await supabase.from("orders").insert({
      customer_id: form.customer_id,
      order_number: form.order_number,
      description: form.description,
      quantity: form.quantity ? parseInt(form.quantity) : null,
      amount: form.amount ? parseFloat(form.amount) : null,
      expected_delivery: form.expected_delivery || null,
      delivery_address: form.delivery_address || null,
      pickup_required: form.pickup_required,
      internal_notes: form.internal_notes || null,
      status: "confirmed",
    }).select().single();

    if (insertError) { setError(insertError.message); setLoading(false); return; }

    await supabase.from("order_events").insert({ order_id: data.id, status: "confirmed", note: "Order created" });
    router.push(`/admin/orders/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Customer */}
      <div style={card}>
        <span style={sectionLabel}>Customer</span>
        <div>
          <label style={label}>Select Customer *</label>
          <select required value={form.customer_id} onChange={update("customer_id")} style={input}>
            <option value="">— Choose customer —</option>
            {customers.map(c => (
              <option key={c.id} value={c.id}>{c.company_name}{c.contact_name ? ` (${c.contact_name})` : ""}</option>
            ))}
          </select>
          {customers.length === 0 && (
            <p style={{ fontSize: "12px", color: "#AAAAAA", marginTop: "8px" }}>
              No customers yet. <Link href="/admin/customers" style={{ color: "#DC2626" }}>View customers →</Link>
            </p>
          )}
        </div>
      </div>

      {/* Order Details */}
      <div style={card}>
        <span style={sectionLabel}>Order Details</span>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <div>
            <label style={label}>Order Number *</label>
            <input required type="text" value={form.order_number} onChange={update("order_number")} style={{ ...input, fontFamily: "monospace" }} />
          </div>
          <div>
            <label style={label}>Quantity</label>
            <input type="number" min="1" value={form.quantity} onChange={update("quantity")} placeholder="e.g. 500" style={input} />
          </div>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <label style={label}>Description *</label>
          <textarea required value={form.description} onChange={update("description")} rows={3} placeholder="e.g. Wire harness assembly for CNC machine, 18AWG..." style={{ ...input, resize: "none" }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={label}>Agreed Amount (₹)</label>
            <input type="number" min="0" step="0.01" value={form.amount} onChange={update("amount")} placeholder="e.g. 25000" style={input} />
          </div>
          <div>
            <label style={label}>Expected Delivery</label>
            <input type="date" value={form.expected_delivery} onChange={update("expected_delivery")} style={input} />
          </div>
        </div>
      </div>

      {/* Delivery */}
      <div style={card}>
        <span style={sectionLabel}>Delivery</span>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
          <input type="checkbox" id="pickup" checked={form.pickup_required} onChange={update("pickup_required")} style={{ width: "16px", height: "16px", accentColor: "#DC2626" }} />
          <label htmlFor="pickup" style={{ fontSize: "14px", color: "#555555", cursor: "pointer" }}>Free door-step pickup required from customer</label>
        </div>
        <div>
          <label style={label}>Delivery Address</label>
          <input type="text" value={form.delivery_address} onChange={update("delivery_address")} placeholder="Customer's delivery address" style={input} />
        </div>
      </div>

      {/* Notes */}
      <div style={card}>
        <span style={sectionLabel}>Internal Notes</span>
        <textarea value={form.internal_notes} onChange={update("internal_notes")} rows={3} placeholder="Internal notes — not visible to customer..." style={{ ...input, resize: "none" }} />
      </div>

      {error && (
        <div style={{ padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", marginBottom: "16px" }}>
          <p style={{ fontSize: "13px", color: "#DC2626" }}>{error}</p>
        </div>
      )}

      <div style={{ display: "flex", gap: "12px" }}>
        <button type="submit" disabled={loading} style={{ display: "flex", alignItems: "center", gap: "8px", background: loading ? "#AAAAAA" : "#DC2626", color: "#FFFFFF", border: "none", borderRadius: "4px", padding: "13px 24px", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", cursor: loading ? "not-allowed" : "pointer" }}>
          <Plus size={14} /> {loading ? "Creating…" : "Create Order"}
        </button>
        <Link href="/admin/orders" style={{ display: "flex", alignItems: "center", padding: "13px 24px", border: "1px solid #E0E0E0", borderRadius: "4px", fontSize: "13px", color: "#555555", textDecoration: "none" }}>
          Cancel
        </Link>
      </div>
    </form>
  );
}

export default function NewOrderPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, background: "#111111", zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 800, letterSpacing: "0.10em", textDecoration: "none", textTransform: "uppercase" }}>ONESHOT</Link>
          <Link href="/admin/orders" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeft size={14} /> Orders
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "40px 24px 80px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 900, color: "#111111", textTransform: "uppercase", marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ background: "#DC2626", color: "#FFFFFF", width: "36px", height: "36px", borderRadius: "4px", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>+</span>
          Create New Order
        </h1>
        <Suspense fallback={<div style={{ padding: "48px", textAlign: "center", color: "#AAAAAA" }}>Loading form...</div>}>
          <NewOrderForm />
        </Suspense>
      </div>
    </div>
  );
}
