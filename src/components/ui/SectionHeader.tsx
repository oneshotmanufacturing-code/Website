import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  align?: "left" | "center";
  className?: string;
}

export default function SectionHeader({
  title,
  subtitle,
  badge,
  align = "center",
  className = "",
}: SectionHeaderProps) {
  const alignClass = align === "center" ? "text-center mx-auto" : "text-left";

  return (
    <div className={`max-w-2xl mb-8 ${alignClass} ${className}`}>
      {badge && (
        <span className="inline-block mb-4 px-4 py-1.5 text-xs font-semibold tracking-widest uppercase text-accent-primary bg-accent-primary/10 border border-accent-primary/20 rounded-full">
          {badge}
        </span>
      )}
      <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="text-text-secondary text-base md:text-lg leading-relaxed">
          {subtitle}
        </p>
      )}
      <div className="mt-4 mx-auto w-20 h-1 rounded-full bg-gradient-to-r from-accent-primary to-accent-secondary" />
    </div>
  );
}
