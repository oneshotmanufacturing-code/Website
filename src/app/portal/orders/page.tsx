import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Package, Clock } from "lucide-react";

export const metadata = { title: "My Orders | Portal" };

const STATUS_STEPS = [
  { key: "confirmed", label: "Order Confirmed" },
  { key: "material_ready", label: "Material Ready" },
  { key: "in_production", label: "In Production" },
  { key: "quality_check", label: "Quality Check" },
  { key: "dispatched", label: "Dispatched" },
  { key: "delivered", label: "Delivered" },
];

const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  material_ready: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  in_production: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  quality_check: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  dispatched: "text-accent-primary bg-accent-primary/10 border-accent-primary/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
};

export default async function PortalOrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*, documents(count)")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  const stepIndex = (status: string) => STATUS_STEPS.findIndex(s => s.key === status);

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/portal" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">My Portal</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <Package className="w-7 h-7 text-accent-primary" /> My Orders
        </h1>

        {orders && orders.length > 0 ? (
          <div className="space-y-4">
            {orders.map((order) => {
              const currentStep = stepIndex(order.status);
              const docCount = (order.documents as { count: number }[] | null)?.[0]?.count ?? 0;
              return (
                <Link key={order.id} href={`/portal/orders/${order.id}`}
                  className="glass-card p-6 block hover:border-accent-primary/30 transition-all group">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-mono font-bold text-accent-primary text-lg">{order.order_number}</p>
                      <p className="text-text-secondary text-sm mt-0.5">{order.description.slice(0, 60)}{order.description.length > 60 ? "…" : ""}</p>
                    </div>
                    <div className="text-right flex-shrink-0 ml-4">
                      <span className={`text-xs px-2.5 py-1 rounded-full border font-medium ${STATUS_COLORS[order.status]}`}>
                        {STATUS_STEPS[currentStep]?.label}
                      </span>
                      {docCount > 0 && (
                        <p className="text-xs text-text-muted mt-1">{docCount} document{docCount > 1 ? "s" : ""}</p>
                      )}
                    </div>
                  </div>

                  {/* Mini progress bar */}
                  <div className="flex items-center gap-1">
                    {STATUS_STEPS.map((step, i) => (
                      <div key={step.key} className="flex-1 flex items-center gap-1">
                        <div className={`h-1.5 flex-1 rounded-full transition-colors ${
                          i <= currentStep ? "bg-accent-primary" : "bg-bg-tertiary"
                        }`} />
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-1">
                    <p className="text-xs text-text-muted">Confirmed</p>
                    <p className="text-xs text-text-muted">Delivered</p>
                  </div>

                  {order.expected_delivery && order.status !== "delivered" && (
                    <div className="flex items-center gap-1.5 mt-3 text-xs text-text-muted">
                      <Clock className="w-3 h-3" />
                      Expected: {new Date(order.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <Package className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No orders yet</p>
            <p className="text-text-muted text-sm mt-1">
              Your orders will appear here once confirmed by our team.
            </p>
            <Link href="/services#quote-builder"
              className="inline-block mt-4 text-sm text-accent-primary hover:underline">
              Request a quote →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
