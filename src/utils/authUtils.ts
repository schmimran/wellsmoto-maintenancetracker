
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Debug flag to track authentication flow
export const DEBUG_AUTH = false;

export const debugLog = (...args: any[]) => {
  if (DEBUG_AUTH) {
    console.log('[AuthContext]', ...args);
  }
};

export const signInWithEmail = async (email: string, password: string, stayLoggedIn = false) => {
  try {
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

export const signUpWithEmail = async (email: string, password: string, displayName: string, eulaAccepted: boolean) => {
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

export const signOutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error: any) {
    toast.error(error.message || 'Error signing out');
    throw error;
  }
};

export const updateUserProfile = async (
  userId: string, 
  data: { 
    display_name?: string, 
    email?: string, 
    avatar_url?: string,
    notifications?: boolean,
    distance_unit?: string,
    dark_mode?: boolean,
    maintenance_reminders?: boolean
  }
) => {
  try {
    // Update email if provided
    if (data.email) {
      const { error: emailError } = await supabase.auth.updateUser({ email: data.email });
      if (emailError) throw emailError;
    }

    // Update profile data in profiles table
    const updates = {
      id: userId,
      updated_at: new Date().toISOString(),
      ...data,
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .upsert(updates)
      .eq('id', userId);

    if (updateError) throw updateError;

    toast.success('Profile updated successfully!');
  } catch (error: any) {
    toast.error(error.message || 'Error updating profile');
    throw error;
  }
};
