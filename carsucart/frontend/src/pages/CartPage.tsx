import React, { useEffect, useState } from 'react';
import { addToCartApi, fetchCartApi, removeCartItemApi, updateCartApi } from '../api';
import type { CartItem } from '../types';
import FavoriteButton from '../components/FavoriteButton';

const CartPage: React.FC = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [voucher, setVoucher] = useState('');

  useEffect(() => {
    fetchCartApi().then((res) => setItems(res.data?.data ?? res.data ?? []));
  }, []);

  const toggleSelectAll = (checked: boolean) => {
    const next: Record<string, boolean> = {};
    items.forEach((i) => (next[i.id] = checked));
    setSelected(next);
  };

  const subtotal = items
    .filter((i) => selected[i.id] || Object.keys(selected).length === 0)
    .reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-semibold">Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-4">
        <div className="card p-4 space-y-3">
          <div className="flex items-center gap-3">
            <input type="checkbox" checked={Object.values(selected).every(Boolean)} onChange={(e) => toggleSelectAll(e.target.checked)} />
            <span className="text-sm text-gray-600">Select all</span>
            <button
              className="btn-ghost text-sm"
              onClick={() => {
                const ids = Object.keys(selected).filter((id) => selected[id]);
                ids.forEach((id) => removeCartItemApi(id));
                setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
              }}
            >
              Delete selected
            </button>
          </div>
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 border-b border-gray-100 pb-3">
              <input
                type="checkbox"
                checked={!!selected[item.id]}
                onChange={(e) => setSelected((prev) => ({ ...prev, [item.id]: e.target.checked }))}
              />
              <div className="h-16 w-16 rounded-lg bg-gray-100" />
              <div className="flex-1">
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-gray-500">₱{item.price.toLocaleString()}</div>
                <div className="text-xs text-gray-500">Variant: {item.variant ?? 'N/A'}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    className="btn-ghost text-xs"
                    onClick={() => {
                      const nextQty = Math.max(1, item.quantity - 1);
                      updateCartApi(item.id, { qty: nextQty });
                      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: nextQty } : i)));
                    }}
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    className="btn-ghost text-xs"
                    onClick={() => {
                      const nextQty = item.quantity + 1;
                      updateCartApi(item.id, { qty: nextQty });
                      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, quantity: nextQty } : i)));
                    }}
                  >
                    +
                  </button>
                  <FavoriteButton active={false} onToggle={() => addToCartApi({})} />
                  <button
                    className="text-xs text-primary"
                    onClick={() => {
                      removeCartItemApi(item.id);
                      setItems((prev) => prev.filter((i) => i.id !== item.id));
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
          {!items.length && <div className="text-sm text-gray-500">Your cart is empty.</div>}
        </div>
        <div className="space-y-3">
          <div className="card p-4 space-y-3">
            <div className="text-lg font-semibold">Summary</div>
            <div className="flex items-center justify-between text-sm">
              <span>Subtotal</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Shipping</span>
              <span>TBD</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span>Total</span>
              <span>₱{subtotal.toLocaleString()}</span>
            </div>
            <button className="btn-primary w-full">Proceed to Checkout</button>
          </div>
          <div className="card p-4 space-y-3">
            <div className="text-sm font-medium">Voucher</div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-gray-200 px-3 py-2"
                placeholder="Enter code"
                value={voucher}
                onChange={(e) => setVoucher(e.target.value)}
              />
              <button
                className="btn-ghost"
                onClick={() => {
                  if (!voucher) return;
                  // TODO: wire voucher endpoint when available
                  void voucher;
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;

