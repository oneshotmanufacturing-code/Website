"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/set-password`,
    });

    if (resetError) {
      setError("Something went wrong. Please try again.");
    } else {
      setSent(true);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 circuit-bg">
      <div className="fixed inset-0 pointer-events-none" aria-hidden>
        <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full blur-[120px]"
          style={{ backgroundColor: "rgba(212,168,71,0.05)" }} />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <span className="font-display text-2xl font-bold text-text-primary">
              Mayur<span className="text-accent-primary">Precision</span>
            </span>
          </Link>
        </div>

        <div className="glass-card p-8">
          {sent ? (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center mx-auto mb-4">
                <Mail className="w-6 h-6 text-accent-primary" />
              </div>
              <h2 className="font-display text-xl font-bold text-text-primary mb-2">Check your inbox</h2>
              <p className="text-text-secondary text-sm mb-6">
                A password reset link has been sent to <strong className="text-text-primary">{email}</strong>.
              </p>
              <Link href="/login" className="text-accent-primary text-sm hover:underline flex items-center justify-center gap-1">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to login
              </Link>
            </div>
          ) : (
            <>
              <h1 className="font-display text-2xl font-bold text-text-primary mb-1">Reset password</h1>
              <p className="text-text-muted text-sm mb-6">
                Enter your email and we&apos;ll send a reset link.
              </p>

              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-bg-tertiary/40 border border-border-subtle text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-primary/60 focus:ring-1 focus:ring-accent-primary/30 transition-colors" />
                  </div>
                </div>

                {error && (
                  <p className="text-red-400 text-sm bg-red-400/10 border border-red-400/20 rounded-lg px-3 py-2">
                    {error}
                  </p>
                )}

                <button type="submit" disabled={loading}
                  className="btn-glow w-full flex items-center justify-center gap-2 py-3 disabled:opacity-60">
                  {loading
                    ? <span className="w-4 h-4 border-2 border-bg-primary/40 border-t-bg-primary rounded-full animate-spin" />
                    : <Mail className="w-4 h-4" />}
                  {loading ? "Sending…" : "Send Reset Link"}
                </button>
              </form>

              <Link href="/login" className="flex items-center justify-center gap-1 text-sm text-text-muted hover:text-accent-primary mt-4 transition-colors">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to login
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
