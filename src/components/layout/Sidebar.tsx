import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Home, 
  ShoppingCart, 
  Package, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  ChefHat,
  MapPin,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SKDelightLogo from '../SKDelightLogo';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

const Sidebar: React.FC = () => {
  const { user, logout, portalType } = useAuth();
  const location = useLocation();

  const userNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
    { name: 'Menu', href: '/menu', icon: <ChefHat size={20} /> },
    { name: 'Cart', href: '/cart', icon: <ShoppingCart size={20} /> },
    { name: 'Orders', href: '/orders', icon: <Package size={20} /> },
    { name: 'Addresses', href: '/addresses', icon: <MapPin size={20} /> },
    { name: 'Payments', href: '/payments', icon: <CreditCard size={20} /> },
  ];

  const adminNavItems: NavItem[] = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: <Home size={20} /> },
    { name: 'Food Management', href: '/admin/foods', icon: <ChefHat size={20} /> },
    { name: 'Orders', href: '/admin/orders', icon: <Package size={20} /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={20} /> },
    { name: 'Users', href: '/admin/users', icon: <Users size={20} /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings size={20} /> },
  ];

  const navItems = portalType === 'admin' ? adminNavItems : userNavItems;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className="w-64 h-screen bg-white shadow-xl border-r border-gray-200 flex flex-col"
    >
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <SKDelightLogo className="mx-auto" />
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-skorange to-skorange-dark rounded-full flex items-center justify-center text-white font-semibold">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-gray-900">{user.username}</p>
              <p className="text-sm text-gray-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-skorange to-skorange-dark text-white shadow-lg'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-skorange'
              }`}
            >
              <span className={`transition-colors duration-200 ${isActive ? 'text-white' : 'text-gray-400'}`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 w-full px-4 py-3 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all duration-200"
        >
          <LogOut size={20} />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </motion.div>
  );
};

export default Sidebar; 