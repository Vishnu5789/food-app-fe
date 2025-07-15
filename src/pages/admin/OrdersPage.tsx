import React from 'react';
import { motion } from 'framer-motion';
import { Package, Clock, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

const AdminOrdersPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all orders</p>
        </div>
      </motion.div>

      <Card className="p-8 text-center">
        <Package size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Order Management Coming Soon</h3>
        <p className="text-gray-600">Advanced order management will be implemented here.</p>
      </Card>
    </div>
  );
};

export default AdminOrdersPage; 