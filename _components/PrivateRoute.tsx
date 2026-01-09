import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import authApi from '@/services/authApi';
 

interface PrivateRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'user'>;
  redirectTo?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  allowedRoles = ['admin'],
  redirectTo = '/login'
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) return;

    // Redirect if not authenticated
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (user && allowedRoles.length > 0) {
      const userType = user.type || authApi.getUserType();
      if (userType && !allowedRoles.includes(userType as 'admin' | 'user')) {
        router.push('/unauthorized');
      }
    }
  }, [isAuthenticated, isLoading, user, router, allowedRoles, redirectTo]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // Check role-based access before rendering
  if (user && allowedRoles.length > 0) {
    const userType = user.type || authApi.getUserType();
    if (userType && !allowedRoles.includes(userType as 'admin' | 'user')) {
      return null; // Will redirect in useEffect
    }
  }

  return <>{children}</>;
};

// Helper components for specific roles
export const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <PrivateRoute allowedRoles={['admin']}>{children}</PrivateRoute>;
};

 

export default PrivateRoute;