"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import authApi, { LoginRequest, LoginResponse } from '@/services/authApi';

interface AuthContextType {
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
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
  const router = useRouter();

  // Check initial auth state
  useEffect(() => {
    console.log("Initial auth check:", {
      isAuthenticated: authApi.isAuthenticated(),
      userType: authApi.getUserType(),
      userEmail: authApi.getUserEmail()
    });
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.success) {
        console.log("Login successful");
        
        // Give localStorage time to save
        setTimeout(() => {
          console.log("After login localStorage check:", {
            token: localStorage.getItem("access_token")?.substring(0, 20) + "...",
            user_type: localStorage.getItem("user_type"),
            user_email: localStorage.getItem("user_email")
          });
        }, 100);
      }
      
      return response;
    } catch (error) {
      // The error is now a LoginResponse object
      console.error('Login error in context:', error);
      throw error; // Pass the error response object
    } finally {
      setIsLoading(false);
    }
  };

  const logout = (): void => {
    authApi.clearAuth();
    router.push('/');
  };

  const value: AuthContextType = {
    isLoading,
    login,
    logout,
    isAuthenticated: authApi.isAuthenticated(),
    userType: authApi.getUserType(),
    userEmail: authApi.getUserEmail(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};