"use client";

import React, { useState } from "react";
import {
  Send,
  Copy,
  Plus,
  Trash2,
  Check,
  ClipboardList,
} from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";
import { createClient } from "@/lib/supabase/client";
import {
  CABLE_TYPE_OPTIONS,
  CONNECTOR_OPTIONS,
  CRIMPING_OPTIONS,
  PROCESSING_OPTIONS,
  PCB_TYPE_OPTIONS,
  RAW_MATERIAL_OPTIONS,
  CNC_TYPE_OPTIONS,
  CNC_MATERIAL_OPTIONS,
} from "@/lib/serviceData";

type ServiceType = "wire_cable" | "pcb" | "both" | "cnc";

interface ConnectorEntry {
  id: string;
  type: string;
  qty: string;
}

interface QuoteFormData {
  serviceType: ServiceType;
  // Wire/Cable
  cableType: string;
  connectors: ConnectorEntry[];
  crimping: string;
  processing: string[];
  cableLength: string;
  // PCB
  pcbType: string;
  boardQty: string;
  // CNC
  cncType: string;
  cncMaterial: string;
  cncQty: string;
  // Common
  materialSupply: string;
  notes: string;
  // Contact
  name: string;
  company: string;
  email: string;
  phone: string;
  gstin: string;
}

const initialForm: QuoteFormData = {
  serviceType: "wire_cable",
  cableType: "",
  connectors: [{ id: "1", type: "", qty: "" }],
  crimping: "",
  processing: [],
  cableLength: "",
  pcbType: "",
  boardQty: "",
  cncType: "",
  cncMaterial: "",
  cncQty: "",
  materialSupply: "buyer",
  notes: "",
  name: "",
  company: "",
  email: "",
  phone: "",
  gstin: "",
};

function SelectInput({
  label,
  value,
  onChange,
  options,
  placeholder = "Select…",
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder?: string;
  id: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 12px center",
        }}
      >
        <option value="" className="bg-bg-primary">
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-bg-primary">
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function TextInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  id,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  id: string;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
      >
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all"
      />
    </div>
  );
}

function formatQuoteText(form: QuoteFormData): string {
  const lines: string[] = [];
  lines.push("=== QUOTE REQUEST ===");
  lines.push(`Service Type: ${form.serviceType.replace("_", " / ").toUpperCase()}`);
  lines.push("");

  if (form.serviceType === "wire_cable" || form.serviceType === "both") {
    lines.push("── Wire / Cable ──");
    if (form.cableType) lines.push(`Cable Type: ${form.cableType}`);
    form.connectors.forEach((c, i) => {
      if (c.type) lines.push(`Connector ${i + 1}: ${c.type}${c.qty ? ` × ${c.qty}` : ""}`);
    });
    if (form.crimping) lines.push(`Crimping: ${form.crimping}`);
    if (form.processing.length) lines.push(`Processing: ${form.processing.join(", ")}`);
    if (form.cableLength) lines.push(`Cable Length: ${form.cableLength} mm`);
    lines.push("");
  }

  if (form.serviceType === "pcb" || form.serviceType === "both") {
    lines.push("── PCB Assembly ──");
    if (form.pcbType) lines.push(`Assembly Type: ${form.pcbType}`);
    if (form.boardQty) lines.push(`Board Qty: ${form.boardQty}`);
    lines.push("");
  }

  if (form.serviceType === "cnc") {
    lines.push("── CNC Manufacturing ──");
    if (form.cncType) lines.push(`Manufacturing Type: ${form.cncType}`);
    if (form.cncMaterial) lines.push(`Material: ${form.cncMaterial}`);
    if (form.cncQty) lines.push(`Quantity: ${form.cncQty}`);
    lines.push("");
  }

  lines.push(`Material Supply: ${form.materialSupply}`);
  if (form.notes) {
    lines.push(`Notes: ${form.notes}`);
  }
  lines.push("");
  lines.push("── Contact ──");
  lines.push(`Name: ${form.name}`);
  if (form.company) lines.push(`Company: ${form.company}`);
  lines.push(`Email: ${form.email}`);
  if (form.phone) lines.push(`Phone: ${form.phone}`);
  lines.push("===================");
  return lines.join("\n");
}

