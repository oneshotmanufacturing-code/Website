"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/lib/constants";

export default function HeroSection() {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden circuit-bg">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full blur-[130px] animate-float"
          style={{ backgroundColor: "rgba(212,168,71,0.06)" }} />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] rounded-full blur-[110px] animate-float"
          style={{ animationDelay: "3s", backgroundColor: "rgba(46,64,87,0.30)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[160px]"
          style={{ backgroundColor: "rgba(212,168,71,0.04)" }} />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-20" aria-hidden="true">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-grid"
              x="0"
              y="0"
              width="64"
              height="64"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="1" cy="1" r="0.5" fill="rgba(0,212,255,0.2)" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-grid)" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-24 pb-12">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-accent-primary/10 border border-accent-primary/20 animate-fade-in">
          <Sparkles className="w-3.5 h-3.5 text-accent-primary" />
          <span className="text-xs font-semibold text-accent-primary tracking-wide uppercase">
            Electronics Manufacturing Excellence
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-fade-in-up">
          <span className="text-text-primary">{COMPANY.tagline.split("&")[0]}&</span>
          <br />
          <span className="text-gradient">
            Assembly Solutions
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="max-w-2xl mx-auto text-text-secondary text-lg sm:text-xl md:text-2xl leading-relaxed mb-10 animate-fade-in-up"
          style={{ animationDelay: "0.15s" }}
        >
          From wire harnesses and cable prep to PCB assembly — we deliver
          precision-built electronics with on-time reliability. Trusted by
          manufacturers across India since {COMPANY.established}.
        </p>

        {/* CTAs */}
        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            variant="primary"
            size="lg"
            href="/services"
            icon={<ArrowRight className="w-4 h-4" />}
            iconPosition="right"
          >
            Explore Services
          </Button>
          <Button variant="outline" size="lg" href="/services#quote-builder">
            Get a Quote
          </Button>
        </div>

        {/* Stats pill row */}
        <div
          className="flex flex-wrap items-center justify-center gap-6 mt-16 animate-fade-in-up"
          style={{ animationDelay: "0.45s" }}
        >
          {[
            { value: `${new Date().getFullYear() - COMPANY.established}+`, label: "Years" },
            { value: "1000+", label: "Projects" },
            { value: "99%", label: "On-Time" },
            { value: "50+", label: "Clients" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center px-5 py-3"
            >
              <span className="text-2xl md:text-3xl font-bold text-accent-primary font-display">
                {stat.value}
              </span>
              <span className="text-xs text-text-muted uppercase tracking-wider mt-1">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg-primary to-transparent pointer-events-none" />
    </section>
  );
}
