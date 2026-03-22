type Store = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  location?: string;
};

export default function StoreCard({ store }: { store: Store }) {
  return (
    <div className="rounded-2xl border border-[var(--bege)] bg-white p-4 shadow-sm">
      {store.image && (
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-40 object-cover rounded-xl mb-2"
        />
      )}

      <h3 className="font-semibold text-[var(--ardosia)]">{store.name}</h3>

      {store.price && (
        <p className="font-bold text-[var(--verde-xp)]">R$ {store.price}</p>
      )}

      {store.location && (
        <p className="text-sm text-[var(--texto-sub)]">{store.location}</p>
      )}
    </div>
  );
}