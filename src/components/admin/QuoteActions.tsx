"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CheckCircle, Phone, Mail, MessageSquare, ArrowRight, ExternalLink } from "lucide-react";
import { serviceLabel } from "@/lib/serviceData";

const STATUSES = ["new", "contacted", "converted", "closed"] as const;
type Status = typeof STATUSES[number];

const STATUS_LABELS: Record<Status, string> = {
  new: "New",
  contacted: "Contacted",
  converted: "Converted to Order",
  closed: "Closed",
};

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  borderRadius: "4px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "24px",
  marginTop: "20px",
};

const sectionLabel = {
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase" as const,
  letterSpacing: "0.10em",
  color: "#DC2626",
  marginBottom: "16px",
  display: "block",
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
  const [status, setStatus] = useState<Status>((currentStatus || "new") as Status);
  const [notes, setNotes] = useState(adminNotes || "");
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

  async function handleConvertToOrder() {
    if (status === "converted") {
      const proceed = window.confirm("This quote is already marked converted. Create another order anyway?");
      if (!proceed) return;
    }
    const supabase = createClient();
    await supabase.from("quote_requests").update({ status: "converted" }).eq("id", quoteId);
    setStatus("converted");

    const params = new URLSearchParams();
    if (customerId) params.set("customer_id", customerId);
    if (serviceType) params.set("description", serviceLabel(serviceType));
    if (quantity) params.set("quantity", String(quantity));
    params.set("quote_id", quoteId);
    router.push(`/admin/orders/new?${params.toString()}`);
  }

  return (
    <div style={cardStyle}>
      <span style={sectionLabel}>Admin Actions & Management</span>

      {/* Quick contact links */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
        {phone && (
          <a href={`tel:${phone}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            <Phone size={13} /> Call Customer
          </a>
        )}
        {email && (
          <a href={`mailto:${email}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            <Mail size={13} /> Email Customer
          </a>
        )}
        {customerId && (
          <a href="/portal" target="_blank" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", background: "#F5F5F5", border: "1px solid #E0E0E0", color: "#111111", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            <ExternalLink size={13} /> Open Customer Portal
          </a>
        )}
      </div>

      {/* Status Selection */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", fontSize: "11px", fontWeight: 700, color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
          Quote Status
        </label>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "8px" }}>
          {STATUSES.map((s) => {
            const isSelected = status === s;
            return (
              <button
                key={s}
                onClick={() => setStatus(s)}
                type="button"
                style={{
                  padding: "10px 14px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  border: isSelected ? "2px solid #DC2626" : "1px solid #E0E0E0",
                  background: isSelected ? "#FEF2F2" : "#FFFFFF",
                  color: isSelected ? "#DC2626" : "#555555",
                  transition: "all 0.15s ease",
                }}
              >
                {STATUS_LABELS[s]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Internal Notes */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
          <MessageSquare size={13} /> Internal Admin Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Record phone discussion details, pricing estimates, next follow-up date..."
          style={{
            width: "100%",
            padding: "12px 14px",
            borderRadius: "4px",
            background: "#FFFFFF",
            border: "1px solid #E0E0E0",
            color: "#111111",
            fontSize: "13px",
            outline: "none",
            resize: "vertical",
            boxSizing: "border-box",
          }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", borderTop: "1px solid #F0F0F0", paddingTop: "20px" }}>
        <button
          onClick={handleSave}
          disabled={saving}
          type="button"
          style={{
            padding: "12px 24px",
            background: saving ? "#AAAAAA" : "#DC2626",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: saving ? "not-allowed" : "pointer",
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {saved ? <><CheckCircle size={15} /> Changes Saved!</> :
            saving ? "Saving..." :
              "Save Changes"}
        </button>
        {customerId ? (
          <button
            onClick={handleConvertToOrder}
            type="button"
            style={{
              padding: "12px 24px",
              background: "#FFFFFF",
              color: "#16A34A",
              border: "1px solid #BBF7D0",
              borderRadius: "4px",
              fontSize: "13px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <ArrowRight size={15} /> Convert to Order
          </button>
        ) : (
          <span style={{ fontSize: "12px", color: "#888888", fontStyle: "italic" }}>
            * Guest quote submission (customer not registered on portal)
          </span>
        )}
      </div>
    </div>
  );
}
