import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, ShoppingCart, Plus, Minus, Utensils } from 'lucide-react';
import { FoodItem } from '../types';
import { foodAPI, cartAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { CATEGORY_OPTIONS, getCategoryLabel, getCategoryColors } from '../constants/categories';
import { toast } from 'react-hot-toast';

const MenuPage: React.FC = () => {
  const { user } = useAuth();
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [filteredFoods, setFilteredFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

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
    let filtered = foods.filter(food => !food.isDeleted && food.available);
    
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

  const addToCart = async (foodItemId: number) => {
    if (!user) {
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await cartAPI.addToCart(user.id, foodItemId, 1);
      toast.success('Item added to cart successfully');
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
        
        <div className="w-full md:w-64">
          <Select
            placeholder="Filter by category"
            options={CATEGORY_OPTIONS}
            value={selectedCategory}
            onChange={setSelectedCategory}
          />
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
            className="h-full"
          >
            <Card className="overflow-hidden h-full flex flex-col">
              <div className="w-full h-48 bg-gray-100 relative overflow-hidden flex-shrink-0 group">
                {food.imageUrl ? (
                  <img
                    src={food.imageUrl}
                    alt={food.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-gray-400">
                    <Utensils size={48} />
                    <span className="text-sm font-medium">No Image</span>
                  </div>
                )}
                
                {/* Category Tag Overlay */}
                <div className="absolute top-2 right-2">
                  <span className={`px-3 py-1.5 rounded-full text-[10px] font-semibold whitespace-nowrap shadow-lg backdrop-blur-md bg-white/90 border-2 ${getCategoryColors(food.category).border} ${getCategoryColors(food.category).text}`}>
                    {getCategoryLabel(food.category)}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{food.name}</h3>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-2 flex-grow">
                  {food.description}
                </p>
                
                <div className="flex items-center justify-between mb-4 flex-shrink-0">
                  <span className="text-2xl font-bold text-skorange">
                    ${food.price}
                  </span>
                </div>
                
                <Button
                  variant="primary"
                  onClick={() => addToCart(food.id)}
                  icon={<Plus size={16} />}
                  className="w-full flex-shrink-0"
                >
                  Add to Cart
                </Button>
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
          <p className="text-gray-500 text-lg">No dishes found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
};

export default MenuPage; 