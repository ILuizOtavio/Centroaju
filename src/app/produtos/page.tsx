"use client"
import React, { Suspense, useMemo, useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import { products, categories, type Product } from "../../data/products";
import { supabase } from "@/lib/supabase/client";
import { notifyCartChanged } from "@/lib/cart-events";
import { grantPurchaseXp } from "@/lib/zona-xp/client-actions";

function ProdutosInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const qRaw = searchParams.get("q") || "";
  const q = qRaw.trim().toLowerCase();
  const category = searchParams.get("category");
  const filtro = searchParams.get("filtro");

  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ id: string } | null>(null);

  const pushParams = useCallback(
    (next: { category?: string | null; filtro?: string | null }) => {
      const p = new URLSearchParams(searchParams.toString());
      const cat = next.category !== undefined ? next.category : category;
      const fi = next.filtro !== undefined ? next.filtro : filtro;
      if (cat) p.set("category", cat);
      else p.delete("category");
      if (fi) p.set("filtro", fi);
      else p.delete("filtro");
      const qs = p.toString();
      router.push(qs ? `/produtos?${qs}` : "/produtos");
    },
    [router, searchParams, category, filtro]
  );

  const setCategory = useCallback(
    (c: string | null) => {
      pushParams({ category: c });
    },
    [pushParams]
  );

  const setFiltro = useCallback(
    (f: string | null) => {
      pushParams({ filtro: f });
    },
    [pushParams]
  );

  const filtered = useMemo(() => {
    let list = products;
    if (category) {
      list = list.filter((p) => p.category === category);
    }
    if (filtro === "promo") {
      list = list.filter((p) => p.badge === "promo");
    } else if (filtro === "novo") {
      list = list.filter((p) => p.badge === "novo");
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.store.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, q, filtro]);

  useEffect(() => {
    let cancelled = false;

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!cancelled) setUser(session?.user ? { id: session.user.id } : null);
    });

    void supabase.auth.getSession().then(({ data: { session } }) => {
      if (!cancelled) setUser(session?.user ? { id: session.user.id } : null);
    });

    const raw = localStorage.getItem("ca_cart") || "[]";
    try {
      const arr = JSON.parse(raw);
      setCartCount(Array.isArray(arr) ? arr.length : 0);
    } catch {
      setCartCount(0);
    }

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  async function handleAdd(product: Product) {
    if (!user) {
      await supabase.auth.signInWithOAuth({ provider: "google" });
      return;
    }

    const raw = localStorage.getItem("ca_cart") || "[]";
    const arr = JSON.parse(raw);
    arr.push(product);
    localStorage.setItem("ca_cart", JSON.stringify(arr));
    setCartCount(arr.length);
    notifyCartChanged({ productName: product.name });
    grantPurchaseXp(product.id);

    try {
      await supabase.from("carts").upsert({ user_id: user.id, items: arr });
    } catch (e) {
      console.warn("Failed to persist cart to Supabase", e);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
      <header className="mb-6 sm:mb-8">
        <h1 className="text-xl font-bold text-[#333] sm:text-2xl md:text-3xl">Marketplace</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Várias lojas do centro de Aracaju em um só lugar — cultura local e comércio de rua.
        </p>
      </header>

      <div className="touch-pan-x -mx-3 mb-4 flex snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
        <span className="mr-1 shrink-0 snap-start self-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
          Ofertas
        </span>
        <button
          type="button"
          onClick={() => setFiltro(null)}
          className={`shrink-0 snap-start touch-manipulation rounded-full px-3 py-1.5 text-sm font-medium transition ${
            !filtro
              ? "bg-[#333] text-white"
              : "bg-white text-[#666] ring-1 ring-[var(--border-subtle)] hover:bg-neutral-50"
          }`}
        >
          Todos
        </button>
        <button
          type="button"
          onClick={() => setFiltro("promo")}
          className={`shrink-0 snap-start touch-manipulation rounded-full px-3 py-1.5 text-sm font-medium transition ${
            filtro === "promo"
              ? "bg-[#00a650] text-white"
              : "bg-white text-[#666] ring-1 ring-[var(--border-subtle)] hover:bg-neutral-50"
          }`}
        >
          Promoções
        </button>
        <button
          type="button"
          onClick={() => setFiltro("novo")}
          className={`shrink-0 snap-start touch-manipulation rounded-full px-3 py-1.5 text-sm font-medium transition ${
            filtro === "novo"
              ? "bg-[var(--ml-blue)] text-white"
              : "bg-white text-[#666] ring-1 ring-[var(--border-subtle)] hover:bg-neutral-50"
          }`}
        >
          Lançamentos
        </button>
      </div>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="touch-pan-x -mx-3 flex min-w-0 snap-x snap-mandatory gap-2 overflow-x-auto px-3 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden">
          <button
            type="button"
            onClick={() => setCategory(null)}
            className={`shrink-0 snap-start touch-manipulation rounded-full px-3 py-1.5 text-sm font-medium transition ${
              !category
                ? "bg-[#333] text-white"
                : "bg-white text-[#666] ring-1 ring-[var(--border-subtle)] hover:bg-neutral-50"
            }`}
          >
            Categorias (todas)
          </button>
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`shrink-0 snap-start touch-manipulation rounded-full px-3 py-1.5 text-sm font-medium transition ${
                category === c
                  ? "bg-[#333] text-white"
                  : "bg-white text-[#666] ring-1 ring-[var(--border-subtle)] hover:bg-neutral-50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="text-sm text-neutral-600">
          Carrinho: <strong className="text-[#333]">{cartCount}</strong> itens
        </div>
      </div>

      {q ? (
        <p className="mb-4 text-sm text-neutral-600">
          Resultados para &quot;<span className="font-medium text-[#333]">{qRaw.trim()}</span>
          &quot; — {filtered.length} produto(s)
        </p>
      ) : null}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <ProductCard key={p.id} product={p} onAdd={handleAdd} />
        ))}
      </section>

      {filtered.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-[var(--border-subtle)] bg-white p-8 text-center text-sm text-neutral-600">
          Nenhum produto encontrado.{" "}
          <a href="/produtos" className="font-medium text-[var(--ml-blue)] hover:underline">
            Limpar filtros
          </a>
        </p>
      ) : null}
    </div>
  );
}

function ProdutosFallback() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-neutral-500">
      Carregando produtos…
    </div>
  );
}

export default function ProdutosPage() {
  return (
    <Suspense fallback={<ProdutosFallback />}>
      <ProdutosInner />
    </Suspense>
  );
}
