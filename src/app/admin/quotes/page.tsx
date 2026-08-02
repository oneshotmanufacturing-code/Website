import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { ClipboardList, Eye, Mail, Phone, Calendar, Paperclip } from "lucide-react";
import { serviceLabel } from "@/lib/serviceData";

export const metadata = { title: "Quote Requests | Admin — OneShot Manufacturing" };

const STATUS_CLASS: Record<string, string> = {
  new: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
  contacted: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  converted: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
  closed: "bg-gray-100-cl text-text-mid border-gray-300-cl",
};

const STATUS_LABEL: Record<string, string> = {
  new: "New Inquiry",
  contacted: "Contacted",
  converted: "Converted to Order",
  closed: "Closed",
};

export default async function AdminQuotesPage() {
  const supabase = await createClient();

  const { data: quotes, error } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <section className="bg-navy px-6 py-12 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="amber-badge mb-4">QUOTES</span>
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight">QUOTE REQUESTS</h1>
            <p className="text-white/50 text-sm mt-2">Review custom manufacturing estimates and specs.</p>
          </div>
          <div className="bg-amber-light/20 border border-amber/30 px-4 py-2 rounded">
            <p className="text-[11px] font-bold uppercase tracking-announcement text-amber">{quotes?.length ?? 0} Total</p>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="px-6 py-8 lg:px-8 flex-1">
        {error ? (
          <div className="text-center py-20 bg-[#FEF2F2] rounded border border-[#FECACA]">
            <h3 className="text-lg font-bold text-[#DC2626] mb-2">Couldn&apos;t load quotes</h3>
            <p className="text-text-mid text-sm max-w-md mx-auto">{error.message}</p>
          </div>
        ) : quotes && quotes.length > 0 ? (
          <div className="flex flex-col gap-4 max-w-full mx-auto">
            {quotes.map((q) => {
              const sc = STATUS_CLASS[q.status || "new"] ?? STATUS_CLASS.new;
              return (
                <Link key={q.id} href={`/admin/quotes/${q.id}`} className="group block transition-all">
                  <div className="bg-white border border-gray-300-cl border-l-4 border-l-amber rounded shadow-card p-5 flex items-center justify-between flex-wrap gap-4 cursor-pointer group-hover:shadow-card-hover">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-base font-bold text-text-dark">{q.company_name || "Anonymous Company"}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc} uppercase tracking-announcement`}>
                          {STATUS_LABEL[q.status || "new"] ?? q.status}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-4 text-text-mid text-xs">
                        {q.contact_name && <span className="font-semibold">{q.contact_name}</span>}
                        {q.email && <span className="flex items-center gap-1"><Mail size={13} className="text-amber" /> {q.email}</span>}
                        {q.phone && <span className="flex items-center gap-1"><Phone size={13} className="text-amber" /> {q.phone}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-2.5">
                        <span className="bg-gray-100-cl text-text-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                          {serviceLabel(q.service_type)}
                        </span>
                        {q.quantity && <span className="text-xs text-text-light">Qty: <strong className="text-text-dark">{q.quantity}</strong></span>}
                        {q.gstin && <span className="text-[10px] text-text-light font-mono">GSTIN: {q.gstin}</span>}
                        {Array.isArray((q.specs as { attachments?: unknown[] } | null)?.attachments) && (q.specs as { attachments: unknown[] }).attachments.length > 0 && (
                          <span className="text-xs text-text-light flex items-center gap-1">
                            <Paperclip size={12} /> {(q.specs as { attachments: unknown[] }).attachments.length} file{(q.specs as { attachments: unknown[] }).attachments.length > 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="text-xs text-text-light flex items-center gap-1">
                        <Calendar size={13} /> {new Date(q.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </span>
                      <span className="text-xs font-bold text-amber flex items-center gap-1 group-hover:underline">
                        View Details <Eye size={14} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-100-cl rounded border border-dashed border-gray-300-cl">
            <ClipboardList size={40} className="mx-auto mb-4 text-text-light opacity-40" />
            <h3 className="text-lg font-bold text-text-dark mb-2">No quote requests yet</h3>
            <p className="text-text-mid text-sm max-w-xs mx-auto">
              Inquiries and quote builder submissions from the services page will appear here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
