import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Package,
  Search,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { formatPeso } from '../lib/utils';
import { toast } from 'sonner';
import api from '../lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

export default function AdminProducts() {
  const navigate = useNavigate();
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetch all products
      const response = await api.get('/products?per_page=1000&include_inactive=1');
      if (response.data.success) {
        const mappedProducts = response.data.data.data.map((p: any) => ({
          id: p.id,
          name: p.name,
          category: p.category ? p.category.name : 'Uncategorized',
          price: Number(p.price),
          image: p.image_url || `https://placehold.co/600x400?text=${encodeURIComponent(p.name)}`,
          seller: p.seller ? p.seller.name : 'CarSU Store',
          rating: 0, 
          reviews: 0,
          isActive: Boolean(p.is_active),
          description: p.description
        }));
        setProductList(mappedProducts);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(productList.map(p => p.category)))];

  const filteredProducts = productList.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.seller?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleView = (product: any) => {
    setSelectedProduct(product);
    setShowViewDialog(true);
  };

  const handleDelete = async (product: any) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      try {
        await api.delete(`/products/${product.id}`);
        setProductList(prev => prev.filter(p => p.id !== product.id));
        toast.success('Product deleted successfully');
      } catch (error) {
        console.error('Failed to delete product:', error);
        toast.error('Failed to delete product');
      }
    }
  };

  const handleToggleStatus = async (productId: number) => {
    const product = productList.find(p => p.id === productId);
    if (!product) return;
    
    const newStatus = !product.isActive;
    
    // Optimistic update
    setProductList(prev => 
      prev.map(p => p.id === productId ? { ...p, isActive: newStatus } : p)
    );

    try {
        await api.put(`/products/${productId}`, { isActive: newStatus });
        toast.success('Product status updated');
    } catch (error) {
        console.error('Failed to update status:', error);
        toast.error('Failed to update status');
        // Revert
        setProductList(prev => 
            prev.map(p => p.id === productId ? { ...p, isActive: !newStatus } : p)
        );
    }
  };

  const totalProducts = productList.length;
  const activeProducts = productList.filter(p => p.isActive).length;
  const totalValue = productList.reduce((sum, p) => sum + p.price, 0);

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/admin/dashboard')}
                variant="ghost"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-[#333]">Product Management</h1>
                <p className="text-sm text-gray-600">Manage all platform products</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Package className="w-8 h-8 text-purple-600" />
            </div>
            <div className="text-2xl text-[#333]">{totalProducts}</div>
            <div className="text-sm text-gray-600">Total Products</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <div className="text-2xl text-[#333]">{activeProducts}</div>
            <div className="text-sm text-gray-600">Active Products</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl text-[#333]">{formatPeso(totalValue)}</div>
            <div className="text-sm text-gray-600">Total Inventory Value</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by product name or seller..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Product</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Category</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Price</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Seller</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Rating</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr>
                        <td colSpan={7} className="text-center py-12">Loading products...</td>
                    </tr>
                ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-100 hover:bg-[#F8F8F8] transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <div className="text-[#333]">{product.name}</div>
                          <div className="text-sm text-gray-600">ID: {product.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#333]">{formatPeso(product.price)}</td>
                    <td className="px-6 py-4 text-gray-600">{product.seller}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-[#333]">{product.rating}</span>
                        <span className="text-sm text-gray-600">({product.reviews})</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleStatus(product.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${
                          product.isActive
                            ? 'bg-green-50 text-green-600'
                            : 'bg-red-50 text-red-600'
                        }`}
                      >
                        {product.isActive ? (
                          <>
                            <CheckCircle className="w-4 h-4" />
                            Active
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-4 h-4" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleView(product)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => navigate(`/product/${product.id}`)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Page"
                        >
                          <Edit className="w-4 h-4 text-gray-600" />
                        </button>
                        <button 
                          onClick={() => handleDelete(product)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* View Product Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Product Details</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name}
                  className="w-32 h-32 object-cover rounded-xl"
                />
                <div className="flex-1">
                  <h3 className="text-xl text-[#333] mb-2">{selectedProduct.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700">
                      {selectedProduct.category}
                    </span>
                    <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                      selectedProduct.isActive
                        ? 'bg-green-50 text-green-600'
                        : 'bg-red-50 text-red-600'
                    }`}>
                      {selectedProduct.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <div className="text-2xl text-[#00D084] mb-2">{formatPeso(selectedProduct.price)}</div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>★</span>
                    <span className="text-[#333]">{selectedProduct.rating}</span>
                    <span className="text-sm text-gray-600">({selectedProduct.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Seller</div>
                  <div className="text-[#333]">{selectedProduct.seller}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Description</div>
                  <div className="text-[#333]">
                    {selectedProduct.description || 'No description available'}
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowViewDialog(false)} variant="outline">
              Close
            </Button>
            <Button 
              onClick={() => {
                setShowViewDialog(false);
                navigate(`/product/${selectedProduct?.id}`);
              }}
              className="bg-[#00D084] hover:bg-[#00966A]"
            >
              View Full Page
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}