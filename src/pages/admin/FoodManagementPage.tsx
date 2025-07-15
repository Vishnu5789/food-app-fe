import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Search, Filter, Upload, Image as ImageIcon, X, Utensils, Camera, UploadCloud } from 'lucide-react';
import { FoodItem, FoodItemRequest, UpdateFoodItemRequest } from '../../types';
import { foodAPI } from '../../services/api';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import Select from '../../components/ui/Select';
import { CATEGORY_OPTIONS, CATEGORY_FILTER_OPTIONS, getCategoryLabel, getCategoryColors } from '../../constants/categories';
import { toast } from 'react-hot-toast';

const FoodManagementPage: React.FC = () => {
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setIsSubmitting(true);
      await foodAPI.addFood(formData);
      toast.success('Food item added successfully');
      setShowAddModal(false);
      await loadFoods();
    } catch (error) {
      console.error('Error adding food:', error);
      toast.error('Failed to add food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateFood = async (id: number, formData: UpdateFoodItemRequest) => {
    try {
      setIsSubmitting(true);
      await foodAPI.updateFood(id, formData);
      toast.success('Food item updated successfully');
      setShowEditModal(false);
      setSelectedFood(null);
      await loadFoods();
    } catch (error) {
      console.error('Error updating food:', error);
      toast.error('Failed to update food item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFood = async (id: number) => {
      try {
      setIsDeleting(true);
        await foodAPI.deleteFood(id);
        toast.success('Food item deleted successfully');
      setShowDeleteModal(false);
      setSelectedFood(null);
        await loadFoods();
      } catch (error) {
        console.error('Error deleting food:', error);
        toast.error('Failed to delete food item');
    } finally {
      setIsDeleting(false);
    }
  };

  const openDeleteModal = (food: FoodItem) => {
    setSelectedFood(food);
    setShowDeleteModal(true);
  };

  const openEditModal = (food: FoodItem) => {
    setSelectedFood(food);
    setShowEditModal(true);
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
          disabled={isSubmitting}
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
                  
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    food.available 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {food.available ? 'Available' : 'Unavailable'}
                  </span>
                </div>
                
                <div className="flex space-x-2 flex-shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(food)}
                    icon={<Edit size={16} />}
                    disabled={isSubmitting}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => openDeleteModal(food)}
                    icon={<Trash2 size={16} />}
                    disabled={isSubmitting || isDeleting}
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
        isSubmitting={isSubmitting}
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
          isSubmitting={isSubmitting}
        />
      )}

      {/* Delete Confirmation Modal */}
      {selectedFood && (
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedFood(null);
          }}
          food={selectedFood}
          onConfirm={handleDeleteFood}
          isDeleting={isDeleting}
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
  isSubmitting: boolean;
}

