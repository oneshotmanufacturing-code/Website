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
  Inbox,
  FileText,
  ShoppingBag,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface Message {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  message: string;
  created_at: string;
}

interface Stats {
  total: number;
  today: number;
}

export default function AdminPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageStats, setMessageStats] = useState<Stats>({ total: 0, today: 0 });
  const [quoteStats, setQuoteStats] = useState<Stats>({ total: 0, today: 0 });
  const [orderStats, setOrderStats] = useState<Stats>({ total: 0, today: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      const supabase = createClient();

      try {
        // 1. Messages
        const { data: msgData } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
        const msgs = msgData || [];
        setMessages(msgs);

        const todayStr = new Date().toDateString();
        const todayMsgs = msgs.filter((m) => new Date(m.created_at).toDateString() === todayStr).length;
        setMessageStats({ total: msgs.length, today: todayMsgs });

        // 2. Quotes
        const { count: totalQuotes } = await supabase.from("quote_requests").select("*", { count: "exact", head: true });
        const { data: todayQuotes } = await supabase.from("quote_requests").select("id", {
          count: "exact",
          head: true,
          filter: `created_at >= '${new Date().toISOString().split('T')[0]}'`
        });
        // Note: The above filter is simplified; for real production we'd use a proper date range.
        // Since we are in client side and it's a dashboard, a simple count is okay.
        setQuoteStats({ total: totalQuotes || 0, today: 0 }); // Today's quotes require a complex filter on anon client, we'll stick to total for now.

        // 3. Orders
        const { count: totalOrders } = await supabase.from("orders").select("*", { count: "exact", head: true });
        setOrderStats({ total: totalOrders || 0, today: 0 });

      } catch (e) {
        console.error("Dashboard load failed:", e);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ── Hero Header ── */}
      <section className="bg-navy px-6 py-16 lg:px-8">
        <div className="max-w-full mx-auto">
          <span className="amber-badge mb-5">
            ADMIN PANEL
          </span>
          <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-black uppercase leading-tight mb-3">
            MANAGEMENT<br />DASHBOARD.
          </h1>
          <p className="text-white/60 text-base font-normal leading-relaxed max-w-[480px]">
            Monitor incoming inquiries, track active orders, and manage your quote requests from one place.
          </p>
        </div>
      </section>

      {/* ── Stats Row ── */}
      <section className="bg-white px-6 py-0 lg:px-8 -mt-6 relative z-10">
        <div className="max-w-full mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Total Messages */}
          <div className="bg-white border border-gray-300-cl rounded p-7 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded bg-amber-light flex items-center justify-center">
                <MessageSquare size={20} className="text-amber" />
              </div>
            </div>
            <p className="text-4xl font-black text-text-dark leading-none">
              {loading ? "—" : messageStats.total}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-announcement text-text-light mt-2">
              TOTAL MESSAGES
            </p>
          </div>

          {/* Today's Inquiries */}
          <div className="bg-white border border-gray-300-cl rounded p-7 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded bg-gray-100-cl flex items-center justify-center">
                <Clock size={20} className="text-text-dark" />
              </div>
            </div>
            <p className="text-4xl font-black text-text-dark leading-none">
              {loading ? "—" : messageStats.today}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-announcement text-text-light mt-2">
              TODAY&apos;S INQUIRIES
            </p>
          </div>

          {/* Total Quotes */}
          <div className="bg-white border border-gray-300-cl rounded p-7 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded bg-amber-light flex items-center justify-center">
                <FileText size={20} className="text-amber" />
              </div>
            </div>
            <p className="text-4xl font-black text-text-dark leading-none">
              {loading ? "—" : quoteStats.total}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-announcement text-text-light mt-2">
              QUOTE REQUESTS
            </p>
          </div>

          {/* Total Orders */}
          <div className="bg-white border border la-gray-300-cl rounded p-7 shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 rounded bg-gray-100-cl flex items-center justify-center">
                <ShoppingBag size={20} className="text-text-dark" />
              </div>
            </div>
            <p className="text-4xl font-black text-text-dark leading-none">
              {loading ? "—" : orderStats.total}
            </p>
            <p className="text-[11px] font-bold uppercase tracking-announcement text-text-light mt-2">
              TOTAL ORDERS
            </p>
          </div>
        </div>
      </section>

      {/* ── Recent Messages ── */}
      <section className="px-6 py-12 lg:px-8 flex-1">
        <div className="max-w-full mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="eyebrow">RECENT</span>
              <h2 className="text-3xl font-bold text-text-dark leading-tight">
                LATEST INQUIRIES
              </h2>
            </div>
            <Link
              href="/admin/messages"
              className="bg-amber text-white text-xs font-bold uppercase tracking-announcement px-5 py-2.5 rounded transition-colors hover:bg-amber-hover"
            >
              VIEW ALL →
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="w-8 h-8 border-3 border-gray-300-cl border-t-amber rounded-full animate-spin mx-auto mb-4" />
              <p className="text-text-light text-sm">Loading messages…</p>
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-20 bg-gray-100-cl rounded border border-dashed border-gray-300-cl">
              <MessageSquare size={40} className="mx-auto mb-4 text-text-light opacity-40" />
              <h3 className="text-lg font-bold text-text-dark mb-2">No messages yet</h3>
              <p className="text-text-mid text-sm max-w-xs mx-auto">
                Inquiries from the contact form on your website will appear here.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {messages.slice(0, 5).map((m) => (
                <div
                  key={m.id}
                  className="bg-white border border-gray-300-cl border-l-4 border-l-amber rounded shadow-card transition-all hover:shadow-card-hover overflow-hidden"
                >
                  <div className="p-5 flex items-center justify-between border-b border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-full bg-navy flex items-center justify-center text-amber text-lg font-black">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-base font-bold text-text-dark">
                          {m.name}
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                          <span className="text-xs text-text-mid flex items-center gap-1">
                            <Mail size={12} className="text-amber" /> {m.email}
                          </span>
                          {m.phone && (
                            <span className="text-xs text-text-mid flex items-center gap-1">
                              <Phone size={12} className="text-amber" /> {m.phone}
                            </span>
                          )}
                          {m.company && (
                            <span className="text-xs text-text-mid flex items-center gap-1">
                              <Building2 size={12} className="text-amber" /> {m.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[11px] font-bold uppercase tracking-announcement text-text-light">
                        {new Date(m.created_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-[11px] text-text-light">
                        {new Date(m.created_at).toLocaleTimeString(undefined, {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 lg:p-6">
                    <p className="text-sm text-text-mid leading-relaxed italic">
                      &ldquo;{m.message}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <footer className="bg-navy p-6 text-center">
        <p className="text-[12px] text-white/40 tracking-announcement">
          © {new Date().getFullYear()} OneShot Manufacturing — Admin Panel
        </p>
      </footer>
    </div>
  );
}
