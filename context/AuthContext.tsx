import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import authApi, { LoginRequest, LoginResponse, User } from '@/services/authApi';
 

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  checkAuth: () => boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      
      if (authApi.isAuthenticated()) {
        try {
          const response = await authApi.getProfile();
          if (response.success && response.data) {
            setUser(response.data);
          } else {
            authApi.clearAuth();
            setUser(null);
          }
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
          authApi.clearAuth();
          setUser(null);
        }
      }
      
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      setIsLoading(true);
      const response = await authApi.login(credentials);
      
      if (response.success) {
        localStorage.setItem('user_type', response.type);
        
        try {
          const profileResponse = await authApi.getProfile();
          if (profileResponse.success && profileResponse.data) {
            setUser(profileResponse.data);
          }
        } catch (profileError) {
          console.error('Failed to fetch profile after login:', profileError);
        }
      }
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      authApi.clearAuth();
      setUser(null);
      router.push('/login');
    }
  };

  const checkAuth = (): boolean => {
    return authApi.isAuthenticated();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user && authApi.isAuthenticated(),
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};