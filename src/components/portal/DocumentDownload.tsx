"use client";
import { createClient } from "@/lib/supabase/client";
import { Download, FileText } from "lucide-react";

interface Doc {
  id: string;
  filename: string;
  type: string;
  storage_path: string;
  created_at: string;
}

const TYPE_LABEL: Record<string, string> = {
  invoice: "Invoice",
  challan: "Delivery Challan",
  test_report: "Test Report",
  other: "Document",
};

export default function PortalDocumentDownload({
  doc,
  orderNumber,
}: {
  doc: Doc;
  orderNumber?: string;
}) {
  async function handleDownload() {
    const supabase = createClient();
    const { data } = await supabase.storage
      .from("documents")
      .createSignedUrl(doc.storage_path, 300); // 5 min expiry
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/30 hover:bg-bg-tertiary/50 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <FileText className="w-4 h-4 text-accent-primary flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm text-text-primary truncate">{doc.filename}</p>
          <p className="text-xs text-text-muted">
            {TYPE_LABEL[doc.type] ?? doc.type}
            {orderNumber && ` · ${orderNumber}`}
            {" · "}{new Date(doc.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </p>
        </div>
      </div>
      <button
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-xs font-medium hover:bg-accent-primary/20 transition-colors flex-shrink-0 ml-3"
      >
        <Download className="w-3.5 h-3.5" /> Download
      </button>
    </div>
  );
}
