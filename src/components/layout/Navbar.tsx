"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Services", href: "#services" },
    { name: "Why Us", href: "#why-us" },
    { name: "Process", href: "#process" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-dark-3" : "bg-transparent"
        }`}
    >
      <div className="w-full px-4 sm:px-6 md:px-10 h-[80px] flex items-center justify-between">
        {/* Left: Logo */}
        <a href="/" className={`font-display text-2xl md:text-4xl transition-colors ${isScrolled ? "text-white-text" : "text-white"}`}>
          ONESHOT
        </a>

        {/* Center: Desktop Nav */}
        <div className="hidden md:flex items-center space-x-10">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`text-[16px] uppercase tracking-[0.12em] hover:text-red transition-colors ${isScrolled ? "text-grey" : "text-white/60"}`}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Right: CTA & Mobile Toggle */}
        <div className="flex items-center space-x-4">
          <a
            href="#contact"
            className="hidden md:inline-block bg-red hover:bg-red-hover text-white text-[15px] font-semibold px-7 py-2.5 rounded-[2px] transition-colors"
          >
            GET A QUOTE
          </a>

          <button
            className={`md:hidden focus:outline-none transition-colors ${isScrolled ? "text-white-text" : "text-white"}`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={30} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 flex flex-col items-center justify-center">
          <button
            className="absolute top-5 right-6 text-white-text focus:outline-none"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X size={34} />
          </button>

          <div className="flex flex-col items-center space-y-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-4xl text-white-text uppercase hover:text-red transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="text-4xl text-red font-semibold uppercase mt-4 hover:text-red-hover transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              GET A QUOTE
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
