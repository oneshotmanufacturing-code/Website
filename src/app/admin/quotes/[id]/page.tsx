import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Phone, Mail, FileText, MessageSquare, Download } from "lucide-react";
import AdminQuoteActions from "@/components/admin/QuoteActions";
import { serviceLabel } from "@/lib/serviceData";

export const metadata = { title: "Quote Detail | Admin — OneShot Manufacturing" };

interface CableSpec {
  cable_type: string; length_mm: string; quantity: string;
  end_a: { connector: string; crimping: string };
  end_b: { connector: string; crimping: string } | null;
  processing: string[];
}
interface BoardSpec { pcb_type: string; board_qty: string }
interface CncSpec { cnc_type: string; material: string; quantity: string }
interface AttachmentSpec { section: string; filename: string; size: number; storage_path: string; uploaded_at: string }
interface StructuredSpecs {
  services: string[];
  material_supply: string;
  cables: CableSpec[];
  boards: BoardSpec[];
  cnc_parts: CncSpec[];
  section_modes: Record<string, "form" | "upload">;
  approx_quantity: Record<string, string>;
  attachments: AttachmentSpec[];
}

function isStructuredSpecs(specs: unknown): specs is StructuredSpecs {
  if (!specs || typeof specs !== "object") return false;
  const s = specs as Record<string, unknown>;
  return Array.isArray(s.cables) || Array.isArray(s.boards) || Array.isArray(s.cnc_parts);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function AdminQuoteDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const { data: quote } = await supabase.from("quote_requests").select("*").eq("id", params.id).single();
  if (!quote) notFound();

  const rawSpecs = quote.specs as unknown;
  const structured = isStructuredSpecs(rawSpecs) ? rawSpecs : null;
  const legacySpecs = !structured ? (rawSpecs as Record<string, string | number> | null) : null;

  // Signed URLs must be minted server-side; do it once here for every attachment.
  const attachmentLinks = new Map<string, string>();
  if (structured?.attachments?.length) {
    for (const a of structured.attachments) {
      const { data: signed } = await supabase.storage.from("quote_attachments").createSignedUrl(a.storage_path, 300);
      if (signed?.signedUrl) attachmentLinks.set(a.storage_path, signed.signedUrl);
    }
  }

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
      {/* Breadcrumb */}
      <div style={{ background: "#F5F5F5", borderBottom: "1px solid #E0E0E0", padding: "12px 24px" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <Link href="/admin/quotes" style={{ color: "#555555", fontSize: "13px", fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}>
            <ArrowLeft size={14} /> Back to Quotes
          </Link>
        </div>
      </div>

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
              <p style={fieldLabel}>Services Requested</p>
              <p style={{ ...fieldValue, fontSize: "16px" }}>
                {structured ? structured.services.map(serviceLabel).join(", ") : serviceLabel(quote.service_type)}
              </p>
            </div>
            <div>
              <p style={fieldLabel}>Requested Quantity</p>
              <p style={{ ...fieldValue, fontSize: "16px", color: "#DC2626" }}>{quote.quantity ? `${quote.quantity} units` : "Not specified"}</p>
            </div>
          </div>

          {structured ? (
            <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E0E0E0", display: "flex", flexDirection: "column", gap: "20px" }}>
              {structured.material_supply && (
                <div>
                  <p style={fieldLabel}>Material Supply</p>
                  <p style={fieldValue}>{structured.material_supply}</p>
                </div>
              )}

              {structured.services.includes("wire_cable") && (
                <SpecSection title="Wire / Cable" mode={structured.section_modes?.wire_cable}>
                  {structured.section_modes?.wire_cable === "upload" ? (
                    <UploadNote qty={structured.approx_quantity?.wire_cable} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {structured.cables.map((c, i) => (
                        <div key={i} style={{ background: "#F9F9F9", padding: "10px 14px", borderRadius: "4px", border: "1px solid #EFEFEF", fontSize: "13px", color: "#333333" }}>
                          <strong>Cable {i + 1}:</strong> {c.cable_type}{c.length_mm ? `, ${c.length_mm}mm` : ""}{c.quantity ? ` × ${c.quantity}` : ""}
                          <br />End A: {c.end_a?.connector || "—"} / {c.end_a?.crimping || "—"}
                          {c.end_b ? <> — End B: {c.end_b.connector || "—"} / {c.end_b.crimping || "—"}</> : <> — End B: open</>}
                          {c.processing?.length ? <><br />Processing: {c.processing.join(", ")}</> : null}
                        </div>
                      ))}
                    </div>
                  )}
                </SpecSection>
              )}

              {structured.services.includes("pcb") && (
                <SpecSection title="PCB Assembly" mode={structured.section_modes?.pcb}>
                  {structured.section_modes?.pcb === "upload" ? (
                    <UploadNote qty={structured.approx_quantity?.pcb} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {structured.boards.map((b, i) => (
                        <div key={i} style={{ background: "#F9F9F9", padding: "10px 14px", borderRadius: "4px", border: "1px solid #EFEFEF", fontSize: "13px", color: "#333333" }}>
                          <strong>Board {i + 1}:</strong> {b.pcb_type}{b.board_qty ? ` × ${b.board_qty}` : ""}
                        </div>
                      ))}
                    </div>
                  )}
                </SpecSection>
              )}

              {structured.services.includes("cnc") && (
                <SpecSection title="CNC Manufacturing" mode={structured.section_modes?.cnc}>
                  {structured.section_modes?.cnc === "upload" ? (
                    <UploadNote qty={structured.approx_quantity?.cnc} />
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                      {structured.cnc_parts.map((c, i) => (
                        <div key={i} style={{ background: "#F9F9F9", padding: "10px 14px", borderRadius: "4px", border: "1px solid #EFEFEF", fontSize: "13px", color: "#333333" }}>
                          <strong>Part {i + 1}:</strong> {c.cnc_type}{c.material ? `, ${c.material}` : ""}{c.quantity ? ` × ${c.quantity}` : ""}
                        </div>
                      ))}
                    </div>
                  )}
                </SpecSection>
              )}

              {structured.attachments?.length > 0 && (
                <div>
                  <p style={fieldLabel}>Attachments</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "6px" }}>
                    {structured.attachments.map((a, i) => {
                      const url = attachmentLinks.get(a.storage_path);
                      return (
                        <a
                          key={i}
                          href={url ?? "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px", background: "#F9F9F9", border: "1px solid #EFEFEF", borderRadius: "4px", padding: "10px 14px", textDecoration: "none", color: "#111111", fontSize: "13px", opacity: url ? 1 : 0.5, pointerEvents: url ? "auto" : "none" }}
                        >
                          <span><strong>{serviceLabel(a.section)}</strong> — {a.filename} <span style={{ color: "#888888" }}>({formatBytes(a.size)})</span></span>
                          <Download size={14} color="#DC2626" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            legacySpecs && Object.keys(legacySpecs).length > 0 && (
              <div style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #E0E0E0", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px" }}>
                {Object.entries(legacySpecs).map(([k, v]) => (
                  <div key={k} style={{ background: "#F9F9F9", padding: "10px 14px", borderRadius: "4px", border: "1px solid #EFEFEF" }}>
                    <p style={{ fontSize: "11px", color: "#777777", textTransform: "uppercase", marginBottom: "4px", margin: "0 0 4px" }}>{k.replace(/_/g, " ")}</p>
                    <p style={{ fontSize: "14px", fontWeight: 700, color: "#111111", margin: 0 }}>{String(v)}</p>
                  </div>
                ))}
              </div>
            )
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

function SpecSection({ title, mode, children }: { title: string; mode?: "form" | "upload"; children: React.ReactNode }) {
  return (
    <div>
      <p style={{ fontSize: "11px", color: "#777777", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
        {title}
        {mode === "upload" && (
          <span style={{ background: "#FFFBEB", color: "#D97706", border: "1px solid #FDE68A", borderRadius: "3px", padding: "1px 6px", fontSize: "10px", fontWeight: 700 }}>SHEET UPLOAD</span>
        )}
      </p>
      {children}
    </div>
  );
}

function UploadNote({ qty }: { qty?: string }) {
  return (
    <p style={{ fontSize: "13px", color: "#555555", fontStyle: "italic" }}>
      Customer uploaded a sheet instead of filling in details{qty ? ` — approx. quantity: ${qty}` : ""}. See Attachments below.
    </p>
  );
}
