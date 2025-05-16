
import { useState, useEffect } from 'react';
import PageHeader from '@/components/PageHeader';
import ActionButton from '@/components/ActionButton';
import ToggleSwitch from '@/components/ToggleSwitch';
import SettingsItem from '@/components/SettingsItem';
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

type Profile = Database['public']['Tables']['profiles']['Row'];

const Profile = () => {
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState('miles');
  const [darkMode, setDarkMode] = useState(false);
  const [maintenanceReminders, setMaintenanceReminders] = useState(true);
  const [userProfile, setUserProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
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

    fetchProfile();
  }, [user]);
  
  const handleEditProfile = () => {
    toast({
      title: "Coming Soon",
      description: "Profile editing will be available in a future update",
    });
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
  
  return (
    <div className="pb-16">
      <PageHeader title="Profile" />
      
      <div className="p-4">
        <div className="bg-white dark:bg-wells-darkGray rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col items-center">
            <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-1">
              {isLoading ? 'Loading...' : userProfile?.display_name || user?.email || 'User'}
            </h2>
            <p className="text-gray-500 mb-4">{user?.email || 'No email available'}</p>
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
            isChecked={notifications}
            onChange={setNotifications}
          />
          
          <div className="py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span>Distance Unit</span>
              <div className="flex bg-wells-lightGray rounded-lg overflow-hidden">
                <button
                  className={`px-4 py-1 ${distanceUnit === 'miles' ? 'bg-white dark:bg-wells-darkGray shadow-sm' : ''}`}
                  onClick={() => setDistanceUnit('miles')}
                >
                  Miles
                </button>
                <button
                  className={`px-4 py-1 ${distanceUnit === 'kilometers' ? 'bg-white dark:bg-wells-darkGray shadow-sm' : ''}`}
                  onClick={() => setDistanceUnit('kilometers')}
                >
                  Kilometers
                </button>
              </div>
            </div>
          </div>
          
          <ToggleSwitch
            id="darkMode"
            label="Dark Mode"
            isChecked={darkMode}
            onChange={setDarkMode}
          />
          
          <ToggleSwitch
            id="maintenanceReminders"
            label="Maintenance Reminders"
            isChecked={maintenanceReminders}
            onChange={setMaintenanceReminders}
          />
        </div>
        
        <div className="bg-white dark:bg-wells-darkGray rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-bold mb-4">About</h3>
          
          <SettingsItem title="App Version" rightElement={<span className="text-gray-500">1.0.0</span>} />
          <SettingsItem title="Terms of Service" onClick={navigateToTerms} />
          <SettingsItem title="Privacy Policy" onClick={navigateToPrivacy} />
          <SettingsItem title="Contact Support" onClick={navigateToSupport} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
