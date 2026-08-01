"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, LogOut, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/messages", label: "Messages", exact: false },
  { href: "/admin/customers", label: "Customers", exact: false },
  { href: "/admin/orders", label: "Orders", exact: false },
  { href: "/admin/quotes", label: "Quotes", exact: false },
];

const linkBase: React.CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  textTransform: "uppercase",
  letterSpacing: "0.05em",
  textDecoration: "none",
  paddingBottom: "4px",
  transition: "color 0.2s, border-color 0.2s",
};

const backToSiteStyle: React.CSSProperties = {
  background: "#DC2626",
  color: "#FFFFFF",
  fontSize: "12px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  padding: "10px 20px",
  borderRadius: "4px",
  textDecoration: "none",
  whiteSpace: "nowrap",
  transition: "background 0.2s ease",
};

export default function AdminNav({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  // Close the account dropdown on outside click / Escape
  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const navLink = (href: string, label: string, exact: boolean) => {
    const active = isActive(href, exact);
    return (
      <Link
        key={href}
        href={href}
        style={{
          ...linkBase,
          color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
          borderBottom: active ? "2px solid #DC2626" : "2px solid transparent",
        }}
      >
        {label}
      </Link>
    );
  };

  const signOutButton = (
    <form action="/auth/signout" method="post">
      <button
        type="submit"
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          width: "100%",
          minHeight: "44px",
          padding: "0 16px",
          background: "transparent",
          border: "none",
          color: "#DC2626",
          fontSize: "13px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <LogOut size={15} /> Sign Out
      </button>
    </form>
  );

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        background: "#111111",
        zIndex: 50,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <div
        style={{
          padding: "0 24px",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
        }}
      >
        <Link
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
        </Link>

        {/* ── Desktop links ── */}
        <div className="admin-nav-desktop" style={{ alignItems: "center", gap: "24px" }}>
          {NAV_LINKS.map((l) => navLink(l.href, l.label, l.exact))}

          {/* Account dropdown */}
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-label="Account menu"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                minHeight: "44px",
                padding: "0 10px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.18)",
                borderRadius: "4px",
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                maxWidth: "220px",
              }}
            >
              <span
                style={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {userEmail}
              </span>
              <ChevronDown size={14} style={{ flexShrink: 0 }} />
            </button>

            {menuOpen && (
              <div
                role="menu"
                style={{
                  position: "absolute",
                  right: 0,
                  top: "calc(100% + 8px)",
                  minWidth: "240px",
                  background: "#FFFFFF",
                  border: "1px solid #E0E0E0",
                  borderRadius: "4px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
                  overflow: "hidden",
                  zIndex: 60,
                }}
              >
                <div style={{ padding: "12px 16px", borderBottom: "1px solid #EFEFEF" }}>
                  <p
                    style={{
                      margin: "0 0 2px",
                      fontSize: "11px",
                      color: "#767676",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    Signed in as
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#111111",
                      wordBreak: "break-all",
                    }}
                  >
                    {userEmail}
                  </p>
                </div>
                <div style={{ padding: "4px 0" }}>{signOutButton}</div>
              </div>
            )}
          </div>

          <Link href="/" style={backToSiteStyle}>
            ← BACK TO SITE
          </Link>
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          type="button"
          className="admin-nav-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          style={{
            width: "44px",
            height: "44px",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            color: "#FFFFFF",
            cursor: "pointer",
          }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* ── Mobile drawer ── */}
      {mobileOpen && (
        <div
          className="admin-nav-drawer"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.12)",
            padding: "8px 24px 20px",
            background: "#111111",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            {NAV_LINKS.map((l) => {
              const active = isActive(l.href, l.exact);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  style={{
                    ...linkBase,
                    display: "flex",
                    alignItems: "center",
                    minHeight: "48px",
                    paddingBottom: 0,
                    color: active ? "#FFFFFF" : "rgba(255,255,255,0.7)",
                    borderLeft: active ? "3px solid #DC2626" : "3px solid transparent",
                    paddingLeft: "12px",
                  }}
                >
                  {l.label}
                </Link>
              );
            })}
          </div>

          <div
            style={{
              marginTop: "12px",
              paddingTop: "12px",
              borderTop: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <p
              style={{
                margin: "0 0 10px",
                fontSize: "12px",
                color: "rgba(255,255,255,0.7)",
                wordBreak: "break-all",
              }}
            >
              Signed in as <strong style={{ color: "#FFFFFF" }}>{userEmail}</strong>
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/" style={backToSiteStyle}>
                ← BACK TO SITE
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    minHeight: "44px",
                    padding: "0 16px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.25)",
                    borderRadius: "4px",
                    color: "#FFFFFF",
                    fontSize: "12px",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    cursor: "pointer",
                  }}
                >
                  <LogOut size={15} /> Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
