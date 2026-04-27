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
    { name: "Why Us",   href: "#why-us" },
    { name: "Process",  href: "#process" },
    { name: "Contact",  href: "#contact" },
  ];

  return (
    <nav
      style={{
        position: "fixed",
        top: "40px", /* below announcement bar */
        left: 0,
        width: "100%",
        zIndex: 50,
        background: "#0F1D3F",
        boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <a
          href="/"
          style={{
            color: "#FFFFFF",
            fontSize: "20px",
            fontWeight: 800,
            letterSpacing: "0.10em",
            textDecoration: "none",
            textTransform: "uppercase",
          }}
        >
          ONESHOT
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center" style={{ gap: "36px" }}>
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              style={{
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                paddingBottom: "4px",
                borderBottom: "2px solid transparent",
                transition: "border-color 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "#F7941D";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "transparent";
              }}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA + mobile toggle */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a
            href="#contact"
            className="hidden md:inline-flex"
            style={{
              background: "#F7941D",
              color: "#FFFFFF",
              fontSize: "12px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              padding: "10px 20px",
              borderRadius: "4px",
              textDecoration: "none",
              transition: "background 0.2s ease",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#E08319";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#F7941D";
            }}
          >
            GET A QUOTE
          </a>

          <button
            className="md:hidden focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
            style={{ color: "#FFFFFF", background: "none", border: "none", cursor: "pointer" }}
          >
            <Menu size={28} />
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#0F1D3F",
            zIndex: 100,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: "20px",
              right: "24px",
              color: "#FFFFFF",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close mobile menu"
          >
            <X size={34} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "32px" }}>
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  color: "#FFFFFF",
                  fontSize: "28px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  textDecoration: "none",
                }}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                background: "#F7941D",
                color: "#FFFFFF",
                fontSize: "18px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.08em",
                padding: "14px 32px",
                borderRadius: "4px",
                textDecoration: "none",
                marginTop: "8px",
              }}
            >
              GET A QUOTE
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
