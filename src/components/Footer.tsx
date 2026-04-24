import React from "react";
import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { COMPANY, FOOTER_LINKS } from "@/lib/constants";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border-subtle bg-bg-primary">
      {/* Decorative top glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-accent-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center mb-4">
              <span className="font-display text-xl font-bold text-text-primary">
                OneShot<span className="text-accent-primary">Manufacturing</span>
              </span>
            </Link>
            <p className="text-text-secondary text-sm leading-relaxed mb-6">
              {COMPANY.tagline}. Delivering precision electronics manufacturing
              since {COMPANY.established}.
            </p>
            {/* GST Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent-primary/5 border border-accent-primary/15 text-xs text-accent-primary font-mono">
              <span className="font-semibold">GSTIN:</span> {COMPANY.gstin}
            </div>
            <p className="mt-2 text-xs text-text-muted">{COMPANY.officialName}</p>
          </div>

          {/* Services Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-text-primary mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-text-primary mb-4">
              Company
            </h3>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-secondary hover:text-accent-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-text-primary mb-4">
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-accent-primary mt-0.5 flex-shrink-0" />
                <a
                  href={COMPANY.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-text-secondary hover:text-accent-primary transition-colors leading-relaxed"
                >
                  {COMPANY.address}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Phone className="w-4 h-4 text-accent-primary flex-shrink-0" />
                  {COMPANY.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${COMPANY.email}`}
                  className="flex items-center gap-3 text-sm text-text-secondary hover:text-accent-primary transition-colors"
                >
                  <Mail className="w-4 h-4 text-accent-primary flex-shrink-0" />
                  {COMPANY.email}
                </a>
              </li>
            </ul>
            {/* Business Hours */}
            <div className="mt-6 p-3 rounded-lg bg-bg-secondary/40 border border-border-subtle">
              <p className="text-xs font-semibold text-text-primary mb-1">
                Business Hours
              </p>
              <p className="text-xs text-text-secondary">
                {COMPANY.businessHours.days}
              </p>
              <p className="text-xs text-text-secondary">
                {COMPANY.businessHours.time}
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="section-divider mt-12 mb-6" />
        <div className="flex items-center justify-center">
          <p className="text-xs text-text-muted text-center">
            © {currentYear} {COMPANY.officialName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
