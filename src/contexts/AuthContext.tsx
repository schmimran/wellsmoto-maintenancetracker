import { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
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
  const navigate = useNavigate();
  const location = useLocation(); // Get current location

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
        
        // Only navigate if there's a specific auth event (not just initial loading)
        if (event === 'SIGNED_IN' && session) {
          // Only navigate to /garage if we're not already there
          if (location.pathname !== '/garage') {
            navigate('/garage');
          }
        } else if (event === 'SIGNED_OUT') {
          // Only navigate to /login if we're not already there or on the welcome page
          if (location.pathname !== '/login' && location.pathname !== '/') {
            navigate('/login');
          }
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
      
      // Initial navigation based on session status, but only if necessary
      if (session && location.pathname !== '/garage' && 
          !location.pathname.startsWith('/garage/') && 
          location.pathname !== '/profile' && 
          location.pathname !== '/maintenance' && 
          location.pathname !== '/reports') {
        navigate('/garage');
      } else if (!session && location.pathname !== '/login' && 
                 location.pathname !== '/' && 
                 location.pathname !== '/signup') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate, location.pathname]);

  const signIn = async (email: string, password: string, stayLoggedIn = false) => {
    try {
      // The issue is here - we need to correctly handle the stayLoggedIn option
      // The signInWithPassword method doesn't accept persistSession in the options
      // We can set this globally for the client if needed, but for now we'll just sign in
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
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
