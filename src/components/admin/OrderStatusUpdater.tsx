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
  const [docs, setDocs] = useState<Document[]>(documents);

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

    const { data: { publicUrl } } = supabase.storage.from("documents").getPublicUrl(path);
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

  const inputClass = "w-full px-3 py-2.5 rounded-xl bg-bg-tertiary/40 border border-border-subtle text-text-primary text-sm focus:outline-none focus:border-accent-primary/60 transition-colors";

  return (
    <>
      {/* Update Status */}
      <div className="glass-card p-5">
        <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3">Update Status</h2>
        <select value={status} onChange={e => setStatus(e.target.value)} className={`${inputClass} mb-3`}>
          {STATUSES.map(s => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          rows={2}
          placeholder="Add a note (e.g. tracking number)..."
          className={`${inputClass} resize-none mb-3`}
        />
        <button onClick={handleStatusUpdate} disabled={saving}
          className="btn-glow w-full flex items-center justify-center gap-2 py-2.5 text-sm disabled:opacity-60">
          {saved ? <><CheckCircle className="w-4 h-4" /> Updated!</> :
            saving ? <span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" /> :
              "Update Status"}
        </button>
      </div>

      {/* Upload Document */}
      <div className="glass-card p-5">
        <h2 className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3">Upload Document</h2>
        <select value={docType} onChange={e => setDocType(e.target.value as typeof docType)} className={`${inputClass} mb-3`}>
          <option value="invoice">Invoice</option>
          <option value="challan">Delivery Challan</option>
          <option value="test_report">Test Report</option>
          <option value="other">Other</option>
        </select>
        <label className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl border-2 border-dashed cursor-pointer transition-colors text-sm ${uploading ? "border-accent-primary/40 text-accent-primary" : "border-border-subtle text-text-muted hover:border-accent-primary/40 hover:text-accent-primary"}`}>
          {uploading ? (
            <><span className="w-4 h-4 border-2 border-accent-primary/40 border-t-accent-primary rounded-full animate-spin" /> Uploading…</>
          ) : (
            <><Upload className="w-4 h-4" /> Choose file to upload</>
          )}
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleUpload} className="hidden" disabled={uploading} />
        </label>

        {/* Documents list */}
        {docs.length > 0 && (
          <div className="mt-4 space-y-2">
            {docs.map(doc => (
              <div key={doc.id} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-tertiary/30">
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="w-3.5 h-3.5 text-accent-primary flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs text-text-primary truncate">{doc.filename}</p>
                    <p className="text-xs text-text-muted capitalize">{doc.type.replace("_", " ")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => getDownloadUrl(doc.storage_path)}
                    className="p-1.5 rounded-lg hover:bg-accent-primary/10 text-text-muted hover:text-accent-primary transition-colors">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => handleDelete(doc.id, doc.storage_path)}
                    className="p-1.5 rounded-lg hover:bg-red-400/10 text-text-muted hover:text-red-400 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
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
