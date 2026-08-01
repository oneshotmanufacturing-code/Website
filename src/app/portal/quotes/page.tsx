import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, ClipboardList, Clock } from "lucide-react";

export const metadata = { title: "My Quotes | Portal" };

const STATUS_STYLES: Record<string, { color: string; label: string }> = {
  new:       { color: "text-amber-400 bg-amber-400/10 border-amber-400/30",   label: "Under Review" },
  contacted: { color: "text-blue-400 bg-blue-400/10 border-blue-400/30",     label: "We Contacted You" },
  converted: { color: "text-green-400 bg-green-400/10 border-green-400/30",  label: "Order Confirmed" },
  closed:    { color: "text-text-muted bg-bg-tertiary border-border-subtle",  label: "Closed" },
};

export default async function PortalQuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: quotes } = await supabase
    .from("quote_requests")
    .select("*")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/portal" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">Customer Portal</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <ClipboardList className="w-7 h-7 text-accent-primary" /> My Quote Requests
        </h1>

        {quotes && quotes.length > 0 ? (
          <div className="space-y-4">
            {quotes.map((q) => {
              const s = STATUS_STYLES[q.status] ?? STATUS_STYLES.new;
              return (
                <div key={q.id} className="glass-card p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <p className="font-semibold text-text-primary">
                          {q.service_type === "pcb" ? "PCB Assembly" : "Wire & Cable Preparation"}
                        </p>
                        <span className={`text-xs px-2.5 py-0.5 rounded-full border font-medium ${s.color}`}>
                          {s.label}
                        </span>
                      </div>
                      {q.quantity && (
                        <p className="text-sm text-text-secondary">Quantity: {q.quantity}</p>
                      )}
                      {q.message && (
                        <p className="text-sm text-text-muted mt-1 line-clamp-2">{q.message}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-text-muted shrink-0">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </div>
                  </div>

                  {/* Status message for customer */}
                  <div className="mt-4 pt-4 border-t border-border-subtle">
                    {q.status === "new" && (
                      <p className="text-xs text-text-muted">📋 Your quote is being reviewed. We'll reach out to you soon.</p>
                    )}
                    {q.status === "contacted" && (
                      <p className="text-xs text-blue-400">📞 We've reached out to you. Please check your phone/email.</p>
                    )}
                    {q.status === "converted" && (
                      <p className="text-xs text-green-400">✅ Great news! Your order has been confirmed. Check <Link href="/portal/orders" className="underline">My Orders</Link>.</p>
                    )}
                    {q.status === "closed" && (
                      <p className="text-xs text-text-muted">This quote request has been closed. <Link href="/quote" className="text-accent-primary hover:underline">Submit a new one</Link>.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No quote requests yet</p>
            <p className="text-text-muted text-sm mt-1">
              <Link href="/quote" className="text-accent-primary hover:underline">
                Submit a quote request
              </Link>{" "}
              and we'll get back to you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
