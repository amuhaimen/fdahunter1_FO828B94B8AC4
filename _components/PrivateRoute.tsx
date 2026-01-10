'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'user'>;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles = ['admin', 'user'],
  redirectTo = '/'
}) => {
  const { isAuthenticated, isLoading, userType } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      // Toast message removed as requested
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (userType && allowedRoles.length > 0 && !allowedRoles.includes(userType as 'admin' | 'user')) {
      toast.error("You don't have permission to access this page", {
        id: 'no-permission',
      });
      router.push('/unauthorized');
    }
  }, [isAuthenticated, isLoading, userType, router, allowedRoles, redirectTo]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (userType && allowedRoles.length > 0 && !allowedRoles.includes(userType as 'admin' | 'user')) {
    return null;
  }

  return <>{children}</>;
};

export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PrivateRoute allowedRoles={['admin']}>{children}</PrivateRoute>;
};

export const UserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PrivateRoute allowedRoles={['user']}>{children}</PrivateRoute>;
};

export default PrivateRoute;