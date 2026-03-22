"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";

type FormData = {
  title: string;
  description: string;
  location: string;
  type: string;
  date: string;
};

export default function PublishEventForm() {
  const [form, setForm] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    type: "",
    date: "",
  });

  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await supabase.from("events").insert([form]);

      if (error) throw error;

      alert("Evento publicado 🚀");

      setForm({
        title: "",
        description: "",
        location: "",
        type: "",
        date: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao publicar evento");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input
        placeholder="Título"
        required
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />

      <input
        placeholder="Local"
        required
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
      />

      <input
        placeholder="Tipo"
        value={form.type}
        onChange={(e) => setForm({ ...form, type: e.target.value })}
      />

      <input
        type="datetime-local"
        required
        value={form.date}
        onChange={(e) => setForm({ ...form, date: e.target.value })}
      />

      <textarea
        placeholder="Descrição"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />

      <button
        disabled={loading}
        className="bg-green-600 text-white py-2 rounded"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}