
import { createContext, useContext } from 'react';
import { AuthContextType } from '@/types/auth';

// Create the context with undefined as default
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Export the AuthProvider component from the new location
export { AuthProvider } from '@/components/auth/AuthProvider';

// Hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
