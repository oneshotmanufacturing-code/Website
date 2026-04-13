"use client";

import React, { useState } from "react";
import { Send, Check } from "lucide-react";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

export default function ContactForm() {
  const [form, setForm] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const update = <K extends keyof ContactFormData>(
    key: K,
    value: string
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xdummyid", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: `Contact Form — ${form.name}`,
          name: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      if (response.ok) {
        setSubmitted(true);
      }
    } catch {
      // Fallback to mailto
      const subject = encodeURIComponent(`Contact from ${form.name}`);
      const body = encodeURIComponent(
        `Name: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\n\nMessage:\n${form.message}`
      );
      window.open(
        `mailto:${COMPANY.email}?subject=${subject}&body=${body}`,
        "_self"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <Card padding="lg" className="text-center py-12">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-green-500/15 border border-green-500/30 mb-5">
          <Check className="w-7 h-7 text-green-400" />
        </div>
        <h3 className="font-display text-xl font-bold text-text-primary mb-2">
          Message Sent!
        </h3>
        <p className="text-text-secondary text-sm mb-6">
          We&apos;ll get back to you within 24 hours.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setForm({ name: "", email: "", phone: "", message: "" });
            setSubmitted(false);
          }}
        >
          Send Another Message
        </Button>
      </Card>
    );
  }

  return (
    <Card padding="lg">
      <h3 className="font-display text-xl font-bold text-text-primary mb-6">
        Send Us a Message
      </h3>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label
              htmlFor="contact-name"
              className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
            >
              Name <span className="text-red-400">*</span>
            </label>
            <input
              id="contact-name"
              type="text"
              required
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all"
            />
          </div>
          <div>
            <label
              htmlFor="contact-email"
              className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
            >
              Email <span className="text-red-400">*</span>
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@company.com"
              className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="contact-phone"
            className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
          >
            Phone
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            placeholder="+91 98765 43210"
            className="w-full px-4 py-2.5 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="contact-message"
            className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2"
          >
            Message <span className="text-red-400">*</span>
          </label>
          <textarea
            id="contact-message"
            required
            rows={5}
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Tell us about your project or inquiry…"
            className="w-full px-4 py-3 rounded-xl bg-bg-primary border border-border-subtle text-text-primary text-sm placeholder:text-text-muted focus:border-accent-primary focus:ring-1 focus:ring-accent-primary/30 outline-none transition-all resize-y"
          />
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          icon={<Send className="w-4 h-4" />}
          fullWidth
          disabled={submitting}
        >
          {submitting ? "Sending…" : "Send Message"}
        </Button>
      </form>
    </Card>
  );
}
