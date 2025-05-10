
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  redirectPath?: string;
}

const ProtectedRoute = ({ 
  allowedRoles,
  redirectPath = '/auth'
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    // Show loading state while checking authentication
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Check if user is authenticated and has the required role
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={redirectPath} replace />;
  }
  
  return <Outlet />;
};

export default ProtectedRoute;
