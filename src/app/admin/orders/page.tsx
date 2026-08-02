import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Package, Plus } from "lucide-react";

export const metadata = { title: "Orders | Admin — OneShot Manufacturing" };

const STATUS_LABEL: Record<string, string> = {
  confirmed: "Confirmed",
  material_ready: "Material Ready",
  in_production: "In Production",
  quality_check: "Quality Check",
  dispatched: "Dispatched",
  delivered: "Delivered",
};

const STATUS_CLASS: Record<string, string> = {
  confirmed: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
  material_ready: "bg-[#FFFBEB] text-[#D97706] border-[#FDE68A]",
  in_production: "bg-[#FFF7ED] text-[#EA580C] border-[#FED7AA]",
  quality_check: "bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]",
  dispatched: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
  delivered: "bg-[#F0FDF4] text-[#16A34A] border-[#BBF7D0]",
};

export default async function AdminOrdersPage() {
  const supabase = await createClient();

  const { data: orders } = await supabase
    .from("orders")
    .select("id, order_number, description, quantity, amount, status, expected_delivery, created_at, profiles(company_name, contact_name)")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <section className="bg-navy px-6 py-12 lg:px-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <span className="amber-badge mb-4">ORDERS</span>
            <h1 className="text-white text-2xl md:text-3xl lg:text-4xl font-black uppercase leading-tight">ORDER MANAGEMENT</h1>
            <p className="text-white/50 text-sm mt-2">Track and manage all manufacturing orders.</p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="bg-amber-light/20 border border-amber/30 px-4 py-2 rounded">
              <p className="text-[11px] font-bold uppercase tracking-announcement text-amber">{orders?.length ?? 0} Total</p>
            </div>
            <Link href="/admin/orders/new" className="bg-amber text-white text-xs font-bold uppercase tracking-announcement px-5 py-2.5 rounded flex items-center gap-2 hover:bg-amber-hover transition-colors">
              <Plus size={14} /> NEW ORDER
            </Link>
          </div>
        </div>
      </section>

      {/* List */}
      <section className="px-6 py-8 lg:px-8 flex-1">
        {orders && orders.length > 0 ? (
          <div className="flex flex-col gap-3">
            {orders.map((o) => {
              const customer = o.profiles as unknown as { company_name: string; contact_name: string } | null;
              const sc = STATUS_CLASS[o.status] ?? "bg-gray-100-cl text-text-mid border-gray-300-cl";
              return (
                <Link key={o.id} href={`/admin/orders/${o.id}`} className="group block transition-all">
                  <div className="w-full bg-white border border-gray-300-cl border-l-4 border-l-amber rounded shadow-card p-4 flex items-center justify-between flex-wrap gap-3 cursor-pointer group-hover:shadow-card-hover">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="text-sm font-bold text-amber font-mono">{o.order_number}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${sc}`}>
                          {STATUS_LABEL[o.status] ?? o.status}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-text-dark">{customer?.company_name ?? "—"}</p>
                      <p className="text-xs text-text-mid mt-0.5">
                        {o.description?.slice(0, 70)}{(o.description?.length ?? 0) > 70 ? "…" : ""}
                        {o.quantity ? ` · Qty: ${o.quantity}` : ""}
                        {o.amount ? ` · ₹${Number(o.amount).toLocaleString("en-IN")}` : ""}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      {o.expected_delivery && (
                        <div className="flex flex-col">
                          <p className="text-[10px] text-text-light uppercase tracking-announcement">Expected</p>
                          <p className="text-xs font-bold text-text-mid">
                            {new Date(o.expected_delivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-100-cl rounded border border-dashed border-gray-300-cl">
            <Package size={40} className="mx-auto mb-4 text-text-light opacity-40" />
            <h3 className="text-lg font-bold text-text-dark mb-2">No orders yet</h3>
            <p className="text-text-mid text-sm mb-4">Orders will appear here once created.</p>
            <Link href="/admin/orders/new" className="inline-flex items-center gap-2 bg-amber text-white px-5 py-2 rounded text-xs font-bold uppercase tracking-announcement hover:bg-amber-hover transition-colors">
              <Plus size={14} /> Create First Order
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
