import React from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  ChefHat,
  MapPin,
  CreditCard,
  Plus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const DashboardPage: React.FC = () => {
  const { user, portalType } = useAuth();

  const userStats = [
    { name: 'Total Orders', value: '12', icon: <Package size={24} />, color: 'from-blue-500 to-blue-600' },
    { name: 'Cart Items', value: '3', icon: <ShoppingCart size={24} />, color: 'from-green-500 to-green-600' },
    { name: 'Saved Addresses', value: '2', icon: <MapPin size={24} />, color: 'from-purple-500 to-purple-600' },
    { name: 'Total Spent', value: '$156', icon: <CreditCard size={24} />, color: 'from-orange-500 to-orange-600' },
  ];

  const adminStats = [
    { name: 'Total Orders', value: '156', icon: <Package size={24} />, color: 'from-blue-500 to-blue-600' },
    { name: 'Food Items', value: '24', icon: <ChefHat size={24} />, color: 'from-green-500 to-green-600' },
    { name: 'Total Users', value: '89', icon: <Users size={24} />, color: 'from-purple-500 to-purple-600' },
    { name: 'Revenue', value: '$2,456', icon: <TrendingUp size={24} />, color: 'from-orange-500 to-orange-600' },
  ];

  const stats = portalType === 'admin' ? adminStats : userStats;

  const quickActions = portalType === 'admin' ? [
    { name: 'Add Food Item', href: '/admin/foods/add', icon: <Plus size={20} /> },
    { name: 'View Orders', href: '/admin/orders', icon: <Package size={20} /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <TrendingUp size={20} /> },
    { name: 'Manage Users', href: '/admin/users', icon: <Users size={20} /> },
  ] : [
    { name: 'Browse Menu', href: '/menu', icon: <ChefHat size={20} /> },
    { name: 'View Cart', href: '/cart', icon: <ShoppingCart size={20} /> },
    { name: 'My Orders', href: '/orders', icon: <Package size={20} /> },
    { name: 'Add Address', href: '/addresses', icon: <MapPin size={20} /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user?.username}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's what's happening with your {portalType === 'admin' ? 'restaurant' : 'orders'} today.
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-gradient-to-r ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <Card 
                className="p-6 text-center hover:shadow-xl transition-all duration-300 cursor-pointer"
                onClick={() => window.location.href = action.href}
              >
                <div className="w-12 h-12 bg-gradient-to-r from-skorange to-skorange-dark rounded-lg flex items-center justify-center mx-auto mb-4 text-white">
                  {action.icon}
                </div>
                <h3 className="font-medium text-gray-900">{action.name}</h3>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-skorange to-skorange-dark rounded-full flex items-center justify-center text-white">
                <Package size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Order #1234 placed</p>
                <p className="text-sm text-gray-600">2 hours ago</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                Delivered
              </span>
            </div>
            
            <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-gradient-to-r from-skorange to-skorange-dark rounded-full flex items-center justify-center text-white">
                <ShoppingCart size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Item added to cart</p>
                <p className="text-sm text-gray-600">4 hours ago</p>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage; 