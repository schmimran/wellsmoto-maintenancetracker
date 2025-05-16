
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type DistanceUnit = 'miles' | 'kilometers';

interface UserPreferences {
  notifications: boolean;
  distanceUnit: DistanceUnit;
  darkMode: boolean;
  maintenanceReminders: boolean;
}

interface UserPreferencesContextType {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreferences: (newPreferences: Partial<UserPreferences>) => Promise<void>;
}

const defaultPreferences: UserPreferences = {
  notifications: true,
  distanceUnit: 'miles',
  darkMode: false,
  maintenanceReminders: true,
};

const UserPreferencesContext = createContext<UserPreferencesContextType | undefined>(undefined);

export const UserPreferencesProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Load user preferences from Supabase
  useEffect(() => {
    const fetchPreferences = async () => {
      if (!user) {
        setPreferences(defaultPreferences);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('notifications, distance_unit, dark_mode, maintenance_reminders')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user preferences:', error);
          return;
        }

        if (data) {
          setPreferences({
            notifications: data.notifications ?? defaultPreferences.notifications,
            distanceUnit: (data.distance_unit as DistanceUnit) ?? defaultPreferences.distanceUnit,
            darkMode: data.dark_mode ?? defaultPreferences.darkMode,
            maintenanceReminders: data.maintenance_reminders ?? defaultPreferences.maintenanceReminders,
          });
        }
      } catch (error) {
        console.error('Error loading preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPreferences();
  }, [user]);

  // Apply dark mode preference to document
  useEffect(() => {
    if (preferences.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [preferences.darkMode]);

  const updatePreferences = async (newPreferences: Partial<UserPreferences>) => {
    if (!user) return;

    try {
      // Update local state first for immediate UI feedback
      const updatedPreferences = { ...preferences, ...newPreferences };
      setPreferences(updatedPreferences);

      // Update database
      const { error } = await supabase
        .from('profiles')
        .update({
          notifications: updatedPreferences.notifications,
          distance_unit: updatedPreferences.distanceUnit,
          dark_mode: updatedPreferences.darkMode,
          maintenance_reminders: updatedPreferences.maintenanceReminders,
        })
        .eq('id', user.id);

      if (error) {
        throw error;
      }
    } catch (error: any) {
      toast.error('Failed to update preferences');
      console.error('Error updating preferences:', error);
    }
  };

  return (
    <UserPreferencesContext.Provider value={{ preferences, isLoading, updatePreferences }}>
      {children}
    </UserPreferencesContext.Provider>
  );
};

export const useUserPreferences = () => {
  const context = useContext(UserPreferencesContext);
  if (context === undefined) {
    throw new Error('useUserPreferences must be used within a UserPreferencesProvider');
  }
  return context;
};
