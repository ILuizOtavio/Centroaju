"use client";

import { useState } from "react";
import StoreCard from "@/components/StoreCard";

type Store = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  location?: string;
};

const mockStores: Store[] = [
  {
    id: "1",
    name: "Loja Centro Fashion",
    image: "https://via.placeholder.com/400x200",
    price: 49.9,
    location: "Centro",
  },
  {
    id: "2",
    name: "Tech Store AJU",
    image: "https://via.placeholder.com/400x200",
    price: 199.9,
    location: "Shopping Jardins",
  },
  {
    id: "3",
    name: "Artesanato Sergipe",
    image: "https://via.placeholder.com/400x200",
    price: 29.9,
    location: "Mercado Municipal",
  },
];

export default function LojasPage() {
  const [stores] = useState<Store[]>(mockStores);

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Lojas</h1>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
        {stores.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}