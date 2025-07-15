import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Shield, CheckCircle, AlertCircle } from 'lucide-react';
import { paymentAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const PaymentsPage: React.FC = () => {
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async (amount: number) => {
    try {
      setLoading(true);
      
      // Create order on backend
      const orderResponse = await paymentAPI.createOrder({
        amount: amount * 100, // Convert to paise
        currency: 'INR',
        description: 'Food order payment',
        receipt: `receipt_${Date.now()}`
      });

      if (!orderResponse.order) {
        throw new Error('Failed to create payment order');
      }

      const order = JSON.parse(orderResponse.order);

      // Initialize Razorpay
      const options = {
        key: 'rzp_test_JR5a3U8aOxNQQq', // Your Razorpay key
        amount: order.amount,
        currency: order.currency,
        name: 'SK Delight',
        description: 'Food order payment',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            // Verify payment on backend
            const verificationResponse = await paymentAPI.verifyPayment({
              paymentId: response.razorpay_payment_id,
              orderId: response.razorpay_order_id,
              signature: response.razorpay_signature
            });

            if (verificationResponse.status === 'success') {
              toast.success('Payment successful!');
              // Add to payment history
              setPaymentHistory(prev => [{
                id: Date.now(),
                amount: amount,
                status: 'success',
                date: new Date().toISOString(),
                transactionId: response.razorpay_payment_id
              }, ...prev]);
            } else {
              toast.error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            toast.error('Payment verification failed');
          }
        },
        prefill: {
          name: 'Customer Name',
          email: 'customer@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#FF6F1F'
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  const testPayments = [
    { amount: 100, description: 'Small order' },
    { amount: 250, description: 'Medium order' },
    { amount: 500, description: 'Large order' },
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-gray-600 mt-2">Manage your payment options and transactions</p>
        </div>
      </motion.div>

      {/* Payment Options */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {testPayments.map((payment, index) => (
          <motion.div
            key={payment.amount}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-skorange to-skorange-dark rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard size={24} className="text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                ₹{payment.amount}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{payment.description}</p>
              <Button
                variant="primary"
                onClick={() => handlePayment(payment.amount)}
                loading={loading}
                className="w-full"
              >
                Pay Now
              </Button>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Payment Security Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Shield size={24} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Secure Payments</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>PCI DSS Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" />
              <span>Instant Processing</span>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Payment History */}
      {paymentHistory.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Payments</h3>
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <Card key={payment.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {payment.status === 'success' ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                    <div>
                      <p className="font-medium text-gray-900">₹{payment.amount}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(payment.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      payment.status === 'success' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {payment.status}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {payment.transactionId}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </motion.div>
      )}

      {/* Payment Methods Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Accepted Payment Methods</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Credit Cards</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Debit Cards</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">UPI</p>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900">Net Banking</p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentsPage; 