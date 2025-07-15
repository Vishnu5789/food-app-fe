import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Plus, Edit, Trash2, Star } from 'lucide-react';
import { Address } from '../types';
import { addressAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Modal from '../components/ui/Modal';
import { toast } from 'react-hot-toast';

const AddressesPage: React.FC = () => {
  const { user } = useAuth();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
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
      } else {
        setAddresses([]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
      toast.error('Failed to load addresses');
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async (formData: Omit<Address, 'id' | 'user' | 'isDeleted'>) => {
    try {
      await addressAPI.addAddress(user!.id, formData);
      toast.success('Address added successfully');
      setShowAddModal(false);
      await loadAddresses();
    } catch (error) {
      console.error('Error adding address:', error);
      toast.error('Failed to add address');
    }
  };

  const handleUpdateAddress = async (id: number, formData: Omit<Address, 'id' | 'user' | 'isDeleted'>) => {
    try {
      // For now, we'll delete and recreate since the backend doesn't have an update endpoint
      await addressAPI.deleteAddress(user!.id, id);
      await addressAPI.addAddress(user!.id, formData);
      toast.success('Address updated successfully');
      setShowEditModal(false);
      setSelectedAddress(null);
      await loadAddresses();
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error('Failed to update address');
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await addressAPI.deleteAddress(user!.id, id);
        toast.success('Address deleted successfully');
        await loadAddresses();
      } catch (error) {
        console.error('Error deleting address:', error);
        toast.error('Failed to delete address');
      }
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await addressAPI.setDefaultAddress(user!.id, id);
      toast.success('Default address updated');
      await loadAddresses();
    } catch (error) {
      console.error('Error setting default address:', error);
      toast.error('Failed to set default address');
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-600 mt-2">Manage your delivery addresses</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          icon={<Plus size={20} />}
        >
          Add Address
        </Button>
      </motion.div>

      {addresses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12"
        >
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin size={32} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No addresses found</h3>
          <p className="text-gray-600 mb-6">Add your first delivery address to get started!</p>
          <Button
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            Add Address
          </Button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address, index) => (
            <motion.div
              key={address.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 relative">
                {address.isDefault && (
                  <div className="absolute top-4 right-4">
                    <Star size={20} className="text-yellow-500 fill-current" />
                  </div>
                )}
                
                <div className="mb-4">
                  <h3 className="font-semibold text-gray-900 mb-2">
                    {address.street}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {address.city}, {address.state} {address.zipCode}
                  </p>
                </div>
                
                <div className="flex space-x-2">
                  {!address.isDefault && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSetDefault(address.id)}
                      className="flex-1"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedAddress(address);
                      setShowEditModal(true);
                    }}
                    icon={<Edit size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteAddress(address.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Address Modal */}
      <AddAddressModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddAddress}
      />

      {/* Edit Address Modal */}
      {selectedAddress && (
        <EditAddressModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedAddress(null);
          }}
          address={selectedAddress}
          onSubmit={handleUpdateAddress}
        />
      )}
    </div>
  );
};

// Add Address Modal Component
interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Address, 'id' | 'user' | 'isDeleted'>) => void;
}

const AddAddressModal: React.FC<AddAddressModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Address" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Street Address"
          placeholder="Enter street address"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          required
        />
        
        <Input
          label="City"
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        
        <Input
          label="State"
          placeholder="Enter state"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          required
        />
        
        <Input
          label="ZIP Code"
          placeholder="Enter ZIP code"
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          required
        />
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="rounded border-gray-300 text-skorange focus:ring-skorange"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1">
            Add Address
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Address Modal Component
interface EditAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  address: Address;
  onSubmit: (id: number, data: Omit<Address, 'id' | 'user' | 'isDeleted'>) => void;
}

const EditAddressModal: React.FC<EditAddressModalProps> = ({ isOpen, onClose, address, onSubmit }) => {
  const [formData, setFormData] = useState({
    street: address.street,
    city: address.city,
    state: address.state,
    zipCode: address.zipCode,
    isDefault: address.isDefault,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(address.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Address" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Street Address"
          placeholder="Enter street address"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          required
        />
        
        <Input
          label="City"
          placeholder="Enter city"
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          required
        />
        
        <Input
          label="State"
          placeholder="Enter state"
          value={formData.state}
          onChange={(e) => setFormData({ ...formData, state: e.target.value })}
          required
        />
        
        <Input
          label="ZIP Code"
          placeholder="Enter ZIP code"
          value={formData.zipCode}
          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
          required
        />
        
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
            className="rounded border-gray-300 text-skorange focus:ring-skorange"
          />
          <label htmlFor="isDefault" className="text-sm text-gray-700">
            Set as default address
          </label>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1">
            Update Address
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddressesPage; 