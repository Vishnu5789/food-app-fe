import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AppState } from '../types';
import { authAPI } from '../services/api';
import { toast } from 'react-hot-toast';

interface AuthContextType extends AppState {
  login: (user: User, token: string, portalType: 'user' | 'admin') => void;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string; portalType: 'user' | 'admin' } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'SET_LOADING'; payload: boolean };

const authReducer = (state: AppState, action: AuthAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        portalType: action.payload.portalType,
        isLoading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        portalType: 'user',
        isLoading: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AppState = {
  user: null,
  token: null,
  isAuthenticated: false,
  portalType: 'user',
  isLoading: true,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User, token: string, portalType: 'user' | 'admin') => {
    localStorage.setItem('jwtToken', token);
    localStorage.setItem('portalType', portalType);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user, token, portalType } });
  };

  const logout = async (): Promise<void> => {
    try {
      // Call the logout API
      await authAPI.logout();
      
      // Clear local storage and state
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('portalType');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      
      // Show success message
      toast.success('Logged out successfully!');
      
      // Redirect to appropriate login page based on portal type
      const currentPortalType = state.portalType;
      if (currentPortalType === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    } catch (error: any) {
      console.error('Logout API error:', error);
      
      // Even if API call fails, clear local data
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('portalType');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
      
      // Show error message
      const errorMessage = error.response?.data?.message || 'Logout failed, but you have been signed out locally';
      toast.error(errorMessage);
      
      // Redirect to appropriate login page
      const currentPortalType = state.portalType;
      if (currentPortalType === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/login';
      }
    }
  };

  const updateUser = (user: User) => {
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  useEffect(() => {
    // Initialize authentication state from localStorage
    const token = localStorage.getItem('jwtToken');
    const portalType = localStorage.getItem('portalType') as 'user' | 'admin';
    const storedUser = localStorage.getItem('user');
    
    console.log('Auth initialization:', { token: !!token, portalType, storedUser: !!storedUser });
    
    if (token && portalType && storedUser) {
      // All authentication data exists, validate it
      try {
        const user = JSON.parse(storedUser);
        if (user && user.role) {
          // Valid authentication data, restore state
          console.log('Valid auth data found, restoring state');
          dispatch({ 
            type: 'LOGIN', 
            payload: { 
              user, 
              token, 
              portalType: portalType as 'user' | 'admin' 
            } 
          });
        } else {
          // Invalid user data, clear everything
          console.log('Invalid user data, clearing auth');
          localStorage.removeItem('jwtToken');
          localStorage.removeItem('portalType');
          localStorage.removeItem('user');
          dispatch({ type: 'LOGOUT' });
        }
      } catch (error) {
        // Error parsing user data, clear everything
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('portalType');
        localStorage.removeItem('user');
        dispatch({ type: 'LOGOUT' });
      }
    } else if (token || portalType || storedUser) {
      // Partial authentication data exists, clear everything
      console.log('Partial auth data found, clearing auth');
      localStorage.removeItem('jwtToken');
      localStorage.removeItem('portalType');
      localStorage.removeItem('user');
      dispatch({ type: 'LOGOUT' });
    } else {
      // No authentication data exists, set loading to false
      console.log('No auth data found, setting loading to false');
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []); // Only run once on mount

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 