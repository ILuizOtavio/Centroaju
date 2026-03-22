'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { events as seedEvents, type EventItem } from '@/data/events'
import { loadState } from '@/lib/zona-xp'
import { grantEventConfirmXp } from '@/lib/zona-xp/client-actions'

const STORAGE = 'ca_eventos_publicados_v1'

function loadPublished(): EventItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE)
    if (!raw) return []
    return JSON.parse(raw) as EventItem[]
  } catch {
    return []
  }
}

function savePublished(list: EventItem[]) {
  localStorage.setItem(STORAGE, JSON.stringify(list))
}

export default function EventosPage() {
  const [published, setPublished] = useState<EventItem[]>([])
  const [confirmed, setConfirmed] = useState<Set<string>>(new Set())
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    title: '',
    type: 'Gastronomia',
    date: '',
    time: '18:00',
    place: '',
    description: '',
  })

  useEffect(() => {
    setPublished(loadPublished())
    setConfirmed(new Set(loadState().confirmedEventIds))
  }, [])

  const all = useMemo(() => {
    const merged = [...seedEvents, ...published]
    merged.sort((a, b) => a.date.localeCompare(b.date))
    return merged
  }, [published])

  const confirm = useCallback((id: string) => {
    grantEventConfirmXp(id)
    const s = loadState()
    setConfirmed(new Set(s.confirmedEventIds))
  }, [])

  function publish(e: React.FormEvent) {
    e.preventDefault()
    const item: EventItem = {
      id: `pub-${Date.now()}`,
      title: form.title || 'Evento sem título',
      type: form.type,
      date: form.date || new Date().toISOString().slice(0, 10),
      time: form.time,
      place: form.place || 'Centro de Aracaju',
      description: form.description || '',
      tags: ['Comunitário'],
      confirmed: 0,
      past: false,
    }
    const next = [...published, item]
    setPublished(next)
    savePublished(next)
    setShowForm(false)
    setForm({ title: '', type: 'Gastronomia', date: '', time: '18:00', place: '', description: '' })
  }

  return (
    <div className="mx-auto max-w-4xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-end sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-[#333] sm:text-3xl">Eventos</h1>
          <p className="mt-1 text-sm text-neutral-600">
            Cultura e comércio no centro — confirme presença e ganhe +50 XP na Zona XP.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowForm((v) => !v)}
          className="min-h-11 w-full touch-manipulation rounded-lg bg-[var(--ml-blue)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--ml-blue-hover)] sm:w-auto sm:shrink-0"
        >
          + Publicar evento
        </button>
      </header>

      {showForm ? (
        <form
          onSubmit={publish}
          className="mb-6 rounded-xl border border-[var(--border-subtle)] bg-white p-4 shadow-sm sm:mb-8 sm:p-6"
        >
          <h2 className="font-semibold text-[#333]">Novo evento</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="text-sm">
              Nome
              <input
                required
                className="mt-1 min-h-11 w-full rounded border px-3 py-2 text-base text-[#333] sm:min-h-10 sm:text-sm"
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Tipo
              <select
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                value={form.type}
                onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              >
                <option>Festa Junina</option>
                <option>Gastronomia</option>
                <option>Patrimônio</option>
                <option>Música & Arte</option>
                <option>Forró</option>
              </select>
            </label>
            <label className="text-sm">
              Data
              <input
                type="date"
                required
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </label>
            <label className="text-sm">
              Horário
              <input
                type="time"
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                value={form.time}
                onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
              />
            </label>
            <label className="col-span-full text-sm">
              Local
              <input
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                value={form.place}
                onChange={(e) => setForm((f) => ({ ...f, place: e.target.value }))}
              />
            </label>
            <label className="col-span-full text-sm">
              Descrição
              <textarea
                className="mt-1 w-full rounded border px-3 py-2 text-sm"
                rows={3}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </label>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="submit" className="rounded-lg bg-[#333] px-4 py-2 text-sm font-medium text-white">
              Publicar
            </button>
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm"
              onClick={() => setShowForm(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      ) : null}

      <ul className="space-y-4">
        {all.map((ev) => {
          const isPast = ev.past || ev.date < new Date().toISOString().slice(0, 10)
          const isConfirmed = confirmed.has(ev.id)
          return (
            <li
              key={ev.id}
              className="overflow-hidden rounded-xl border border-[var(--border-subtle)] bg-white shadow-sm"
            >
              <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-stretch">
                <div className="flex w-24 shrink-0 flex-col items-center justify-center rounded-lg bg-[var(--ml-yellow)]/90 py-3 text-center">
                  <span className="text-2xl font-bold leading-none text-[#333]">
                    {ev.date.slice(8, 10)}
                  </span>
                  <span className="text-xs font-medium text-[#333]/80">
                    {ev.date.slice(5, 7)}/{ev.date.slice(2, 4)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-[#333]">
                      {ev.type}
                    </span>
                    {isPast ? (
                      <span className="rounded-full bg-neutral-200 px-2 py-0.5 text-xs">Encerrado</span>
                    ) : null}
                  </div>
                  <h2 className="mt-2 text-lg font-bold text-[#333]">{ev.title}</h2>
                  <p className="text-sm text-neutral-600">
                    {ev.time} · {ev.place}
                  </p>
                  <p className="mt-2 text-sm text-neutral-700">{ev.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ev.tags.map((t) => (
                      <span key={t} className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                        #{t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-3 text-xs text-neutral-500">{ev.confirmed} confirmados</p>
                </div>
                <div className="flex w-full shrink-0 flex-col justify-stretch gap-2 border-t border-[var(--border-subtle)] pt-4 sm:w-44 sm:border-t-0 sm:pt-0">
                  {!isPast && !isConfirmed ? (
                    <button
                      type="button"
                      onClick={() => confirm(ev.id)}
                      className="min-h-11 touch-manipulation rounded-lg bg-[#00a650] px-3 py-2.5 text-sm font-semibold text-white hover:bg-[#008f47]"
                    >
                      Confirmar (+50 XP)
                    </button>
                  ) : null}
                  {!isPast && isConfirmed ? (
                    <span className="text-center text-sm font-medium text-[#00a650]">Presença confirmada ✓</span>
                  ) : null}
                  {isPast && ev.galleryUrl ? (
                    <a
                      href={ev.galleryUrl}
                      className="text-center text-sm text-[var(--ml-blue)] hover:underline"
                    >
                      Ver galeria
                    </a>
                  ) : null}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
