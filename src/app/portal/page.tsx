import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, FileText, User, LogOut, ClipboardList, TrendingUp } from "lucide-react";

export const metadata = { title: "My Portal" };

export default async function PortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Redirect admin to admin panel
  if (profile?.role === "admin") redirect("/admin");

  // Fetch order counts
  const { count: totalOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.id);

  const { count: activeOrders } = await supabase
    .from("orders")
    .select("*", { count: "exact", head: true })
    .eq("customer_id", user.id)
    .not("status", "in", '("delivered")');

  const { count: invoiceCount } = await supabase
    .from("documents")
    .select("*, orders!inner(customer_id)", { count: "exact", head: true })
    .eq("orders.customer_id", user.id)
    .eq("type", "invoice");

  const stats = [
    { label: "Total Orders", value: totalOrders ?? 0, icon: ClipboardList, href: "/portal/orders" },
    { label: "Active Orders", value: activeOrders ?? 0, icon: TrendingUp, href: "/portal/orders" },
    { label: "Invoices", value: invoiceCount ?? 0, icon: FileText, href: "/portal/invoices" },
  ];

  const quickLinks = [
    { label: "My Orders", desc: "Track your orders and status", icon: Package, href: "/portal/orders" },
    { label: "My Quotes", desc: "Track your quote requests", icon: ClipboardList, href: "/portal/quotes" },
    { label: "Invoices", desc: "Download your GST invoices", icon: FileText, href: "/portal/invoices" },
    { label: "My Profile", desc: "View company info & GSTIN", icon: User, href: "/portal/profile" },
  ];

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-start justify-between mb-10">
          <div>
            <p className="text-accent-primary text-xs font-semibold uppercase tracking-widest mb-1">
              Customer Portal
            </p>
            <h1 className="font-display text-3xl font-bold text-text-primary">
              Welcome, {profile?.contact_name ?? profile?.company_name ?? "Customer"}
            </h1>
            <p className="text-text-muted text-sm mt-1">{user.email}</p>
          </div>
          <form action="/auth/signout" method="post">
            <button
              type="submit"
              className="flex items-center gap-2 text-sm text-text-muted hover:text-accent-primary transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign out
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {stats.map((s) => (
            <Link key={s.label} href={s.href} className="glass-card p-6 flex items-center gap-4 hover:border-accent-primary/30 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-accent-primary/10 border border-accent-primary/20 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-primary/20 transition-colors">
                <s.icon className="w-5 h-5 text-accent-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold font-display text-text-primary">{s.value}</p>
                <p className="text-xs text-text-muted">{s.label}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickLinks.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className="glass-card p-6 hover:border-accent-primary/30 transition-all group"
            >
              <l.icon className="w-6 h-6 text-accent-primary mb-3" />
              <h3 className="font-semibold text-text-primary mb-1 group-hover:text-accent-primary transition-colors">
                {l.label}
              </h3>
              <p className="text-text-muted text-xs">{l.desc}</p>
            </Link>
          ))}
        </div>

        {/* GST info strip */}
        {profile?.gstin && (
          <div className="mt-8 glass-card px-5 py-3 flex items-center gap-3">
            <FileText className="w-4 h-4 text-text-muted flex-shrink-0" />
            <p className="text-xs text-text-muted">
              GSTIN on file: <span className="font-mono text-text-secondary">{profile.gstin}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
