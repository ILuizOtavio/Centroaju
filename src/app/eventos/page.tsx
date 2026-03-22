"use client";

import { useEffect, useState } from "react";
import { fetchEvents } from "@/lib/events";
import EventCard from "@/components/EventCard";
import { Event } from "@/app/types";

export default function EventosPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filter, setFilter] = useState<"upcoming" | "done">("upcoming");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const data = await fetchEvents(filter);
        setEvents(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, [filter]);

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Eventos</h1>

      {/* FILTER */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setFilter("upcoming")}
          className={`px-3 py-1 rounded ${
            filter === "upcoming" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Próximos
        </button>

        <button
          onClick={() => setFilter("done")}
          className={`px-3 py-1 rounded ${
            filter === "done" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Encerrados
        </button>
      </div>

      {/* LOADING */}
      {loading && <p>Carregando eventos...</p>}

      {/* LIST */}
      {!loading && (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}