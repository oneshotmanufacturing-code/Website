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
  const [saveError, setSaveError] = useState<string | null>(null);
  const [converting, setConverting] = useState(false);
  const [convertError, setConvertError] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replyState, setReplyState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [replyError, setReplyError] = useState<string | null>(null);

  const reference = `Q-${quoteId.slice(0, 8).toUpperCase()}`;

  async function handleSave() {
    setSaving(true);
    setSaveError(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("quote_requests")
      .update({ status, admin_notes: notes })
      .eq("id", quoteId);
    setSaving(false);
    if (error) {
      setSaveError(error.message);
      return;
    }
    setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
  }

  async function handleConvertToOrder() {
    if (!customerId) return;
    if (status === "converted") {
      const proceed = window.confirm("This quote is already marked converted. Create another order anyway?");
      if (!proceed) return;
    }
    setConverting(true);
    setConvertError(null);
    const supabase = createClient();

    const year = new Date().getFullYear();
    const rand = Math.floor(Math.random() * 900) + 100;
    const orderNumber = `MP-${year}-${rand}`;

    // Order must exist before the quote is marked converted — otherwise an
    // aborted/failed insert leaves the quote flipped with no order behind it.
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_id: customerId,
        order_number: orderNumber,
        description: serviceType ? serviceLabel(serviceType) : "",
        quantity: quantity ?? null,
        status: "confirmed",
        internal_notes: `Converted from quote ${reference}`,
        quote_id: quoteId,
      })
      .select()
      .single();

    if (orderError || !order) {
      setConverting(false);
      setConvertError(orderError?.message ?? "Could not create the order.");
      return;
    }

    await supabase.from("order_events").insert({ order_id: order.id, status: "confirmed", note: "Order created" });
    await supabase.from("quote_requests").update({ status: "converted" }).eq("id", quoteId);

    setConverting(false);
    setStatus("converted");
    router.push(`/admin/orders/${order.id}`);
  }

  function handleConvertGuest() {
    const params = new URLSearchParams();
    if (serviceType) params.set("description", serviceLabel(serviceType));
    if (quantity) params.set("quantity", String(quantity));
    params.set("quote_id", quoteId);
    router.push(`/admin/orders/new?${params.toString()}`);
  }

  async function handleSendReply() {
    if (!replyBody.trim() || !email) return;
    setReplyState("sending");
    setReplyError(null);
    try {
      const res = await fetch("/api/quotes/reply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId, to: email, message: replyBody }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to send reply.");
      setReplyState("sent");
      setReplyBody("");
      setTimeout(() => setReplyState("idle"), 2500);
    } catch (err) {
      setReplyState("error");
      setReplyError(err instanceof Error ? err.message : "Failed to send reply.");
    }
  }

  const waMessage = encodeURIComponent(
    `Hi${companyName ? " " + companyName : ""}, this is OneShot Manufacturing regarding your quote request ${reference}.`
  );
  const waPhone = phone?.replace(/[^0-9]/g, "");

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
          <a href={`mailto:${email}?subject=${encodeURIComponent(`Regarding your quote request ${reference}`)}`} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", background: "#EFF6FF", border: "1px solid #BFDBFE", color: "#2563EB", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            <Mail size={13} /> Email Customer
          </a>
        )}
        {waPhone && (
          <a href={`https://wa.me/${waPhone}?text=${waMessage}`} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "8px 14px", borderRadius: "4px", background: "#F0FDF4", border: "1px solid #BBF7D0", color: "#16A34A", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
            <MessageSquare size={13} /> WhatsApp Customer
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

      {/* Reply via email (Resend) */}
      {email && (
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "11px", fontWeight: 700, color: "#555555", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>
            <Mail size={13} /> Reply to Customer (sends an email)
          </label>
          <textarea
            value={replyBody}
            onChange={(e) => setReplyBody(e.target.value)}
            rows={3}
            placeholder={`Write a reply to ${email}...`}
            style={{ width: "100%", padding: "12px 14px", borderRadius: "4px", background: "#FFFFFF", border: "1px solid #E0E0E0", color: "#111111", fontSize: "13px", outline: "none", resize: "vertical", boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "8px" }}>
            <button
              onClick={handleSendReply}
              disabled={replyState === "sending" || !replyBody.trim()}
              type="button"
              style={{
                padding: "10px 18px", background: replyState === "sending" ? "#AAAAAA" : "#2563EB", color: "#FFFFFF",
                border: "none", borderRadius: "4px", fontSize: "12px", fontWeight: 700, textTransform: "uppercase",
                cursor: replyState === "sending" || !replyBody.trim() ? "not-allowed" : "pointer",
              }}
            >
              {replyState === "sending" ? "Sending..." : replyState === "sent" ? "Sent!" : "Send Reply"}
            </button>
            {replyState === "error" && replyError && <span style={{ fontSize: "12px", color: "#DC2626" }}>{replyError}</span>}
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "12px", borderTop: "1px solid #F0F0F0", paddingTop: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
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
              disabled={converting}
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
                cursor: converting ? "not-allowed" : "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <ArrowRight size={15} /> {converting ? "Creating Order..." : "Convert to Order"}
            </button>
          ) : (
            <button
              onClick={handleConvertGuest}
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
              <ArrowRight size={15} /> Convert to Order…
            </button>
          )}
        </div>
        {saveError && <p style={{ fontSize: "12px", color: "#DC2626", margin: 0 }}>Couldn&apos;t save: {saveError}</p>}
        {convertError && <p style={{ fontSize: "12px", color: "#DC2626", margin: 0 }}>Couldn&apos;t create order: {convertError}</p>}
        {!customerId && (
          <span style={{ fontSize: "12px", color: "#888888", fontStyle: "italic" }}>
            * Guest quote submission (customer not registered on portal) — opens the order form to fill in a customer manually.
          </span>
        )}
      </div>
    </div>
  );
}
