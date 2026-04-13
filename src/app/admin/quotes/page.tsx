import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList, ArrowLeft, Eye } from "lucide-react";

export const metadata = { title: "Quote Requests | Admin" };

const STATUS_STYLES: Record<string, string> = {
  new: "text-amber-400 bg-amber-400/10 border-amber-400/30",
  contacted: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  converted: "text-green-400 bg-green-400/10 border-green-400/30",
  closed: "text-text-muted bg-bg-tertiary border-border-subtle",
};

export default async function AdminQuotesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

  const { data: quotes } = await supabase
    .from("quote_requests")
    .select("*")
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
            <ClipboardList className="w-7 h-7 text-accent-primary" /> Quote Requests
          </h1>
          <span className="text-text-muted text-sm">{quotes?.length ?? 0} total</span>
        </div>

        {quotes && quotes.length > 0 ? (
          <div className="space-y-3">
            {quotes.map((q) => (
              <Link key={q.id} href={`/admin/quotes/${q.id}`}
                className="glass-card p-5 flex items-center justify-between hover:border-accent-primary/30 transition-all group">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-semibold text-text-primary">{q.company_name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${STATUS_STYLES[q.status]}`}>
                      {q.status}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary">
                    {q.contact_name} · {q.email} · {q.phone}
                  </p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-xs text-text-muted">
                      {q.service_type === "pcb" ? "PCB Assembly" : "Wire & Cable"} · Qty: {q.quantity ?? "—"}
                    </span>
                    {q.gstin && (
                      <span className="text-xs font-mono text-text-muted">GSTIN: {q.gstin}</span>
                    )}
                    <span className="text-xs text-text-muted">
                      {new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
                <Eye className="w-4 h-4 text-text-muted group-hover:text-accent-primary transition-colors ml-4 flex-shrink-0" />
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <ClipboardList className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No quote requests yet</p>
            <p className="text-text-muted text-sm mt-1">
              Quotes submitted from the{" "}
              <Link href="/services#quote-builder" className="text-accent-primary hover:underline">
                services page
              </Link>{" "}
              will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
