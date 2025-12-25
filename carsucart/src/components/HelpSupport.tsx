import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  HelpCircle,
  ChevronLeft,
  Search,
  MessageCircle,
  Mail,
  Phone,
  ChevronRight,
  Package,
  CreditCard,
  Shield,
  Truck,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { toast } from 'sonner@2.0.3';

const faqCategories = [
  {
    id: 'orders',
    name: 'Orders & Shipping',
    icon: Package,
    faqs: [
      {
        question: 'How do I track my order?',
        answer: 'You can track your order from the "My Orders" page in your profile. Click on any order to see its current status and tracking information.'
      },
      {
        question: 'What are the delivery times?',
        answer: 'Standard delivery takes 3-5 business days within Butuan City and 5-7 business days for other areas in Caraga Region.'
      },
      {
        question: 'Can I change my delivery address?',
        answer: 'You can change your delivery address before the order is shipped. Go to "My Orders" and click "Edit" on the pending order.'
      }
    ]
  },
  {
    id: 'payments',
    name: 'Payments',
    icon: CreditCard,
    faqs: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept credit/debit cards (Visa, Mastercard), GCash, PayMaya, and Cash on Delivery for eligible orders.'
      },
      {
        question: 'Is my payment information secure?',
        answer: 'Yes, all payment information is encrypted using industry-standard SSL technology. We never store your complete card details.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Yes, refunds are available for eligible orders. Please refer to our return policy or contact support for assistance.'
      }
    ]
  },
  {
    id: 'returns',
    name: 'Returns & Refunds',
    icon: RefreshCw,
    faqs: [
      {
        question: 'What is your return policy?',
        answer: 'We accept returns within 7 days of delivery. Items must be unused and in original packaging. Electronics and personal care items may have different policies.'
      },
      {
        question: 'How do I return an item?',
        answer: 'Go to "My Orders", select the order, and click "Request Return". Follow the instructions to complete your return request.'
      },
      {
        question: 'When will I get my refund?',
        answer: 'Refunds are processed within 5-7 business days after we receive and inspect the returned item.'
      }
    ]
  },
  {
    id: 'account',
    name: 'Account & Security',
    icon: Shield,
    faqs: [
      {
        question: 'How do I reset my password?',
        answer: 'Click on "Forgot Password" on the login page, enter your email, and follow the instructions sent to your email.'
      },
      {
        question: 'How do I update my profile information?',
        answer: 'Go to your profile page and click "Edit" or navigate to Account Settings to update your personal information.'
      },
      {
        question: 'Is my personal information safe?',
        answer: 'Yes, we use advanced security measures to protect your data. We never share your information with third parties without your consent.'
      }
    ]
  }
];

export default function HelpSupport() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('orders');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const activeCategoryData = faqCategories.find(c => c.id === activeCategory);

  const handleContactSupport = () => {
    toast.success('Support ticket created! We\'ll get back to you soon.');
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
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
              <h1 className="text-[#333]">Help & Support</h1>
              <p className="text-sm text-gray-600">Get help with your orders and account</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-8">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-8 shadow-sm mb-8 text-center"
        >
          <div className="w-16 h-16 bg-[#00D084]/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <HelpCircle className="w-8 h-8 text-[#00D084]" />
          </div>
          <h2 className="text-2xl text-[#333] mb-2">How can we help you?</h2>
          <p className="text-gray-600 mb-6">Search for answers or browse our FAQ</p>
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search for help..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12"
            />
          </div>
        </motion.div>

        {/* Contact Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <button
            onClick={handleContactSupport}
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-[#333] mb-1">Live Chat</h3>
            <p className="text-sm text-gray-600">Chat with our support team</p>
          </button>

          <a
            href="mailto:support@carsucart.edu.ph"
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-[#333] mb-1">Email Us</h3>
            <p className="text-sm text-gray-600">support@carsucart.edu.ph</p>
          </a>

          <a
            href="tel:+639123456789"
            className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-[#333] mb-1">Call Us</h3>
            <p className="text-sm text-gray-600">+63 912 345 6789</p>
          </a>
        </motion.div>

        {/* FAQ */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Categories */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl p-4 shadow-sm space-y-1">
              {faqCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => {
                    setActiveCategory(category.id);
                    setExpandedFaq(null);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    activeCategory === category.id
                      ? 'bg-[#00D084] text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="text-sm">{category.name}</span>
                </button>
              ))}
            </div>
          </motion.div>

          {/* FAQ List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3"
          >
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h3 className="text-xl text-[#333] mb-6">{activeCategoryData?.name}</h3>
              <div className="space-y-3">
                {activeCategoryData?.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-[#333] text-left">{faq.question}</span>
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          expandedFaq === index ? 'rotate-90' : ''
                        }`}
                      />
                    </button>
                    {expandedFaq === index && (
                      <div className="px-4 pb-4 text-gray-600 text-sm">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Still Need Help */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-br from-[#00D084] to-[#00966A] rounded-2xl p-8 mt-8 text-center text-white"
        >
          <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-90" />
          <h3 className="text-xl mb-2">Still need help?</h3>
          <p className="mb-6 opacity-90">Our support team is here to assist you 24/7</p>
          <Button
            onClick={handleContactSupport}
            className="bg-white text-[#00D084] hover:bg-gray-100"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
