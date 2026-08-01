"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar({ solid = false }: { solid?: boolean }) {
  const [isScrolled, setIsScrolled] = useState(solid);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  useEffect(() => {
    if (solid) return;
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [solid]);

  const navLinks = [
    { name: "Services", href: "/#services" },
    { name: "Why Us",   href: "/#why-us" },
    { name: "Process",  href: "/#process" },
    { name: "Contact",  href: "/#contact" },
  ];

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 60,
      }}
    >
      {/* Announcement Bar */}
      {isBannerVisible && (
        <div
          style={{
            width: "100%",
            height: "40px",
            background: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: "#FFFFFF",
              textAlign: "center",
              padding: "0 40px",
            }}
          >
            Zero-Defect Guarantee &nbsp;|&nbsp; Free Pickup &amp; Delivery Across India &nbsp;|&nbsp; ESD-Safe Handling
          </p>
          <button
            onClick={() => setIsBannerVisible(false)}
            aria-label="Dismiss announcement"
            style={{
              position: "absolute",
              right: "16px",
              background: "none",
              border: "none",
              color: "#FFFFFF",
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "opacity 0.2s ease",
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.7"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <nav
        style={{
          width: "100%",
          background: isScrolled ? "rgba(17, 17, 17, 0.95)" : "transparent",
          backdropFilter: isScrolled ? "blur(8px)" : "none",
          WebkitBackdropFilter: isScrolled ? "blur(8px)" : "none",
          boxShadow: isScrolled ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
          transition: "background 0.3s ease, box-shadow 0.3s ease, backdrop-filter 0.3s ease",
        }}
      >
        <div
          style={{
            width: "100%",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {/* Logo */}
          <div style={{ flex: 1, display: "flex", justifyContent: "flex-start" }}>
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
              <span style={{ color: "#DC2626" }}>ONESHOT</span> MANUFACTURING
            </a>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center justify-center" style={{ flex: "none", gap: "36px" }}>
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
                  (e.currentTarget as HTMLAnchorElement).style.borderBottomColor = "#DC2626";
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
          <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "16px" }}>
            <a
              href="/quote"
              className="hidden md:inline-flex"
              style={{
                background: "#DC2626",
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
                (e.currentTarget as HTMLAnchorElement).style.background = "#B91C1C";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.background = "#DC2626";
              }}
            >
              GET A QUOTE
            </a>

            <button
              className="md:hidden focus:outline-none"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open mobile menu"
              style={{ color: "#FFFFFF", background: "none", border: "none", cursor: "pointer", marginLeft: "auto" }}
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
              background: "#111111",
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
                href="/quote"
                onClick={() => setIsMobileMenuOpen(false)}
                style={{
                  background: "#DC2626",
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
    </header>
  );
}
