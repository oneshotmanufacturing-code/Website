import React from "react";
import type { Metadata } from "next";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  ArrowRight,
} from "lucide-react";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import ContactForm from "@/components/ContactForm";
import MapEmbed from "@/components/MapEmbed";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${COMPANY.name}. Phone, email, location, business hours, and quick inquiry form.`,
};

const contactCards = [
  {
    icon: Phone,
    title: "Phone",
    value: COMPANY.phone,
    href: `tel:${COMPANY.phone.replace(/\s/g, "")}`,
    color: "from-cyan-500/15 to-blue-500/15",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    icon: Mail,
    title: "Email",
    value: COMPANY.email,
    href: `mailto:${COMPANY.email}`,
    color: "from-violet-500/15 to-purple-500/15",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    icon: MapPin,
    title: "Address",
    value: COMPANY.address,
    href: COMPANY.mapsUrl,
    color: "from-amber-500/15 to-orange-500/15",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
];

export default function ContactPage() {
  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 circuit-bg">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/3 w-[350px] h-[350px] rounded-full bg-accent-primary/5 blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-full animate-fade-in">
            Contact Us
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Let&apos;s Start a{" "}
            <span className="text-gradient">Conversation</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            Whether you have a question, need a quote, or just want to say
            hello — we&apos;re here to help.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto -mt-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {contactCards.map((card) => (
            <a
              key={card.title}
              href={card.href}
              target={card.title === "Address" ? "_blank" : undefined}
              rel={card.title === "Address" ? "noopener noreferrer" : undefined}
              className="group"
            >
              <Card hover padding="lg" className="text-center h-full">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} border ${card.border} mb-4 group-hover:scale-105 transition-transform duration-300`}
                >
                  <card.icon className={`w-5 h-5 ${card.iconColor}`} />
                </div>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-text-muted mb-2">
                  {card.title}
                </h3>
                <p className="text-sm text-text-primary font-medium leading-relaxed">
                  {card.value}
                </p>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* ── Form + Info Grid ── */}
      <section className="py-10 lg:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form (3/5 width) */}
          <div className="lg:col-span-3">
            <ContactForm />
          </div>

          {/* Sidebar Info (2/5 width) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Business Hours */}
            <Card padding="lg">
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
                  <Clock className="w-4 h-4 text-accent-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  Business Hours
                </h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {COMPANY.businessHours.days}
                  </span>
                  <span className="text-text-primary font-medium">
                    {COMPANY.businessHours.time}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">
                    {COMPANY.businessHours.closed}
                  </span>
                  <span className="text-red-400 font-medium">Closed</span>
                </div>
              </div>
            </Card>

            {/* GST Information */}
            <Card padding="lg" glow>
              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20">
                  <Building2 className="w-4 h-4 text-accent-secondary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary">
                  GST Information
                </h3>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    GSTIN
                  </p>
                  <p className="text-lg font-mono font-bold text-accent-primary">
                    {COMPANY.gstin}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted uppercase tracking-wider mb-1">
                    Registered Name
                  </p>
                  <p className="text-sm text-text-primary font-medium">
                    {COMPANY.officialName}
                  </p>
                </div>
              </div>
            </Card>

            {/* Direct Email CTA */}
            <Card padding="lg" className="bg-gradient-to-br from-accent-primary/5 to-accent-secondary/5">
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                Need a quick quote?
              </h3>
              <p className="text-sm text-text-secondary mb-4">
                For detailed quote requests with BOM attachments, email us
                directly:
              </p>
              <Button
                variant="primary"
                size="sm"
                href={`mailto:${COMPANY.inquiryEmail}`}
                icon={<Mail className="w-3.5 h-3.5" />}
                fullWidth
              >
                {COMPANY.inquiryEmail}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Map Section ── */}
      <section className="py-10 lg:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Location"
          title="Find Us"
          subtitle="Visit us at our facility in Bengaluru, Karnataka."
        />
        <MapEmbed />
      </section>
    </>
  );
}