const AddFoodModal: React.FC<AddFoodModalProps> = ({ isOpen, onClose, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<FoodItemRequest>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    imageUrl: '',
  });
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      resetForm();
    }
  }, [isOpen]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      image: '',
      imageUrl: '',
    });
    setImagePreview(null);
    setErrors({});
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input change event triggered!');
    console.log('Files:', event.target.files);
    const file = event.target.files?.[0];
    if (file) {
      console.log('Processing file:', file.name);
      processImageFile(file);
    } else {
      console.log('No file selected');
    }
  };

  const processImageFile = (file: File) => {
    setIsUploading(true);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      setIsUploading(false);
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-skorange', 'bg-orange-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-skorange', 'bg-orange-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-skorange', 'bg-orange-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '' });
    setImagePreview(null);
  };

  const handleImageClick = () => {
    console.log('Image clicked, triggering file input...');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Add Food Item" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter food name"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          required
          error={errors.name}
        />
        
        <Input
          label="Description"
          placeholder="Enter food description"
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          required
          error={errors.description}
        />
        
        <Input
          label="Price"
          type="number"
          placeholder="Enter price"
          value={formData.price}
          onChange={(e) => {
            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
            if (errors.price) setErrors({ ...errors, price: '' });
          }}
          required
          error={errors.price}
        />
        
        <Select
          label="Category"
          placeholder="Select category"
          options={CATEGORY_FILTER_OPTIONS}
          value={formData.category}
          onChange={(value) => {
            setFormData({ ...formData, category: value });
            if (errors.category) setErrors({ ...errors, category: '' });
          }}
          required
        />
        
        {/* Professional Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Food Image <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          
          {!imagePreview ? (
            <label 
              htmlFor="image-upload"
              className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-skorange transition-all duration-300 cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 group block"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
                disabled={isUploading || isSubmitting}
              />
              <div className="flex flex-col items-center space-y-4">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-skorange border-t-transparent"></div>
                ) : (
                  <div className="relative">
                    <UploadCloud className="h-16 w-16 text-gray-400 group-hover:text-skorange transition-colors duration-300" />
                    <Camera className="absolute -bottom-2 -right-2 h-6 w-6 text-gray-500 bg-white rounded-full p-1 shadow-sm" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-700 group-hover:text-skorange transition-colors duration-300">
                    {isUploading ? 'Uploading...' : 'Upload Food Image'}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-skorange hover:text-orange-600">
                      Click to browse
                    </span>{' '}
                    or drag and drop
                  </div>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="relative group">
              <label 
                htmlFor="image-upload"
                className="relative border-2 border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-skorange transition-all duration-300 bg-white shadow-sm hover:shadow-lg block"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                  disabled={isUploading || isSubmitting}
                />
                <div className="relative w-full h-[280px] bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                  
                  {/* Professional Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-700">
                          <Camera size={16} />
                          <span className="text-sm font-medium">Click to change image</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeImage();
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl z-10 group/btn"
                  >
                    <X size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  {/* Upload Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1.5 bg-green-500 text-white text-xs font-medium rounded-full shadow-lg">
                      ✓ Uploaded
                    </span>
                  </div>
                </div>
              </label>
              
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  Image uploaded successfully • Click anywhere on the image to change
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Food Item'}
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
  isSubmitting: boolean;
}

const EditFoodModal: React.FC<EditFoodModalProps> = ({ isOpen, onClose, food, onSubmit, isSubmitting }) => {
  const [formData, setFormData] = useState<UpdateFoodItemRequest>({
    name: food.name,
    description: food.description,
    price: food.price,
    category: food.category,
    imageUrl: food.imageUrl,
    available: food.available,
  });
  const [imagePreview, setImagePreview] = useState<string | null>(food.imageUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Update form data when food prop changes
  useEffect(() => {
    if (food) {
      setFormData({
        name: food.name,
        description: food.description,
        price: food.price,
        category: food.category,
        imageUrl: food.imageUrl,
        available: food.available,
      });
      setImagePreview(food.imageUrl || null);
      setErrors({});
    }
  }, [food]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File) => {
    setIsUploading(true);
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      setIsUploading(false);
      return;
    }
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      setIsUploading(false);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64String = e.target?.result as string;
      setFormData({ ...formData, image: base64String });
      setImagePreview(base64String);
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-skorange', 'bg-orange-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-skorange', 'bg-orange-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-skorange', 'bg-orange-50');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: '', imageUrl: '' });
    setImagePreview(null);
  };

  const handleImageClick = () => {
    console.log('Image clicked, triggering file input...');
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      console.error('File input ref is null');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    onSubmit(food.id, formData);
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Edit Food Item" size="xl">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          placeholder="Enter food name"
          value={formData.name || ''}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          required
          error={errors.name}
        />
        
        <Input
          label="Description"
          placeholder="Enter food description"
          value={formData.description || ''}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          required
          error={errors.description}
        />
        
        <Input
          label="Price"
          type="number"
          placeholder="Enter price"
          value={formData.price || 0}
          onChange={(e) => {
            setFormData({ ...formData, price: parseFloat(e.target.value) || 0 });
            if (errors.price) setErrors({ ...errors, price: '' });
          }}
          required
          error={errors.price}
        />
        
        <Select
          label="Category"
          placeholder="Select category"
          options={CATEGORY_FILTER_OPTIONS}
          value={formData.category || ''}
          onChange={(value) => {
            setFormData({ ...formData, category: value });
            if (errors.category) setErrors({ ...errors, category: '' });
          }}
          required
        />
        
        {/* Professional Image Upload Section */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Food Image <span className="text-gray-500 font-normal">(Optional)</span>
          </label>
          
          {!imagePreview ? (
            <label 
              htmlFor="edit-image-upload"
              className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-skorange transition-all duration-300 cursor-pointer bg-gradient-to-br from-gray-50 to-gray-100 hover:from-orange-50 hover:to-orange-100 group block"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="edit-image-upload"
                disabled={isUploading || isSubmitting}
              />
              <div className="flex flex-col items-center space-y-4">
                {isUploading ? (
                  <div className="animate-spin rounded-full h-16 w-16 border-4 border-skorange border-t-transparent"></div>
                ) : (
                  <div className="relative">
                    <UploadCloud className="h-16 w-16 text-gray-400 group-hover:text-skorange transition-colors duration-300" />
                    <Camera className="absolute -bottom-2 -right-2 h-6 w-6 text-gray-500 bg-white rounded-full p-1 shadow-sm" />
                  </div>
                )}
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-700 group-hover:text-skorange transition-colors duration-300">
                    {isUploading ? 'Uploading...' : 'Upload Food Image'}
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-skorange hover:text-orange-600">
                      Click to browse
                    </span>{' '}
                    or drag and drop
                    </div>
                  <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                </div>
              </div>
            </label>
          ) : (
            <div className="relative group">
              <label 
                htmlFor="edit-image-upload"
                className="relative border-2 border-gray-200 rounded-xl overflow-hidden cursor-pointer hover:border-skorange transition-all duration-300 bg-white shadow-sm hover:shadow-lg block"
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="edit-image-upload"
                  disabled={isUploading || isSubmitting}
                />
                <div className="relative w-full h-[280px] bg-gray-50">
                  <img
                    src={imagePreview}
                    alt="Food preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                  />
                  
                  {/* Professional Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-white/90 backdrop-blur-sm rounded-lg p-3 text-center">
                        <div className="flex items-center justify-center space-x-2 text-gray-700">
                          <Camera size={16} />
                          <span className="text-sm font-medium">Click to change image</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      removeImage();
                    }}
                    className="absolute top-4 right-4 p-2.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all duration-200 shadow-lg hover:shadow-xl z-10 group/btn"
                  >
                    <X size={18} className="group-hover/btn:scale-110 transition-transform duration-200" />
                  </button>
                  
                  {/* Upload Status Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 text-white text-xs font-medium rounded-full shadow-lg ${
                      formData.image ? 'bg-blue-500' : 'bg-green-500'
                    }`}>
                      {formData.image ? '🔄 New Upload' : '✓ Current Image'}
                    </span>
                  </div>
                </div>
              </label>
              
              <div className="mt-3 text-center">
                <p className="text-sm text-gray-600">
                  {formData.image ? 'New image uploaded • Click anywhere on the image to change' : 'Current image • Click anywhere on the image to change'}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleClose} className="flex-1" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? 'Updating...' : 'Update Food Item'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

// Delete Confirmation Modal Component
interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  food: FoodItem;
  onConfirm: (id: number) => void;
  isDeleting: boolean;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ isOpen, onClose, food, onConfirm, isDeleting }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Deletion" size="sm">
      <div className="text-center py-6">
        <p className="text-gray-800 text-lg mb-4">
          Are you sure you want to delete "{food.name}"? This action cannot be undone.
        </p>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={onClose} className="flex-1" disabled={isDeleting}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onConfirm(food.id)} className="flex-1" disabled={isDeleting}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default FoodManagementPage; 