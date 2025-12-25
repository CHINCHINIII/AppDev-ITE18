import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  MapPin,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  Home,
  Briefcase,
  CheckCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from './ui/dialog';

const mockAddresses = [
  {
    id: 1,
    label: 'Home',
    name: 'Juan Dela Cruz',
    phone: '+63 912 345 6789',
    address: 'Caraga State University',
    city: 'Butuan City',
    province: 'Agusan del Norte',
    zipCode: '8600',
    isDefault: true,
    icon: Home
  },
  {
    id: 2,
    label: 'Dorm',
    name: 'Juan Dela Cruz',
    phone: '+63 912 345 6789',
    address: 'Ampayon Dormitory, Room 201',
    city: 'Butuan City',
    province: 'Agusan del Norte',
    zipCode: '8600',
    isDefault: false,
    icon: Briefcase
  }
];

export default function AddressesPage() {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState(mockAddresses);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    zipCode: '',
    isDefault: false
  });

  const handleAdd = () => {
    setFormData({
      label: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      province: '',
      zipCode: '',
      isDefault: false
    });
    setShowAddDialog(true);
  };

  const handleEdit = (address: any) => {
    setSelectedAddress(address);
    setFormData({
      label: address.label,
      name: address.name,
      phone: address.phone,
      address: address.address,
      city: address.city,
      province: address.province,
      zipCode: address.zipCode,
      isDefault: address.isDefault
    });
    setShowEditDialog(true);
  };

  const handleSaveNew = () => {
    const newAddress = {
      id: addresses.length + 1,
      ...formData,
      icon: formData.label === 'Home' ? Home : Briefcase
    };
    setAddresses([...addresses, newAddress]);
    setShowAddDialog(false);
    toast.success('Address added successfully');
  };

  const handleSaveEdit = () => {
    setAddresses(addresses.map(a => 
      a.id === selectedAddress.id ? { ...a, ...formData } : a
    ));
    setShowEditDialog(false);
    toast.success('Address updated successfully');
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(a => a.id !== id));
      toast.success('Address deleted successfully');
    }
  };

  const handleSetDefault = (id: number) => {
    setAddresses(addresses.map(a => ({
      ...a,
      isDefault: a.id === id
    })));
    toast.success('Default address updated');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                onClick={() => navigate('/profile')}
                variant="ghost"
                className="gap-2"
              >
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-[#333]">My Addresses</h1>
                <p className="text-sm text-gray-600">Manage your delivery addresses</p>
              </div>
            </div>

            <Button
              onClick={handleAdd}
              className="gap-2 bg-[#00D084] hover:bg-[#00966A]"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {addresses.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <MapPin className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-[#333] mb-2">No addresses yet</h3>
            <p className="text-gray-600 mb-6">Add your first delivery address</p>
            <Button
              onClick={handleAdd}
              className="bg-[#00D084] hover:bg-[#00966A] gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Address
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {addresses.map((address, index) => (
              <motion.div
                key={address.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-2xl p-6 shadow-sm relative ${
                  address.isDefault ? 'ring-2 ring-[#00D084]' : ''
                }`}
              >
                {address.isDefault && (
                  <div className="absolute top-4 right-4 bg-[#00D084] text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Default
                  </div>
                )}

                <div className="flex items-start gap-3 mb-4">
                  <div className="w-12 h-12 bg-[#00D084]/10 rounded-xl flex items-center justify-center">
                    <address.icon className="w-6 h-6 text-[#00D084]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[#333] mb-1">{address.label}</h3>
                    <p className="text-sm text-gray-600">{address.name}</p>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="text-sm text-gray-600">{address.phone}</div>
                  <div className="text-sm text-gray-700">
                    {address.address}<br />
                    {address.city}, {address.province} {address.zipCode}
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
                  {!address.isDefault && (
                    <Button
                      onClick={() => handleSetDefault(address.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      Set as Default
                    </Button>
                  )}
                  <Button
                    onClick={() => handleEdit(address)}
                    variant="outline"
                    size="sm"
                    className={address.isDefault ? 'flex-1' : ''}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDelete(address.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50"
                    disabled={address.isDefault}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Address Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Label</label>
                <select
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
                >
                  <option value="">Select label</option>
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Dorm">Dorm</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Street Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Province</label>
                <Input
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Zip Code</label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="setDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-[#00D084] border-gray-300 rounded focus:ring-[#00D084]"
              />
              <label htmlFor="setDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowAddDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSaveNew} className="bg-[#00D084] hover:bg-[#00966A]">
              Save Address
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Address</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Label</label>
                <select
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Dorm">Dorm</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Full Name</label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">Street Address</label>
              <Input
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">City</label>
                <Input
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Province</label>
                <Input
                  value={formData.province}
                  onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Zip Code</label>
                <Input
                  value={formData.zipCode}
                  onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editSetDefault"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="w-4 h-4 text-[#00D084] border-gray-300 rounded focus:ring-[#00D084]"
              />
              <label htmlFor="editSetDefault" className="text-sm text-gray-700">
                Set as default address
              </label>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEditDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleSaveEdit} className="bg-[#00D084] hover:bg-[#00966A]">
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
