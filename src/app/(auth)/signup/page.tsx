"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, Building2, Phone, Mail, Lock, Eye, EyeOff, FileText, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FormData {
  contactName: string;
  companyName: string;
  phone: string;
  email: string;
  gstin: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  password: string;
  confirmPassword: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({
    contactName: "", companyName: "", phone: "", email: "",
    gstin: "", address: "", city: "", state: "", pincode: "",
    password: "", confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function update(field: keyof FormData) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    // Check if Supabase is configured
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL === "your-supabase-project-url"
    ) {
      setError("⚠️ Supabase is not configured yet. Please add your project URL and anon key to .env.local and restart the server.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError || !authData.user) {
        setError(authError?.message ?? "Signup failed. Please try again.");
        setLoading(false);
        return;
      }

      // 2. Update profile details (trigger auto-created the profile row)
      await supabase.from("profiles").update({
        contact_name: form.contactName,
        company_name: form.companyName,
        phone: form.phone,
        gstin: form.gstin || null,
        address: form.address,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
      }).eq("id", authData.user.id);

      // Redirect to portal immediately
      window.location.href = "/portal";

    } catch (err) {
      console.error("Signup error:", err);
      setError("Could not connect to the server. Please check your internet connection and try again.");
    } finally {
      setLoading(false);
    }
  }


  const inputClass = "w-full px-4 py-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/30 transition-colors";
  const labelClass = "block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5";
  const iconInput = "pl-10";

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 circuit-bg">
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(212,168,71,0.06)" }} />
      </div>

      <div className="relative w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold text-text-primary">
              OneShot<span className="text-accent-primary">Manufacturing</span>
            </span>
          </Link>
          <p className="text-text-muted text-sm mt-2">Create your customer account</p>
        </div>

        <div className="glass-card p-8">
          <h1 className="font-display text-2xl font-bold text-text-primary mb-6">
            Company Registration
          </h1>

          <form onSubmit={handleSignup} className="space-y-5">
            {/* Section: Contact */}
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> Contact Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Your Name *</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input required type="text" value={form.contactName} onChange={update("contactName")}
                      placeholder="Full name" className={`${inputClass} ${iconInput}`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Phone Number *</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input required type="tel" value={form.phone} onChange={update("phone")}
                      placeholder="+91 98765 43210" className={`${inputClass} ${iconInput}`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Company */}
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> Company Details
              </p>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Company Name *</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input required type="text" value={form.companyName} onChange={update("companyName")}
                      placeholder="Your company name" className={`${inputClass} ${iconInput}`} />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>GSTIN <span className="text-text-muted normal-case font-normal">(optional)</span></label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="text" value={form.gstin} onChange={update("gstin")}
                      placeholder="27XXXXXXXXX1ZX" maxLength={15}
                      className={`${inputClass} ${iconInput} font-mono tracking-wide`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Address */}
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> Billing Address
              </p>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Street Address</label>
                  <input type="text" value={form.address} onChange={update("address")}
                    placeholder="Building, street, area" className={inputClass} />
                </div>
                <div className="grid grid-cols-3 gap-3">
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
                    <label className={labelClass}>Pincode</label>
                    <input type="text" value={form.pincode} onChange={update("pincode")}
                      placeholder="414111" maxLength={6} className={inputClass} />
                  </div>
                </div>
              </div>
            </div>

            {/* Section: Account */}
            <div>
              <p className="text-xs uppercase tracking-widest text-accent-primary font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Account Credentials
              </p>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Email Address *</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input required type="email" value={form.email} onChange={update("email")}
                      placeholder="you@company.com" className={`${inputClass} ${iconInput}`} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input required type={showPassword ? "text" : "password"}
                        value={form.password} onChange={update("password")}
                        placeholder="Min 8 chars" className={`${inputClass} ${iconInput} pr-10`} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary">
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Confirm Password *</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                      <input required type="password" value={form.confirmPassword} onChange={update("confirmPassword")}
                        placeholder="Repeat password" className={`${inputClass} ${iconInput}`} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading}
              className="btn-glow w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60 disabled:cursor-not-allowed">
              {loading
                ? <><span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" /> Creating account…</>
                : "Create Account"}
            </button>
          </form>

          <p className="text-center text-sm text-text-muted mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-accent-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
