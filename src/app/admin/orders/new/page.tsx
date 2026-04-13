"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  company_name: string;
  contact_name: string | null;
}

export default function NewOrderPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Profile[]>([]);
  const [form, setForm] = useState({
    customer_id: "",
    order_number: "",
    description: "",
    quantity: "",
    amount: "",
    expected_delivery: "",
    delivery_address: "",
    pickup_required: false,
    internal_notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.from("profiles").select("id, company_name, contact_name").eq("role", "customer")
      .then(({ data }) => setCustomers(data ?? []));

    // Auto-generate order number
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

    // Add initial event
    await supabase.from("order_events").insert({
      order_id: data.id,
      status: "confirmed",
      note: "Order created",
    });

    router.push(`/admin/orders/${data.id}`);
  }

  const inputClass = "w-full px-4 py-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/30 transition-colors";
  const labelClass = "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/orders" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">Admin Panel</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <Package className="w-7 h-7 text-accent-primary" /> Create New Order
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Customer */}
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Customer</p>
            <div>
              <label className={labelClass}>Select Customer *</label>
              <select required value={form.customer_id} onChange={update("customer_id")} className={inputClass}>
                <option value="">— Choose customer —</option>
                {customers.map(c => (
                  <option key={c.id} value={c.id}>{c.company_name} {c.contact_name ? `(${c.contact_name})` : ""}</option>
                ))}
              </select>
              {customers.length === 0 && (
                <p className="text-xs text-text-muted mt-1">
                  No customers yet.{" "}
                  <Link href="/admin/customers" className="text-accent-primary hover:underline">Add a customer first</Link>
                </p>
              )}
            </div>
          </div>

          {/* Order Details */}
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Order Details</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Order Number *</label>
                  <input required type="text" value={form.order_number} onChange={update("order_number")}
                    className={`${inputClass} font-mono`} />
                </div>
                <div>
                  <label className={labelClass}>Quantity</label>
                  <input type="number" min="1" value={form.quantity} onChange={update("quantity")}
                    placeholder="e.g. 500" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Description *</label>
                <textarea required value={form.description} onChange={update("description")}
                  rows={3} placeholder="e.g. Wire harness assembly for CNC machine, 18AWG..."
                  className={`${inputClass} resize-none`} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Agreed Amount (₹)</label>
                  <input type="number" min="0" step="0.01" value={form.amount} onChange={update("amount")}
                    placeholder="e.g. 25000" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Expected Delivery</label>
                  <input type="date" value={form.expected_delivery} onChange={update("expected_delivery")}
                    className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Delivery</p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <input type="checkbox" id="pickup" checked={form.pickup_required}
                  onChange={update("pickup_required")}
                  className="w-4 h-4 accent-[#D4A847] rounded" />
                <label htmlFor="pickup" className="text-sm text-text-secondary">
                  Free door-step pickup required from customer
                </label>
              </div>
              <div>
                <label className={labelClass}>Delivery Address</label>
                <input type="text" value={form.delivery_address} onChange={update("delivery_address")}
                  placeholder="Customer's delivery address" className={inputClass} />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Internal Notes</p>
            <textarea value={form.internal_notes} onChange={update("internal_notes")}
              rows={3} placeholder="Internal notes — not visible to customer..."
              className={`${inputClass} resize-none`} />
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="flex gap-3">
            <button type="submit" disabled={loading}
              className="btn-glow flex items-center gap-2 px-6 py-3 disabled:opacity-60">
              {loading
                ? <span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
                : <Plus className="w-4 h-4" />}
              {loading ? "Creating…" : "Create Order"}
            </button>
            <Link href="/admin/orders"
              className="px-6 py-3 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary transition-colors text-sm">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
