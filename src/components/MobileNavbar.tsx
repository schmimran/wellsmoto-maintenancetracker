
import { Link, useLocation } from 'react-router-dom';
import { Home, Wrench, BarChart3, User } from 'lucide-react';
import Logo from './Logo';

const MobileNavbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-wells-darkGray border-t border-gray-200 dark:border-gray-800 pb-safe">
      <div className="flex justify-around items-center h-16">
        <Link to="/garage" className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive('/garage') ? 'text-wells-red' : 'text-gray-500'}`}>
          <Home size={24} />
          <span className="text-xs mt-1">Garage</span>
        </Link>
        
        <Link to="/maintenance" className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive('/maintenance') ? 'text-wells-red' : 'text-gray-500'}`}>
          <Wrench size={24} />
          <span className="text-xs mt-1">Maintenance</span>
        </Link>
        
        <Link to="/reports" className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive('/reports') ? 'text-wells-red' : 'text-gray-500'}`}>
          <BarChart3 size={24} />
          <span className="text-xs mt-1">Reports</span>
        </Link>
        
        <Link to="/profile" className={`flex flex-col items-center justify-center w-1/4 h-full ${isActive('/profile') ? 'text-wells-red' : 'text-gray-500'}`}>
          <User size={24} />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavbar;
