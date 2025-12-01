import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { djidaliApi, ApiUser, ApiAuthResponse } from '../services/djidaliApi';

interface AuthContextType {
  user: ApiUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'CUSTOMER';
    passportNumber: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      try {
        if (djidaliApi.isAuthenticated()) {
          const currentUser = djidaliApi.getCurrentUser();
          if (currentUser) {
            setUser(currentUser);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const handleAuthChange = (event: Event) => {
      const customEvent = event as CustomEvent<ApiUser | null>;
      setUser(customEvent.detail);
    };

    window.addEventListener('djidali:auth-change', handleAuthChange);

    return () => {
      window.removeEventListener('djidali:auth-change', handleAuthChange);
    };
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    try {
      setIsLoading(true);
      const response: ApiAuthResponse = await djidaliApi.login(email, password);
      setUser(response.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    role: 'CUSTOMER';
    passportNumber: string;
    dateOfBirth: string;
    nationality: string;
    address: string;
  }): Promise<void> => {
    try {
      setIsLoading(true);
      const response: ApiAuthResponse = await djidaliApi.register(userData);
      setUser(response.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    djidaliApi.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
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