export default function QuoteBuilder() {
  const [form, setForm] = useState<QuoteFormData>(initialForm);
  const [copied, setCopied] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [designFile, setDesignFile] = useState<File | null>(null);

  const update = <K extends keyof QuoteFormData>(
    key: K,
    value: QuoteFormData[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addConnector = () => {
    update("connectors", [
      ...form.connectors,
      { id: String(Date.now()), type: "", qty: "" },
    ]);
  };

  const removeConnector = (id: string) => {
    if (form.connectors.length <= 1) return;
    update(
      "connectors",
      form.connectors.filter((c) => c.id !== id)
    );
  };

  const updateConnector = (
    id: string,
    field: "type" | "qty",
    value: string
  ) => {
    update(
      "connectors",
      form.connectors.map((c) => (c.id === id ? { ...c, [field]: value } : c))
    );
  };

  const toggleProcessing = (item: string) => {
    update(
      "processing",
      form.processing.includes(item)
        ? form.processing.filter((p) => p !== item)
        : [...form.processing, item]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const supabase = createClient();

      // Check if user is logged in to link quote to their profile
      const { data: { user } } = await supabase.auth.getUser();

      // Handle Design File Upload
      let designFileUrl = null;
      if (designFile) {
        const fileExt = designFile.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from("quote_documents")
          .upload(fileName, designFile);
        
        if (uploadError) throw uploadError;
        
        const { data: { publicUrl } } = supabase.storage
          .from("quote_documents")
          .getPublicUrl(fileName);
          
        designFileUrl = publicUrl;
      }

      const specs = {
        ...(form.serviceType === "wire_cable" || form.serviceType === "both" ? {
          cable_type: form.cableType,
          connectors: form.connectors.filter(c => c.type),
          crimping: form.crimping,
          processing: form.processing,
          cable_length_mm: form.cableLength,
        } : {}),
        ...(form.serviceType === "pcb" || form.serviceType === "both" ? {
          pcb_type: form.pcbType,
          board_qty: form.boardQty,
        } : {}),
        ...(form.serviceType === "cnc" ? {
          cnc_type: form.cncType,
          cnc_material: form.cncMaterial,
          cnc_qty: form.cncQty,
        } : {}),
        material_supply: form.materialSupply,
      };

      const { error: insertError } = await supabase.from("quote_requests").insert({
        contact_name: form.name,
        company_name: form.company || form.name,
        phone: form.phone,
        email: form.email,
        gstin: form.gstin || null,
        service_type: form.serviceType === "both" ? "wire_cable" : form.serviceType,
        quantity: null,
        specs,
        message: form.notes || null,
        status: "new",
        customer_id: user?.id ?? null,
        design_file_url: designFileUrl,
      });

      if (insertError) throw insertError;
      setSubmitted(true);
    } catch (err) {
      console.error("Quote submission error:", err);
      // Fallback to email
      handleCopyAndEmail();
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyAndEmail = async () => {
    const text = formatQuoteText(form);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // fallback
    }

    const subject = encodeURIComponent(
      `Quote Request — ${form.serviceType.replace("_", " / ")}`
    );
    const body = encodeURIComponent(text);
    window.open(
      `mailto:${COMPANY.inquiryEmail}?subject=${subject}&body=${body}`,
      "_self"
    );
  };

  if (submitted) {
    return (
      <Card padding="lg" className="text-center py-16">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/15 border border-green-500/30 mb-6">
          <Check className="w-8 h-8 text-green-400" />
        </div>
        <h3 className="font-display text-2xl font-bold text-text-primary mb-3">
          Quote Request Sent!
        </h3>
        <p className="text-text-secondary mb-6 max-w-md mx-auto">
          We&apos;ll review your requirements and get back to you within 24
          hours. Check your email for a confirmation.
        </p>
        <Button
          variant="outline"
          onClick={() => {
            setForm(initialForm);
            setDesignFile(null);
            setSubmitted(false);
          }}
        >
          Submit Another Quote
        </Button>
      </Card>
    );
  }

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header */}
      <div className="p-6 lg:p-8 border-b border-border-subtle bg-gradient-to-r from-accent-primary/5 to-accent-secondary/5">
        <div className="flex items-center gap-3 mb-2">
          <ClipboardList className="w-5 h-5 text-accent-primary" />
          <h3 className="font-display text-xl font-bold text-text-primary">
            Build Your Quote Request
          </h3>
        </div>
        <p className="text-sm text-text-secondary">
          Select your requirements below — we&apos;ll get back to you with a
          detailed quotation within 24 hours.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 lg:p-8 space-y-8">
        {/* Service Type */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Service Type
          </label>
          <div className="flex flex-wrap gap-3">
            {(
              [
                { value: "wire_cable", label: "Wire / Cable" },
                { value: "pcb", label: "PCB Assembly" },
                { value: "cnc", label: "CNC Manufacturing" },
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => update("serviceType", opt.value)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  form.serviceType === opt.value || (form.serviceType === "both" && opt.value !== "cnc")
                    ? "bg-accent-primary/15 border-accent-primary text-accent-primary"
                    : "bg-transparent border-border-subtle text-text-secondary hover:border-text-muted"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Wire / Cable Options ── */}
        {(form.serviceType === "wire_cable" || form.serviceType === "both") && (
          <div className="space-y-6 p-5 rounded-2xl border border-border-subtle bg-bg-primary/30">
            <h4 className="text-sm font-bold text-accent-primary uppercase tracking-wider">
              Wire / Cable Options
            </h4>

            <SelectInput
              label="Cable Type"
              id="cable-type"
              value={form.cableType}
              onChange={(v) => update("cableType", v)}
              options={CABLE_TYPE_OPTIONS}
            />

            {/* Connectors */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Connectors
              </label>
              <div className="space-y-3">
                {form.connectors.map((conn, idx) => (
                  <div
                    key={conn.id}
                    className="flex items-end gap-3 flex-wrap sm:flex-nowrap"
                  >
                    <div className="flex-1 min-w-[180px]">
                      <SelectInput
                        label={`Connector ${idx + 1}`}
                        id={`connector-${conn.id}`}
                        value={conn.type}
                        onChange={(v) => updateConnector(conn.id, "type", v)}
                        options={CONNECTOR_OPTIONS}
                      />
                    </div>
                    <div className="w-24">
                      <TextInput
                        label="Qty"
                        id={`connector-qty-${conn.id}`}
                        value={conn.qty}
                        onChange={(v) => updateConnector(conn.id, "qty", v)}
                        type="number"
                        placeholder="100"
                      />
                    </div>
                    {form.connectors.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeConnector(conn.id)}
                        className="p-2.5 rounded-xl text-text-muted hover:text-red-400 hover:bg-red-400/10 transition-colors"
                        aria-label="Remove connector"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addConnector}
                  className="inline-flex items-center gap-1.5 text-sm text-accent-primary hover:text-accent-primary/80 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add connector
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectInput
                label="Crimping"
                id="crimping"
                value={form.crimping}
                onChange={(v) => update("crimping", v)}
                options={CRIMPING_OPTIONS}
              />
              <TextInput
                label="Cable Length (mm)"
                id="cable-length"
                value={form.cableLength}
                onChange={(v) => update("cableLength", v)}
                type="number"
                placeholder="300"
              />
            </div>

            {/* Processing checkboxes */}
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
                Processing
              </label>
              <div className="flex flex-wrap gap-2">
                {PROCESSING_OPTIONS.map((item) => {
                  const isSelected = form.processing.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleProcessing(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200 ${
                        isSelected
                          ? "bg-accent-primary/15 border-accent-primary/40 text-accent-primary"
                          : "bg-transparent border-border-subtle text-text-muted hover:border-text-muted hover:text-text-secondary"
                      }`}
                    >
                      {isSelected ? "✓ " : ""}
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── PCB Assembly Options ── */}
        {(form.serviceType === "pcb" || form.serviceType === "both") && (
          <div className="space-y-6 p-5 rounded-2xl border border-border-subtle bg-bg-primary/30">
            <h4 className="text-sm font-bold text-accent-secondary uppercase tracking-wider">
              PCB Assembly
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectInput
                label="Assembly Type"
                id="pcb-type"
                value={form.pcbType}
                onChange={(v) => update("pcbType", v)}
                options={PCB_TYPE_OPTIONS}
              />
              <TextInput
                label="Board Quantity"
                id="board-qty"
                value={form.boardQty}
                onChange={(v) => update("boardQty", v)}
                type="number"
                placeholder="200"
              />
            </div>
          </div>
        )}

        {/* ── CNC Options ── */}
        {form.serviceType === "cnc" && (
          <div className="space-y-6 p-5 rounded-2xl border border-border-subtle bg-bg-primary/30">
            <h4 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
              CNC Manufacturing
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SelectInput
                label="Manufacturing Type"
                id="cnc-type"
                value={form.cncType}
                onChange={(v) => update("cncType", v)}
                options={CNC_TYPE_OPTIONS}
              />
              <SelectInput
                label="Material Preference"
                id="cnc-material"
                value={form.cncMaterial}
                onChange={(v) => update("cncMaterial", v)}
                options={CNC_MATERIAL_OPTIONS}
              />
            </div>
            <div className="w-1/2 pr-3">
              <TextInput
                label="Quantity"
                id="cnc-qty"
                value={form.cncQty}
                onChange={(v) => update("cncQty", v)}
                type="number"
                placeholder="100"
              />
            </div>
          </div>
        )}

        {/* ── Material Supply ── */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3">
            Material Supply
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {RAW_MATERIAL_OPTIONS.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => update("materialSupply", opt.id)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  form.materialSupply === opt.id
                    ? "bg-accent-primary/10 border-accent-primary/40"
                    : "border-border-subtle hover:border-text-muted"
                }`}
              >
                <div
                  className={`text-sm font-semibold mb-1 ${
                    form.materialSupply === opt.id
                      ? "text-accent-primary"
                      : "text-text-primary"
                  }`}
                >
                  {opt.label}
                </div>
                <div className="text-xs text-text-muted leading-relaxed">
                  {opt.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Notes ── */}
        <div>
          <label
            htmlFor="notes"
            className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
          >
            Additional Notes
          </label>
          <textarea
            id="notes"
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            rows={3}
            placeholder="Any special requirements, BOM reference, drawings…"
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all resize-y"
          />
        </div>

        {/* ── Design File Upload ── */}
        <div>
          <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
            Design File / Drawing (Optional)
          </label>
          <div className="flex items-center gap-4 p-4 rounded-xl border border-dashed border-border-subtle bg-bg-primary/20">
            <input
              type="file"
              id="file-upload"
              onChange={(e) => setDesignFile(e.target.files?.[0] || null)}
              className="text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-accent-primary/10 file:text-accent-primary hover:file:bg-accent-primary/20 transition-colors"
            />
            {designFile && (
              <button
                type="button"
                onClick={() => setDesignFile(null)}
                className="text-text-muted hover:text-red-400 p-2"
                aria-label="Remove file"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="mt-2 text-xs text-text-muted">
            Upload CAD files, PDFs, images, or STEP models for an accurate quote. Max 10MB.
          </p>
        </div>

        {/* ── Divider ── */}
        <div className="section-divider" />

        {/* ── Contact Info ── */}
        <div className="space-y-6">
          <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider">
            Your Details
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <TextInput
              label="Name"
              id="name"
              value={form.name}
              onChange={(v) => update("name", v)}
              required
              placeholder="John Doe"
            />
            <TextInput
              label="Company"
              id="company"
              value={form.company}
              onChange={(v) => update("company", v)}
              placeholder="Acme Electronics"
            />
            <TextInput
              label="Email"
              id="email"
              value={form.email}
              onChange={(v) => update("email", v)}
              type="email"
              required
              placeholder="john@example.com"
            />
            <TextInput
              label="Phone"
              id="phone"
              value={form.phone}
              onChange={(v) => update("phone", v)}
              type="tel"
              placeholder="+91 98765 43210"
            />
            <TextInput
              label="GSTIN (optional)"
              id="gstin"
              value={form.gstin}
              onChange={(v) => update("gstin", v)}
              placeholder="22AAAAA0000A1Z5"
            />
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            icon={<Send className="w-4 h-4" />}
            disabled={submitting}
            className="flex-1"
          >
            {submitting ? "Sending…" : "Send Quote Request"}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="lg"
            icon={
              copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )
            }
            onClick={handleCopyAndEmail}
            className="flex-1"
          >
            {copied ? "Copied!" : "Copy & Email"}
          </Button>
        </div>

        <p className="text-xs text-text-muted text-center">
          Or email us directly at{" "}
          <a
            href={`mailto:${COMPANY.inquiryEmail}`}
            className="text-accent-primary hover:underline"
          >
            {COMPANY.inquiryEmail}
          </a>
        </p>
      </form>
    </Card>
  );
}
