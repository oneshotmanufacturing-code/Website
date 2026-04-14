import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, Phone, Mail, FileText, MessageSquare } from "lucide-react";
import AdminQuoteActions from "@/components/admin/QuoteActions";

export const metadata = { title: "Quote Detail | Admin" };

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

  const { data: quote } = await supabase.from("quote_requests").select("*").eq("id", params.id).single();
  if (!quote) notFound();

  const specs = quote.specs as Record<string, string | number> | null;

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/admin/quotes" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">Quote Request</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8">{quote.company_name}</h1>

        <div className="space-y-5">
          {/* Contact Info */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider text-accent-primary">Contact Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-0.5">Contact Name</p>
                <p className="text-text-primary font-medium">{quote.contact_name}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">Company</p>
                <p className="text-text-primary font-medium">{quote.company_name}</p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5 flex items-center gap-1"><Phone className="w-3 h-3" /> Phone</p>
                <a href={`tel:${quote.phone}`} className="text-accent-primary hover:underline">{quote.phone}</a>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</p>
                <a href={`mailto:${quote.email}`} className="text-accent-primary hover:underline">{quote.email}</a>
              </div>
              {quote.gstin && (
                <div>
                  <p className="text-xs text-text-muted mb-0.5 flex items-center gap-1"><FileText className="w-3 h-3" /> GSTIN</p>
                  <p className="font-mono text-text-primary">{quote.gstin}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-text-muted mb-0.5">Submitted</p>
                <p className="text-text-secondary">{new Date(quote.created_at).toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="glass-card p-6">
            <h2 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider text-accent-primary">Service Requirements</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-0.5">Service Type</p>
                <p className="text-text-primary font-medium">
                  {quote.service_type === "pcb" ? "PCB Assembly" : "Wire & Cable Preparation"}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-0.5">Quantity</p>
                <p className="text-text-primary font-medium">{quote.quantity ?? "Not specified"}</p>
              </div>
              {specs && Object.entries(specs).map(([k, v]) => (
                <div key={k}>
                  <p className="text-xs text-text-muted mb-0.5 capitalize">{k.replace(/_/g, " ")}</p>
                  <p className="text-text-primary">{String(v)}</p>
                </div>
              ))}
            </div>
            {quote.message && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-text-muted mb-1 flex items-center gap-1"><MessageSquare className="w-3 h-3" /> Message</p>
                <p className="text-text-secondary text-sm">{quote.message}</p>
              </div>
            )}
            
            {quote.design_file_url && (
              <div className="mt-4 pt-4 border-t border-border-subtle">
                <p className="text-xs text-text-muted mb-2 flex items-center gap-1">Attached Design File</p>
                <a 
                  href={quote.design_file_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-accent-primary/30 bg-accent-primary/10 text-accent-primary hover:bg-accent-primary/20 transition-colors text-sm font-medium"
                >
                  View / Download File
                </a>
              </div>
            )}
          </div>

          {/* Admin Actions */}
          <AdminQuoteActions
            quoteId={quote.id}
            currentStatus={quote.status}
            adminNotes={quote.admin_notes ?? ""}
            customerId={quote.customer_id ?? null}
            phone={quote.phone}
            email={quote.email}
            serviceType={quote.service_type}
            quantity={quote.quantity}
            companyName={quote.company_name}
          />
        </div>
      </div>
    </div>
  );
}
