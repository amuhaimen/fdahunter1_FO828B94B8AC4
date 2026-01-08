"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import authApi, { LoginRequest, User, ApiResponse } from '@/services/authApi';

// ============ TYPES ============
interface AuthState {
  user: User | null;
  token: string | null;
  userType: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: any) => Promise<ApiResponse>;
  loadUser: () => Promise<void>;
  clearAuth: () => void;
}

// ============ INITIAL STATE ============
const initialState: AuthState = {
  user: null,
  token: null,
  userType: null,
  isLoading: true,
  isAuthenticated: false,
};

// ============ CREATE CONTEXT ============
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============ PROVIDER COMPONENT ============
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = authApi.getToken();
        const userType = authApi.getUserType();
        
        if (token) {
          // Load user profile if token exists
          await loadUser();
        } else {
          setAuthState({
            ...initialState,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        setAuthState({
          ...initialState,
          isLoading: false,
        });
      }
    };

    initAuth();
  }, []);

  // ============ AUTH FUNCTIONS ============

  // Login function
  const login = async (credentials: LoginRequest): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authApi.login(credentials);
      
      if (response.success) {
        const token = response.authorization.access_token;
        const userType = response.type;
        
        // Set initial state with token
        setAuthState({
          user: null,
          token,
          userType,
          isLoading: true,
          isAuthenticated: true,
        });
        
        // Load user profile after successful login
        await loadUser();
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      setAuthState({
        ...initialState,
        isLoading: false,
      });
      throw error;
    }
  };

  // Register function
  const register = async (userData: any): Promise<ApiResponse> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      const response = await authApi.register(userData);
      
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return response;
    } catch (error: any) {
      setAuthState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  // Load user profile
  const loadUser = async (): Promise<void> => {
    try {
      if (!authApi.isAuthenticated()) {
        setAuthState({
          ...initialState,
          isLoading: false,
        });
        return;
      }

      const response = await authApi.getProfile();
      
      if (response.success && response.data) {
        setAuthState({
          user: response.data,
          token: authApi.getToken(),
          userType: authApi.getUserType(),
          isLoading: false,
          isAuthenticated: true,
        });
      } else {
        throw new Error(response.message || 'Failed to load user');
      }
    } catch (error: any) {
      console.error('Load user error:', error);
      
      // If token is invalid, clear auth
      if (error.status === 401) {
        clearAuth();
      } else {
        setAuthState({
          ...initialState,
          isLoading: false,
        });
      }
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearAuth();
    }
  };

  // Clear auth state
  const clearAuth = (): void => {
    authApi.clearAuth();
    setAuthState({
      ...initialState,
      isLoading: false,
    });
  };

  // ============ CONTEXT VALUE ============
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    register,
    loadUser,
    clearAuth,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;