import React, { useEffect, useState } from 'react';
import { fetchProductsApi } from '../api';
import type { Product } from '../types';
import FilterSidebar from '../components/FilterSidebar';
import FavoriteButton from '../components/FavoriteButton';

const ProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Record<string, unknown>>({});
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const transformProduct = (product: any): Product => {
    return {
      id: String(product.id),
      name: product.name || '',
      price: Number(product.price) || 0,
      image: product.image_url,
      image_url: product.image_url,
      category: product.category?.name || product.category_name || 'Uncategorized',
      rating: product.rating || 0,
      reviews: product.reviews?.length || 0,
      description: product.description || '',
      stock: product.stock || 0,
      sellerId: product.seller_id ? String(product.seller_id) : undefined,
      sellerName: product.seller?.name || product.seller_name || 'Unknown Seller',
      brand: product.brand || '',
      status: product.is_active ? 'active' : 'pending',
    };
  };

  const load = (params?: Record<string, unknown>) => {
    setLoading(true);
    setError(null);
    fetchProductsApi(params)
      .then((res) => {
        console.log('Products API Response:', res.data);
        // Handle paginated response: { success: true, data: { data: [...], ...pagination } }
        let productsData = [];
        if (res.data?.success && res.data?.data) {
          // Check if it's paginated (has data.data array)
          if (res.data.data.data && Array.isArray(res.data.data.data)) {
            productsData = res.data.data.data;
          } else if (Array.isArray(res.data.data)) {
            productsData = res.data.data;
          }
        } else if (Array.isArray(res.data)) {
          productsData = res.data;
        } else if (Array.isArray(res.data?.data)) {
          productsData = res.data.data;
        }
        
        console.log('Extracted products data:', productsData);
        const transformed = productsData.map(transformProduct);
        console.log('Transformed products:', transformed);
        setProducts(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        console.error('Error details:', err.response?.data || err.message);
        setError(err.response?.data?.message || err.message || 'Failed to load products. Please make sure the backend server is running on http://localhost:8000');
        setLoading(false);
        setProducts([]);
      });
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return url;
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <FilterSidebar
        filters={filters}
        onChange={setFilters}
        onApply={() => load(filters)}
        onClear={() => {
          setFilters({});
          load();
        }}
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading && (
          <div className="col-span-full text-center py-8">
            <div className="text-gray-500">Loading products...</div>
          </div>
        )}
        {error && (
          <div className="col-span-full card p-6 bg-red-50 border border-red-200">
            <div className="text-red-800 font-semibold mb-2">Error loading products</div>
            <div className="text-red-600 text-sm">{error}</div>
            <button
              onClick={() => load(filters)}
              className="mt-4 btn-primary text-sm"
            >
              Retry
            </button>
          </div>
        )}
        {!loading && !error && products.map((p) => (
          <div key={p.id} className="card p-3 flex flex-col gap-3 group">
            <div className="aspect-video rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center">
                 {p.image_url ? (
                    <img src={getImageUrl(p.image_url)} alt={p.name} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                 ) : (
                    <span className="text-gray-400">No Image</span>
                 )}
            </div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="font-semibold">{p.name}</div>
                <div className="text-sm text-gray-500">{p.category}</div>
              </div>
              <FavoriteButton active={!!wishlist[p.id]} onToggle={() => setWishlist((prev) => ({ ...prev, [p.id]: !prev[p.id] }))} />
            </div>
            <div className="text-primary font-bold">₱{Number(p.price).toLocaleString()}</div>
            <div className="flex items-center justify-between">
              <div className="text-xs text-gray-500">Seller: {p.sellerName ?? 'N/A'}</div>
              <a className="btn-ghost text-xs px-3 py-2" href={`/product/${p.id}`}>
                View
              </a>
            </div>
          </div>
        ))}
        {!loading && !error && !products.length && (
          <div className="col-span-full text-center py-8 text-gray-500">No products found.</div>
        )}
      </div>
    </div>
  );
};

export default ProductsPage;

