import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, Truck, FileText } from "lucide-react";
import PortalDocumentDownload from "@/components/portal/DocumentDownload";

export const metadata = { title: "Order Detail | Portal" };

const STATUS_STEPS = [
  { key: "confirmed",      label: "Order Confirmed",  desc: "Your order has been confirmed" },
  { key: "material_ready", label: "Material Ready",   desc: "Materials are ready for production" },
  { key: "in_production",  label: "In Production",   desc: "Your order is being manufactured" },
  { key: "quality_check",  label: "Quality Check",   desc: "Final quality inspection in progress" },
  { key: "dispatched",     label: "Dispatched",      desc: "Your order is on the way" },
  { key: "delivered",      label: "Delivered",       desc: "Order successfully delivered" },
];

export default async function PortalOrderDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("id", params.id)
    .eq("customer_id", user.id) // security: only their own order
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

  const currentStepIndex = STATUS_STEPS.findIndex(s => s.key === order.status);

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/portal/orders" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">My Orders</p>
        </div>
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold font-mono text-text-primary">{order.order_number}</h1>
            <p className="text-text-muted text-sm mt-1">
              Placed {new Date(order.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          {order.expected_delivery && order.status !== "delivered" && (
            <div className="text-right glass-card px-4 py-2.5">
              <p className="text-xs text-text-muted">Expected Delivery</p>
              <p className="text-sm font-semibold text-accent-primary">
                {new Date(order.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </p>
            </div>
          )}
        </div>

        {/* Status Timeline */}
        <div className="glass-card p-6 mb-5">
          <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-6">Order Status</h2>
          <div className="relative">
            <div className="absolute left-3.5 top-0 bottom-0 w-0.5 bg-border-subtle" />
            <div
              className="absolute left-3.5 top-0 w-0.5 bg-accent-primary transition-all duration-500"
              style={{ height: `${(currentStepIndex / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            <div className="space-y-6">
              {STATUS_STEPS.map((step, i) => {
                const isDone = i <= currentStepIndex;
                const isCurrent = i === currentStepIndex;
                const event = events?.find(e => e.status === step.key);
                return (
                  <div key={step.key} className="flex items-start gap-4 relative">
                    <div className={`w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 z-10 ${
                      isDone ? "bg-accent-primary border-accent-primary" : "bg-bg-primary border-border-subtle"
                    }`}>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-bg-primary" />
                      ) : (
                        <Circle className="w-3 h-3 text-text-muted" />
                      )}
                    </div>
                    <div className="flex-1 pb-1">
                      <p className={`font-medium text-sm ${isCurrent ? "text-accent-primary" : isDone ? "text-text-primary" : "text-text-muted"}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-xs bg-accent-primary/10 text-accent-primary border border-accent-primary/20 rounded-full px-2 py-0.5">Current</span>}
                      </p>
                      <p className="text-xs text-text-muted mt-0.5">{step.desc}</p>
                      {event && (
                        <div className="mt-1">
                          {event.note && <p className="text-xs text-text-secondary">{event.note}</p>}
                          <p className="text-xs text-text-muted">{new Date(event.created_at).toLocaleString("en-IN")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="glass-card p-6 mb-5">
          <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Order Details</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-text-muted mb-0.5">Description</p>
              <p className="text-text-secondary text-sm">{order.description}</p>
            </div>
            <div>
              <p className="text-xs text-text-muted mb-0.5">Quantity</p>
              <p className="text-text-primary">{order.quantity ?? "—"}</p>
            </div>
            {order.amount && (
              <div>
                <p className="text-xs text-text-muted mb-0.5">Order Value</p>
                <p className="text-text-primary font-semibold">₹{Number(order.amount).toLocaleString("en-IN")}</p>
              </div>
            )}
            {order.pickup_required && (
              <div className="col-span-2">
                <span className="flex items-center gap-1.5 text-xs text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-lg px-3 py-1.5 w-fit">
                  <Truck className="w-3.5 h-3.5" /> Free door-step pickup included
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Documents */}
        {documents && documents.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-3.5 h-3.5" /> Documents
            </h2>
            <div className="space-y-2">
              {documents.map(doc => (
                <PortalDocumentDownload key={doc.id} doc={doc} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
