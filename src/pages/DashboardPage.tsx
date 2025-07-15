import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  ChefHat,
  MapPin,
  CreditCard,
  Plus,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userDashboardAPI, orderAPI } from '../services/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { toast } from 'react-hot-toast';

const DashboardPage: React.FC = () => {
  const { user, portalType } = useAuth();
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [recentActivity, setRecentActivity] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && portalType === 'user') {
      fetchDashboardData();
    }
  }, [user, portalType]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsResponse, activityResponse] = await Promise.all([
        userDashboardAPI.getDashboardStats(user!.id),
        userDashboardAPI.getRecentActivity(user!.id)
      ]);

      if (statsResponse.status === 'SUCCESS') {
        setDashboardStats(statsResponse.data);
      }
      if (activityResponse.status === 'SUCCESS') {
        setRecentActivity(activityResponse.data);
      }
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const userStats = dashboardStats ? [
    { name: 'Total Orders', value: dashboardStats.ordersCount.toString(), icon: <Package size={24} />, color: 'from-blue-500 to-blue-600' },
    { name: 'Cart Items', value: dashboardStats.cartItemsCount.toString(), icon: <ShoppingCart size={24} />, color: 'from-green-500 to-green-600' },
    { name: 'Saved Addresses', value: dashboardStats.addressesCount.toString(), icon: <MapPin size={24} />, color: 'from-purple-500 to-purple-600' },
    { name: 'Total Spent', value: `₹${dashboardStats.totalSpent}`, icon: <CreditCard size={24} />, color: 'from-orange-500 to-orange-600' },
  ] : [
    { name: 'Total Orders', value: '0', icon: <Package size={24} />, color: 'from-blue-500 to-blue-600' },
    { name: 'Cart Items', value: '0', icon: <ShoppingCart size={24} />, color: 'from-green-500 to-green-600' },
    { name: 'Saved Addresses', value: '0', icon: <MapPin size={24} />, color: 'from-purple-500 to-purple-600' },
    { name: 'Total Spent', value: '₹0', icon: <CreditCard size={24} />, color: 'from-orange-500 to-orange-600' },
  ];

  const adminStats = [
    { name: 'Total Orders', value: '156', icon: <Package size={24} />, color: 'from-blue-500 to-blue-600' },
    { name: 'Food Items', value: '24', icon: <ChefHat size={24} />, color: 'from-green-500 to-green-600' },
    { name: 'Total Users', value: '89', icon: <Users size={24} />, color: 'from-purple-500 to-purple-600' },
    { name: 'Revenue', value: '₹2,456', icon: <TrendingUp size={24} />, color: 'from-orange-500 to-orange-600' },
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ORDERED':
        return <Clock className="h-4 w-4" />;
      case 'PREPARING':
        return <Package className="h-4 w-4" />;
      case 'DELIVERED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ORDERED':
        return 'bg-blue-100 text-blue-800';
      case 'PREPARING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && portalType === 'user') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-skorange"></div>
        </div>
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
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => (
          <Card key={stat.name} className="p-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * index }}
              className="flex items-center"
            >
              <div className={`p-3 bg-gradient-to-r ${stat.color} rounded-lg text-white`}>
                {stat.icon}
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </motion.div>
          </Card>
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
          {quickActions.map((action) => (
            <Card key={action.name} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
              <a href={action.href} className="flex items-center space-x-3">
                <div className="p-2 bg-skorange rounded-lg text-white">
                  {action.icon}
                </div>
                <span className="font-medium text-gray-900">{action.name}</span>
              </a>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Recent Activity */}
      {portalType === 'user' && recentActivity && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <Card className="p-6">
            <div className="space-y-4">
              {recentActivity.recentOrders && recentActivity.recentOrders.length > 0 ? (
                recentActivity.recentOrders.map((order: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-skorange to-skorange-dark rounded-full flex items-center justify-center text-white">
                      <Package size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">Order #{order.id} placed</p>
                      <p className="text-sm text-gray-600">
                        {new Date(order.orderedAt).toLocaleDateString()} at {new Date(order.orderedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Package className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-600">No recent orders. Start by browsing our menu!</p>
                </div>
              )}
              
              {recentActivity.recentCartItems && recentActivity.recentCartItems.length > 0 && (
                recentActivity.recentCartItems.map((item: any, index: number) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-gradient-to-r from-skorange to-skorange-dark rounded-full flex items-center justify-center text-white">
                      <ShoppingCart size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{item.foodItemName} added to cart</p>
                      <p className="text-sm text-gray-600">
                        {new Date(item.addedAt).toLocaleDateString()} at {new Date(item.addedAt).toLocaleTimeString()}
                      </p>
                    </div>
                    <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Admin Recent Activity (placeholder) */}
      {portalType === 'admin' && (
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
                  <p className="font-medium text-gray-900">New user registered</p>
                  <p className="text-sm text-gray-600">4 hours ago</p>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardPage; 