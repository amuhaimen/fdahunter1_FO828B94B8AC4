"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authApi, { LoginRequest, LoginResponse } from '@/services/authApi';
import toast from 'react-hot-toast';

interface AuthContextType {
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  userType: string | null;
  userEmail: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [authState, setAuthState] = useState({
    isAuthenticated: authApi.isAuthenticated(),
    userType: authApi.getUserType(),
    userEmail: authApi.getUserEmail()
  });
  const router = useRouter();

  // Check initial auth state
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = {
        isAuthenticated: authApi.isAuthenticated(),
        userType: authApi.getUserType(),
        userEmail: authApi.getUserEmail()
      };
      setAuthState(authStatus);
      console.log("Initial auth check:", authStatus);
    };
    
    checkAuth();
    
    // Listen for storage changes (for logout from other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'token' || e.key === 'user_type') {
        checkAuth();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.success) {
        // Update auth state after login
        setAuthState({
          isAuthenticated: true,
          userType: authApi.getUserType(),
          userEmail: authApi.getUserEmail()
        });
        
        console.log("Login successful - Context updated");
        
        // Show success toast
        
      }
      
      return response;
    } catch (error: any) {
      console.error('Login error in context:', error);
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

// AuthContext.tsx (logout function only - already implemented)
const logout = async (): Promise<void> => {
  try {
    setIsLoading(true);
    
    // Clear all authentication data
    authApi.clearAuth();
    
    // Update state immediately
    setAuthState({
      isAuthenticated: false,
      userType: null,
      userEmail: null
    });
    
    console.log("Logout successful - All tokens removed");
    
    // Show success message
    toast.success('Logged out successfully');
    
    // Redirect to home page
    router.push('/');
    
    // Force a router refresh to clear any cached protected routes
    setTimeout(() => {
      router.refresh();
    }, 100);
    
  } catch (error) {
    console.error('Logout error:', error);
    toast.error('Logout failed. Please try again.');
    throw error;
  } finally {
    setIsLoading(false);
  }
};
  const value: AuthContextType = {
    isLoading,
    login,
    logout,
    isAuthenticated: authState.isAuthenticated,
    userType: authState.userType,
    userEmail: authState.userEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};