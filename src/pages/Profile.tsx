
import { useState, useEffect } from 'react';
import ActionButton from '@/components/ActionButton';
import ToggleSwitch from '@/components/ToggleSwitch';
import SettingsItem from '@/components/SettingsItem';
import EditProfileModal from '@/components/EditProfileModal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const { preferences, updatePreferences, isLoading: preferencesLoading } = useUserPreferences();
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  
  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setUserProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);
  
  const handleEditProfile = () => {
    setIsEditProfileOpen(true);
  };

  const handleEditProfileClose = (updated: boolean) => {
    setIsEditProfileOpen(false);
    if (updated) {
      // Refresh profile data after successful edit
      fetchProfile();
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out successfully",
      });
    } catch (error) {
      toast({
        title: "Error logging out",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const navigateToTerms = () => {
    toast({
      title: "Coming Soon",
      description: "Terms of Service will be available in a future update",
    });
  };

  const navigateToPrivacy = () => {
    toast({
      title: "Coming Soon",
      description: "Privacy Policy will be available in a future update",
    });
  };

  const navigateToSupport = () => {
    toast({
      title: "Coming Soon",
      description: "Support contact will be available in a future update",
    });
  };

  const getInitials = () => {
    const name = userProfile?.display_name || user?.user_metadata?.name || 'User';
    return name.charAt(0).toUpperCase();
  };
  
  return (
    <div className="p-4">
      <div className="bg-white dark:bg-wells-darkGray rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col items-center">
          <Avatar className="w-20 h-20 mb-4">
            <AvatarImage 
              src={userProfile?.avatar_url || undefined} 
              alt={userProfile?.display_name || 'Profile'} 
            />
            <AvatarFallback className="bg-wells-red text-white text-2xl font-bold">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-1">
            {isLoading ? 'Loading...' : userProfile?.display_name || user?.email || 'User'}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-4">{user?.email || 'No email available'}</p>
          <div className="flex flex-col space-y-2 w-full max-w-xs">
            <ActionButton onClick={handleEditProfile}>Edit Profile</ActionButton>
            <ActionButton 
              onClick={handleLogout}
              variant="outline"
              className="border-wells-red text-wells-red hover:bg-wells-red/10"
            >
              Sign Out
            </ActionButton>
          </div>
        </div>
      </div>
      
      <div className="bg-white dark:bg-wells-darkGray rounded-lg shadow-sm p-6 mb-6">
        <h3 className="text-lg font-bold mb-4">Settings</h3>
        
        <ToggleSwitch
          id="notifications"
          label="Notifications"
          isChecked={preferences.notifications}
          onChange={(checked) => updatePreferences({ notifications: checked })}
        />
        
        <div className="py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <span>Distance Unit</span>
            <div className="flex bg-wells-lightGray rounded-lg overflow-hidden">
              <button
                className={`px-4 py-1 ${preferences.distanceUnit === 'miles' ? 'bg-white dark:bg-wells-darkGray shadow-sm' : ''}`}
                onClick={() => updatePreferences({ distanceUnit: 'miles' })}
              >
                Miles
              </button>
              <button
                className={`px-4 py-1 ${preferences.distanceUnit === 'kilometers' ? 'bg-white dark:bg-wells-darkGray shadow-sm' : ''}`}
                onClick={() => updatePreferences({ distanceUnit: 'kilometers' })}
              >
                Kilometers
              </button>
            </div>
          </div>
        </div>
        
        <ToggleSwitch
          id="darkMode"
          label="Dark Mode"
          isChecked={preferences.darkMode}
          onChange={(checked) => updatePreferences({ darkMode: checked })}
        />
        
        <ToggleSwitch
          id="maintenanceReminders"
          label="Maintenance Reminders"
          isChecked={preferences.maintenanceReminders}
          onChange={(checked) => updatePreferences({ maintenanceReminders: checked })}
        />
      </div>
      
      <div className="bg-white dark:bg-wells-darkGray rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-bold mb-4">About</h3>
        
        <SettingsItem title="App Version" rightElement={<span className="text-gray-500">1.0.0</span>} />
        <SettingsItem title="Terms of Service" onClick={navigateToTerms} />
        <SettingsItem title="Privacy Policy" onClick={navigateToPrivacy} />
        <SettingsItem title="Contact Support" onClick={navigateToSupport} />
      </div>

      <EditProfileModal
        open={isEditProfileOpen}
        onOpenChange={handleEditProfileClose}
        currentProfile={userProfile || {}}
      />
    </div>
  );
};

export default Profile;
