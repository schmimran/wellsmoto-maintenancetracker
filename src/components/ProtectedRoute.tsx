
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

const ProtectedRoute = () => {
  const { user, isLoading, authInitialized } = useAuth();
  const location = useLocation();
  const [shouldRedirect, setShouldRedirect] = useState(false);
  
  // Use an effect to determine if we should redirect
  // This prevents immediate redirects that might conflict with AuthContext
  useEffect(() => {
    // Only make a decision when auth is no longer loading and has been initialized
    if (!isLoading && authInitialized) {
      setShouldRedirect(!user);
    }
  }, [user, isLoading, authInitialized]);

  if (isLoading || !authInitialized) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  // Only redirect when we've explicitly determined we should
  return shouldRedirect ? <Navigate to="/login" state={{ from: location }} replace /> : <Outlet />;
};

export default ProtectedRoute;
