import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export default function Card({
  children,
  className = "",
  hover = false,
  glow = false,
  padding = "md",
}: CardProps) {
  const baseClass = hover ? "glass-card-hover" : "glass-card";
  const glowClass = glow ? "shadow-glow-sm" : "";

  return (
    <div
      className={`${baseClass} ${paddingClasses[padding]} ${glowClass} ${className}`}
    >
      {children}
    </div>
  );
}
