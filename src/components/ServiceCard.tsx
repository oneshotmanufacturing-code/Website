"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Card from "@/components/ui/Card";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  categories: {
    id: string;
    title: string;
    items: string[];
  }[];
  accentColor?: string;
}

export default function ServiceCard({
  title,
  description,
  icon,
  categories,
  accentColor = "accent-primary",
}: ServiceCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card padding="none" className="overflow-hidden">
      {/* Header (always visible) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-6 lg:p-8 flex items-start gap-5 text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={expanded}
      >
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-xl lg:text-2xl font-bold text-text-primary mb-2">
            {title}
          </h3>
          <p className="text-sm text-text-secondary leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className={`w-5 h-5 text-${accentColor}`} />
          ) : (
            <ChevronDown className="w-5 h-5 text-text-muted" />
          )}
        </div>
      </button>

      {/* Expandable content */}
      <div
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-6 lg:px-8 pb-6 lg:pb-8 border-t border-border-subtle">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
            {categories.map((cat) => (
              <div key={cat.id}>
                <h4 className="text-sm font-semibold text-accent-primary uppercase tracking-wider mb-3">
                  {cat.title}
                </h4>
                <ul className="space-y-2">
                  {cat.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2 text-sm text-text-secondary"
                    >
                      <span className="w-1 h-1 rounded-full bg-accent-primary/60 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}
