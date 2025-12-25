import React, { useEffect, useState } from 'react';
import api, { createProductApi, fetchOrdersApi, updateOrderStatusApi } from '../api';

interface Order {
  id: number;
  status: string;
  total: number;
  created_at: string;
  delivery_method: string;
  buyer_name: string;
  items: any[];
}

interface Product {
  id: number;
  name: string;
  price: string;
  stock: number;
  image_url?: string;
  reviews?: { rating: number }[];
}

const SellerDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add-product'>('products');

  // Add Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category_id: '1', // Default to first category
    sku: '',
    unit: 'piece',
    brand: '',
    image: null as File | null,
  });

  useEffect(() => {
    if (activeTab === 'products') loadMyProducts();
    if (activeTab === 'orders') loadSellerOrders();
  }, [activeTab]);

  const loadMyProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get('/my-products');
      setProducts(res.data.data);
    } catch (error) {
      console.error('Failed to load products', error);
    } finally {
      setLoading(false);
    }
  };

  const loadSellerOrders = async () => {
    setLoadingOrders(true);
    try {
      const res = await fetchOrdersApi({ role: 'seller' });
      setOrders(res.data.data.data || res.data.data || []);
    } catch (error) {
      console.error('Failed to load seller orders', error);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatusApi(String(orderId), { status: newStatus });
      // Refresh
      loadSellerOrders();
      alert(`Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error('Failed to update status', error);
      alert('Failed to update status');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProduct(prev => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(newProduct).forEach(([key, value]) => {
      if (value !== null) formData.append(key, value);
    });

    try {
      await createProductApi(formData);
      alert('Product created successfully!');
      setActiveTab('products');
      loadMyProducts();
    } catch (error) {
      console.error('Failed to create product', error);
      alert('Failed to create product.');
    }
  };

  const calculateRating = (reviews?: { rating: number }[]) => {
    if (!reviews || reviews.length === 0) return 'No ratings';
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Seller Dashboard</h1>

      <div className="flex gap-4 mb-8 border-b">
        <button
          className={`pb-2 px-4 ${activeTab === 'products' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          My Products
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'add-product' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveTab('add-product')}
        >
          Add Product
        </button>
        <button
          className={`pb-2 px-4 ${activeTab === 'orders' ? 'border-b-2 border-blue-600 font-bold' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
      </div>

      {activeTab === 'products' && (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Product Ratings & Stock</h2>
            {loading ? <p>Loading...</p> : (
              <div className="grid gap-4">
                {products.map(p => (
                  <div key={p.id} className="border p-4 rounded flex justify-between items-center bg-white shadow-sm">
                    <div className="flex items-center gap-4">
                        {p.image_url && <img src={p.image_url} alt={p.name} className="w-16 h-16 object-cover rounded" />}
                        <div>
                            <h3 className="font-bold">{p.name}</h3>
                            <p className="text-sm text-gray-500">Stock: {p.stock}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-yellow-500 font-bold text-lg">
                             ★ {calculateRating(p.reviews)}
                        </div>
                        <p className="text-xs text-gray-400">{p.reviews?.length || 0} reviews</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>
      )}

      {activeTab === 'add-product' && (
        <div className="max-w-2xl bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Add New Product</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Product Name</label>
              <input type="text" name="name" required className="w-full border p-2 rounded" onChange={handleInputChange} />
            </div>
            <div>
              <label className="block text-sm font-medium">Description</label>
              <textarea name="description" required className="w-full border p-2 rounded" onChange={handleInputChange} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">Price</label>
                    <input type="number" name="price" required className="w-full border p-2 rounded" onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Stock</label>
                    <input type="number" name="stock" required className="w-full border p-2 rounded" onChange={handleInputChange} />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium">SKU</label>
                    <input type="text" name="sku" required className="w-full border p-2 rounded" onChange={handleInputChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium">Brand</label>
                    <input type="text" name="brand" required className="w-full border p-2 rounded" onChange={handleInputChange} />
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium">Category ID</label>
                <select name="category_id" className="w-full border p-2 rounded" onChange={handleInputChange}>
                    <option value="1">Electronics</option>
                    <option value="2">School Supplies</option>
                    <option value="3">Clothing</option>
                    <option value="4">Food</option>
                    <option value="5">Books</option>
                </select>
            </div>
            <div>
                <label className="block text-sm font-medium">Image</label>
                <input type="file" name="image" accept="image/*" className="w-full border p-2 rounded" onChange={handleFileChange} />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                Add Product
            </button>
          </form>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
           <h2 className="text-xl font-semibold">Incoming Orders</h2>
           {loadingOrders ? <p>Loading orders...</p> : (
             <div className="grid gap-4">
                {orders.length === 0 && <p className="text-gray-500">No orders found.</p>}
                {orders.map(order => (
                    <div key={order.id} className="border p-4 rounded bg-white shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">Order #{order.id}</h3>
                                <p className="text-sm text-gray-500">Buyer: {order.buyer_name}</p>
                                <p className="text-sm text-gray-500">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-xl">${Number(order.total).toFixed(2)}</p>
                                <div className="mt-2">
                                    <select 
                                        value={order.status}
                                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                                        className="border rounded p-1 text-sm bg-gray-50"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-gray-50 p-2 rounded">
                            <h4 className="font-semibold text-sm mb-2">Items</h4>
                            {order.items && order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between text-sm py-1 border-b last:border-0">
                                    <span>{item.qty}x {item.product?.name || item.product_name}</span>
                                    <span>${Number(item.subtotal).toFixed(2)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
             </div>
           )}
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
