"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, User, Save, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Profile {
  id: string;
  company_name: string;
  contact_name: string | null;
  phone: string | null;
  email: string | null;
  gstin: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
}

export default function ProfilePageClient({ profile }: { profile: Profile }) {
  const router = useRouter();
  const [form, setForm] = useState({
    company_name: profile.company_name ?? "",
    contact_name: profile.contact_name ?? "",
    phone: profile.phone ?? "",
    gstin: profile.gstin ?? "",
    address: profile.address ?? "",
    city: profile.city ?? "",
    state: profile.state ?? "",
    pincode: profile.pincode ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm(f => ({ ...f, [field]: e.target.value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: updateError } = await supabase.from("profiles").update(form).eq("id", profile.id);
    if (updateError) { setError(updateError.message); setSaving(false); return; }
    setSaved(true);
    setTimeout(() => { setSaved(false); router.refresh(); }, 2000);
    setSaving(false);
  }

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-bg-tertiary/40 border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/30 transition-colors";
  const labelClass = "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5";

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-2">
          <Link href="/portal" className="text-text-muted hover:text-accent-primary transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest">My Portal</p>
        </div>
        <h1 className="font-display text-3xl font-bold text-text-primary mb-8 flex items-center gap-3">
          <User className="w-7 h-7 text-accent-primary" /> My Profile
        </h1>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Company Details */}
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Company Details</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input required type="text" value={form.company_name} onChange={update("company_name")}
                  placeholder="Your company name" className={inputClass} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Contact Person</label>
                  <input type="text" value={form.contact_name} onChange={update("contact_name")}
                    placeholder="Your name" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Phone</label>
                  <input type="tel" value={form.phone} onChange={update("phone")}
                    placeholder="+91 98765 43210" className={inputClass} />
                </div>
              </div>
              <div>
                <label className={labelClass}>GSTIN (optional)</label>
                <input type="text" value={form.gstin} onChange={update("gstin")}
                  placeholder="22AAAAA0000A1Z5" className={`${inputClass} font-mono`} />
                <p className="text-xs text-text-muted mt-1">Required for GST invoices on your orders.</p>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="glass-card p-6">
            <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-4">Billing Address</p>
            <div className="space-y-4">
              <div>
                <label className={labelClass}>Street Address</label>
                <input type="text" value={form.address} onChange={update("address")}
                  placeholder="Plot no., Street, Area" className={inputClass} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>City</label>
                  <input type="text" value={form.city} onChange={update("city")}
                    placeholder="City" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>State</label>
                  <input type="text" value={form.state} onChange={update("state")}
                    placeholder="State" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>PIN Code</label>
                  <input type="text" value={form.pincode} onChange={update("pincode")}
                    placeholder="414001" className={inputClass} />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-3">{error}</p>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving}
              className="btn-glow flex items-center gap-2 px-6 py-3 disabled:opacity-60">
              {saved ? <><CheckCircle className="w-4 h-4" /> Saved!</> :
                saving ? <span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" /> :
                  <><Save className="w-4 h-4" /> Save Profile</>}
            </button>
            <p className="text-xs text-text-muted">Email changes not allowed here — contact support</p>
          </div>
        </form>
      </div>
    </div>
  );
}
