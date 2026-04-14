"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, Phone, Mail, MessageSquare, ArrowRight, ExternalLink } from "lucide-react";

const STATUSES = ["new", "contacted", "converted", "closed"] as const;
type Status = typeof STATUSES[number];

const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted to Order",
  closed: "Closed",
};

export default function AdminQuoteActions({
  quoteId,
  currentStatus,
  adminNotes,
  customerId,
  phone,
  email,
  serviceType,
  quantity,
  companyName,
}: {
  quoteId: string;
  currentStatus: string;
  adminNotes: string;
  customerId?: string | null;
  phone?: string;
  email?: string;
  serviceType?: string;
  quantity?: number | null;
  companyName?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus as Status);
  const [notes, setNotes] = useState(adminNotes);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    const supabase = createClient();
    await supabase
      .from("quote_requests")
      .update({ status, admin_notes: notes })
      .eq("id", quoteId);
    setSaving(false);
    setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
  }

  function handleConvertToOrder() {
    const params = new URLSearchParams();
    if (customerId) params.set("customer_id", customerId);
    if (serviceType) params.set("description", serviceType === "pcb" ? "PCB Assembly" : "Wire & Cable Preparation");
    if (quantity) params.set("quantity", String(quantity));
    params.set("quote_id", quoteId);
    router.push(`/admin/orders/new?${params.toString()}`);
  }

  return (
    <div className="glass-card p-6">
      <h2 className="font-semibold text-text-primary mb-4 text-sm uppercase tracking-wider text-accent-primary">
        Admin Actions
      </h2>

      {/* Quick contact buttons */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {phone && (
          <a href={`tel:${phone}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-xs hover:bg-green-400/20 transition-colors">
            <Phone className="w-3.5 h-3.5" /> Call
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-400/10 border border-blue-400/20 text-blue-400 text-xs hover:bg-blue-400/20 transition-colors">
            <Mail className="w-3.5 h-3.5" /> Email
          </a>
        )}
        {customerId && (
          <a href={`/portal`} target="_blank" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs hover:bg-accent-primary/20 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> View Portal
          </a>
        )}
      </div>

      {/* Status */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
          Status
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                status === s
                  ? "bg-accent-primary text-bg-primary border-accent-primary"
                  : "bg-bg-tertiary/40 text-text-secondary border-border-subtle hover:border-accent-primary/40"
              }`}
            >
              {STATUS_LABELS[s]}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="mb-5">
        <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2 flex items-center gap-1">
          <MessageSquare className="w-3 h-3" /> Internal Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Price discussed, timeline agreed, next steps..."
          className="w-full px-4 py-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/60 transition-colors resize-none"
        />
      </div>

      <div className="flex gap-3 flex-wrap">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-glow flex items-center gap-2 px-6 py-2.5 disabled:opacity-60"
        >
          {saved ? (
            <><CheckCircle className="w-4 h-4" /> Saved!</>
          ) : saving ? (
            <><span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" /> Saving…</>
          ) : (
            "Save Changes"
          )}
        </button>

        {/* Convert to Order - only if quote has a registered customer */}
        {customerId && (
          <button
            onClick={handleConvertToOrder}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-green-400/30 text-green-400 bg-green-400/5 hover:bg-green-400/15 transition-colors text-sm font-medium"
          >
            <ArrowRight className="w-4 h-4" /> Convert to Order
          </button>
        )}
        {!customerId && (
          <p className="text-xs text-text-muted self-center">
            ⚠ No portal account linked — customer must sign up to create an order
          </p>
        )}
      </div>
    </div>
  );
}
