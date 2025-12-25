import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  Shield,
  Store,
  Search,
  Eye,
  Edit,
  Trash2,
  Download,
  ChevronLeft,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner';
import api from '../lib/axios';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

export default function AdminSellers() {
  const navigate = useNavigate();
  const [sellers, setSellers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedSeller, setSelectedSeller] = useState<any>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    fetchSellers();
  }, []);

  const fetchSellers = async () => {
    try {
      setLoading(true);
      // Fetch users with role='Seller'
      // Note: Backend might need a dedicated endpoint if this becomes slow,
      // but filtering client-side or via query param is fine for now if API supports it.
      // Assuming existing /admin/users endpoint supports filtering or we filter here.
      const response = await api.get('/admin/users?per_page=100');
      
      if (response.data.success) {
        const allUsers = response.data.data.data;
        const sellerUsers = allUsers.filter((u: any) => u.role === 'seller' || u.role === 'Seller');
        
        const mappedSellers = sellerUsers.map((u: any) => ({
          id: u.id,
          name: u.name,
          email: u.email,
          storeName: u.store_name || `${u.name}'s Store`, // Fallback
          status: 'Active', // DB column needed for verify status
          phone: u.contact_no || 'N/A',
          joined: new Date(u.created_at).toLocaleDateString(),
          productsCount: u.products_count || 0, // Needs backend support
          ordersCount: 0, 
          revenue: 0
        }));
        setSellers(mappedSellers);
      }
    } catch (error) {
      console.error('Failed to fetch sellers:', error);
      toast.error('Failed to load sellers');
    } finally {
      setLoading(false);
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.storeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         seller.email.toLowerCase().includes(searchQuery.toLowerCase());
    // const matchesStatus = filterStatus === 'All' || seller.status === filterStatus;
    return matchesSearch;
  });

  const handleView = (seller: any) => {
    setSelectedSeller(seller);
    setShowViewDialog(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-50 text-green-600';
      case 'Pending': return 'bg-yellow-50 text-yellow-600';
      case 'Suspended': return 'bg-red-50 text-red-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

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
                <h1 className="text-[#333]">Seller Management</h1>
                <p className="text-sm text-gray-600">Verify and manage platform sellers</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                onClick={() => toast.info('Export feature coming soon')}
                variant="outline"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Export List
              </Button>
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
              <Store className="w-8 h-8 text-blue-600" />
            </div>
            <div className="text-2xl text-[#333]">{sellers.length}</div>
            <div className="text-sm text-gray-600">Total Sellers</div>
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
            <div className="text-2xl text-[#333]">{sellers.filter(s => s.status === 'Active').length}</div>
            <div className="text-sm text-gray-600">Active Sellers</div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-6 shadow-sm"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
            <div className="text-2xl text-[#333]">{sellers.filter(s => s.status === 'Pending').length}</div>
            <div className="text-sm text-gray-600">Pending Verification</div>
          </motion.div>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by store name, owner, or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
            >
              <option value="All">All Status</option>
              <option value="Active">Active</option>
              <option value="Pending">Pending</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
        </motion.div>

        {/* Sellers Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-2xl shadow-sm overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#F8F8F8]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Store / Owner</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Contact</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Joined</th>
                  {/* <th className="text-left px-6 py-4 text-sm text-gray-600">Performance</th> */}
                  <th className="text-left px-6 py-4 text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                    <tr><td colSpan={5} className="text-center py-12">Loading sellers...</td></tr>
                ) : filteredSellers.length === 0 ? (
                    <tr><td colSpan={5} className="text-center py-12">No sellers found.</td></tr>
                ) : (
                filteredSellers.map((seller) => (
                  <tr key={seller.id} className="border-b border-gray-100 hover:bg-[#F8F8F8] transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-[#333] flex items-center gap-2">
                          <Store className="w-4 h-4 text-gray-400" />
                          {seller.storeName}
                        </div>
                        <div className="text-sm text-gray-600 mt-0.5">{seller.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-gray-600">{seller.email}</div>
                        <div className="text-gray-500">{seller.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getStatusColor(seller.status)}`}>
                        <div className={`w-1.5 h-1.5 rounded-full bg-current`} />
                        {seller.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{seller.joined}</td>
                    {/* <td className="px-6 py-4">
                      <div className="text-sm">
                        <div className="text-[#333]">{seller.productsCount} Products</div>
                        <div className="text-gray-500">₱{seller.revenue} Sales</div>
                      </div>
                    </td> */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleView(seller)}
                          className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4 text-gray-600" />
                        </button>
                        {/* 
                        <button 
                          onClick={() => window.open(`/seller-store/${seller.id}`, '_blank')}
                          className="p-2 hover:bg-green-50 rounded-lg transition-colors"
                          title="Visit Store"
                        >
                          <ExternalLink className="w-4 h-4 text-gray-600" />
                        </button>
                        */}
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

      {/* View Seller Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Seller Details</DialogTitle>
          </DialogHeader>
          {selectedSeller && (
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-xl flex items-center justify-center text-white">
                  <Store className="w-8 h-8" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl text-[#333] mb-1">{selectedSeller.storeName}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-gray-600">Owner: {selectedSeller.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm ${getStatusColor(selectedSeller.status)}`}>
                      {selectedSeller.status}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-[#F8F8F8] rounded-xl">
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </div>
                  <div className="text-[#333]">{selectedSeller.email}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Phone
                  </div>
                  <div className="text-[#333]">{selectedSeller.phone}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-gray-600 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Joined
                  </div>
                  <div className="text-[#333]">{selectedSeller.joined}</div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-3">
                 <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                    Close
                 </Button>
                 {selectedSeller.status === 'Pending' && (
                    <Button className="bg-[#00D084] hover:bg-[#00966A]">
                        Verify Seller
                    </Button>
                 )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
