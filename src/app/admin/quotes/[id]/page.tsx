import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, FileText, MessageSquare, Download } from "lucide-react";
import AdminQuoteActions from "@/components/admin/QuoteActions";

export const metadata = { title: "Quote Detail | Admin — OneShot Manufacturing" };

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: quote } = await supabase.from("quote_requests").select("*").eq("id", params.id).single();
  if (!quote) notFound();

  const specs = quote.specs as Record<string, string | number> | null;

  const cardStyle = {
    background: "#FFFFFF",
    border: "1px solid #E0E0E0",
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    padding: "24px",
    marginBottom: "20px",
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

  const fieldLabel = { fontSize: "11px", color: "#AAAAAA", marginBottom: "4px", textTransform: "uppercase" as const };
  const fieldValue = { fontSize: "14px", color: "#111111", fontWeight: 600 };

  return (
    <div style={{ minHeight: "100vh", background: "#F5F5F5" }}>
      {/* Nav */}
      <nav style={{ position: "sticky", top: 0, background: "#111111", zIndex: 50, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
        <div style={{ padding: "0 24px", height: "64px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ color: "#FFFFFF", fontSize: "20px", fontWeight: 800, letterSpacing: "0.10em", textDecoration: "none", textTransform: "uppercase" }}>ONESHOT</Link>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Link href="/admin/quotes" style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
              <ArrowLeft size={14} /> Back to Quotes
            </Link>
            <Link href="/" style={{ background: "#DC2626", color: "#FFFFFF", fontSize: "12px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 20px", borderRadius: "4px", textDecoration: "none" }}>← SITE</Link>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section style={{ background: "#111111", padding: "40px 24px 32px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <p style={{ color: "#DC2626", fontSize: "11px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.10em", marginBottom: "8px" }}>QUOTE REQUEST DETAILS</p>
          <h1 style={{ color: "#FFFFFF", fontSize: "28px", fontWeight: 900, textTransform: "uppercase", margin: 0 }}>{quote.company_name || quote.contact_name || "Inquiry Details"}</h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "4px" }}>Submitted on {new Date(quote.created_at).toLocaleString("en-IN")}</p>
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: "32px 24px 80px", maxWidth: "800px", margin: "0 auto" }}>
        {/* Contact Info Card */}
        <div style={cardStyle}>
          <span style={sectionLabel}>Customer Contact Details</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div>
              <p style={fieldLabel}>Contact Person</p>
              <p style={fieldValue}>{quote.contact_name || "—"}</p>
            </div>
            <div>
              <p style={fieldLabel}>Company Name</p>
              <p style={fieldValue}>{quote.company_name || "—"}</p>
            </div>
            <div>
              <p style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: "4px" }}><Phone size={11} color="#DC2626" /> Phone Number</p>
              {quote.phone ? <a href={`tel:${quote.phone}`} style={{ ...fieldValue, color: "#DC2626", textDecoration: "none" }}>{quote.phone}</a> : <p style={fieldValue}>—</p>}
            </div>
            <div>
              <p style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: "4px" }}><Mail size={11} color="#DC2626" /> Email Address</p>
              {quote.email ? <a href={`mailto:${quote.email}`} style={{ ...fieldValue, color: "#DC2626", textDecoration: "none" }}>{quote.email}</a> : <p style={fieldValue}>—</p>}
            </div>
            {quote.gstin && (
              <div>
                <p style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: "4px" }}><FileText size={11} /> GSTIN Registration</p>
                <p style={{ ...fieldValue, fontFamily: "monospace", background: "#F5F5F5", padding: "4px 8px", display: "inline-block", borderRadius: "3px" }}>{quote.gstin}</p>
              </div>
            )}
          </div>
        </div>

        {/* Technical Specs Card */}
        <div style={cardStyle}>
          <span style={sectionLabel}>Manufacturing Service Requirements</span>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "16px" }}>
            <div>
              <p style={fieldLabel}>Service Type</p>
              <p style={{ ...fieldValue, fontSize: "16px" }}>
                {quote.service_type === "pcb" ? "PCB Assembly (SMT & DIP)" : "Wire Harness & Cable Preparation"}
              </p>
            </div>
            <div>
              <p style={fieldLabel}>Requested Quantity</p>
              <p style={{ ...fieldValue, fontSize: "16px", color: "#DC2626" }}>{quote.quantity ? `${quote.quantity} units` : "Not specified"}</p>
            </div>
          </div>

          {specs && Object.keys(specs).length > 0 && (
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E0E0E0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} style={{ background: "#F9F9F9", padding: "10px 14px", borderRadius: "4px", border: "1px solid #EFEFEF" }}>
                  <p style={{ fontSize: "11px", color: "#777777", textTransform: "uppercase", marginBottom: "4px", margin: "0 0 4px" }}>{k.replace(/_/g, " ")}</p>
                  <p style={{ fontSize: "14px", fontWeight: 700, color: "#111111", margin: 0 }}>{String(v)}</p>
                </div>
              ))}
            </div>
          )}

          {quote.message && (
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E0E0E0" }}>
              <p style={{ ...fieldLabel, display: "flex", alignItems: "center", gap: "4px" }}><MessageSquare size={11} /> Customer Message / Additional Notes</p>
              <p style={{ fontSize: "14px", color: "#444444", lineHeight: 1.6, fontStyle: "italic", background: "#F5F5F5", padding: "12px 16px", borderRadius: "4px", margin: "8px 0 0", borderLeft: "3px solid #AAAAAA" }}>
                &ldquo;{quote.message}&rdquo;
              </p>
            </div>
          )}

          {quote.design_file_url && (
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E0E0E0" }}>
              <p style={fieldLabel}>Attached Engineering / Design Files</p>
              <a
                href={quote.design_file_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#111111", color: "#FFFFFF", padding: "10px 18px", borderRadius: "4px", textDecoration: "none", fontSize: "13px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "6px" }}
              >
                <Download size={14} /> Download Attached Design File
              </a>
            </div>
          )}
        </div>

        {/* Admin Interactive Actions Component */}
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
      </section>
    </div>
  );
}
