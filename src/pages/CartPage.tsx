import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { CartItem, Address } from '../types';
import { cartAPI, addressAPI, orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import { toast } from 'react-hot-toast';

const CartPage: React.FC = () => {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadCart();
      loadAddresses();
    }
  }, [user]);

  const loadCart = async () => {
    try {
      setLoading(true);
      const response = await cartAPI.getCartItems(user!.id);
      
      if (response.status === 'SUCCESS' && response.data) {
        // Handle the cart data structure from backend
        setCartItems(response.data);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
      toast.error('Failed to load cart items');
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const response = await addressAPI.getAddresses(user!.id);
      if (response.status === 'SUCCESS' && response.data) {
        // Transform backend address structure to frontend structure
        const transformedAddresses = response.data.map((addr: any) => ({
          id: addr.id,
          user: addr.user,
          street: addr.addressLine1 || '',
          city: addr.city || '',
          state: addr.state || '',
          zipCode: addr.postalCode || '',
          isDefault: addr.isDefault || false,
          isDeleted: false
        }));
        setAddresses(transformedAddresses);
        const defaultAddress = transformedAddresses.find((addr: Address) => addr.isDefault);
        setSelectedAddress(defaultAddress || null);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      setAddresses([]);
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    try {
      await cartAPI.updateCartItemQuantity(user!.id, cartItemId, quantity);
      await loadCart();
      toast.success('Cart updated');
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await cartAPI.removeFromCart(user!.id, cartItemId);
      await loadCart();
      toast.success('Item removed from cart');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    }
  };

  const clearCart = async () => {
    try {
      await cartAPI.clearCart(user!.id);
      await loadCart();
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      // Handle different cart item structures
      const price = item.price || item.foodItem?.price || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  const handleCheckout = async () => {
    if (!selectedAddress) {
      toast.error('Please select a delivery address');
      return;
    }

    try {
      await orderAPI.checkoutCart(user!.id, selectedAddress.id);
      toast.success('Order placed successfully!');
      setShowCheckoutModal(false);
      await loadCart();
    } catch (error) {
      console.error('Error placing order:', error);
      toast.error('Failed to place order');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skorange"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {cartItems.length} items in your cart
          </p>
        </div>
        
        {cartItems.length > 0 && (
          <Button
            variant="danger"
            onClick={clearCart}
            icon={<Trash2 size={20} />}
          >
            Clear Cart
          </Button>
        )}
      </motion.div>

      {cartItems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
          <Button
            variant="primary"
            onClick={() => window.location.href = '/menu'}
          >
            Browse Menu
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => {
              // Handle different cart item structures from backend
              const foodItem = item.foodItem || item;
              const quantity = item.quantity || 0;
              const price = item.price || foodItem?.price || 0;
              
              return (
                <motion.div
                  key={item.id || item.cartId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <div className="flex items-center space-x-4">
                      {foodItem.imageUrl && (
                        <img
                          src={foodItem.imageUrl}
                          alt={foodItem.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                      )}
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {foodItem.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {foodItem.description}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-lg font-bold text-skorange">
                            ${price}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id || item.cartId, quantity - 1)}
                              disabled={quantity <= 1}
                              icon={<Minus size={16} />}
                            >
                              -
                            </Button>
                            <span className="w-8 text-center font-medium">
                              {quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id || item.cartId, quantity + 1)}
                              icon={<Plus size={16} />}
                            >
                              +
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeItem(item.id || item.cartId)}
                              icon={<Trash2 size={16} />}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${getTotalPrice().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery</span>
                  <span className="font-medium">$5.00</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-bold text-skorange">
                      ${(getTotalPrice() + 5).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => setShowAddressModal(true)}
                  icon={<ArrowRight size={20} />}
                >
                  Proceed to Checkout
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>
      )}

      {/* Address Selection Modal */}
      <Modal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        title="Select Delivery Address"
        size="lg"
      >
        <div className="space-y-4">
          {addresses.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No addresses found. Please add a delivery address.</p>
              <Button
                variant="primary"
                onClick={() => {
                  setShowAddressModal(false);
                  window.location.href = '/addresses';
                }}
              >
                Add Address
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {addresses.map((address) => (
                  <div
                    key={address.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedAddress?.id === address.id
                        ? 'border-skorange bg-orange-50'
                        : 'border-gray-200 hover:border-skorange'
                    }`}
                    onClick={() => setSelectedAddress(address)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{address.street}</p>
                        <p className="text-gray-600 text-sm">
                          {address.city}, {address.state} {address.zipCode}
                        </p>
                      </div>
                      {address.isDefault && (
                        <span className="px-2 py-1 bg-skgreen text-green-800 rounded-full text-xs font-medium">
                          Default
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="flex space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowAddressModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  variant="primary"
                  onClick={() => {
                    setShowAddressModal(false);
                    setShowCheckoutModal(true);
                  }}
                  disabled={!selectedAddress}
                  className="flex-1"
                >
                  Continue
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>

      {/* Checkout Confirmation Modal */}
      <Modal
        isOpen={showCheckoutModal}
        onClose={() => setShowCheckoutModal(false)}
        title="Confirm Order"
        size="md"
      >
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Delivery Address</h4>
            <p className="text-gray-600">{selectedAddress?.street}</p>
            <p className="text-gray-600">
              {selectedAddress?.city}, {selectedAddress?.state} {selectedAddress?.zipCode}
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Order Total</h4>
            <p className="text-2xl font-bold text-skorange">
              ${(getTotalPrice() + 5).toFixed(2)}
            </p>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowCheckoutModal(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCheckout}
              className="flex-1"
            >
              Place Order
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CartPage; 