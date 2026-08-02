"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export default function VisitTracker() {
  useEffect(() => {
    if (sessionStorage.getItem("ov_session_id")) return;

    const sessionId = crypto.randomUUID();
    sessionStorage.setItem("ov_session_id", sessionId);

    createClient()
      .from("page_views")
      .insert({ session_id: sessionId })
      .then(() => {});
  }, []);

  return null;
}
