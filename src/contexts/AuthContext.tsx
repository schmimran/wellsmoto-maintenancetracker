
import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

// Debug flag to track authentication flow
const DEBUG_AUTH = false;

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  authInitialized: boolean; // Flag to track when initial auth check is complete
  signIn: (email: string, password: string, stayLoggedIn?: boolean) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, eulaAccepted: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { display_name?: string, email?: string, avatar_url?: string }) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authInitialized, setAuthInitialized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const debugLog = (...args: any[]) => {
    if (DEBUG_AUTH) {
      console.log('[AuthContext]', ...args);
    }
  };

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
    try {
      // Update: Fixed options structure for signInWithPassword
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) throw error;
      
      // Handle session persistence separately if needed
      if (stayLoggedIn) {
        // Set local storage option for persistence if needed
        localStorage.setItem('supabase.auth.persistence', 'local');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error signing in');
      throw error;
    }
  };

  const signUp = async (email: string, password: string, displayName: string, eulaAccepted: boolean) => {
    try {
      if (!eulaAccepted) {
        throw new Error('You must accept the EULA to create an account.');
      }
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: displayName,
            eula_accepted: eulaAccepted,
            eula_accepted_at: new Date().toISOString(),
          },
        },
      });
      
      if (error) throw error;
      toast.success('Account created successfully! Please check your email for verification.');
    } catch (error: any) {
      toast.error(error.message || 'Error creating account');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // Ensure we clear any state when signing out
      setUser(null);
      setSession(null);
      
      // Navigate to login page after sign out
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message || 'Error signing out');
      throw error;
    }
  };

  const updateProfile = async (data: { display_name?: string, email?: string, avatar_url?: string }) => {
    try {
      if (!user) throw new Error('User not authenticated');

      // Update email if provided
      if (data.email && data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({ email: data.email });
        if (emailError) throw emailError;
      }

      // Update profile data in profiles table
      const updates = {
        id: user.id,
        updated_at: new Date().toISOString(),
        ...data,
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .upsert(updates)
        .eq('id', user.id);

      if (updateError) throw updateError;

      toast.success('Profile updated successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Error updating profile');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        authInitialized, // Expose this flag to consumers
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
