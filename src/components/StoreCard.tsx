type Store = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  location?: string;
};

export default function StoreCard({ store }: { store: Store }) {
  return (
    <div className="bg-white shadow rounded-2xl p-4">
      {store.image && (
        <img
          src={store.image}
          alt={store.name}
          className="w-full h-40 object-cover rounded-xl mb-2"
        />
      )}

      <h3 className="font-semibold">{store.name}</h3>

      {store.price && (
        <p className="text-green-600 font-bold">R$ {store.price}</p>
      )}

      {store.location && (
        <p className="text-sm text-gray-500">{store.location}</p>
      )}
    </div>
  );
}