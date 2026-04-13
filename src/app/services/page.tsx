import React from "react";
import type { Metadata } from "next";
import { Cable, Cpu, ShoppingBag, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import ServiceCard from "@/components/ServiceCard";
import QuoteBuilder from "@/components/QuoteBuilder";
import {
  WIRE_CABLE_SERVICES,
  PCB_ASSEMBLY_SERVICES,
  RAW_MATERIAL_OPTIONS,
} from "@/lib/serviceData";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Wire & cable preparation, PCB assembly, and raw material sourcing. Free door-step pickup & delivery for batch orders. Build a custom quote online.",
  openGraph: {
    title: "Services — Mayur Precision",
    description:
      "Full-spectrum electronics manufacturing: wire harnesses, PCB assembly, and raw material sourcing. Pan-India delivery.",
    url: "https://mayurprecision.in/services",
  },
  alternates: { canonical: "https://mayurprecision.in/services" },
};

export default function ServicesPage() {
  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 circuit-bg">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent-primary/5 blur-[100px]" />
          <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-accent-secondary/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-full animate-fade-in">
            Our Services
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Full-Spectrum{" "}
            <span className="text-gradient">Electronics Manufacturing</span>
          </h1>
          <p
            className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.15s" }}
          >
            From raw wire spools to tested, production-ready assemblies. Explore
            our capabilities below, then build your custom quote.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
      </section>

      {/* ── Service Catalog ── */}
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Capabilities"
          title="What We Build"
          subtitle="Click on any service to see the full list of capabilities."
        />

        <div className="space-y-6" id="wire-cable">
          {/* Wire & Cable */}
          <ServiceCard
            title={WIRE_CABLE_SERVICES.title}
            description={WIRE_CABLE_SERVICES.description}
            icon={
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/15 to-blue-500/15 border border-cyan-500/20">
                <Cable className="w-6 h-6 text-cyan-400" />
              </div>
            }
            categories={WIRE_CABLE_SERVICES.categories}
          />

          {/* PCB Assembly */}
          <div id="pcb-assembly">
            <ServiceCard
              title={PCB_ASSEMBLY_SERVICES.title}
              description={PCB_ASSEMBLY_SERVICES.description}
              icon={
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/15 to-purple-500/15 border border-violet-500/20">
                  <Cpu className="w-6 h-6 text-violet-400" />
                </div>
              }
              categories={PCB_ASSEMBLY_SERVICES.categories}
              accentColor="accent-secondary"
            />
          </div>

          {/* Raw Material Sourcing */}
          <div id="material">
            <Card padding="none" className="overflow-hidden">
              <div className="p-6 lg:p-8 flex items-start gap-5">
                <div className="flex-shrink-0">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/15 to-orange-500/15 border border-amber-500/20">
                    <ShoppingBag className="w-6 h-6 text-amber-400" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display text-xl lg:text-2xl font-bold text-text-primary mb-2">
                    {RAW_MATERIAL_OPTIONS.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed mb-6">
                    {RAW_MATERIAL_OPTIONS.description}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {RAW_MATERIAL_OPTIONS.options.map((opt) => (
                      <div
                        key={opt.id}
                        className="p-4 rounded-xl bg-bg-primary/50 border border-border-subtle"
                      >
                        <div className="text-sm font-semibold text-amber-400 mb-1">
                          {opt.label}
                        </div>
                        <div className="text-xs text-text-muted leading-relaxed">
                          {opt.description}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ── Quote Builder ── */}
      <section
        id="quote-builder"
        className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto"
      >
        <SectionHeader
          badge="Get a Quote"
          title="Build Your Quote Request"
          subtitle="Tell us exactly what you need — select your services, specify the details, and we'll get back with a quotation within 24 hours."
        />
        <QuoteBuilder />
      </section>
    </>
  );
}
