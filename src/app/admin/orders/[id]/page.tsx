import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, Truck } from "lucide-react";
import OrderStatusUpdater from "@/components/admin/OrderStatusUpdater";

export const metadata = { title: "Order Detail | Admin" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  material_ready: "Material Ready",
  in_production: "In Production",
  quality_check: "Quality Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  material_ready: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  in_production: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  quality_check: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  dispatched: "text-accent-primary bg-accent-primary/10 border-accent-primary/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
};

export default async function AdminOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

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

  const customer = order.profiles as {
    company_name: string; contact_name: string; email: string; phone: string; gstin: string;
  } | null;

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/orders" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">Admin Panel</p>
        </div>

        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary font-mono">{order.order_number}</h1>
            <p className="text-text-muted text-sm mt-1">{customer?.company_name}</p>
          </div>
          <span className={`text-sm px-3 py-1.5 rounded-full border font-medium ${STATUS_COLORS[order.status]}`}>
            {STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Order info + Timeline */}
          <div className="lg:col-span-2 space-y-5">

            {/* Order Details */}
            <div className="glass-card p-6">
              <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Description</p>
                  <p className="text-text-primary text-sm">{order.description}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Quantity</p>
                  <p className="text-text-primary">{order.quantity ?? "—"}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Agreed Amount</p>
                  <p className="text-text-primary font-semibold">
                    {order.amount ? `₹${Number(order.amount).toLocaleString("en-IN")}` : "—"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-0.5">Expected Delivery</p>
                  <p className="text-text-primary">
                    {order.expected_delivery
                      ? new Date(order.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </p>
                </div>
                {order.pickup_required && (
                  <div className="col-span-2">
                    <span className="flex items-center gap-1.5 text-xs text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-lg px-3 py-1.5 w-fit">
                      <Truck className="w-3.5 h-3.5" /> Free door-step pickup required
                    </span>
                  </div>
                )}
                {order.delivery_address && (
                  <div className="col-span-2">
                    <p className="text-xs text-text-muted mb-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" /> Delivery Address</p>
                    <p className="text-text-secondary text-sm">{order.delivery_address}</p>
                  </div>
                )}
              </div>
              {order.internal_notes && (
                <div className="mt-4 pt-4 border-t border-border-subtle">
                  <p className="text-xs text-text-muted mb-1">Internal Notes</p>
                  <p className="text-text-secondary text-sm">{order.internal_notes}</p>
                </div>
              )}
            </div>

            {/* Status Timeline */}
            <div className="glass-card p-6">
              <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Status Timeline</h2>
              {events && events.length > 0 ? (
                <div className="space-y-3">
                  {events.map((ev) => (
                    <div key={ev.id} className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-accent-primary mt-1.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-text-primary">{STATUS_LABEL[ev.status] ?? ev.status}</p>
                        {ev.note && <p className="text-xs text-text-muted">{ev.note}</p>}
                        <p className="text-xs text-text-muted mt-0.5">
                          {new Date(ev.created_at).toLocaleString("en-IN")}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-text-muted text-sm">No events yet.</p>
              )}
            </div>

          </div>

          {/* Right: Customer + Actions */}
          <div className="space-y-5">
            {/* Customer Info */}
            <div className="glass-card p-5">
              <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3">Customer</h2>
              <p className="font-semibold text-text-primary">{customer?.company_name}</p>
              <p className="text-sm text-text-secondary mt-0.5">{customer?.contact_name}</p>
              {customer?.email && (
                <a href={`mailto:${customer.email}`} className="text-xs text-accent-primary hover:underline block mt-1">
                  {customer.email}
                </a>
              )}
              {customer?.phone && (
                <a href={`tel:${customer.phone}`} className="text-xs text-text-muted hover:text-accent-primary block mt-0.5">
                  {customer.phone}
                </a>
              )}
              {customer?.gstin && (
                <p className="text-xs font-mono text-text-muted mt-2">GSTIN: {customer.gstin}</p>
              )}
            </div>

            {/* Status Updater + Document Upload */}
            <OrderStatusUpdater
              orderId={order.id}
              currentStatus={order.status}
              documents={documents ?? []}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
