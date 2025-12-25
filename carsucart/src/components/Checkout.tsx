import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, MapPin, CreditCard, Truck, CheckCircle2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { useCart } from '../contexts/CartContext';
import { useOrders } from '../contexts/OrderContext';
import { formatPeso } from '../lib/utils';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder } = useOrders();
  const [step, setStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState('meet-up');
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    building: '',
    room: '',
    notes: ''
  });

  const shippingFee = deliveryMethod === 'delivery' ? 50 : 0;
  const total = totalPrice + shippingFee;

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    try {
      // Create order with proper structure
      await addOrder({
        items: [], // Backend handles items
        totalAmount: total, // Backend handles total
        shippingFee: shippingFee,
        deliveryMethod: deliveryMethod as 'meet-up' | 'delivery',
        paymentMethod: paymentMethod,
        status: 'pending',
        deliveryAddress: {
          name: address.name,
          phone: address.phone,
          building: address.building,
          room: address.room,
          notes: address.notes
        }
      });
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Order placement failed', error);
      // Toast handled in context
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-[#00D084] p-2 rounded-lg">
                <ShoppingCart className="w-5 h-5 text-white" />
              </div>
              <span className="text-[#333]">CarSUcart Checkout</span>
            </div>

            <div className="flex items-center gap-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                      s <= step
                        ? 'bg-[#00D084] text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {s < step ? <CheckCircle2 className="w-5 h-5" /> : s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`w-12 h-1 ${
                        s < step ? 'bg-[#00D084]' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Delivery Method */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#00D084]/10 p-3 rounded-xl">
                    <Truck className="w-6 h-6 text-[#00D084]" />
                  </div>
                  <h2 className="text-[#333]">Delivery Method</h2>
                </div>

                <RadioGroup value={deliveryMethod} onValueChange={setDeliveryMethod}>
                  <div className="space-y-3">
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        deliveryMethod === 'meet-up'
                          ? 'border-[#00D084] bg-[#00D084]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setDeliveryMethod('meet-up')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="meet-up" id="meet-up" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="meet-up" className="cursor-pointer">
                            <div className="text-[#333] mb-1">Campus Meet-up</div>
                            <div className="text-sm text-gray-600">
                              Meet the seller at a designated location within CSU campus
                            </div>
                            <div className="text-sm text-[#00D084] mt-1">FREE</div>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        deliveryMethod === 'delivery'
                          ? 'border-[#00D084] bg-[#00D084]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setDeliveryMethod('delivery')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="delivery" id="delivery" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="delivery" className="cursor-pointer">
                            <div className="text-[#333] mb-1">Campus Delivery</div>
                            <div className="text-sm text-gray-600">
                              Delivered to your dorm or department within 1-2 hours
                            </div>
                            <div className="text-sm text-[#00D084] mt-1">₱50</div>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex gap-3 justify-between mt-6">
                  <Button
                    onClick={() => navigate('/home')}
                    variant="outline"
                    className="border-gray-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel & Shop More
                  </Button>
                  <Button
                    onClick={() => setStep(2)}
                    className="bg-[#00D084] hover:bg-[#00966A]"
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Delivery Address */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#00D084]/10 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-[#00D084]" />
                  </div>
                  <h2 className="text-[#333]">
                    {deliveryMethod === 'meet-up' ? 'Contact Information' : 'Delivery Address'}
                  </h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Juan Dela Cruz"
                      value={address.name}
                      onChange={(e) => setAddress({ ...address, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      placeholder="09XX XXX XXXX"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  {deliveryMethod === 'delivery' && (
                    <>
                      <div>
                        <Label htmlFor="building">Building / Department</Label>
                        <Input
                          id="building"
                          placeholder="e.g., Engineering Building"
                          value={address.building}
                          onChange={(e) => setAddress({ ...address, building: e.target.value })}
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <Label htmlFor="room">Room Number (Optional)</Label>
                        <Input
                          id="room"
                          placeholder="e.g., Room 301"
                          value={address.room}
                          onChange={(e) => setAddress({ ...address, room: e.target.value })}
                          className="mt-1"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <Label htmlFor="notes">Notes (Optional)</Label>
                    <Input
                      id="notes"
                      placeholder="Any special instructions..."
                      value={address.notes}
                      onChange={(e) => setAddress({ ...address, notes: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    className="bg-[#00D084] hover:bg-[#00966A]"
                    disabled={!address.name || !address.phone}
                  >
                    Continue
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment Method */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-[#00D084]/10 p-3 rounded-xl">
                    <CreditCard className="w-6 h-6 text-[#00D084]" />
                  </div>
                  <h2 className="text-[#333]">Payment Method</h2>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'cod'
                          ? 'border-[#00D084] bg-[#00D084]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="cod" id="cod" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="cod" className="cursor-pointer">
                            <div className="text-[#333] mb-1">Cash on Delivery</div>
                            <div className="text-sm text-gray-600">
                              Pay when you receive your order
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'gcash'
                          ? 'border-[#00D084] bg-[#00D084]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('gcash')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="gcash" id="gcash" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="gcash" className="cursor-pointer">
                            <div className="text-[#333] mb-1">GCash</div>
                            <div className="text-sm text-gray-600">
                              Pay securely using GCash mobile wallet
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>

                    <div
                      className={`border-2 rounded-xl p-4 cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-[#00D084] bg-[#00D084]/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <div className="flex items-start gap-3">
                        <RadioGroupItem value="card" id="card" className="mt-1" />
                        <div className="flex-1">
                          <Label htmlFor="card" className="cursor-pointer">
                            <div className="text-[#333] mb-1">Debit/Credit Card</div>
                            <div className="text-sm text-gray-600">
                              Visa, Mastercard, or other cards
                            </div>
                          </Label>
                        </div>
                      </div>
                    </div>
                  </div>
                </RadioGroup>

                <div className="flex gap-3 justify-end mt-6">
                  <Button
                    onClick={() => setStep(2)}
                    variant="outline"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handlePlaceOrder}
                    className="bg-[#00D084] hover:bg-[#00966A]"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Placing Order...' : 'Place Order'}
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order Summary Sticky */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-4">
              <h3 className="text-[#333] mb-4">Order Summary</h3>

              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={`${item.id}-${item.variant}`} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-[#333] truncate">{item.name}</div>
                      <div className="text-xs text-gray-500">Qty: {item.quantity}</div>
                      <div className="text-sm text-[#00D084]">{formatPeso(item.price * item.quantity)}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-[#333]">{formatPeso(totalPrice)}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping Fee</span>
                  <span className="text-[#333]">
                    {shippingFee === 0 ? 'FREE' : formatPeso(shippingFee)}
                  </span>
                </div>

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between">
                    <span className="text-[#333]">Total</span>
                    <span className="text-[#00D084] text-xl">
                      {formatPeso(total)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}