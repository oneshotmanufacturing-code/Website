import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, ArrowLeft, Plus } from "lucide-react";

export const metadata = { title: "Orders | Admin" };

const STATUS_STYLES: Record<string, string> = {
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  material_ready: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  in_production: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  quality_check: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  dispatched: "text-accent-primary bg-accent-primary/10 border-accent-primary/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  material_ready: "Material Ready",
  in_production: "In Production",
  quality_check: "Quality Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, profiles(company_name, contact_name)")
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
            <Package className="w-7 h-7 text-accent-primary" /> Orders
          </h1>
          <Link href="/admin/orders/new" className="btn-glow flex items-center gap-2 px-4 py-2 text-sm">
            <Plus className="w-4 h-4" /> New Order
          </Link>
        </div>

        {orders && orders.length > 0 ? (
          <div className="space-y-3">
            {orders.map((o) => {
              const customer = o.profiles as { company_name: string; contact_name: string } | null;
              return (
                <Link key={o.id} href={`/admin/orders/${o.id}`}
                  className="glass-card p-5 flex items-center justify-between hover:border-accent-primary/30 transition-all group">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-mono font-semibold text-accent-primary">{o.order_number}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[o.status]}`}>
                        {STATUS_LABEL[o.status]}
                      </span>
                    </div>
                    <p className="text-sm text-text-primary font-medium">{customer?.company_name ?? "—"}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {o.description.slice(0, 60)}{o.description.length > 60 ? "…" : ""} · Qty: {o.quantity ?? "—"}
                      {o.amount ? ` · ₹${Number(o.amount).toLocaleString("en-IN")}` : ""}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    {o.expected_delivery && (
                      <>
                        <p className="text-xs text-text-muted">Expected</p>
                        <p className="text-xs text-text-secondary">
                          {new Date(o.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                        </p>
                      </>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No orders yet</p>
            <Link href="/admin/orders/new" className="text-accent-primary text-sm hover:underline mt-2 inline-block">
              Create your first order →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
