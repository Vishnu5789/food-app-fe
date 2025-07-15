import { SelectOption } from '../components/ui/Select';

// Professional category options for display
export const CATEGORY_OPTIONS: SelectOption[] = [
  { value: 'all', label: 'All Categories' },
  { value: 'veg', label: 'Vegetarian' },
  { value: 'non-veg', label: 'Non-Vegetarian' },
  { value: 'dessert', label: 'Dessert' },
  { value: 'beverage', label: 'Beverages' }
];

// Filter options (excluding 'all' for form inputs)
export const CATEGORY_FILTER_OPTIONS: SelectOption[] = CATEGORY_OPTIONS.filter(
  option => option.value !== 'all'
);

// Professional color schemes for different categories
export const CATEGORY_COLORS = {
  'veg': {
    bg: 'bg-green-100',
    text: 'text-green-800',
    border: 'border-green-500'
  },
  'non-veg': {
    bg: 'bg-red-100',
    text: 'text-red-800',
    border: 'border-red-500'
  },
  'dessert': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    border: 'border-purple-500'
  },
  'beverage': {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    border: 'border-blue-500'
  }
};

// Helper function to get display label from value
export const getCategoryLabel = (value: string): string => {
  const option = CATEGORY_OPTIONS.find(opt => opt.value === value);
  return option ? option.label : value;
};

// Helper function to get value from display label
export const getCategoryValue = (label: string): string => {
  const option = CATEGORY_OPTIONS.find(opt => opt.label === label);
  return option ? option.value : label;
};

// Helper function to get category colors
export const getCategoryColors = (category: string) => {
  const normalizedCategory = category.toLowerCase();
  return CATEGORY_COLORS[normalizedCategory as keyof typeof CATEGORY_COLORS] || {
    bg: 'bg-gray-100',
    text: 'text-gray-800',
    border: 'border-gray-200'
  };
}; 