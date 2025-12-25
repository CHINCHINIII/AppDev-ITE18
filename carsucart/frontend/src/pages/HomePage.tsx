import React, { useEffect, useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { fetchProductsApi, productSuggestionsApi } from '../api';
import type { Product } from '../types';
import FavoriteButton from '../components/FavoriteButton';
import FilterSidebar from '../components/FilterSidebar';
import PlaceholderPage from './Placeholder';

const HomePage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  const [filters, setFilters] = useState<Record<string, unknown>>({});
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

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductsApi()
      .then((res) => {
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
        
        const transformed = productsData.map(transformProduct);
        setProducts(transformed);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load products:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load products. Please make sure the backend server is running.');
        setLoading(false);
        setProducts([]);
      });
  }, []);

  useEffect(() => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    const debounce = setTimeout(() => {
      productSuggestionsApi({ search: query, per_page: 6 }).then((res) => {
        let productsData = [];
        if (res.data?.success && res.data?.data) {
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
        setSuggestions(productsData.slice(0, 6).map((p: any) => p.name ?? p));
      }).catch(() => {
        setSuggestions([]);
      });
    }, 250);
    return () => clearTimeout(debounce);
  }, [query]);

  const toggleWishlist = (product: Product) => {
    const active = wishlist[product.id];
    setWishlist((prev) => ({ ...prev, [product.id]: !active }));
    // TODO: Wire to real wishlist endpoint when available
  };

  const getImageUrl = (url?: string) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return url;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <FilterSidebar
        filters={filters}
        onChange={setFilters}
        onApply={() => {
          setLoading(true);
          setError(null);
          const params: Record<string, unknown> = { ...filters };
          if (query) params.search = query;
          fetchProductsApi(params)
            .then((res) => {
              let productsData = [];
              if (res.data?.success && res.data?.data) {
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
              const transformed = productsData.map(transformProduct);
              setProducts(transformed);
              setLoading(false);
            })
            .catch((err) => {
              console.error('Failed to load products:', err);
              setError(err.response?.data?.message || err.message || 'Failed to load products.');
              setLoading(false);
              setProducts([]);
            });
        }}
        onClear={() => {
          setFilters({});
          setLoading(true);
          setError(null);
          fetchProductsApi()
            .then((res) => {
              let productsData = [];
              if (res.data?.success && res.data?.data) {
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
              const transformed = productsData.map(transformProduct);
              setProducts(transformed);
              setLoading(false);
            })
            .catch((err) => {
              console.error('Failed to load products:', err);
              setError(err.response?.data?.message || err.message || 'Failed to load products.');
              setLoading(false);
              setProducts([]);
            });
        }}
      />
      <div className="space-y-4">
        <div className="card p-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2">
              <Search className="h-4 w-4 text-gray-400" />
              <input
                className="flex-1 border-none outline-none"
                placeholder="Search products or categories"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                className="btn-primary"
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  const params: Record<string, unknown> = { ...filters };
                  if (query) params.search = query;
                  fetchProductsApi(params)
                    .then((res) => {
                      let productsData = [];
                      if (res.data?.success && res.data?.data) {
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
                      const transformed = productsData.map(transformProduct);
                      setProducts(transformed);
                      setLoading(false);
                    })
                    .catch((err) => {
                      console.error('Failed to load products:', err);
                      setError(err.response?.data?.message || err.message || 'Failed to load products.');
                      setLoading(false);
                      setProducts([]);
                    });
                }}
              >
                Search
              </button>
            </div>
            {suggestions.length > 0 && (
              <div className="rounded-lg border border-gray-200 p-3 text-sm">
                <div className="font-semibold mb-1">Suggestions</div>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      className="rounded-full border border-gray-200 px-3 py-1 hover:border-primary hover:text-primary"
                      onClick={() => setQuery(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

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
                onClick={() => {
                  setLoading(true);
                  setError(null);
                  fetchProductsApi()
                    .then((res) => {
                      let productsData = [];
                      if (res.data?.success && res.data?.data) {
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
                      const transformed = productsData.map(transformProduct);
                      setProducts(transformed);
                      setLoading(false);
                    })
                    .catch((err) => {
                      console.error('Failed to load products:', err);
                      setError(err.response?.data?.message || err.message || 'Failed to load products. Please make sure the backend server is running.');
                      setLoading(false);
                      setProducts([]);
                    });
                }}
                className="mt-4 btn-primary text-sm"
              >
                Retry
              </button>
            </div>
          )}
          {!loading && !error && products.map((p) => (
            <a key={p.id} href={`/product/${p.id}`} className="card p-3 flex flex-col gap-3 group">
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
                <div onClick={(e) => { e.preventDefault(); toggleWishlist(p); }}>
                    <FavoriteButton active={!!wishlist[p.id]} onToggle={() => {}} />
                </div>
              </div>
              <div className="text-primary font-bold">₱{Number(p.price).toLocaleString()}</div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Heart className="h-4 w-4 text-primary" />
                Wishlist ready
              </div>
            </a>
          ))}
          {!loading && !error && !products.length && (
            <PlaceholderPage title="No products" description="Try adjusting your search." />
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;

