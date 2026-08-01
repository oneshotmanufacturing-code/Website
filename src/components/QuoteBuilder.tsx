"use client";

import React, { useState } from "react";
import {
  Send,
  MessageCircle,
  Plus,
  Trash2,
  Check,
  ClipboardList,
  Upload,
  FileText,
  X,
  AlertCircle,
} from "lucide-react";
import { COMPANY } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  CABLE_TYPE_OPTIONS,
  CONNECTOR_OPTIONS,
  CRIMPING_OPTIONS,
  PROCESSING_OPTIONS,
  PCB_TYPE_OPTIONS,
  RAW_MATERIAL_OPTIONS,
} from "@/lib/serviceData";

// ── Types ──────────────────────────────────────────────

type ServiceKey = "wire_cable" | "pcb" | "cnc";
type SectionMode = "form" | "upload";

const SERVICES: { key: ServiceKey; label: string }[] = [
  { key: "wire_cable", label: "Wire / Cable" },
  { key: "pcb", label: "PCB Assembly" },
  { key: "cnc", label: "CNC Manufacturing" },
];

interface CableItem {
  id: string;
  cable_type: string;
  length_mm: string;
  quantity: string;
  end_a_connector: string;
  end_a_crimping: string;
  has_end_b: boolean;
  end_b_connector: string;
  end_b_crimping: string;
  processing: string[];
}

interface BoardItem {
  id: string;
  pcb_type: string;
  board_qty: string;
}

interface CncItem {
  id: string;
  cnc_type: string;
  material: string;
  quantity: string;
}

interface Attachment {
  section: ServiceKey | "general";
  filename: string;
  size: number;
  storage_path: string;
  uploaded_at: string;
}

interface QuoteFormData {
  services: ServiceKey[];
  sectionModes: Record<ServiceKey, SectionMode>;
  approxQuantity: Record<ServiceKey, string>;
  cables: CableItem[];
  boards: BoardItem[];
  cncParts: CncItem[];
  materialSupply: string;
  notes: string;
  notifyCnc: boolean;
  name: string;
  company: string;
  email: string;
  phone: string;
  gstin: string;
}

const newCable = (): CableItem => ({
  id: crypto.randomUUID(),
  cable_type: "",
  length_mm: "",
  quantity: "",
  end_a_connector: "",
  end_a_crimping: "",
  has_end_b: true,
  end_b_connector: "",
  end_b_crimping: "",
  processing: [],
});
const newBoard = (): BoardItem => ({ id: crypto.randomUUID(), pcb_type: "", board_qty: "" });
const newCnc = (): CncItem => ({ id: crypto.randomUUID(), cnc_type: "", material: "", quantity: "" });

const initialForm: QuoteFormData = {
  services: [],
  sectionModes: { wire_cable: "form", pcb: "form", cnc: "form" },
  approxQuantity: { wire_cable: "", pcb: "", cnc: "" },
  cables: [newCable()],
  boards: [newBoard()],
  cncParts: [newCnc()],
  materialSupply: "buyer",
  notes: "",
  notifyCnc: false,
  name: "",
  company: "",
  email: "",
  phone: "",
  gstin: "",
};

// ── Upload validation ──────────────────────────────────

const MAX_FILE_MB = 10;
const ACCEPTED_EXT = [
  "xlsx", "xls", "csv", "pdf", "doc", "docx",
  "jpg", "jpeg", "png", "step", "stp", "dxf",
];

function validateFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ACCEPTED_EXT.includes(ext)) return `${file.name}: unsupported file type`;
  if (file.size > MAX_FILE_MB * 1024 * 1024) return `${file.name}: over ${MAX_FILE_MB}MB`;
  return null;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// ── Small shared inputs ────────────────────────────────

const fieldLabel = "block text-xs font-semibold text-[#555555] uppercase tracking-wider mb-2";
const fieldBase =
  "w-full px-4 py-2.5 rounded-md bg-white border border-[#D4D4D4] text-[#1A1A1A] text-sm placeholder:text-[#A3A3A3] focus:border-[#DC2626] focus:ring-1 focus:ring-[#DC2626]/30 transition-all";

