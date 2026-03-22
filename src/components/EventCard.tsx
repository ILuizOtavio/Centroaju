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
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">{event.title}</h3>

        {isDone && (
          <span className="text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
            Encerrado
          </span>
        )}
      </div>

      <p className="text-sm text-gray-600">{event.description}</p>

      <div className="text-sm text-gray-500">
        📍 {event.location}
      </div>

      <div className="text-sm text-gray-500">
        🗓 {new Date(event.date).toLocaleString()}
      </div>

      {/* BUTTON */}
      {!isDone && (
        <button
          onClick={handleConfirm}
          disabled={loading || confirmed}
          className={`mt-2 py-2 rounded-xl transition ${
            confirmed
              ? "bg-green-600 text-white"
              : "bg-blue-600 text-white hover:bg-blue-700"
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