"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [portalPath, setPortalPath] = useState("/portal");
  const pathname = usePathname();

  useEffect(() => {
    const supabase = createClient();
    // Get initial user
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user ?? null));
    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-bg-primary/80 backdrop-blur-xl border-b border-border-subtle shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav className="w-full px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Brand — text only, no logo */}
          <Link
            href="/"
            className="flex items-center group"
            aria-label="Mayur Precision Home"
          >
            <div className="flex flex-col">
              <span className="font-display text-xl font-bold text-text-primary leading-tight tracking-tight group-hover:text-accent-primary transition-colors">
                Mayur<span className="text-accent-primary">Precision</span>
              </span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-text-muted leading-none hidden sm:block">
                Wiring &amp; Assembly
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-accent-primary bg-accent-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-accent-primary rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* CTA + Mobile Burger */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <Link
                  href="/portal"
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-accent-primary hover:text-accent-primary/80 transition-colors"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  My Portal
                </Link>
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors"
                >
                  Login
                </Link>
              )}
              <Button variant="primary" size="sm" href="/services#quote-builder">
                Get a Quote
              </Button>
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isOpen ? "max-h-80 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <div className="flex flex-col gap-1 pt-2 border-t border-border-subtle">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "text-accent-primary bg-accent-primary/10"
                      : "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="mt-2 px-4">
              <Button variant="primary" size="sm" href="/services#quote-builder" fullWidth>
                Get a Quote
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
