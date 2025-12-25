import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  CreditCard,
  ChevronLeft,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Smartphone,
  Building
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

const mockPaymentMethods = [
  {
    id: 1,
    type: 'card',
    name: 'Credit Card',
    cardNumber: '**** **** **** 1234',
    expiryDate: '12/25',
    cardHolder: 'Juan Dela Cruz',
    isDefault: true,
    icon: CreditCard,
    brand: 'Visa'
  },
  {
    id: 2,
    type: 'ewallet',
    name: 'GCash',
    accountNumber: '0912 345 6789',
    accountName: 'Juan Dela Cruz',
    isDefault: false,
    icon: Smartphone,
    brand: 'GCash'
  }
];

export default function PaymentMethods() {
  const navigate = useNavigate();
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedType, setSelectedType] = useState('card');

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this payment method?')) {
      setPaymentMethods(paymentMethods.filter(p => p.id !== id));
      toast.success('Payment method deleted successfully');
    }
  };

  const handleSetDefault = (id: number) => {
    setPaymentMethods(paymentMethods.map(p => ({
      ...p,
      isDefault: p.id === id
    })));
    toast.success('Default payment method updated');
  };

  const handleAddPayment = () => {
    toast.success('Payment method added successfully');
    setShowAddDialog(false);
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
                <h1 className="text-[#333]">Payment Methods</h1>
                <p className="text-sm text-gray-600">Manage your payment options</p>
              </div>
            </div>

            <Button
              onClick={() => setShowAddDialog(true)}
              className="gap-2 bg-[#00D084] hover:bg-[#00966A]"
            >
              <Plus className="w-4 h-4" />
              Add Payment
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {paymentMethods.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-12 text-center shadow-sm"
          >
            <div className="w-20 h-20 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CreditCard className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-[#333] mb-2">No payment methods yet</h3>
            <p className="text-gray-600 mb-6">Add your first payment method</p>
            <Button
              onClick={() => setShowAddDialog(true)}
              className="bg-[#00D084] hover:bg-[#00966A] gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Payment Method
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {paymentMethods.map((method, index) => (
              <motion.div
                key={method.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-gradient-to-br ${
                  method.type === 'card' 
                    ? 'from-slate-700 to-slate-900' 
                    : 'from-blue-500 to-blue-700'
                } rounded-2xl p-6 shadow-lg text-white relative overflow-hidden`}
              >
                {method.isDefault && (
                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Default
                  </div>
                )}

                {/* Card pattern */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-8">
                    <div>
                      <div className="text-sm text-white/70 mb-1">{method.name}</div>
                      <div className="text-lg">{method.brand}</div>
                    </div>
                    <method.icon className="w-8 h-8 text-white/70" />
                  </div>

                  {method.type === 'card' ? (
                    <>
                      <div className="text-2xl tracking-wider mb-4">{method.cardNumber}</div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-xs text-white/70 mb-1">Card Holder</div>
                          <div className="text-sm">{method.cardHolder}</div>
                        </div>
                        <div>
                          <div className="text-xs text-white/70 mb-1">Expires</div>
                          <div className="text-sm">{method.expiryDate}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="text-xl tracking-wider mb-4">{method.accountNumber}</div>
                      <div>
                        <div className="text-xs text-white/70 mb-1">Account Name</div>
                        <div className="text-sm">{method.accountName}</div>
                      </div>
                    </>
                  )}

                  <div className="flex items-center gap-2 mt-6 pt-4 border-t border-white/20">
                    {!method.isDefault && (
                      <Button
                        onClick={() => handleSetDefault(method.id)}
                        variant="outline"
                        size="sm"
                        className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                      >
                        Set as Default
                      </Button>
                    )}
                    <Button
                      onClick={() => toast.info('Edit feature coming soon')}
                      variant="outline"
                      size="sm"
                      className={`bg-white/10 border-white/20 text-white hover:bg-white/20 ${method.isDefault ? 'flex-1' : ''}`}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(method.id)}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-red-500/20"
                      disabled={method.isDefault}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mt-8"
        >
          <div className="flex items-start gap-3">
            <CreditCard className="w-6 h-6 text-blue-600 flex-shrink-0" />
            <div>
              <h3 className="text-blue-900 mb-2">Secure Payments</h3>
              <p className="text-sm text-blue-700">
                All payment information is encrypted and securely stored. We support major credit cards, 
                debit cards, and popular e-wallets like GCash, PayMaya, and more.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Add Payment Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600 mb-2 block">Payment Type</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setSelectedType('card')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                    selectedType === 'card'
                      ? 'border-[#00D084] bg-[#00D084]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <CreditCard className="w-8 h-8 text-gray-600" />
                  <span className="text-sm text-gray-700">Credit/Debit Card</span>
                </button>
                <button
                  onClick={() => setSelectedType('ewallet')}
                  className={`p-4 border-2 rounded-xl flex flex-col items-center gap-2 transition-colors ${
                    selectedType === 'ewallet'
                      ? 'border-[#00D084] bg-[#00D084]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <Smartphone className="w-8 h-8 text-gray-600" />
                  <span className="text-sm text-gray-700">E-Wallet</span>
                </button>
              </div>
            </div>

            {selectedType === 'card' ? (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Card Number</label>
                  <Input placeholder="1234 5678 9012 3456" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">Expiry Date</label>
                    <Input placeholder="MM/YY" />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600 mb-1 block">CVV</label>
                    <Input placeholder="123" type="password" maxLength={3} />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Card Holder Name</label>
                  <Input placeholder="Juan Dela Cruz" />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">E-Wallet Provider</label>
                  <select className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00D084]">
                    <option value="">Select provider</option>
                    <option value="gcash">GCash</option>
                    <option value="paymaya">PayMaya</option>
                    <option value="grabpay">GrabPay</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Mobile Number</label>
                  <Input placeholder="+63 912 345 6789" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">Account Name</label>
                  <Input placeholder="Juan Dela Cruz" />
                </div>
              </>
            )}

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="setDefaultPayment"
                className="w-4 h-4 text-[#00D084] border-gray-300 rounded focus:ring-[#00D084]"
              />
              <label htmlFor="setDefaultPayment" className="text-sm text-gray-700">
                Set as default payment method
              </label>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setShowAddDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button onClick={handleAddPayment} className="bg-[#00D084] hover:bg-[#00966A]">
              Add Payment Method
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
