import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Plus, Minus } from 'lucide-react';
import { FoodItem } from '../types';
import { foodAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { toast } from 'react-hot-toast';

const MenuPage: React.FC = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', 'veg', 'non-veg', 'dessert', 'beverage'];

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    filterFoods();
  }, [foods, searchTerm, selectedCategory]);

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
      toast.error('Failed to load menu items');
    } finally {
      setLoading(false);
    }
  };

  const filterFoods = () => {
    let filtered = foods.filter(food => food.available && !food.isDeleted);

    if (searchTerm) {
      filtered = filtered.filter(food =>
        food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        food.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(food =>
        food.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    setFilteredFoods(filtered);
  };

  const addToCart = async (foodId: number) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartAPI.addToCart(user.id, foodId, 1);
      toast.success('Added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
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
          <h1 className="text-3xl font-bold text-gray-900">Our Menu</h1>
          <p className="text-gray-600 mt-2">Discover delicious dishes from our kitchen</p>
        </div>
        
        <Button
          variant="primary"
          icon={<ShoppingCart size={20} />}
          onClick={() => window.location.href = '/cart'}
        >
          View Cart
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
            placeholder="Search for dishes..."
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
                
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-skorange">
                    ${food.price}
                  </span>
                  
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => addToCart(food.id)}
                    icon={<Plus size={16} />}
                  >
                    Add
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
          <p className="text-gray-500 text-lg">No items found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage; 