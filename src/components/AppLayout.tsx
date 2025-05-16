
import { Outlet } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';
import { Toaster } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import SafeArea from './SafeArea';
import { useEffect } from 'react';
import { isIOS, isAndroid, isNativePlatform } from '@/services/capacitor';

const AppLayout = () => {
  const { user } = useAuth();
  
  useEffect(() => {
    // Add platform-specific classes to body for targeting styles
    if (isIOS) {
      document.body.classList.add('ios-platform');
    } else if (isAndroid) {
      document.body.classList.add('android-platform');
    }
    
    if (isNativePlatform) {
      document.body.classList.add('native-platform');
    } else {
      document.body.classList.add('web-platform');
    }
    
    return () => {
      document.body.classList.remove('ios-platform', 'android-platform', 'native-platform', 'web-platform');
    };
  }, []);

  return (
    <div className="app-layout">
      <SafeArea top>
        <main className="app-main">
          <Outlet />
        </main>
      </SafeArea>
      <MobileNavbar />
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
