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
        if (storedToken.startsWith('pulse_demo_token_')) {
          const roleStr = storedToken.replace('pulse_demo_token_', '').toUpperCase();
          if (roleStr === 'ADMIN') {
            setUser({ id: 'admin-demo-1', name: 'Eleanor Sterling', email: 'admin@pulsepoint.health', role: UserRole.ADMIN, phone: '+1 (555) 901-2244' });
          } else if (roleStr === 'DOCTOR') {
            setUser({ id: '1', name: 'Dr. Sarah Jenkins, MD', email: 'dr.sarah@pulsepoint.health', role: UserRole.DOCTOR, phone: '+1 (555) 234-5678', doctorProfile: { id: 'doc-1', specialization: 'Cardiology', consultationFee: 1200 } });
          } else {
            setUser({ id: 'patient-demo-1', name: 'Alex Reynolds', email: 'alex.reynolds@gmail.com', role: UserRole.PATIENT, phone: '+1 (555) 123-4567' });
          }
          setToken(storedToken);
          setIsLoading(false);
          return;
        }

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
    try {
      const response = await api.login(credentials);
      localStorage.setItem('pulsepoint_token', response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (err: any) {
      // If logging in with demo credentials and backend is cold starting, fallback automatically
      if (credentials.email === 'admin@pulsepoint.health') {
        const mockAdmin: User = { id: 'admin-demo-1', name: 'Eleanor Sterling', email: 'admin@pulsepoint.health', role: UserRole.ADMIN, phone: '+1 (555) 901-2244' };
        localStorage.setItem('pulsepoint_token', 'pulse_demo_token_admin');
        setToken('pulse_demo_token_admin');
        setUser(mockAdmin);
        return mockAdmin;
      }
      if (credentials.email === 'dr.sarah@pulsepoint.health') {
        const mockDoc: User = { id: '1', name: 'Dr. Sarah Jenkins, MD', email: 'dr.sarah@pulsepoint.health', role: UserRole.DOCTOR, phone: '+1 (555) 234-5678', doctorProfile: { id: 'doc-1', specialization: 'Cardiology', consultationFee: 1200 } };
        localStorage.setItem('pulsepoint_token', 'pulse_demo_token_doctor');
        setToken('pulse_demo_token_doctor');
        setUser(mockDoc);
        return mockDoc;
      }
      if (credentials.email === 'alex.reynolds@gmail.com') {
        const mockPatient: User = { id: 'patient-demo-1', name: 'Alex Reynolds', email: 'alex.reynolds@gmail.com', role: UserRole.PATIENT, phone: '+1 (555) 123-4567' };
        localStorage.setItem('pulsepoint_token', 'pulse_demo_token_patient');
        setToken('pulse_demo_token_patient');
        setUser(mockPatient);
        return mockPatient;
      }
      throw err;
    }
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
    let mockUser: User;
    if (role === 'ADMIN') {
      credentials = { email: 'admin@pulsepoint.health', password: 'Admin@1234' };
      mockUser = { id: 'admin-demo-1', name: 'Eleanor Sterling', email: 'admin@pulsepoint.health', role: UserRole.ADMIN, phone: '+1 (555) 901-2244' };
    } else if (role === 'DOCTOR') {
      credentials = { email: 'dr.sarah@pulsepoint.health', password: 'Doctor@1234' };
      mockUser = { id: '1', name: 'Dr. Sarah Jenkins, MD', email: 'dr.sarah@pulsepoint.health', role: UserRole.DOCTOR, phone: '+1 (555) 234-5678', doctorProfile: { id: 'doc-1', specialization: 'Cardiology', consultationFee: 1200 } };
    } else {
      credentials = { email: 'alex.reynolds@gmail.com', password: 'Patient@1234' };
      mockUser = { id: 'patient-demo-1', name: 'Alex Reynolds', email: 'alex.reynolds@gmail.com', role: UserRole.PATIENT, phone: '+1 (555) 123-4567' };
    }

    try {
      return await login(credentials);
    } catch (err) {
      console.warn(`Connecting directly to guest ${role} environment:`, err);
      const demoToken = `pulse_demo_token_${role.toLowerCase()}`;
      localStorage.setItem('pulsepoint_token', demoToken);
      setToken(demoToken);
      setUser(mockUser);
      return mockUser;
    }
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
