import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User, AppState } from '../types';

interface AuthContextType extends AppState {
  login: (user: User, token: string, portalType: 'user' | 'admin') => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type AuthAction =
  | { type: 'LOGIN'; payload: { user: User; token: string; portalType: 'user' | 'admin' } }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const authReducer = (state: AppState, action: AuthAction): AppState => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        portalType: action.payload.portalType,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        portalType: 'user',
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState: AppState = {
  user: null,
  token: localStorage.getItem('jwtToken'),
  isAuthenticated: !!localStorage.getItem('jwtToken'),
  portalType: 'user',
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const login = (user: User, token: string, portalType: 'user' | 'admin') => {
    localStorage.setItem('jwtToken', token);
    dispatch({ type: 'LOGIN', payload: { user, token, portalType } });
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT' });
  };

  const updateUser = (user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  };

  useEffect(() => {
    // Check if token exists but no user data
    if (state.token && !state.user) {
      // You could decode JWT here to get user info or make an API call
      // For now, we'll just clear the token if it's invalid
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        logout();
      }
    }
  }, [state.token, state.user]);

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