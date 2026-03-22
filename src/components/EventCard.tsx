"use client";

import { Event } from "@/app/types";
import { confirmEvent } from "@/lib/events";
import { useState } from "react";

type Props = {
  event: Event;
};

export default function EventCard({ event }: Props) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const isDone = new Date(event.date) < new Date();

  async function handleConfirm() {
    try {
      setLoading(true);

      const ok = await confirmEvent(event.id);

      if (!ok) throw new Error("fail");

      setConfirmed(true);

      alert("+50 XP 🎉 Presença confirmada!");
    } catch (err) {
      console.error(err);
      alert("Erro ao confirmar presença");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-[var(--bege)] bg-white p-4 shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-[var(--ardosia)]">{event.title}</h3>

        {isDone && (
          <span className="rounded-full bg-[var(--bege)] px-2 py-1 text-xs text-[var(--texto-sub)]">
            Encerrado
          </span>
        )}
      </div>

      <p className="text-sm text-[var(--texto-sub)]">{event.description}</p>

      <div className="text-sm text-[var(--texto-sub)]">
        📍 {event.location}
      </div>

      <div className="text-sm text-[var(--texto-sub)]">
        🗓 {new Date(event.date).toLocaleString()}
      </div>

      {/* BUTTON */}
      {!isDone && (
        <button
          onClick={handleConfirm}
          disabled={loading || confirmed}
          className={`mt-2 py-2 rounded-xl transition ${
            confirmed
              ? "bg-[var(--verde-xp)] text-white"
              : "bg-[var(--terracota)] text-white hover:bg-[var(--ml-blue-hover)]"
          }`}
        >
          {loading
            ? "Confirmando..."
            : confirmed
            ? "Confirmado ✅"
            : "Confirmar presença (+50 XP)"}
        </button>
      )}
    </div>
  );
}