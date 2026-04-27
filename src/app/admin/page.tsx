import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  MessageSquare,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  ArrowRight,
} from "lucide-react";

export const metadata = { title: "Admin Panel" };

const STATUS_COLORS: Record<string, string> = {
  confirmed: "text-blue-400 bg-blue-400/10 border-blue-400/20",
  material_ready: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20",
  in_production: "text-orange-400 bg-orange-400/10 border-orange-400/20",
  quality_check: "text-purple-400 bg-purple-400/10 border-purple-400/20",
  dispatched: "text-accent-primary bg-accent-primary/10 border-accent-primary/20",
  delivered: "text-green-400 bg-green-400/10 border-green-400/20",
};

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  material_ready: "Material Ready",
  in_production: "In Production",
  quality_check: "Quality Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

  // Fetch stats including new contact submissions
  const [
    { count: totalCustomers },
    { count: totalOrders },
    { count: newQuotes },
    { count: totalMessages },
    { count: activeOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
    supabase.from("contact_submissions").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).not("status", "in", '("delivered")'),
  ]);

  // Recent orders
  const { data: recentOrders } = await supabase
    .from("orders")
    .select("*, profiles(company_name)")
    .order("created_at", { ascending: false })
    .limit(5);

  // Recent quote requests
  const { data: recentQuotes } = await supabase
    .from("quote_requests")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  // Recent contact messages
  const { data: recentMessages } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    { label: "Total Customers", value: totalCustomers ?? 0, icon: Users, href: "/admin/customers", color: "text-blue-400" },
    { label: "New Quotes", value: newQuotes ?? 0, icon: ClipboardList, href: "/admin/quotes", color: "text-amber-400" },
    { label: "Messages", value: totalMessages ?? 0, icon: MessageSquare, href: "/admin/messages", color: "text-violet-400" },
    { label: "Active Orders", value: activeOrders ?? 0, icon: TrendingUp, href: "/admin/orders", color: "text-orange-400" },
    { label: "Total Orders", value: totalOrders ?? 0, icon: Package, href: "/admin/orders", color: "text-green-400" },
  ];

  const navLinks = [
    { label: "Quotes", icon: ClipboardList, href: "/admin/quotes" },
    { label: "Messages", icon: MessageSquare, href: "/admin/messages" },
    { label: "Customers", icon: Users, href: "/admin/customers" },
    { label: "Orders", icon: Package, href: "/admin/orders" },
  ];

  return (
    <div className="min-h-screen py-24 px-4 bg-bg-primary">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-accent-primary text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              Management Portal
            </p>
            <h1 className="font-display text-4xl font-bold text-text-primary">
              Admin Dashboard
            </h1>
            <p className="text-text-muted text-sm mt-2 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Logged in as <span className="text-text-secondary font-medium">{user.email}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-bg-tertiary border border-border-subtle text-text-secondary hover:text-accent-primary hover:border-accent-primary/30 transition-all">
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post" className="ml-2">
              <button type="submit"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-text-muted hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-10">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}
              className="glass-card p-6 hover:border-accent-primary/30 transition-all duration-300 group relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-16 h-16 bg-gradient-to-br from-white/5 to-transparent rounded-full" />
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg bg-bg-tertiary border border-border-subtle group-hover:scale-110 transition-transform`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <ArrowRight className="w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>
              <p className={`text-3xl font-bold font-display tracking-tight text-text-primary`}>{s.value}</p>
              <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mt-1">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Recent Quote Requests */}
          <div className="lg:col-span-1 glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-text-primary flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-400/10 flex items-center justify-center">
                   <ClipboardList className="w-4 h-4 text-amber-400" />
                </div>
                New Quotes
              </h2>
              <Link href="/admin/quotes" className="text-xs font-bold text-accent-primary hover:underline uppercase tracking-wider">
                View All
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              {recentQuotes && recentQuotes.length > 0 ? (
                recentQuotes.map((q) => (
                  <Link key={q.id} href={`/admin/quotes/${q.id}`}
                    className="block group">
                    <div className="p-4 rounded-xl bg-bg-tertiary/40 border border-transparent group-hover:border-accent-primary/20 group-hover:bg-bg-tertiary/80 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{q.company_name}</p>
                        <span className="text-[10px] font-bold uppercase tracking-tight px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-400 border border-amber-400/20">
                          {q.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-1">{q.contact_name} · {q.service_type.replace('_', ' ')}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-3">
                    <ClipboardList className="w-6 h-6 text-text-muted" />
                  </div>
                  <p className="text-text-muted text-sm font-medium">No new requests</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Messages */}
          <div className="lg:col-span-1 glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-text-primary flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-violet-400/10 flex items-center justify-center">
                   <MessageSquare className="w-4 h-4 text-violet-400" />
                </div>
                Recent Messages
              </h2>
              <Link href="/admin/messages" className="text-xs font-bold text-accent-primary hover:underline uppercase tracking-wider">
                Inbox
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              {recentMessages && recentMessages.length > 0 ? (
                recentMessages.map((m) => (
                  <Link key={m.id} href={`/admin/messages`}
                    className="block group">
                    <div className="p-4 rounded-xl bg-bg-tertiary/40 border border-transparent group-hover:border-accent-primary/20 group-hover:bg-bg-tertiary/80 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{m.name}</p>
                        <span className="text-[10px] text-text-muted font-mono">
                          {new Date(m.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">{m.message}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                   <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-3">
                    <MessageSquare className="w-6 h-6 text-text-muted" />
                  </div>
                  <p className="text-text-muted text-sm font-medium">Your inbox is empty</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="lg:col-span-1 glass-card p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display font-bold text-lg text-text-primary flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                   <Truck className="w-4 h-4 text-green-400" />
                </div>
                Live Orders
              </h2>
              <Link href="/admin/orders" className="text-xs font-bold text-accent-primary hover:underline uppercase tracking-wider">
                Full List
              </Link>
            </div>
            <div className="space-y-4 flex-1">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((o) => (
                  <Link key={o.id} href={`/admin/orders/${o.id}`}
                    className="block group">
                    <div className="p-4 rounded-xl bg-bg-tertiary/40 border border-transparent group-hover:border-accent-primary/20 group-hover:bg-bg-tertiary/80 transition-all">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-sm font-bold text-text-primary group-hover:text-accent-primary transition-colors">{o.order_number}</p>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${STATUS_COLORS[o.status] ?? ""}`}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                      <p className="text-xs text-text-muted line-clamp-1">
                        {(o.profiles as any)?.company_name ?? "Private Customer"} · {o.description}
                      </p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-bg-tertiary flex items-center justify-center mb-3">
                    <Package className="w-6 h-6 text-text-muted" />
                  </div>
                  <p className="text-text-muted text-sm font-medium">No active orders</p>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Action Grid */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { label: "Quote Management", desc: "Review and respond to inquiries", icon: ClipboardList, href: "/admin/quotes", color: "bg-amber-400/10 text-amber-400" },
            { label: "Customer Relations", desc: "Manage accounts and profiles", icon: Users, href: "/admin/customers", color: "bg-blue-400/10 text-blue-400" },
            { label: "Order Fulfilment", desc: "Create and update production jobs", icon: Package, href: "/admin/orders", color: "bg-green-400/10 text-green-400" },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="glass-card p-6 hover:translate-y-[-4px] hover:shadow-xl transition-all duration-300 group">
              <div className={`w-10 h-10 rounded-xl ${a.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <a.icon className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-text-primary group-hover:text-accent-primary transition-colors">
                {a.label}
              </h3>
              <p className="text-xs text-text-muted mt-2 leading-relaxed">{a.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
