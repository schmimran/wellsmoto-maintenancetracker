
import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/contexts/AuthContext';
import { 
  debugLog, 
  signInWithEmail, 
  signUpWithEmail, 
  signOutUser,
  updateUserProfile 
} from '@/utils/authUtils';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle navigation based on auth state
  const handleAuthNavigation = (sessionData: Session | null, event?: string) => {
    debugLog('handleAuthNavigation', { sessionData, event, pathname: location.pathname });

    // Don't navigate if we're still loading
    if (isLoading) return;
    
    // Only navigate if auth is initialized
    if (!authInitialized) return;

    // If user is authenticated
    if (sessionData) {
      // Public routes that should redirect to garage when logged in
      const publicRoutes = ['/', '/login', '/signup'];
      
      if (publicRoutes.includes(location.pathname)) {
        debugLog('Redirecting to /garage from public route');
        setTimeout(() => navigate('/garage'), 10);
      }
    } 
    // If user is not authenticated
    else {
      // Protected routes that should redirect to login when not logged in
      const protectedRoutes = ['/garage', '/maintenance', '/reports', '/profile'];
      
      // Check if current path is a protected route
      const isProtectedRoute = protectedRoutes.some(route => 
        location.pathname === route || location.pathname.startsWith(`${route}/`)
      );
      
      if (isProtectedRoute) {
        debugLog('Redirecting to /login from protected route');
        setTimeout(() => navigate('/login'), 10);
      }
    }
  };

  useEffect(() => {
    debugLog('Auth Provider initializing');
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, sessionData) => {
        debugLog('onAuthStateChange', { event, sessionData });
        
        if (!mounted) return;

        setSession(sessionData);
        setUser(sessionData?.user ?? null);
        
        if (event === 'SIGNED_IN' || event === 'SIGNED_OUT') {
          setIsLoading(false);
          // Let handleAuthNavigation manage the navigation
          handleAuthNavigation(sessionData, event);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: sessionData } }) => {
      debugLog('getSession result', { sessionData });
      
      if (!mounted) return;

      setSession(sessionData);
      setUser(sessionData?.user ?? null);
      setIsLoading(false);
      setAuthInitialized(true);
      
      // Let handleAuthNavigation manage the navigation
      handleAuthNavigation(sessionData);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Watch for route changes and adjust navigation if needed
  useEffect(() => {
    if (authInitialized && !isLoading) {
      handleAuthNavigation(session);
    }
  }, [location.pathname, authInitialized]);

  const signIn = async (email: string, password: string, stayLoggedIn = false) => {
    await signInWithEmail(email, password, stayLoggedIn);
  };

  const signUp = async (email: string, password: string, displayName: string, eulaAccepted: boolean) => {
    await signUpWithEmail(email, password, displayName, eulaAccepted);
  };

  const signOut = async () => {
    try {
      await signOutUser();
      
      // Ensure we clear any state when signing out
      setUser(null);
      setSession(null);
      
      // Navigate to login page after sign out
      navigate('/login');
    } catch (error) {
      throw error;
    }
  };

  const updateProfile = async (data: { 
    display_name?: string, 
    email?: string, 
    avatar_url?: string,
    notifications?: boolean,
    distance_unit?: string,
    dark_mode?: boolean,
    maintenance_reminders?: boolean
  }) => {
    if (!user) throw new Error('User not authenticated');
    await updateUserProfile(user.id, data);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        authInitialized,
        signIn,
        signUp,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
