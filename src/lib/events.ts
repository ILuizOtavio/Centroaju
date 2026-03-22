import { supabase } from "@/lib/supabase/client";
import { Event } from "@/app/types";

export async function fetchEvents(status?: "upcoming" | "done") {
  try {
    let query = supabase
      .from("events")
      .select("*")
      .order("date", { ascending: true });

    const now = new Date().toISOString();

    if (status === "upcoming") {
      query = query.gte("date", now);
    }

    if (status === "done") {
      query = query.lt("date", now);
    }

    const { data, error } = await query;

    if (error) throw error;

    return (data ?? []) as Event[];
  } catch (err) {
    console.error("[fetchEvents]", err);
    return [];
  }
}

export async function confirmEvent(eventId: string) {
  try {
    const { error } = await supabase.rpc("confirm_event", {
      p_event_id: eventId,
    });

    if (error) throw error;

    return true;
  } catch (err) {
    console.error("[confirmEvent]", err);
    return false;
  }
}