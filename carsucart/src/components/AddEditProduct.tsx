import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Package, Upload, X, CheckCircle2, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner';
import api from '../lib/axios';

interface Category {
  id: number;
  name: string;
}

export default function AddEditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  
  // File objects for upload
  const [imageFile, setImageFile] = useState<File | null>(null);
  // Preview URL (either from existing product or local preview of new file)
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    description: '',
    stock: '',
    variants: '',
    sku: '',
    unit: 'piece',
    brand: 'Generic'
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setInitialLoading(true);
        
        // Fetch categories
        const catsRes = await api.get('/categories');
        if (catsRes.data.success) {
          setCategories(catsRes.data.data);
        }

        // Fetch product if editing
        if (isEditing) {
          const prodRes = await api.get(`/products/${id}`);
          if (prodRes.data.success) {
            const p = prodRes.data.data;
            setFormData({
              name: p.name,
              category_id: p.category_id.toString(),
              price: p.price,
              description: p.description,
              stock: p.stock,
              variants: p.variants?.map((v: any) => v.name).join(', ') || '',
              sku: p.sku || '',
              unit: p.unit || 'piece',
              brand: p.brand || 'Generic'
            });
            
            if (p.image_url) {
              // Construct full URL if relative
              const fullUrl = p.image_url.startsWith('http') 
                ? p.image_url 
                : `${api.defaults.baseURL?.replace('/api', '')}${p.image_url}`;
              setImagePreview(fullUrl);
            }
          }
        } else {
            // Generate a random SKU for new products
            setFormData(prev => ({
                ...prev,
                sku: `SKU-${Date.now()}-${Math.floor(Math.random() * 1000)}`
            }));
        }
      } catch (error) {
        console.error('Failed to load data:', error);
        toast.error('Failed to load initial data');
      } finally {
        setInitialLoading(false);
      }
    };

    loadData();
  }, [id, isEditing]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const file = files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('category_id', formData.category_id);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('stock', formData.stock);
      data.append('sku', formData.sku);
      data.append('unit', formData.unit);
      data.append('brand', formData.brand);
      data.append('is_active', '1');

      if (imageFile) {
        data.append('image', imageFile);
      }

      if (isEditing) {
        // Use POST with _method=PUT for file uploads in Laravel
        data.append('_method', 'PUT');
        await api.post(`/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        await api.post('/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowSuccess(true);
      setTimeout(() => {
        toast.success(isEditing ? 'Product updated successfully!' : 'Product created successfully!');
        navigate('/seller/products');
      }, 1500);

    } catch (error: any) {
      console.error('Failed to save product:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors).flat().join('\n');
        toast.error(errorMessages);
      } else {
        const msg = error.response?.data?.message || 'Failed to save product';
        toast.error(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
      return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-[#F8F8F8] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 0.6 }}
            className="inline-block"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-[#00D084] rounded-full opacity-20 animate-ping" />
              <div className="relative bg-white p-6 rounded-full shadow-2xl">
                <CheckCircle2 className="w-24 h-24 text-[#00D084]" />
              </div>
            </div>
          </motion.div>
          <h2 className="text-[#333] mt-6 mb-2">
            {isEditing ? 'Product Updated!' : 'Product Created!'}
          </h2>
          <p className="text-gray-600">Redirecting you back...</p>
        </motion.div>
      </div>
    );
  }

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
              <span className="text-[#333]">
                {isEditing ? 'Edit Product' : 'Add New Product'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/seller/products')}
                variant="outline"
              >
                Cancel
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-[#333] mb-2">
            {isEditing ? 'Edit Product Details' : 'Create New Product'}
          </h1>
          <p className="text-gray-600 mb-8">
            Fill in the information below to {isEditing ? 'update' : 'add'} your product
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Upload */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <Label className="mb-3 block">Product Image</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-[#00D084] transition-colors relative">
                {!imagePreview ? (
                  <>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer block">
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-1">Click to upload or drag and drop</p>
                      <p className="text-sm text-gray-400">PNG, JPG up to 2MB</p>
                    </label>
                  </>
                ) : (
                  <div className="relative aspect-square w-48 mx-auto bg-gray-100 rounded-xl overflow-hidden group">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Product Details */}
            <div className="bg-white rounded-2xl p-6 shadow-sm space-y-4">
              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  placeholder="Enter product name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-1"
                  required
                />
              </div>

              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat.id} value={cat.id.toString()}>
                         {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (₱) *</Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="stock">Stock *</Label>
                  <Input
                    id="stock"
                    type="number"
                    placeholder="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="mt-1 min-h-32"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      placeholder="Brand name"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="sku">SKU (Auto-generated)</Label>
                    <Input
                      id="sku"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="mt-1 bg-gray-50"
                      readOnly
                    />
                  </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end bg-white rounded-2xl p-6 shadow-sm">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/seller/products')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-[#00D084] hover:bg-[#00966A] min-w-32"
                disabled={loading}
              >
                {loading ? 'Saving...' : (isEditing ? 'Update Product' : 'Create Product')}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
