import React, { useEffect, useState } from 'react';
import { fetchCategoriesApi } from '../api';

type Props = {
  filters: Record<string, unknown>;
  onChange: (next: Record<string, unknown>) => void;
  onApply: () => void;
  onClear: () => void;
};

interface Category {
  id: number;
  name: string;
  products_count?: number;
}

const FilterSidebar: React.FC<Props> = ({ filters, onChange, onApply, onClear }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    fetchCategoriesApi()
      .then((res) => {
        const data = res.data?.data ?? res.data ?? [];
        setCategories(Array.isArray(data) ? data : []);
        setLoadingCategories(false);
      })
      .catch((err) => {
        console.error('Failed to load categories:', err);
        setLoadingCategories(false);
      });
  }, []);

  const update = (key: string, value: unknown) => {
    onChange({ ...filters, [key]: value });
  };

  return (
    <aside className="card p-4 space-y-3 w-full">
      <div className="text-lg font-semibold">Filters</div>
      
      <div>
        <label className="text-sm font-medium">Category</label>
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 w-full"
          value={(filters.category_id as string) ?? ''}
          onChange={(e) => update('category_id', e.target.value ? Number(e.target.value) : '')}
        >
          <option value="">All Categories</option>
          {loadingCategories ? (
            <option disabled>Loading...</option>
          ) : (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name} {cat.products_count !== undefined ? `(${cat.products_count})` : ''}
              </option>
            ))
          )}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium">Min price</label>
        <input
          type="number"
          className="rounded-lg border border-gray-200 px-3 py-2 w-full"
          value={(filters.min_price as number) ?? ''}
          onChange={(e) => update('min_price', e.target.value ? Number(e.target.value) : '')}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Max price</label>
        <input
          type="number"
          className="rounded-lg border border-gray-200 px-3 py-2 w-full"
          value={(filters.max_price as number) ?? ''}
          onChange={(e) => update('max_price', e.target.value ? Number(e.target.value) : '')}
        />
      </div>
      
      <div>
        <label className="text-sm font-medium">Sort by</label>
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 w-full"
          value={(filters.sort_by as string) ?? 'created_at'}
          onChange={(e) => update('sort_by', e.target.value)}
        >
          <option value="created_at">Newest</option>
          <option value="price">Price</option>
          <option value="name">Name</option>
        </select>
      </div>

      <div className="flex gap-2 pt-2">
        <button className="btn-ghost flex-1" onClick={onClear}>
          Clear All
        </button>
        <button className="btn-primary flex-1" onClick={onApply}>
          Apply Filters
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;

