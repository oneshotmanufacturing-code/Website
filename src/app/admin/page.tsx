"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Mail,
  Phone,
  Building2,
  Clock,
  ArrowRight,
  LayoutDashboard,
  Inbox,
  LogOut,
} from "lucide-react";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  created_at: string;
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setMessages(d.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const totalMessages = messages.length;
  const todayMessages = messages.filter((m) => {
    const d = new Date(m.created_at);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  return (
    <div style={{ minHeight: "100vh", background: "#FFFFFF", display: "flex", flexDirection: "column" }}>
      {/* ── Top Nav Bar (matches home page Navbar) ── */}
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
            maxWidth: "100%",
            margin: "0 auto",
            padding: "0 24px",
            height: "64px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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

          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              href="/admin"
              style={{
                color: "#FFFFFF",
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                paddingBottom: "4px",
                borderBottom: "2px solid #DC2626",
              }}
            >
              Dashboard
            </Link>
            <Link
              href="/admin/messages"
              style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "13px",
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                textDecoration: "none",
                paddingBottom: "4px",
                borderBottom: "2px solid transparent",
                transition: "color 0.2s, border-color 0.2s",
              }}
            >
              Messages
            </Link>
            <Link
              href="/"
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
            >
              ← BACK TO SITE
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero Header (Navy bg, like home hero) ── */}
      <section
        style={{
          background: "#111111",
          padding: "64px 24px 48px",
        }}
      >
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          <span
            style={{
              display: "inline-block",
              background: "#DC2626",
              color: "#FFFFFF",
              fontSize: "11px",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.10em",
              padding: "4px 10px",
              marginBottom: "20px",
            }}
          >
            ADMIN PANEL
          </span>
          <h1
            style={{
              color: "#FFFFFF",
              fontSize: "clamp(28px, 4vw, 42px)",
              fontWeight: 900,
              lineHeight: 1.1,
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            MANAGEMENT<br />DASHBOARD.
          </h1>
          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: "16px",
              fontWeight: 400,
              lineHeight: 1.6,
              maxWidth: "480px",
            }}
          >
            Monitor incoming inquiries and manage your contact submissions from one place.
          </p>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section
        style={{
          background: "#FFFFFF",
          padding: "0 24px",
          marginTop: "-24px",
          position: "relative",
          zIndex: 10,
        }}
      >
        <div
          style={{
            maxWidth: "100%",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "20px",
          }}
        >
          {/* Total Messages */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E0E0E0",
              borderRadius: "4px",
              padding: "28px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              transition: "box-shadow 0.25s ease, transform 0.25s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  background: "rgba(220,38,38,0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <MessageSquare size={20} color="#DC2626" />
              </div>
            </div>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#111111",
                lineHeight: 1,
              }}
            >
              {loading ? "—" : totalMessages}
            </p>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                color: "#AAAAAA",
                marginTop: "8px",
              }}
            >
              TOTAL MESSAGES
            </p>
          </div>

          {/* Today */}
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid #E0E0E0",
              borderRadius: "4px",
              padding: "28px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  background: "rgba(17,17,17,0.08)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Clock size={20} color="#111111" />
              </div>
            </div>
            <p
              style={{
                fontSize: "36px",
                fontWeight: 900,
                color: "#111111",
                lineHeight: 1,
              }}
            >
              {loading ? "—" : todayMessages}
            </p>
            <p
              style={{
                fontSize: "11px",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.10em",
                color: "#AAAAAA",
                marginTop: "8px",
              }}
            >
              TODAY&apos;S INQUIRIES
            </p>
          </div>

          {/* Quick Link */}
          <Link
            href="/admin/messages"
            style={{
              background: "#111111",
              borderRadius: "4px",
              padding: "28px 24px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
              textDecoration: "none",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              transition: "transform 0.25s ease",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  borderRadius: "4px",
                  background: "rgba(220,38,38,0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Inbox size={20} color="#DC2626" />
              </div>
              <ArrowRight size={18} color="rgba(255,255,255,0.4)" />
            </div>
            <div>
              <p
                style={{
                  fontSize: "16px",
                  fontWeight: 700,
                  color: "#FFFFFF",
                  marginBottom: "4px",
                }}
              >
                View All Messages
              </p>
              <p
                style={{
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.5)",
                }}
              >
                Open the full inbox →
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Recent Messages ── */}
      <section style={{ padding: "48px 24px 80px", flex: 1 }}>
        <div style={{ maxWidth: "100%", margin: "0 auto" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "32px",
            }}
          >
            <div>
              <span
                style={{
                  display: "inline-block",
                  fontSize: "11px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.12em",
                  color: "#DC2626",
                  marginBottom: "8px",
                }}
              >
                RECENT
              </span>
              <h2
                style={{
                  fontSize: "28px",
                  fontWeight: 700,
                  color: "#111111",
                  lineHeight: 1.15,
                }}
              >
                LATEST INQUIRIES
              </h2>
            </div>
            <Link
              href="/admin/messages"
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
            >
              VIEW ALL →
            </Link>
          </div>

          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0" }}>
              <div
                style={{
                  width: "32px",
                  height: "32px",
                  border: "3px solid #E0E0E0",
                  borderTopColor: "#DC2626",
                  borderRadius: "50%",
                  animation: "spin 0.8s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ color: "#AAAAAA", fontSize: "14px" }}>Loading messages…</p>
              <style dangerouslySetInnerHTML={{ __html: `@keyframes spin { to { transform: rotate(360deg); } }` }} />
            </div>
          ) : messages.length === 0 ? (
            <div
              style={{
                textAlign: "center",
                padding: "80px 24px",
                background: "#F5F5F5",
                borderRadius: "4px",
                border: "1px dashed #E0E0E0",
              }}
            >
              <MessageSquare
                size={40}
                color="#AAAAAA"
                style={{ margin: "0 auto 16px", opacity: 0.4 }}
              />
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "#111111",
                  marginBottom: "8px",
                }}
              >
                No messages yet
              </h3>
              <p style={{ fontSize: "14px", color: "#555555", maxWidth: "320px", margin: "0 auto" }}>
                Inquiries from the contact form on your website will appear here.
              </p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {messages.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E0E0E0",
                    borderLeft: "4px solid #DC2626",
                    borderRadius: "4px",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                    transition: "box-shadow 0.25s ease, transform 0.25s ease",
                  }}
                >
                  {/* Card Header */}
                  <div
                    style={{
                      padding: "20px 24px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      borderBottom: "1px solid #F5F5F5",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div
                        style={{
                          width: "44px",
                          height: "44px",
                          borderRadius: "50%",
                          background: "#111111",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#DC2626",
                          fontSize: "18px",
                          fontWeight: 800,
                        }}
                      >
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: "16px",
                            fontWeight: 700,
                            color: "#111111",
                          }}
                        >
                          {m.name}
                        </p>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "12px",
                            marginTop: "4px",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "12px",
                              color: "#555555",
                              display: "flex",
                              alignItems: "center",
                              gap: "4px",
                            }}
                          >
                            <Mail size={12} color="#DC2626" /> {m.email}
                          </span>
                          {m.phone && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#555555",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Phone size={12} color="#DC2626" /> {m.phone}
                            </span>
                          )}
                          {m.company && (
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#555555",
                                display: "flex",
                                alignItems: "center",
                                gap: "4px",
                              }}
                            >
                              <Building2 size={12} color="#DC2626" /> {m.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          color: "#AAAAAA",
                          textTransform: "uppercase",
                          letterSpacing: "0.08em",
                        }}
                      >
                        {new Date(m.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#AAAAAA",
                        }}
                      >
                        {new Date(m.created_at).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div style={{ padding: "16px 24px 20px" }}>
                    <p
                      style={{
                        fontSize: "14px",
                        color: "#555555",
                        lineHeight: 1.6,
                        fontStyle: "italic",
                      }}
                    >
                      &ldquo;{m.message}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer (matching home page) ── */}
      <footer
        style={{
          background: "#111111",
          padding: "24px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.4)",
            letterSpacing: "0.05em",
          }}
        >
          © {new Date().getFullYear()} OneShot Manufacturing — Admin Panel
        </p>
      </footer>
    </div>
  );
}
