import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Plus, Edit, Trash2, Eye, LogOut, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner';
import api from '../lib/axios';

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  isActive: boolean;
  image: string;
  reviews: number;
}

export default function MyProducts() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [sellerProducts, setSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/my-products');
      if (response.data.success) {
        // Handle pagination: response.data.data might be the array or a paginator object containing 'data'
        const productsList = Array.isArray(response.data.data) 
          ? response.data.data 
          : response.data.data.data;

        const mappedProducts = productsList.map((p: any) => {
          let imageUrl = `https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`;
          
          if (p.image_url) {
            if (p.image_url.startsWith('http')) {
              imageUrl = p.image_url;
            } else {
              imageUrl = `http://localhost:8000${p.image_url}`;
            }
          }

          return {
            id: p.id,
            name: p.name,
            category: p.category ? p.category.name : 'Uncategorized',
            price: Number(p.price),
            stock: p.stock,
            isActive: Boolean(p.is_active),
            image: imageUrl,
            reviews: 0 // Backend doesn't return reviews count yet for this endpoint
          };
        });
        setSellerProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load your products');
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = sellerProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    // Optimistic update
    const newStatus = !currentStatus;
    setSellerProducts(prev =>
      prev.map(p => p.id === id ? { ...p, isActive: newStatus } : p)
    );

    try {
      await api.put(`/products/${id}`, { isActive: newStatus });
      toast.success('Product status updated');
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('Failed to update status');
      // Revert on error
      setSellerProducts(prev =>
        prev.map(p => p.id === id ? { ...p, isActive: currentStatus } : p)
      );
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        await api.delete(`/products/${id}`);
        setSellerProducts(prev => prev.filter(p => p.id !== id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#00966A] p-2 rounded-lg">
                <Package className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#333]">My Products</span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/seller/dashboard')}
                variant="outline"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => navigate('/home')}
                variant="outline"
                className="gap-2"
              >
                <LogOut className="w-4 h-4" />
                Exit
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Top Section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-[#333] mb-2">Product Management</h1>
            <p className="text-gray-600">{filteredProducts.length} products found</p>
          </div>

          <Button
            onClick={() => navigate('/seller/product/new')}
            className="bg-[#00D084] hover:bg-[#00966A] gap-2"
          >
            <Plus className="w-5 h-5" />
            Add New Product
          </Button>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Products Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8] border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Product</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Price</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Stock</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={6} className="text-center py-12">Loading products...</td>
                    </tr>
                ) : (
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-100 hover:bg-[#F8F8F8] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[#333] truncate">{product.name}</div>
                            {/* Views are not available in backend yet, hiding for now or static */}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-[#00D084]">
                        {formatPeso(product.price)}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`${
                          product.stock > 10 ? 'text-green-600' :
                          product.stock > 5 ? 'text-yellow-600' :
                          'text-red-600'
                        }`}>
                          {product.stock} items
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={product.isActive}
                            onCheckedChange={() => handleToggleStatus(product.id, product.isActive)}
                          />
                          <span className={`text-sm ${
                            product.isActive ? 'text-green-600' : 'text-gray-400'
                          }`}>
                            {product.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => navigate(`/seller/product/edit/${product.id}`)}
                            className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(product.id, product.name)}
                            className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
                )}
              </tbody>
            </table>

            {!loading && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No products found</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Total Products</div>
            <div className="text-2xl text-[#333]">{sellerProducts.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Active Products</div>
            <div className="text-2xl text-green-600">
              {sellerProducts.filter(p => p.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="text-sm text-gray-600 mb-1">Low Stock</div>
            <div className="text-2xl text-red-600">
              {sellerProducts.filter(p => p.stock < 5).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}