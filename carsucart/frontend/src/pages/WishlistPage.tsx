import React, { useEffect, useState } from 'react';
import type { Product } from '../types';

// Local wishlist fallback until backend endpoint exists
const LOCAL_KEY = 'wishlist_items';

const WishlistPage: React.FC = () => {
  const [items, setItems] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(LOCAL_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  const persist = (list: Product[]) => {
    setItems(list);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  };

  const remove = (id: string) => {
    persist(items.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">My Wishlist</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <div key={p.id} className="card p-4 space-y-3">
            <div className="aspect-video rounded-lg bg-gray-100" />
            <div className="font-semibold">{p.name}</div>
            <div className="text-primary font-bold">₱{p.price?.toLocaleString()}</div>
            <div className="flex gap-2">
              <button className="btn-primary flex-1">
                Move to Cart
              </button>
              <button className="btn-ghost flex-1" onClick={() => remove(p.id)}>
                Remove
              </button>
            </div>
          </div>
        ))}
        {!items.length && <div className="text-sm text-gray-500">No wishlist items yet.</div>}
      </div>
      <div className="text-xs text-gray-500">
        Wishlist is stored locally until backend endpoints are available.
      </div>
    </div>
  );
};

export default WishlistPage;

