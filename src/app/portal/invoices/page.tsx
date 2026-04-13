import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import PortalDocumentDownload from "@/components/portal/DocumentDownload";

export const metadata = { title: "My Invoices | Portal" };

export default async function PortalInvoicesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch all documents for this customer's orders
  const { data: documents } = await supabase
    .from("documents")
    .select("*, orders!inner(order_number, customer_id, description)")
    .eq("orders.customer_id", user.id)
    .order("created_at", { ascending: false });

  const invoices = documents?.filter(d => d.type === "invoice") ?? [];
  const others = documents?.filter(d => d.type !== "invoice") ?? [];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/portal" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">My Portal</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <FileText className="w-7 h-7 text-accent-primary" /> Invoices & Documents
        </h1>

        {documents && documents.length > 0 ? (
          <div className="space-y-6">
            {invoices.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">
                  GST Invoices ({invoices.length})
                </h2>
                <div className="space-y-2">
                  {invoices.map(doc => (
                    <PortalDocumentDownload
                      key={doc.id}
                      doc={doc}
                      orderNumber={(doc.orders as { order_number: string } | null)?.order_number}
                    />
                  ))}
                </div>
              </div>
            )}
            {others.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">
                  Other Documents ({others.length})
                </h2>
                <div className="space-y-2">
                  {others.map(doc => (
                    <PortalDocumentDownload
                      key={doc.id}
                      doc={doc}
                      orderNumber={(doc.orders as { order_number: string } | null)?.order_number}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="glass-card p-16 text-center">
            <FileText className="w-12 h-12 text-text-muted mx-auto mb-3" />
            <p className="text-text-secondary font-medium">No documents yet</p>
            <p className="text-text-muted text-sm mt-1">
              Invoices and delivery challans will appear here once your order is processed.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
