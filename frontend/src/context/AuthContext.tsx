import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthResponse, LoginData, RegisterData } from '../types';
import { authAPI } from '../services/api';

interface AuthContextType {
  user: AuthResponse | null;
  login: (data: LoginData) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (data: LoginData): Promise<void> => {
    try {
      const response = await authAPI.login(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    try {
      const response = await authAPI.register(data);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};