"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Upload, FileText, Download, Trash2 } from "lucide-react";

const STATUSES = [
  { value: "confirmed", label: "Confirmed" },
  { value: "material_ready", label: "Material Ready" },
  { value: "in_production", label: "In Production" },
  { value: "quality_check", label: "Quality Check" },
  { value: "dispatched", label: "Dispatched" },
  { value: "delivered", label: "Delivered" },
] as const;

interface Document {
  id: string;
  filename: string;
  type: string;
  storage_path: string;
  created_at: string;
}

const cardStyle = {
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  borderRadius: "4px",
  boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
  padding: "24px",
  marginTop: "16px",
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

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: "4px",
  background: "#FFFFFF",
  border: "1px solid #E0E0E0",
  color: "#111111",
  fontSize: "13px",
  outline: "none",
  boxSizing: "border-box" as const,
};

export default function OrderStatusUpdater({
  orderId,
  currentStatus,
  documents,
}: {
  orderId: string;
  currentStatus: string;
  documents: Document[];
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState<"invoice" | "challan" | "test_report" | "other">("invoice");
  const [docs, setDocs] = useState<Document[]>(documents || []);

  async function handleStatusUpdate() {
    setSaving(true);
    const supabase = createClient();
    await supabase.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", orderId);
    await supabase.from("order_events").insert({ order_id: orderId, status, note: note || null });
    setSaved(true);
    setNote("");
    setTimeout(() => { setSaved(false); router.refresh(); }, 1500);
    setSaving(false);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const supabase = createClient();
    const path = `orders/${orderId}/${Date.now()}_${file.name}`;

    const { error: uploadError } = await supabase.storage.from("documents").upload(path, file);
    if (uploadError) { alert("Upload failed: " + uploadError.message); setUploading(false); return; }

    const { data: doc } = await supabase.from("documents").insert({
      order_id: orderId,
      type: docType,
      filename: file.name,
      storage_path: path,
    }).select().single();

    if (doc) setDocs(prev => [doc, ...prev]);
    setUploading(false);
    e.target.value = "";
  }

  async function handleDelete(docId: string, storagePath: string) {
    const supabase = createClient();
    await supabase.storage.from("documents").remove([storagePath]);
    await supabase.from("documents").delete().eq("id", docId);
    setDocs(prev => prev.filter(d => d.id !== docId));
  }

  async function getDownloadUrl(storagePath: string) {
    const supabase = createClient();
    const { data } = await supabase.storage.from("documents").createSignedUrl(storagePath, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  return (
    <>
      {/* Update Status Card */}
      <div style={cardStyle}>
        <span style={sectionLabel}>Update Order Status</span>
        <div style={{ marginBottom: "12px" }}>
          <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
            {STATUSES.map(s => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: "16px" }}>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
            placeholder="Add a status note or tracking details (optional)..."
            style={{ ...inputStyle, resize: "none" }}
          />
        </div>
        <button
          onClick={handleStatusUpdate}
          disabled={saving}
          style={{
            width: "100%",
            padding: "12px",
            background: "#DC2626",
            color: "#FFFFFF",
            border: "none",
            borderRadius: "4px",
            fontSize: "13px",
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            cursor: saving ? "not-allowed" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: saving ? 0.6 : 1,
          }}
        >
          {saved ? <><CheckCircle size={15} /> Status Updated!</> :
            saving ? "Updating Status..." :
              "Apply Status Update"}
        </button>
      </div>

      {/* Upload Document Card */}
      <div style={cardStyle}>
        <span style={sectionLabel}>Attach Documents</span>
        <div style={{ marginBottom: "12px" }}>
          <select value={docType} onChange={e => setDocType(e.target.value as typeof docType)} style={inputStyle}>
            <option value="invoice">Invoice</option>
            <option value="challan">Delivery Challan</option>
            <option value="test_report">Test Report / QC</option>
            <option value="other">Other Attachment</option>
          </select>
        </div>
        <label
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            width: "100%",
            padding: "14px",
            borderRadius: "4px",
            border: "2px dashed #E0E0E0",
            cursor: uploading ? "not-allowed" : "pointer",
            background: "#F9F9F9",
            color: uploading ? "#AAAAAA" : "#555555",
            fontSize: "13px",
            fontWeight: 600,
            boxSizing: "border-box",
          }}
        >
          <Upload size={16} color="#DC2626" />
          {uploading ? "Uploading file..." : "Click to select file & upload"}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} style={{ display: "none" }} disabled={uploading} />
        </label>

        {/* Documents List */}
        {docs.length > 0 && (
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #E0E0E0", paddingTop: "16px" }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#555555", textTransform: "uppercase" }}>Uploaded Files</p>
            {docs.map(doc => (
              <div key={doc.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 12px", background: "#F5F5F5", borderRadius: "4px", border: "1px solid #EFEFEF" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0, flex: 1 }}>
                  <FileText size={16} color="#DC2626" style={{ flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <p style={{ fontSize: "13px", fontWeight: 600, color: "#111111", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.filename}</p>
                    <p style={{ fontSize: "11px", color: "#888888", margin: "2px 0 0", textTransform: "capitalize" }}>{doc.type.replace("_", " ")}</p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexShrink: 0 }}>
                  <button onClick={() => getDownloadUrl(doc.storage_path)} title="Download" style={{ padding: "6px", background: "#FFFFFF", border: "1px solid #E0E0E0", borderRadius: "4px", cursor: "pointer", color: "#555555" }}>
                    <Download size={14} />
                  </button>
                  <button onClick={() => handleDelete(doc.id, doc.storage_path)} title="Delete" style={{ padding: "6px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: "4px", cursor: "pointer", color: "#DC2626" }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
