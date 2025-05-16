
import { User, Session } from '@supabase/supabase-js';

export type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  authInitialized: boolean; 
  signIn: (email: string, password: string, stayLoggedIn?: boolean) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, eulaAccepted: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: { 
    display_name?: string, 
    email?: string, 
    avatar_url?: string,
    notifications?: boolean,
    distance_unit?: string,
    dark_mode?: boolean,
    maintenance_reminders?: boolean
  }) => Promise<void>;
};
