import React from "react";
import type { Metadata } from "next";
import {
  Target,
  Eye,
  TrendingUp,
  DollarSign,
  Users,
  Award,
  Shield,
  Clock,
  Layers,
  Truck,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: `Learn about ${COMPANY.name} — our mission, vision, quality standards, and commitment to precision electronics manufacturing since ${COMPANY.established}.`,
};

const STORY_ITEMS = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To empower electronics manufacturers with affordable, high-quality wire/cable and PCB assembly services — so they can focus on innovation, not production.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become India's most trusted outsourcing partner for precision electronics manufacturing, known for quality, transparency, and on-time delivery.",
  },
];

const OUTSOURCE_REASONS = [
  {
    icon: DollarSign,
    title: "Reduce Costs",
    description:
      "Avoid capital investment in equipment, training, and floor space. Pay only for what you produce.",
  },
  {
    icon: TrendingUp,
    title: "Scale Flexibly",
    description:
      "Ramp up or down instantly — from 10-piece prototypes to 5,000-unit batches, without fixed overhead.",
  },
  {
    icon: Users,
    title: "Access Expertise",
    description:
      "Our skilled technicians specialize in crimping, soldering, and assembly — skills that take years to build.",
  },
  {
    icon: Award,
    title: "Focus on Core",
    description:
      "Free your engineering team to design and innovate, while we handle the manufacturing execution.",
  },
];

const COMMITMENTS = [
  {
    icon: Clock,
    title: "On-Time Delivery",
    description:
      "We treat your deadline like ours. 99% on-time delivery rate across all projects.",
  },
  {
    icon: Shield,
    title: "Quality First",
    description:
      "Every assembly goes through visual inspection and functional testing before shipment.",
  },
  {
    icon: Layers,
    title: "Flexibility",
    description:
      "Custom specs, changing quantities, buyer-supplied materials — we adapt to your workflow.",
  },
  {
    icon: Truck,
    title: "Free Door-Step Pickup & Delivery",
    description:
      "For batch orders, we pick up materials from your facility and deliver finished assemblies directly to your door — anywhere in India.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* ── Hero Banner ── */}
      <section className="relative pt-28 pb-12 lg:pt-32 lg:pb-16 px-4 sm:px-6 lg:px-8 circuit-bg">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full bg-accent-secondary/5 blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/3 w-[300px] h-[300px] rounded-full bg-accent-primary/5 blur-[80px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block mb-6 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-full animate-fade-in">
            About Us
          </span>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            The Story Behind{" "}
            <span className="text-gradient">OneShot Manufacturing</span>
          </h1>
          <p className="text-text-secondary text-lg md:text-xl leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Founded in {COMPANY.established} in Ahilyanagar, we set out with a simple
            goal: give electronics manufacturers a reliable production partner
            they can actually count on.
          </p>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
      </section>

      {/* ── Mission & Vision ── */}
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {STORY_ITEMS.map((item) => (
            <Card key={item.title} hover padding="lg" className="h-full">
              <h2 className="font-display text-2xl font-bold text-text-primary mb-3">
                {item.title}
              </h2>
              <p className="text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Company Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {[
            { value: `${new Date().getFullYear() - COMPANY.established}+`, label: "Years in Business" },
            { value: "1000+", label: "Project Experience" },
            { value: "50+", label: "Happy Clients" },
          ].map((stat) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-accent-primary font-display mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-text-muted uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ── Why Outsource to Us ── */}
      <section id="why-outsource" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Why Outsource"
          title="Your Production, Our Expertise"
          subtitle="Outsourcing your wire/cable and PCB work to a dedicated partner saves time, money, and headaches."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {OUTSOURCE_REASONS.map((item) => (
            <Card key={item.title} hover padding="lg" className="h-full">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-primary/10 border border-accent-primary/20">
                  <item.icon className="w-5 h-5 text-accent-primary" />
                </div>
                <div>
                  <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ── Quality Standards ── */}
      <section id="quality" className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader
            badge="Quality"
            title="Quality Without Compromise"
            subtitle="We don't just assemble — we inspect, test, and verify."
          />
          <Card padding="lg" className="text-left">
            <ul className="space-y-4">
              {[
                "100% visual inspection on every assembled unit",
                "Functional testing per customer-supplied test procedures",
                "In-process quality checkpoints at every production stage",
                "Component traceability and lot tracking",
                "Continuous improvement through customer feedback loops",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Shield className="w-4 h-4 text-accent-primary mt-1 flex-shrink-0" />
                  <span className="text-text-secondary text-sm leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="section-divider max-w-5xl mx-auto" />

      {/* ── Our Commitment ── */}
      <section className="py-24 lg:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Our Promise"
          title="What You Can Count On"
          subtitle="Four pillars that define how we work — every day, every project."
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMMITMENTS.map((item) => (
            <Card key={item.title} hover padding="lg" className="text-center h-full">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-accent-secondary/10 border border-accent-secondary/20 mb-4">
                <item.icon className="w-5 h-5 text-accent-secondary" />
              </div>
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                {item.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Pan-India Delivery ── */}
      <div className="section-divider max-w-5xl mx-auto" />
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SectionHeader
          badge="Nationwide Reach"
          title="We Deliver All Over India"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            "Maharashtra", "Gujarat", "Karnataka", "Tamil Nadu", "Telangana",
            "Rajasthan", "Delhi NCR", "Uttar Pradesh", "West Bengal", "Punjab",
            "Haryana", "Madhya Pradesh", "Andhra Pradesh", "Kerala", "And more…",
          ].map((state) => (
            <div
              key={state}
              className="glass-card px-4 py-3 text-center text-sm font-medium text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-colors duration-200"
            >
              {state}
            </div>
          ))}
        </div>
        <p className="mt-8 text-center text-text-muted text-sm">
          Orders shipped via reliable courier partners. Bulk orders eligible for dedicated logistics.
        </p>
      </section>

      {/* ── CTA ── */}
      <section className="py-14 lg:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center glass-card p-10 md:p-14 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" aria-hidden>
            <div className="absolute -top-32 -right-32 w-64 h-64 rounded-full bg-accent-secondary/10 blur-[80px]" />
          </div>
          <div className="relative z-10">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-text-primary mb-4">
              Let&apos;s work <span className="text-gradient">together</span>
            </h2>
            <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
              Whether you need 10 prototype cables or 5,000 assembled PCBs, we&apos;re
              here to deliver.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                href="/services"
                icon={<ArrowRight className="w-4 h-4" />}
                iconPosition="right"
              >
                View Our Services
              </Button>
              <Button variant="outline" size="lg" href="/contact">
                Get in Touch
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
