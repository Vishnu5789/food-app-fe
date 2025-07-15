import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { FoodItem, FoodItemRequest, UpdateFoodItemRequest } from '../../types';
import { foodAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import { toast } from 'react-hot-toast';

const FoodManagementPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'veg', 'non-veg', 'dessert', 'beverage'];

  useEffect(() => {
    loadFoods();
  }, []);

  const loadFoods = async () => {
    try {
      setLoading(true);
      const response = await foodAPI.getAllFoods();
      
      // Handle the response based on the actual API structure
      let foodItems: FoodItem[] = [];
      
      if (response.status === 'SUCCESS' && response.data) {
        // The backend returns a JSON string, so we need to parse it
        if (typeof response.data === 'string') {
          try {
            foodItems = JSON.parse(response.data);
          } catch (e) {
            console.error('Error parsing food items:', e);
            foodItems = [];
          }
        } else {
          foodItems = response.data as FoodItem[];
        }
      }
      
      setFoods(foodItems);
    } catch (error) {
      console.error('Error loading foods:', error);
      toast.error('Failed to load food items');
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (formData: FoodItemRequest) => {
    try {
      await foodAPI.addFood(formData);
      toast.success('Food item added successfully');
      setShowAddModal(false);
      await loadFoods();
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food item');
    }
  };

  const handleUpdateFood = async (id: number, formData: UpdateFoodItemRequest) => {
    try {
      await foodAPI.updateFood(id, formData);
      toast.success('Food item updated successfully');
      setShowEditModal(false);
      setSelectedFood(null);
      await loadFoods();
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error('Failed to update food item');
    }
  };

  const handleDeleteFood = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await foodAPI.deleteFood(id);
        toast.success('Food item deleted successfully');
        await loadFoods();
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error('Failed to delete food item');
      }
    }
  };

  const filteredFoods = foods.filter(food => {
    const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         food.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || food.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory && !food.isDeleted;
  });

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
          <h1 className="text-3xl font-bold text-gray-900">Food Management</h1>
          <p className="text-gray-600 mt-2">Manage your restaurant's menu items</p>
        </div>
        
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          icon={<Plus size={20} />}
        >
          Add Food Item
        </Button>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="flex-1">
          <Input
            placeholder="Search food items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            icon={<Search size={20} />}
          />
        </div>
        
        <div className="flex gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'primary' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </Button>
          ))}
        </div>
      </motion.div>

      {/* Food Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {filteredFoods.map((food, index) => (
          <motion.div
            key={food.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="overflow-hidden">
              {food.imageUrl && (
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="w-full h-48 object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{food.name}</h3>
                  <span className="px-2 py-1 bg-skgreen text-green-800 rounded-full text-xs font-medium capitalize">
                    {food.category}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {food.description}
                </p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-skorange">
                    ${food.price}
                  </span>
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    food.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {food.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedFood(food);
                      setShowEditModal(true);
                    }}
                    icon={<Edit size={16} />}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeleteFood(food.id)}
                    icon={<Trash2 size={16} />}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {filteredFoods.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-gray-500 text-lg">No food items found matching your criteria.</p>
        </motion.div>
      )}

      {/* Add Food Modal */}
      <AddFoodModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddFood}
      />

      {/* Edit Food Modal */}
      {selectedFood && (
        <EditFoodModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedFood(null);
          }}
          food={selectedFood}
          onSubmit={handleUpdateFood}
        />
      )}
    </div>
  );
};

// Add Food Modal Component
interface AddFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FoodItemRequest) => void;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<FoodItemRequest>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imageUrl: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Food Item" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter food name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Input
          label="Description"
          placeholder="Enter food description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        
        <Input
          label="Price"
          type="number"
          placeholder="Enter price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          required
        />
        
        <Input
          label="Category"
          placeholder="Enter category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
        
        <Input
          label="Image URL"
          placeholder="Enter image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1">
            Add Food Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Edit Food Modal Component
interface EditFoodModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: FoodItem;
  onSubmit: (id: number, data: UpdateFoodItemRequest) => void;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ isOpen, onClose, food, onSubmit }) => {
  const [formData, setFormData] = useState<UpdateFoodItemRequest>({
    name: food.name,
    description: food.description,
    price: food.price,
    category: food.category,
    imageUrl: food.imageUrl,
    available: food.available,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(food.id, formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Edit Food Item" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter food name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        
        <Input
          label="Description"
          placeholder="Enter food description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        
        <Input
          label="Price"
          type="number"
          placeholder="Enter price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          required
        />
        
        <Input
          label="Category"
          placeholder="Enter category"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          required
        />
        
        <Input
          label="Image URL"
          placeholder="Enter image URL"
          value={formData.imageUrl}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
        />
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1">
            Update Food Item
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default FoodManagementPage; 