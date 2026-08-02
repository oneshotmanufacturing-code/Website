"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Mail,
  Phone,
  Building2,
  ArrowLeft,
  Inbox,
  Clock,
  Search,
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

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/contact")
      .then((r) => r.json())
      .then((d) => setMessages(d.data || []))
      .catch(() => setMessages([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = messages.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.company.toLowerCase().includes(search.toLowerCase()) ||
      m.message.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Header ── */}
      <section className="bg-navy px-6 py-12 lg:px-8">
        <div className="max-w-full mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6">
            <Link
              href="/admin"
              className="text-white/50 text-xs font-semibold flex items-center gap-1 transition-colors hover:text-white"
            >
              <ArrowLeft size={14} /> Dashboard
            </Link>
            <span className="text-white/20 text-xs">/</span>
            <span className="text-amber text-xs font-bold uppercase tracking-announcement">
              Messages
            </span>
          </div>

          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <span className="amber-badge mb-4">
                INBOX
              </span>
              <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight">
                INQUIRY MESSAGES
              </h1>
              <p className="text-white/50 text-sm mt-2">
                Review and manage incoming contact form submissions.
              </p>
            </div>

            <div className="bg-amber-light/20 border border-amber/30 px-4 py-2 rounded">
              <p className="text-[11px] font-bold uppercase tracking-announcement text-amber">
                {messages.length} Total
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Search ── */}
      <section className="bg-white px-6 py-0 lg:px-8 -mt-5 relative z-10">
        <div className="max-w-full mx-auto">
          <div className="bg-white border border-gray-300-cl rounded shadow-card p-3 flex items-center gap-3">
            <Search size={18} className="text-text-light" />
            <input
              type="text"
              placeholder="Search by name, email, company, or message..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border-none outline-none text-sm text-text-dark bg-transparent"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="bg-none border-none cursor-pointer text-text-light text-xs font-bold uppercase"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── Message List ── */}
      <section className="px-6 py-8 lg:px-8 flex-1">
        <div className="max-w-full mx-auto">
          {loading ? (
            <div className="text-center py-20">
              <div className="w-8 h-8 border-3 border-gray-300-cl border-t-amber rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-light text-sm">
                Loading messages…
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 bg-gray-100-cl rounded border border-dashed border-gray-300-cl">
              <Inbox size={40} className="mx-auto mb-4 text-text-light opacity-40" />
              <h3 className="text-lg font-bold text-text-dark mb-2">
                {search ? "No matching messages" : "No messages yet"}
              </h3>
              <p className="text-text-mid text-sm max-w-xs mx-auto">
                {search
                  ? "Try a different search term."
                  : "Inquiries from the contact form will appear here."}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {filtered.map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-gray-300-cl border-l-4 border-l-amber rounded shadow-card overflow-hidden transition-all hover:shadow-card-hover"
                >
                  {/* Card Header */}
                  <div className="p-5 flex items-center justify-between flex-wrap gap-3 bg-gray-100-cl border-b border-gray-300-cl">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center text-amber text-xl font-black shrink-0">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-bold text-text-dark mb-1">
                          {m.name}
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <span className="text-xs text-text-mid flex items-center gap-1">
                            <Mail size={13} className="text-amber" /> {m.email}
                          </span>
                          {m.phone && (
                            <span className="text-xs text-text-mid flex items-center gap-1">
                              <Phone size={13} className="text-amber" /> {m.phone}
                            </span>
                          )}
                          {m.company && (
                            <span className="text-xs text-text-mid flex items-center gap-1">
                              <Building2 size={13} className="text-amber" /> {m.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold text-text-mid flex items-center justify-end gap-1">
                        <Clock size={12} className="text-text-light" />
                        {new Date(m.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[11px] text-text-light mt-0.5">
                        {new Date(m.created_at).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>

                  {/* Card Body — Message */}
                  <div className="p-5 lg:p-6">
                    <div className="border-l-3 border-amber/30 pl-4">
                      <p className="text-sm text-text-mid leading-relaxed italic whitespace-pre-wrap">
                        &ldquo;{m.message}&rdquo;
                      </p>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="p-3 flex justify-end bg-gray-100-cl border-t border-gray-300-cl">
                    <a
                      href={`mailto:${m.email}`}
                      className="bg-amber text-white text-xs font-bold uppercase tracking-announcement px-4 py-2 rounded transition-colors hover:bg-amber-hover flex items-center gap-2"
                    >
                      <Mail size={13} /> Reply via Email
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-navy p-6 text-center">
        <p className="text-[12px] text-white/40 tracking-announcement">
          © {new Date().getFullYear()} OneShot Manufacturing — Admin Panel
        </p>
      </footer>
    </div>
  );
}
