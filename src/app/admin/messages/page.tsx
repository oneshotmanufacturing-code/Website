import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { 
  MessageSquare, 
  ArrowLeft, 
  Mail, 
  Phone, 
  Building2, 
  Calendar,
  User
} from "lucide-react";

export const metadata = { title: "Inquiry Messages | Admin" };

export default async function AdminMessagesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/portal");

  const { data: messages, error } = await supabase
    .from("contact_submissions")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="min-h-screen py-24 px-4 bg-bg-primary">
      <div className="max-w-6xl mx-auto">
        
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 mb-6">
          <Link href="/admin" className="text-text-muted hover:text-accent-primary transition-colors flex items-center gap-1 text-sm font-medium">
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <span className="text-text-muted/30">/</span>
          <span className="text-text-secondary text-sm font-medium">Messages</span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold text-text-primary flex items-center gap-3">
              <MessageSquare className="w-8 h-8 text-accent-primary" />
              Inquiry Messages
            </h1>
            <p className="text-text-muted text-sm mt-1">
              Review and manage incoming contact form submissions.
            </p>
          </div>
          <div className="px-4 py-2 rounded-xl bg-accent-primary/10 border border-accent-primary/20 text-accent-primary text-sm font-bold uppercase tracking-wider">
            {messages?.length ?? 0} Total
          </div>
        </div>

        {error ? (
          <div className="p-8 text-center glass-card border-red-500/20">
            <p className="text-red-400 font-medium">Error loading messages: {error.message}</p>
          </div>
        ) : messages && messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((m) => (
              <div key={m.id} className="glass-card overflow-hidden group hover:border-accent-primary/30 transition-all duration-300">
                <div className="p-6 border-b border-border-subtle bg-bg-tertiary/20 group-hover:bg-bg-tertiary/40 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-accent-primary/10 flex items-center justify-center text-accent-primary font-bold text-lg border border-accent-primary/20">
                        {m.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-display font-bold text-text-primary text-lg">{m.name}</h3>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span className="text-xs text-text-muted flex items-center gap-1.5">
                            <Mail className="w-3.5 h-3.5 text-accent-primary" /> {m.email}
                          </span>
                          {m.phone && (
                            <span className="text-xs text-text-muted flex items-center gap-1.5">
                              <Phone className="w-3.5 h-3.5 text-accent-primary" /> {m.phone}
                            </span>
                          )}
                          {m.company && (
                            <span className="text-xs text-text-muted flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-accent-primary" /> {m.company}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs text-text-muted flex items-center justify-end gap-1.5 font-mono uppercase tracking-widest">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(m.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-bg-primary">
                   <div className="relative">
                      <div className="absolute -left-2 top-0 bottom-0 w-1 bg-accent-primary/20 rounded-full" />
                      <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-wrap pl-4 italic">
                        &quot;{m.message}&quot;
                      </p>
                   </div>
                </div>
                <div className="px-6 py-4 bg-bg-tertiary/10 border-t border-border-subtle flex justify-end gap-3">
                   <a href={`mailto:${m.email}`} className="px-4 py-2 rounded-lg bg-accent-primary text-white text-xs font-bold uppercase tracking-wider hover:bg-accent-hover transition-colors flex items-center gap-2">
                     <Mail className="w-3.5 h-3.5" /> Reply via Email
                   </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center glass-card border-dashed">
            <MessageSquare className="w-12 h-12 text-text-muted mx-auto mb-4 opacity-30" />
            <h3 className="font-display text-xl font-bold text-text-primary mb-2">No messages yet</h3>
            <p className="text-text-muted text-sm max-w-sm mx-auto">
              Inquiries from the contact forms will appear here for you to manage.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
