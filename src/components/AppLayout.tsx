
import { Outlet } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';
import { Toaster } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const AppLayout = () => {
  const { user } = useAuth();
  
  return (
    <div className="app-layout">
      <main className="app-main">
        <Outlet />
      </main>
      <MobileNavbar />
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
