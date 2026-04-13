"use client";

import React from "react";
import {
  MessageSquare,
  FileSearch,
  Factory,
  Truck,
  ArrowRight,
} from "lucide-react";

const ICONS = { MessageSquare, FileSearch, Factory, Truck };

const steps = [
  {
    step: 1,
    title: "Inquiry",
    description: "Share your requirements via our quote builder or email.",
    icon: "MessageSquare" as keyof typeof ICONS,
    color: "from-cyan-500 to-blue-500",
  },
  {
    step: 2,
    title: "Design Review",
    description:
      "Our engineers review specs, suggest optimizations, and confirm scope.",
    icon: "FileSearch" as keyof typeof ICONS,
    color: "from-blue-500 to-violet-500",
  },
  {
    step: 3,
    title: "Production",
    description:
      "Precision manufacturing with in-process quality checks at every stage.",
    icon: "Factory" as keyof typeof ICONS,
    color: "from-violet-500 to-purple-500",
  },
  {
    step: 4,
    title: "Delivery",
    description: "Packaged, labeled, and delivered on schedule to your door.",
    icon: "Truck" as keyof typeof ICONS,
    color: "from-purple-500 to-accent-primary",
  },
];

export default function ProcessFlow() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 relative">
      {steps.map((item, index) => {
        const Icon = ICONS[item.icon];
        return (
          <div key={item.step} className="relative group">
            {/* Connector arrow (desktop only) */}
            {index < steps.length - 1 && (
              <div className="hidden lg:flex absolute top-12 -right-4 z-10 w-8 items-center justify-center">
                <ArrowRight className="w-5 h-5 text-text-muted/40" />
              </div>
            )}

            <div className="glass-card-hover p-6 h-full text-center">
              {/* Step number */}
              <div className="text-xs font-bold text-text-muted/50 uppercase tracking-widest mb-4">
                Step {item.step}
              </div>

              {/* Icon */}
              <div
                className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${item.color} mb-4 group-hover:shadow-glow-sm transition-shadow duration-300`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              {/* Title */}
              <h3 className="font-display text-lg font-semibold text-text-primary mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-text-secondary leading-relaxed">
                {item.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
