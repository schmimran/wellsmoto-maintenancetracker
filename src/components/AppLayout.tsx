
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import MobileNavbar from './MobileNavbar';
import PageHeader from './PageHeader';
import { Toaster } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import SafeArea from './SafeArea';
import { useEffect, useState } from 'react';
import { isIOS, isAndroid, isNativePlatform } from '@/services/capacitor';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types/motorcycle';

interface HeaderConfig {
  title: string;
  showLogo?: boolean;
  showBackButton?: boolean;
  onBackButtonClick?: () => void;
  actions?: React.ReactNode;
}

const AppLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  
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

  // Fetch motorcycle data for dynamic titles
  useEffect(() => {
    const fetchMotorcycle = async () => {
      if (params.id && (location.pathname.includes('/motorcycle/') || location.pathname.includes('/edit/'))) {
        try {
          const { data, error } = await supabase
            .from('motorcycles')
            .select('*')
            .eq('id', params.id)
            .single();
          
          if (!error) {
            setMotorcycle(data);
          }
        } catch (error) {
          console.error('Error fetching motorcycle:', error);
        }
      } else {
        setMotorcycle(null);
      }
    };
    
    fetchMotorcycle();
  }, [params.id, location.pathname]);

  const getHeaderConfig = (): HeaderConfig => {
    const path = location.pathname;
    
    if (path === '/garage') {
      return { title: 'My Garage' };
    }
    
    if (path === '/garage/add') {
      return {
        title: 'Add Motorcycle',
        showBackButton: true,
        onBackButtonClick: () => navigate('/garage')
      };
    }
    
    if (path.startsWith('/garage/edit/') && motorcycle) {
      return {
        title: 'Edit Motorcycle',
        showBackButton: true,
        onBackButtonClick: () => navigate(`/garage/motorcycle/${motorcycle.id}`)
      };
    }
    
    if (path.startsWith('/garage/motorcycle/') && motorcycle) {
      const handleDelete = async () => {
        if (!motorcycle) return;
        if (!confirm('Are you sure you want to delete this motorcycle?')) {
          return;
        }
        
        try {
          const { error } = await supabase
            .from('motorcycles')
            .delete()
            .eq('id', motorcycle.id);
          
          if (error) throw error;
          navigate('/garage');
        } catch (error: any) {
          console.error('Error deleting motorcycle:', error);
        }
      };

      return {
        title: motorcycle.nickname,
        showBackButton: true,
        onBackButtonClick: () => navigate('/garage'),
        actions: (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/garage/edit/${motorcycle.id}`)}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleDelete}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        )
      };
    }
    
    if (path === '/maintenance') {
      return { title: 'Maintenance' };
    }
    
    if (path === '/reports') {
      return { title: 'Reports' };
    }
    
    if (path === '/profile') {
      return { title: 'Profile' };
    }
    
    return { title: 'App' };
  };

  const headerConfig = getHeaderConfig();

  return (
    <div className="app-layout">
      <SafeArea top>
        <div className="fixed top-0 left-0 right-0 z-40 bg-white dark:bg-wells-darkGray">
          <SafeArea top>
            <PageHeader {...headerConfig} />
          </SafeArea>
        </div>
        <main className="app-main pt-16">
          <Outlet />
        </main>
      </SafeArea>
      <MobileNavbar />
      <Toaster position="top-center" />
    </div>
  );
};

export default AppLayout;
