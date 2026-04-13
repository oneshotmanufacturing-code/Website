import React from "react";
import {
  Shield,
  Clock,
  Package,
  IndianRupee,
  Truck,
  Cable,
  Cpu,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import HeroSection from "@/components/HeroSection";
import ProcessFlow from "@/components/ProcessFlow";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { DIFFERENTIATORS } from "@/lib/constants";

const DIFF_ICONS: Record<string, React.ElementType> = {
  Shield,
  Clock,
  Package,
  IndianRupee,
  Truck,
};

const SERVICE_OVERVIEW = [
  {
    title: "Wire & Cable Preparation",
    description:
      "Custom cable assemblies, wire harnesses, crimping, soldering, and end-to-end cable processing for every application.",
    icon: Cable,
    href: "/services#wire-cable",
    gradient: "from-cyan-500/15 to-blue-500/15",
    border: "border-cyan-500/20",
    iconColor: "text-cyan-400",
  },
  {
    title: "PCB Assembly",
    description:
      "From prototype to mid-volume production — SMT, THT, and mixed-tech assembly with rigorous quality testing.",
    icon: Cpu,
    href: "/services#pcb-assembly",
    gradient: "from-violet-500/15 to-purple-500/15",
    border: "border-violet-500/20",
    iconColor: "text-violet-400",
  },
  {
    title: "Raw Material Sourcing",
    description:
      "Flexible procurement models — buyer-supplied, we-procure, or hybrid. Competitive pricing with trusted suppliers.",
    icon: ShoppingBag,
    href: "/services#material",
    gradient: "from-amber-500/15 to-orange-500/15",
    border: "border-amber-500/20",
    iconColor: "text-amber-400",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Services Overview ── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="What We Do"
          title="End-to-End Electronics Manufacturing"
          subtitle="Three core capabilities under one roof — from raw materials to finished, tested assemblies."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {SERVICE_OVERVIEW.map((svc) => (
            <a key={svc.title} href={svc.href} className="group">
              <Card hover padding="lg" className="h-full">
                <div
                  className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${svc.gradient} border ${svc.border} mb-5 group-hover:scale-105 transition-transform duration-300`}
                >
                  <svc.icon className={`w-6 h-6 ${svc.iconColor}`} />
                </div>
                <h3 className="font-display text-xl font-semibold text-text-primary mb-3">
                  {svc.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4">
                  {svc.description}
                </p>
                <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent-primary group-hover:gap-2.5 transition-all duration-300">
                  Learn more <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Card>
            </a>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ── Why Choose Us ── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Why Choose Us"
          title="Built Different, Delivered Better"
          subtitle="Our edge: uncompromising quality, transparent pricing, and a commitment to your timelines."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DIFFERENTIATORS.map((diff) => {
            const Icon = DIFF_ICONS[diff.icon];
            return (
              <Card key={diff.title} hover padding="lg" className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-primary/10 border border-accent-primary/20 mb-4">
                  <Icon className="w-5 h-5 text-accent-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                  {diff.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {diff.description}
                </p>
              </Card>
            );
          })}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ── Process Flow ── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="How It Works"
          title="From Inquiry to Delivery"
          subtitle="A streamlined 4-step process designed for speed, transparency, and zero surprises."
        />
        <ProcessFlow />
      </section>

      {/* ── CTA Banner ── */}
      <section className="py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center glass-card p-12 md:p-16 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
            <div className="absolute -top-32 -left-32 w-64 h-64 rounded-full bg-accent-primary/10 blur-[80px]" />
            <div className="absolute -bottom-32 -right-32 w-64 h-64 rounded-full bg-accent-secondary/10 blur-[80px]" />
          </div>

          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4">
              Ready to <span className="text-gradient">outsource</span> your
              production?
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Tell us what you need — we&apos;ll handle the rest. From prototype
              to production at scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/services#quote-builder"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                Build Your Quote
              </Button>
              <Button variant="outline" size="lg" href="/contact">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
