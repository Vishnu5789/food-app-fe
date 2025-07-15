import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Calendar, DollarSign, Package, Users, Clock } from 'lucide-react';
import Card from '../../components/ui/Card';
import { orderAPI } from '../../services/api';
import { OrderStats, VegNonVegStats, ItemOrderStats } from '../../types';
import { toast } from 'react-hot-toast';

const AnalyticsPage: React.FC = () => {
  const [orderStats, setOrderStats] = useState<OrderStats | null>(null);
  const [vegNonVegStats, setVegNonVegStats] = useState<VegNonVegStats | null>(null);
  const [itemStats, setItemStats] = useState<ItemOrderStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    fetchAnalytics();
  }, [selectedDate]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [orderResponse, vegResponse, itemResponse] = await Promise.all([
        orderAPI.getOrderStats(selectedDate),
        orderAPI.getVegNonVegStats(selectedDate),
        orderAPI.getItemOrderStats(selectedDate)
      ]);

      if (orderResponse.status === 'SUCCESS') {
        setOrderStats(orderResponse.data);
      }
      if (vegResponse.status === 'SUCCESS') {
        setVegNonVegStats(vegResponse.data);
      }
      if (itemResponse.status === 'SUCCESS') {
        setItemStats(itemResponse.data);
      }
    } catch (error: any) {
      console.error('Error fetching analytics:', error);
      toast.error('Failed to fetch analytics data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">View detailed analytics and insights</p>
        </div>
        <div className="flex items-center space-x-4">
          <Calendar className="h-5 w-5 text-gray-400" />
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-skorange"
          />
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">
                {orderStats?.totalOrders || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{orderStats?.totalRevenue || 0}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Average Order Value</p>
              <p className="text-2xl font-bold text-gray-900">
                ₹{orderStats && orderStats.totalOrders > 0 
                  ? (orderStats.totalRevenue / orderStats.totalOrders).toFixed(2) 
                  : '0.00'}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Date</p>
              <p className="text-2xl font-bold text-gray-900">
                {new Date(selectedDate).toLocaleDateString()}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Veg/Non-Veg Distribution */}
      {vegNonVegStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Veg/Non-Veg Distribution</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Vegetarian Orders</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{vegNonVegStats.vegOrders}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">Non-Vegetarian Orders</span>
                </div>
                <span className="text-lg font-bold text-gray-900">{vegNonVegStats.nonVegOrders}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-green-500 to-red-500 h-2 rounded-full"
                  style={{ 
                    width: `${vegNonVegStats.vegOrders + vegNonVegStats.nonVegOrders > 0 
                      ? (vegNonVegStats.vegOrders / (vegNonVegStats.vegOrders + vegNonVegStats.nonVegOrders)) * 100 
                      : 0}%` 
                  }}
                ></div>
              </div>
            </div>
          </Card>

          {/* Popular Items */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Items</h3>
            <div className="space-y-3">
              {itemStats && Object.entries(itemStats.itemOrders)
                .sort(([,a], [,b]) => b - a)
                .slice(0, 5)
                .map(([itemName, count], index) => (
                  <div key={itemName} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-6 h-6 bg-skorange rounded-full flex items-center justify-center text-white text-xs font-bold mr-3">
                        {index + 1}
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">{itemName}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">{count}</span>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* No Data State */}
      {(!orderStats && !vegNonVegStats && !itemStats) && (
        <Card className="p-8 text-center">
          <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Analytics Data</h3>
          <p className="text-gray-600">No analytics data available for the selected date.</p>
        </Card>
      )}
    </div>
  );
};

export default AnalyticsPage; 