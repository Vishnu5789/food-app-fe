import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Home } from 'lucide-react';
import SKDelightLogo from '../components/SKDelightLogo';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // The logout function in AuthContext will handle the API call, 
      // clearing local storage, navigation, and toast messages automatically
    } catch (error) {
      console.error('Logout failed:', error);
      // Error handling is already done in the AuthContext logout function
    }
  };

  return (
    <div className="min-h-screen bg-skgreen">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sk-card p-8 transform transition-all duration-500 hover:shadow-2xl animate-fade-in-scale">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <SKDelightLogo animate className="mb-0" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome Home!</h1>
                <p className="text-gray-600">You have successfully logged in.</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center px-4 py-2 bg-skorange hover:bg-skorange-dark text-white font-medium rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              <LogOut size={18} className="mr-2" />
              Logout
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-skorange to-skorange-dark rounded-xl p-6 text-white transform transition-all duration-300 hover:scale-105">
              <h3 className="text-xl font-semibold mb-2">Dashboard</h3>
              <p className="text-orange-100">Your personal dashboard</p>
            </div>
            <div className="bg-gradient-to-r from-green-400 to-skgreen rounded-xl p-6 text-gray-900 transform transition-all duration-300 hover:scale-105 border border-green-200">
              <h3 className="text-xl font-semibold mb-2">Profile</h3>
              <p className="text-green-800">Manage your profile</p>
            </div>
            <div className="bg-gradient-to-r from-yellow-300 to-yellow-100 rounded-xl p-6 text-gray-900 transform transition-all duration-300 hover:scale-105 border border-yellow-200">
              <h3 className="text-xl font-semibold mb-2">Settings</h3>
              <p className="text-yellow-800">Configure your preferences</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;