function SelectInput({
  label, value, onChange, options, placeholder = "Select…", id,
}: {
  label: string; value: string; onChange: (v: string) => void;
  options: readonly string[]; placeholder?: string; id: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>{label}</label>
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={`${fieldBase} cursor-pointer`}>
        <option value="">{placeholder}</option>
        {options.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
      </select>
    </div>
  );
}

function TextInput({
  label, value, onChange, type = "text", placeholder, required = false, id, min,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
  placeholder?: string; required?: boolean; id: string; min?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className={fieldLabel}>
        {label}{required && <span className="text-[#DC2626] ml-1">*</span>}
      </label>
      <input
        id={id} type={type} value={value} min={min}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className={fieldBase}
      />
    </div>
  );
}

/** One selected-state treatment reused by service toggles, processing chips, and material cards. */
function SelectableButton({
  selected, onClick, children, compact = false,
}: { selected: boolean; onClick: () => void; children: React.ReactNode; compact?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium transition-colors duration-150 text-left ${
        compact ? "px-3 py-1.5 text-xs min-h-[36px]" : "px-4 py-2.5 text-sm min-h-[44px]"
      } ${
        selected
          ? "bg-[#FEF2F2] border-[#DC2626] border-2 text-[#B91C1C] font-bold"
          : "bg-white border-[#D4D4D4] text-[#525252] hover:border-[#A3A3A3] hover:bg-[#FAFAFA]"
      }`}
    >
      {selected && <Check size={compact ? 12 : 14} className="shrink-0" />}
      {children}
    </button>
  );
}

/** Attached-file list with a per-file remove button — shared by per-section upload zones and the general design-file field. */
function FileList({ files, onRemove }: { files: File[]; onRemove: (i: number) => void }) {
  if (files.length === 0) return null;
  return (
    <ul className="space-y-2">
      {files.map((f, i) => (
        <li key={`${f.name}-${i}`} className="flex items-center justify-between gap-3 px-3 py-2 rounded-md bg-white border border-[#E0E0E0] text-sm">
          <span className="flex items-center gap-2 text-[#1A1A1A] truncate"><FileText className="w-4 h-4 text-[#DC2626] shrink-0" /> {f.name} <span className="text-[#A3A3A3]">({formatBytes(f.size)})</span></span>
          <button type="button" onClick={() => onRemove(i)} aria-label={`Remove ${f.name}`} className="text-[#A3A3A3] hover:text-[#DC2626] shrink-0"><X className="w-4 h-4" /></button>
        </li>
      ))}
    </ul>
  );
}

function formatQuoteText(form: QuoteFormData, reference: string): string {
  const lines: string[] = [];
  lines.push(`=== QUOTE REQUEST ${reference} ===`);
  lines.push(`Services: ${form.services.map((s) => SERVICES.find((x) => x.key === s)?.label).join(", ")}`);
  lines.push("");

  if (form.services.includes("wire_cable")) {
    lines.push("── Wire / Cable ──");
    if (form.sectionModes.wire_cable === "upload") {
      lines.push(`Uploaded as a sheet${form.approxQuantity.wire_cable ? ` (approx qty: ${form.approxQuantity.wire_cable})` : ""}`);
    } else {
      form.cables.forEach((c, i) => {
        if (!c.cable_type) return;
        lines.push(
          `Cable ${i + 1}: ${c.cable_type}${c.length_mm ? `, ${c.length_mm}mm` : ""}${c.quantity ? ` x${c.quantity}` : ""} | End A: ${c.end_a_connector || "—"}/${c.end_a_crimping || "—"}${c.has_end_b ? ` | End B: ${c.end_b_connector || "—"}/${c.end_b_crimping || "—"}` : " | End B: open"}${c.processing.length ? ` | ${c.processing.join(", ")}` : ""}`
        );
      });
    }
    lines.push("");
  }

  if (form.services.includes("pcb")) {
    lines.push("── PCB Assembly ──");
    if (form.sectionModes.pcb === "upload") {
      lines.push(`Uploaded as a sheet${form.approxQuantity.pcb ? ` (approx qty: ${form.approxQuantity.pcb})` : ""}`);
    } else {
      form.boards.forEach((b, i) => {
        if (!b.pcb_type) return;
        lines.push(`Board ${i + 1}: ${b.pcb_type}${b.board_qty ? ` x${b.board_qty}` : ""}`);
      });
    }
    lines.push("");
  }

  if (form.services.includes("cnc")) {
    lines.push("── CNC Manufacturing ──");
    lines.push("Coming soon — lead captured" + (form.notifyCnc ? " (wants notify)" : ""));
    lines.push("");
  }

  lines.push(`Material Supply: ${form.materialSupply}`);
  if (form.notes) lines.push(`Notes: ${form.notes}`);
  lines.push("");
  lines.push("── Contact ──");
  lines.push(`Name: ${form.name}`);
  if (form.company) lines.push(`Company: ${form.company}`);
  lines.push(`Email: ${form.email}`);
  if (form.phone) lines.push(`Phone: ${form.phone}`);
  lines.push("=======================");
  return lines.join("\n");
}

// ── Component ──────────────────────────────────────────

export default function QuoteBuilder() {
  const [form, setForm] = useState<QuoteFormData>(initialForm);
  const [sectionFiles, setSectionFiles] = useState<Record<ServiceKey, File[]>>({ wire_cable: [], pcb: [], cnc: [] });
  const [fileErrors, setFileErrors] = useState<Record<ServiceKey, string | null>>({ wire_cable: null, pcb: null, cnc: null });
  const [designFiles, setDesignFiles] = useState<File[]>([]);
  const [designFileError, setDesignFileError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<{ reference: string; failedUploads: string[] } | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const update = <K extends keyof QuoteFormData>(key: K, value: QuoteFormData[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const toggleService = (key: ServiceKey) =>
    update("services", form.services.includes(key) ? form.services.filter((s) => s !== key) : [...form.services, key]);

  const setMode = (key: ServiceKey, mode: SectionMode) =>
    update("sectionModes", { ...form.sectionModes, [key]: mode });

  // Generic add/remove/update for the three repeatable line-item arrays.
  const addRow = <K extends "cables" | "boards" | "cncParts">(key: K, row: QuoteFormData[K][number]) =>
    setForm((prev) => ({ ...prev, [key]: [...prev[key], row] }));

  const removeRow = <K extends "cables" | "boards" | "cncParts">(key: K, id: string) =>
    setForm((prev) => {
      const arr = prev[key];
      if (arr.length <= 1) return prev;
      return { ...prev, [key]: arr.filter((r) => r.id !== id) };
    });

  const updateRow = <K extends "cables" | "boards" | "cncParts">(
    key: K, id: string, patch: Partial<QuoteFormData[K][number]>
  ) =>
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].map((r) => (r.id === id ? { ...r, ...patch } : r)),
    }));

  const toggleCableProcessing = (id: string, item: string) => {
    const cable = form.cables.find((c) => c.id === id);
    if (!cable) return;
    updateRow("cables", id, {
      processing: cable.processing.includes(item)
        ? cable.processing.filter((p) => p !== item)
        : [...cable.processing, item],
    });
  };

  const onFilesSelected = (section: ServiceKey, files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const err = validateFile(file);
      if (err) {
        setFileErrors((prev) => ({ ...prev, [section]: err }));
        return;
      }
    }
    setSectionFiles((prev) => ({ ...prev, [section]: [...prev[section], ...Array.from(files)] }));
    setFileErrors((prev) => ({ ...prev, [section]: null }));
  };

  const removeFile = (section: ServiceKey, index: number) =>
    setSectionFiles((prev) => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));

  const onDesignFilesSelected = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    for (const file of Array.from(files)) {
      const err = validateFile(file);
      if (err) {
        setDesignFileError(err);
        return;
      }
    }
    setDesignFiles((prev) => [...prev, ...Array.from(files)]);
    setDesignFileError(null);
  };

  const removeDesignFile = (index: number) =>
    setDesignFiles((prev) => prev.filter((_, i) => i !== index));

  async function saveQuote(): Promise<{ id: string; reference: string; failedUploads: string[] }> {
    if (form.services.length === 0) throw new Error("Select at least one service.");
    for (const key of form.services) {
      if (form.sectionModes[key] === "upload" && sectionFiles[key].length === 0) {
        throw new Error(`Attach a file for ${SERVICES.find((s) => s.key === key)?.label}, or switch back to filling in details.`);
      }
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const cables = form.services.includes("wire_cable") && form.sectionModes.wire_cable === "form"
      ? form.cables.filter((c) => c.cable_type).map((c) => ({
          cable_type: c.cable_type,
          length_mm: c.length_mm,
          quantity: c.quantity,
          end_a: { connector: c.end_a_connector, crimping: c.end_a_crimping },
          end_b: c.has_end_b ? { connector: c.end_b_connector, crimping: c.end_b_crimping } : null,
          processing: c.processing,
        }))
      : [];
    const boards = form.services.includes("pcb") && form.sectionModes.pcb === "form"
      ? form.boards.filter((b) => b.pcb_type).map((b) => ({ pcb_type: b.pcb_type, board_qty: b.board_qty }))
      : [];
    const cncPartsOut = form.services.includes("cnc") && form.sectionModes.cnc === "form"
      ? form.cncParts.filter((c) => c.cnc_type).map((c) => ({ cnc_type: c.cnc_type, material: c.material, quantity: c.quantity }))
      : [];

    const quantity =
      cables.reduce((sum, c) => sum + (Number(c.quantity) || 0), 0) +
      boards.reduce((sum, b) => sum + (Number(b.board_qty) || 0), 0) +
      cncPartsOut.reduce((sum, c) => sum + (Number(c.quantity) || 0), 0) +
      Object.values(form.approxQuantity).reduce((sum, v) => sum + (Number(v) || 0), 0);

    const specs = {
      services: form.services,
      material_supply: form.materialSupply,
      cables,
      boards,
      cnc_parts: cncPartsOut,
      section_modes: form.sectionModes,
      approx_quantity: form.approxQuantity,
      attachments: [] as Attachment[],
    };

    // Mint the id client-side so it can be sent to WhatsApp / the "attachments"
    // patch below without relying on `.select().single()` — PostgREST filters
    // RETURNING through the table's SELECT policy, and a public anon insert
    // has no SELECT grant, so reading the row back after insert 403s (PGRST116).
    const quoteId = crypto.randomUUID();
    const reference = `Q-${quoteId.slice(0, 8).toUpperCase()}`;

    const { error: insertError } = await supabase
      .from("quote_requests")
      .insert({
        id: quoteId,
        contact_name: form.name,
        company_name: form.company || form.name,
        phone: form.phone,
        email: form.email,
        gstin: form.gstin || null,
        service_type: form.services[0],
        quantity: quantity || null,
        specs,
        message: form.notes || null,
        status: "new",
        customer_id: user?.id ?? null,
      });

    if (insertError) throw insertError;

    // Uploads are best-effort: a failed attachment must not discard a quote
    // that's already saved to the DB. Collect failures instead of throwing.
    const failedUploads: string[] = [];
    const attachments: Attachment[] = [];
    for (const section of form.services) {
      for (const file of sectionFiles[section]) {
        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        const path = `quotes/${quoteId}/${section}/${crypto.randomUUID()}_${safeName}`;
        const { error: uploadError } = await supabase.storage.from("quote_attachments").upload(path, file);
        if (uploadError) {
          failedUploads.push(`${file.name} (${SERVICES.find((s) => s.key === section)?.label ?? section})`);
          continue;
        }
        attachments.push({ section, filename: file.name, size: file.size, storage_path: path, uploaded_at: new Date().toISOString() });
      }
    }
    for (const file of designFiles) {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `quotes/${quoteId}/general/${crypto.randomUUID()}_${safeName}`;
      const { error: uploadError } = await supabase.storage.from("quote_attachments").upload(path, file);
      if (uploadError) {
        failedUploads.push(`${file.name} (General Attachment)`);
        continue;
      }
      attachments.push({ section: "general", filename: file.name, size: file.size, storage_path: path, uploaded_at: new Date().toISOString() });
    }

    if (attachments.length > 0) {
      await supabase.from("quote_requests").update({ specs: { ...specs, attachments } }).eq("id", quoteId);
    }

    // Non-fatal lead capture for the not-yet-live CNC service. The
    // service_notifications table is being created by a separate migration —
    // if it isn't there yet this just warns, it never blocks the quote.
    if (form.notifyCnc) {
      try {
        const { error } = await supabase.from("service_notifications").insert({ email: form.email, service: "cnc" });
        if (error) console.warn("service_notifications insert failed:", error);
      } catch (err) {
        console.warn("service_notifications insert failed:", err);
      }
    }

    return { id: quoteId, reference, failedUploads };
  }

  // Supabase rejects with plain objects ({message, code, hint, details}),
  // not Error instances, so `instanceof Error` alone hides the real cause.
  const describeError = (err: unknown, fallback: string): string => {
    // Full detail goes to the console for debugging — raw Supabase/Postgrest
    // error text (column names, codes) should never reach a visitor.
    console.error("Quote submission failed:", err);
    if (err instanceof Error && err.message && !/^\{|column|PGRST/i.test(err.message)) return err.message;
    return fallback;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSubmitting(true);
    try {
      const { reference, failedUploads } = await saveQuote();
      setSubmitted({ reference, failedUploads });
    } catch (err) {
      setFormError(describeError(err, "Something went wrong. Please try again or email us directly."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleWhatsApp = async () => {
    setFormError(null);
    setSubmitting(true);
    try {
      const { reference, failedUploads } = await saveQuote();
      const text = formatQuoteText(form, reference);
      window.open(`https://wa.me/${COMPANY.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
      setSubmitted({ reference, failedUploads });
    } catch (err) {
      setFormError(describeError(err, "Could not save your quote before opening WhatsApp — please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="cl-card text-center py-16 px-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F0FDF4] border border-[#BBF7D0] mb-6">
          <Check className="w-8 h-8 text-[#16A34A]" />
        </div>
        <h3 className="text-2xl font-bold text-[#111111] mb-2">Quote Request Sent!</h3>
        <p className="text-[#555555] mb-1">Reference: <span className="font-mono font-bold">{submitted.reference}</span></p>
        {submitted.failedUploads.length > 0 ? (
          <p className="text-[#B91C1C] mb-6 max-w-md mx-auto text-sm">
            Quote saved as {submitted.reference}, but {submitted.failedUploads.length} file(s) couldn&apos;t be attached — reply to our confirmation email with them.
          </p>
        ) : (
          <p className="text-[#555555] mb-6 max-w-md mx-auto">
            We&apos;ll review your requirements and get back to you within 24 hours.
          </p>
        )}
        <button
          type="button"
          className="btn-outline-white"
          style={{ color: "#111111", borderColor: "#111111" }}
          onClick={() => {
            setForm(initialForm);
            setSectionFiles({ wire_cable: [], pcb: [], cnc: [] });
            setDesignFiles([]);
            setSubmitted(null);
          }}
        >
          Submit Another Quote
        </button>
      </div>
    );
  }

  return (
    <div className="cl-card overflow-hidden">
      {/* Header */}
      <div className="p-6 lg:p-8 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-5 h-5 text-[#DC2626]" />
          <h3 className="text-xl font-bold text-[#111111]">Build Your Quote Request</h3>
        </div>
        <p className="text-sm text-[#555555]">
          Select your requirements below — we&apos;ll get back to you with a detailed quotation within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
        {/* Services */}
        <div>
          <label className={fieldLabel.replace("mb-2", "mb-3")}>Services Needed</label>
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((s) => (
              <SelectableButton key={s.key} selected={form.services.includes(s.key)} onClick={() => toggleService(s.key)}>
                {s.label}
              </SelectableButton>
            ))}
          </div>
        </div>

        {/* ── Wire / Cable ── */}
        {form.services.includes("wire_cable") && (
          <SectionBlock
            title="Wire / Cable"
            mode={form.sectionModes.wire_cable}
            onModeChange={(m) => setMode("wire_cable", m)}
            files={sectionFiles.wire_cable}
            fileError={fileErrors.wire_cable}
            onFilesSelected={(f) => onFilesSelected("wire_cable", f)}
            onRemoveFile={(i) => removeFile("wire_cable", i)}
            approxQty={form.approxQuantity.wire_cable}
            onApproxQtyChange={(v) => update("approxQuantity", { ...form.approxQuantity, wire_cable: v })}
          >
            <div className="space-y-5">
              {form.cables.map((cable, idx) => (
                <div key={cable.id} className="p-4 rounded-md border border-[#E0E0E0] bg-[#FAFAFA] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#555555] uppercase tracking-wider">Cable {idx + 1}</span>
                    {form.cables.length > 1 && (
                      <button type="button" onClick={() => removeRow("cables", cable.id)} aria-label="Remove cable" className="p-2 rounded-md text-[#A3A3A3] hover:text-[#DC2626] hover:bg-[#FEF2F2] min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <SelectInput label="Cable Type" id={`cable-type-${cable.id}`} value={cable.cable_type} onChange={(v) => updateRow("cables", cable.id, { cable_type: v })} options={CABLE_TYPE_OPTIONS} />
                    <TextInput label="Length (mm)" id={`cable-length-${cable.id}`} value={cable.length_mm} onChange={(v) => updateRow("cables", cable.id, { length_mm: v })} type="number" min="1" placeholder="300" />
                    <TextInput label="Quantity" id={`cable-qty-${cable.id}`} value={cable.quantity} onChange={(v) => updateRow("cables", cable.id, { quantity: v })} type="number" min="1" placeholder="100" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-md bg-white border border-[#E0E0E0] space-y-3">
                      <p className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">End A</p>
                      <SelectInput label="Connector" id={`end-a-conn-${cable.id}`} value={cable.end_a_connector} onChange={(v) => updateRow("cables", cable.id, { end_a_connector: v })} options={CONNECTOR_OPTIONS} />
                      <SelectInput label="Crimping" id={`end-a-crimp-${cable.id}`} value={cable.end_a_crimping} onChange={(v) => updateRow("cables", cable.id, { end_a_crimping: v })} options={CRIMPING_OPTIONS} />
                    </div>
                    <div className="p-3 rounded-md bg-white border border-[#E0E0E0] space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-[#DC2626] uppercase tracking-wider">End B</p>
                        <label className="flex items-center gap-1.5 text-xs text-[#555555] cursor-pointer">
                          <input type="checkbox" checked={cable.has_end_b} onChange={(e) => updateRow("cables", cable.id, { has_end_b: e.target.checked })} />
                          Terminated
                        </label>
                      </div>
                      {cable.has_end_b ? (
                        <>
                          <SelectInput label="Connector" id={`end-b-conn-${cable.id}`} value={cable.end_b_connector} onChange={(v) => updateRow("cables", cable.id, { end_b_connector: v })} options={CONNECTOR_OPTIONS} />
                          <SelectInput label="Crimping" id={`end-b-crimp-${cable.id}`} value={cable.end_b_crimping} onChange={(v) => updateRow("cables", cable.id, { end_b_crimping: v })} options={CRIMPING_OPTIONS} />
                        </>
                      ) : (
                        <p className="text-xs text-[#767676]">Open / pigtail end. More than 2 terminations? Describe in Additional Notes.</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className={fieldLabel}>Processing</label>
                    <div className="flex flex-wrap gap-2">
                      {PROCESSING_OPTIONS.map((item) => (
                        <SelectableButton key={item} compact selected={cable.processing.includes(item)} onClick={() => toggleCableProcessing(cable.id, item)}>
                          {item}
                        </SelectableButton>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addRow("cables", newCable())} className="inline-flex items-center gap-1.5 text-sm text-[#DC2626] hover:text-[#B91C1C] font-medium">
                <Plus className="w-3.5 h-3.5" /> Add another cable
              </button>
            </div>
          </SectionBlock>
        )}

        {/* ── PCB ── */}
        {form.services.includes("pcb") && (
          <SectionBlock
            title="PCB Assembly"
            mode={form.sectionModes.pcb}
            onModeChange={(m) => setMode("pcb", m)}
            files={sectionFiles.pcb}
            fileError={fileErrors.pcb}
            onFilesSelected={(f) => onFilesSelected("pcb", f)}
            onRemoveFile={(i) => removeFile("pcb", i)}
            approxQty={form.approxQuantity.pcb}
            onApproxQtyChange={(v) => update("approxQuantity", { ...form.approxQuantity, pcb: v })}
          >
            <div className="space-y-4">
              {form.boards.map((board, idx) => (
                <div key={board.id} className="p-4 rounded-md border border-[#E0E0E0] bg-[#FAFAFA] space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#555555] uppercase tracking-wider">Board {idx + 1}</span>
                    {form.boards.length > 1 && (
                      <button type="button" onClick={() => removeRow("boards", board.id)} aria-label="Remove board" className="p-2 rounded-md text-[#A3A3A3] hover:text-[#DC2626] hover:bg-[#FEF2F2] min-h-[44px] min-w-[44px] flex items-center justify-center">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectInput label="Assembly Type" id={`pcb-type-${board.id}`} value={board.pcb_type} onChange={(v) => updateRow("boards", board.id, { pcb_type: v })} options={PCB_TYPE_OPTIONS} />
                    <TextInput label="Board Quantity" id={`board-qty-${board.id}`} value={board.board_qty} onChange={(v) => updateRow("boards", board.id, { board_qty: v })} type="number" min="1" placeholder="200" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={() => addRow("boards", newBoard())} className="inline-flex items-center gap-1.5 text-sm text-[#DC2626] hover:text-[#B91C1C] font-medium">
                <Plus className="w-3.5 h-3.5" /> Add another board
              </button>
            </div>
          </SectionBlock>
        )}

        {/* ── CNC — not live yet, capture the lead instead of a form ── */}
        {form.services.includes("cnc") && (
          <div className="space-y-4 p-5 rounded-md border border-[#E0E0E0] bg-[#FAFAFA]">
            <h4 className="text-sm font-bold text-[#DC2626] uppercase tracking-wider">CNC Manufacturing</h4>
            <p className="text-sm text-[#555555]">
              CNC Manufacturing is coming soon. Want us to notify you when it launches?
            </p>
            <label className="flex items-center gap-2 text-sm text-[#1A1A1A] cursor-pointer">
              <input
                type="checkbox"
                checked={form.notifyCnc}
                onChange={(e) => update("notifyCnc", e.target.checked)}
              />
              Notify me when this launches
            </label>
          </div>
        )}

        {/* ── Material Supply ── */}
        <div>
          <label className={fieldLabel.replace("mb-2", "mb-3")}>Material Supply</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RAW_MATERIAL_OPTIONS.options.map((opt) => (
              <SelectableButton key={opt.id} selected={form.materialSupply === opt.id} onClick={() => update("materialSupply", opt.id)}>
                <span className="block">
                  <span className="block text-sm font-semibold mb-0.5">{opt.label}</span>
                  <span className="block text-xs font-normal opacity-80 leading-relaxed">{opt.description}</span>
                </span>
              </SelectableButton>
            ))}
          </div>
        </div>

        {/* ── Notes ── */}
        <div>
          <label htmlFor="notes" className={fieldLabel}>Additional Notes</label>
          <textarea
            id="notes" value={form.notes} onChange={(e) => update("notes", e.target.value)}
            rows={3} placeholder="Any special requirements, BOM reference, drawings…"
            className={`${fieldBase} resize-y`}
          />
        </div>

        {/* ── General Design File ── */}
        <div>
          <label className={fieldLabel}>Design File / Drawing (Optional, general)</label>
          <div className="p-4 rounded-md border border-dashed border-[#D4D4D4] bg-[#FAFAFA] space-y-3">
            <input
              type="file"
              id="file-upload"
              multiple
              onChange={(e) => { onDesignFilesSelected(e.target.files); e.target.value = ""; }}
              className="text-sm text-[#555555]"
            />
            {designFileError && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {designFileError}</p>}
            <FileList files={designFiles} onRemove={removeDesignFile} />
          </div>
          <p className="mt-2 text-xs text-[#767676]">A catch-all for anything not covered by the per-section uploads above.</p>
        </div>

        <div className="h-px bg-[#E0E0E0]" />

        {/* ── Contact ── */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-[#111111] uppercase tracking-wider">Your Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextInput label="Name" id="name" value={form.name} onChange={(v) => update("name", v)} required placeholder="John Doe" />
            <TextInput label="Company" id="company" value={form.company} onChange={(v) => update("company", v)} placeholder="Acme Electronics" />
            <TextInput label="Email" id="email" value={form.email} onChange={(v) => update("email", v)} type="email" required placeholder="john@example.com" />
            <TextInput label="Phone" id="phone" value={form.phone} onChange={(v) => update("phone", v)} type="tel" placeholder="+91 98765 43210" />
            <TextInput label="GSTIN (optional)" id="gstin" value={form.gstin} onChange={(v) => update("gstin", v)} placeholder="22AAAAA0000A1Z5" />
          </div>
        </div>

        {formError && (
          <div className="flex items-start gap-2 p-4 rounded-md bg-[#FEF2F2] border border-[#FECACA] text-sm text-[#B91C1C]">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button type="submit" disabled={submitting} className="btn-amber flex-1 min-h-[44px] disabled:opacity-60">
            <Send className="w-4 h-4 mr-2" /> {submitting ? "Sending…" : "Send Quote Request"}
          </button>
          <button type="button" onClick={handleWhatsApp} disabled={submitting} className="btn-outline-white flex-1 min-h-[44px] disabled:opacity-60" style={{ color: "#111111", borderColor: "#111111" }}>
            <MessageCircle className="w-4 h-4 mr-2" /> Send via WhatsApp
          </button>
        </div>

        <p className="text-xs text-[#767676] text-center">
          Or email us directly at{" "}
          <a href={`mailto:${COMPANY.inquiryEmail}`} className="text-[#DC2626] hover:underline">{COMPANY.inquiryEmail}</a>
        </p>
      </form>
    </div>
  );
}

// ── Section wrapper: mode switch + line items OR upload dropzone ──

function SectionBlock({
  title, mode, onModeChange, children, files, fileError, onFilesSelected, onRemoveFile, approxQty, onApproxQtyChange,
}: {
  title: string;
  mode: SectionMode;
  onModeChange: (m: SectionMode) => void;
  children: React.ReactNode;
  files: File[];
  fileError: string | null;
  onFilesSelected: (files: FileList | null) => void;
  onRemoveFile: (index: number) => void;
  approxQty: string;
  onApproxQtyChange: (v: string) => void;
}) {
  return (
    <div className="space-y-5 p-5 rounded-md border border-[#E0E0E0]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h4 className="text-sm font-bold text-[#DC2626] uppercase tracking-wider">{title}</h4>
        <div className="flex gap-2">
          <SelectableButton compact selected={mode === "form"} onClick={() => onModeChange("form")}>Fill in details</SelectableButton>
          <SelectableButton compact selected={mode === "upload"} onClick={() => onModeChange("upload")}>Upload a sheet</SelectableButton>
        </div>
      </div>

      {mode === "form" ? (
        children
      ) : (
        <div className="space-y-3">
          <label
            htmlFor={`upload-${title}`}
            className="flex flex-col items-center justify-center gap-2 p-8 rounded-md border-2 border-dashed border-[#D4D4D4] bg-[#FAFAFA] hover:border-[#DC2626] cursor-pointer transition-colors text-center"
          >
            <Upload className="w-6 h-6 text-[#A3A3A3]" />
            <span className="text-sm text-[#555555]">Click to attach a BOM, spec sheet, or drawing</span>
            <span className="text-xs text-[#A3A3A3]">.xlsx .xls .csv .pdf .doc .docx images .step .stp .dxf — up to {MAX_FILE_MB}MB each</span>
          </label>
          <input
            id={`upload-${title}`} type="file" multiple className="sr-only"
            onChange={(e) => { onFilesSelected(e.target.files); e.target.value = ""; }}
          />
          {fileError && <p className="text-xs text-[#DC2626] flex items-center gap-1"><AlertCircle className="w-3.5 h-3.5" /> {fileError}</p>}
          <FileList files={files} onRemove={onRemoveFile} />
          <div className="max-w-[220px]">
            <TextInput label="Approx. total quantity (optional)" id={`approx-${title}`} value={approxQty} onChange={onApproxQtyChange} type="number" min="1" placeholder="e.g. 500" />
          </div>
        </div>
      )}
    </div>
  );
}
