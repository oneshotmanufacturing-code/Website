import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  Users,
  Package,
  ClipboardList,
  FileText,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
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

  // Fetch stats
  const [
    { count: totalCustomers },
    { count: totalOrders },
    { count: newQuotes },
    { count: activeOrders },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("quote_requests").select("*", { count: "exact", head: true }).eq("status", "new"),
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

  const stats = [
    { label: "Total Customers", value: totalCustomers ?? 0, icon: Users, href: "/admin/customers", color: "text-blue-400" },
    { label: "New Quote Requests", value: newQuotes ?? 0, icon: ClipboardList, href: "/admin/quotes", color: "text-amber-400" },
    { label: "Active Orders", value: activeOrders ?? 0, icon: TrendingUp, href: "/admin/orders", color: "text-orange-400" },
    { label: "Total Orders", value: totalOrders ?? 0, icon: Package, href: "/admin/orders", color: "text-green-400" },
  ];

  const navLinks = [
    { label: "Quote Requests", icon: ClipboardList, href: "/admin/quotes" },
    { label: "Customers", icon: Users, href: "/admin/customers" },
    { label: "Orders", icon: Package, href: "/admin/orders" },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              OneShot Manufacturing Dashboard
            </h1>
            <p className="text-text-muted text-sm mt-1">{user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href}
                className="hidden md:flex items-center gap-2 text-sm text-text-secondary hover:text-accent-primary transition-colors">
                <l.icon className="w-4 h-4" /> {l.label}
              </Link>
            ))}
            <form action="/auth/signout" method="post">
              <button type="submit"
                className="flex items-center gap-2 text-sm text-text-muted hover:text-red-400 transition-colors ml-4">
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </form>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {stats.map((s) => (
            <Link key={s.label} href={s.href}
              className="glass-card p-5 hover:border-accent-primary/30 transition-colors group">
              <div className="flex items-center justify-between mb-3">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className="text-xs text-text-muted">→</span>
              </div>
              <p className={`text-3xl font-bold font-display ${s.color}`}>{s.value}</p>
              <p className="text-xs text-text-muted mt-1">{s.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Recent Quote Requests */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-text-primary flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-accent-primary" /> New Quotes
              </h2>
              <Link href="/admin/quotes" className="text-xs text-accent-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentQuotes && recentQuotes.length > 0 ? (
                recentQuotes.map((q) => (
                  <Link key={q.id} href={`/admin/quotes/${q.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/30 hover:bg-bg-tertiary/60 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{q.company_name}</p>
                      <p className="text-xs text-text-muted">{q.contact_name} · {q.service_type === "pcb" ? "PCB Assembly" : "Wire & Cable"}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                      q.status === "new" ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-text-muted bg-bg-tertiary border-border-subtle"
                    }`}>
                      {q.status}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted text-sm">No quote requests yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Orders */}
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display font-semibold text-text-primary flex items-center gap-2">
                <Truck className="w-4 h-4 text-accent-primary" /> Recent Orders
              </h2>
              <Link href="/admin/orders" className="text-xs text-accent-primary hover:underline">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentOrders && recentOrders.length > 0 ? (
                recentOrders.map((o) => (
                  <Link key={o.id} href={`/admin/orders/${o.id}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-bg-tertiary/30 hover:bg-bg-tertiary/60 transition-colors">
                    <div>
                      <p className="text-sm font-medium text-text-primary">{o.order_number}</p>
                      <p className="text-xs text-text-muted">
                        {(o.profiles as { company_name: string } | null)?.company_name ?? "—"} · {o.description.slice(0, 30)}…
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full border font-medium ${STATUS_COLORS[o.status] ?? ""}`}>
                      {STATUS_LABEL[o.status] ?? o.status}
                    </span>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-text-muted text-sm">No orders yet</p>
                  <Link href="/admin/orders/new"
                    className="text-xs text-accent-primary hover:underline mt-1 inline-block">
                    Create first order →
                  </Link>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Quick Actions */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "View All Quotes", desc: "See incoming quote requests", icon: ClipboardList, href: "/admin/quotes" },
            { label: "Manage Customers", desc: "View and add customers", icon: Users, href: "/admin/customers" },
            { label: "Create New Order", desc: "Add an order for a customer", icon: Package, href: "/admin/orders/new" },
          ].map((a) => (
            <Link key={a.href} href={a.href}
              className="glass-card p-5 hover:border-accent-primary/30 transition-all group">
              <a.icon className="w-5 h-5 text-accent-primary mb-2" />
              <p className="text-sm font-semibold text-text-primary group-hover:text-accent-primary transition-colors">
                {a.label}
              </p>
              <p className="text-xs text-text-muted mt-0.5">{a.desc}</p>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}
