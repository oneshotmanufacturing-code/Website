"use client";

import React, { useState } from "react";
import { createClient } from "@/lib/supabase/client";

type Status = "idle" | "submitting" | "success" | "error";

export default function NotifyMeForm({ service }: { service: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    const supabase = createClient();
    const { error } = await supabase
      .from("service_notifications")
      .insert({ email, service });

    if (error) {
      console.error("Notify me error:", error);
      setStatus("error");
      return;
    }
    setStatus("success");
  };

  if (status === "success") {
    return (
      <p style={{ fontSize: 13, color: "#111111", fontWeight: 600 }}>
        We&apos;ll let you know!
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@company.com"
        style={{
          padding: "8px 12px",
          fontSize: 13,
          border: "1px solid #E0E0E0",
          borderRadius: 4,
          color: "#111111",
          minWidth: 200,
        }}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="btn-amber"
        style={{ padding: "8px 16px" }}
      >
        {status === "submitting" ? "Sending…" : "Notify Me"}
      </button>
      {status === "error" && (
        <p style={{ width: "100%", fontSize: 12, color: "#DC2626" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
