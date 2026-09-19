import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { UserLoginInput, UserRegisterInput, UserRole } from '@pulsepoint/shared';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string | null;
  doctorProfile?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (credentials: UserLoginInput) => Promise<User>;
  register: (data: UserRegisterInput) => Promise<User>;
  logout: () => void;
  loginAsDemo: (role: 'ADMIN' | 'DOCTOR' | 'PATIENT') => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('pulsepoint_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('pulsepoint_token');
      if (storedToken) {
        try {
          const profile = await api.getProfile();
          setUser(profile);
          setToken(storedToken);
        } catch (error) {
          console.warn('Session expired or invalid token:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: UserLoginInput): Promise<User> => {
    const response = await api.login(credentials);
    localStorage.setItem('pulsepoint_token', response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const register = async (data: UserRegisterInput): Promise<User> => {
    const response = await api.register(data);
    localStorage.setItem('pulsepoint_token', response.token);
    setToken(response.token);
    setUser(response.user);
    return response.user;
  };

  const logout = () => {
    localStorage.removeItem('pulsepoint_token');
    setToken(null);
    setUser(null);
  };

  const loginAsDemo = async (role: 'ADMIN' | 'DOCTOR' | 'PATIENT'): Promise<User> => {
    let credentials: UserLoginInput;
    if (role === 'ADMIN') {
      credentials = { email: 'admin@pulsepoint.health', password: 'Admin@1234' };
    } else if (role === 'DOCTOR') {
      credentials = { email: 'dr.sarah@pulsepoint.health', password: 'Doctor@1234' };
    } else {
      credentials = { email: 'alex.reynolds@gmail.com', password: 'Patient@1234' };
    }
    return await login(credentials);
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, loginAsDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
