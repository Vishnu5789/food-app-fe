import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Cog } from 'lucide-react';
import Card from '../../components/ui/Card';

const SettingsPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Configure your restaurant settings</p>
        </div>
      </motion.div>

      <Card className="p-8 text-center">
        <Settings size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Settings Coming Soon</h3>
        <p className="text-gray-600">Advanced settings and configuration will be implemented here.</p>
      </Card>
    </div>
  );
};

export default SettingsPage; 