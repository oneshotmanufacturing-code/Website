import React from "react";

type ButtonVariant = "primary" | "outline" | "ghost" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: "btn-glow",
  outline: "btn-outline-glow",
  ghost:
    "bg-transparent text-text-secondary hover:text-accent-primary hover:bg-accent-primary/5 transition-colors duration-300 px-6 py-3 rounded-xl font-semibold text-sm",
  secondary:
    "bg-[#111111]/5 text-[#111111] border border-[#111111]/20 hover:bg-[#111111]/10 hover:border-[#111111]/40 transition-all duration-300 px-6 py-3 rounded-xl font-semibold text-sm",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "!px-4 !py-2 !text-xs",
  md: "", // default
  lg: "!px-8 !py-4 !text-base",
};

export default function Button({
  variant = "primary",
  size = "md",
  href,
  children,
  icon,
  iconPosition = "left",
  fullWidth = false,
  className = "",
  ...props
}: ButtonProps) {
  const classes = [
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? "w-full justify-center" : "",
    "inline-flex items-center gap-2",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <a href={href} className={classes}>
        {icon && iconPosition === "left" && icon}
        {children}
        {icon && iconPosition === "right" && icon}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </button>
  );
}
