import React, { useState } from 'react';

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (stock: number) => void;
  currentStock?: number;
};

const StockUpdateModal: React.FC<Props> = ({ open, onClose, onSubmit, currentStock = 0 }) => {
  const [stock, setStock] = useState<number>(currentStock);
  if (!open) return null;

  const submit = () => {
    onSubmit(stock);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-30 bg-black/40 flex items-center justify-center px-4">
      <div className="card w-full max-w-md p-6 relative">
        <button className="absolute right-3 top-3 text-gray-400 hover:text-primary" onClick={onClose}>
          ✕
        </button>
        <h3 className="text-lg font-semibold mb-4">Update Stock</h3>
        <label className="text-sm text-gray-600 mb-2 block">Quantity</label>
        <input
          type="number"
          className="w-full rounded-lg border border-gray-200 px-3 py-2"
          value={stock}
          onChange={(e) => setStock(Number(e.target.value))}
          min={0}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default StockUpdateModal;

