
import { useState, useEffect } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import Logo from '@/components/Logo';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import { Keyboard } from '@capacitor/keyboard';
import { isNativePlatform } from '@/services/capacitor';
import SafeArea from '@/components/SafeArea';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  stayLoggedIn: z.boolean().default(false),
});

const Login = () => {
  const { user, isLoading, authInitialized, signIn } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      stayLoggedIn: false,
    },
  });

  // Setup keyboard handling for native platforms
  useEffect(() => {
    if (isNativePlatform) {
      const setupNativeKeyboard = async () => {
        await Keyboard.setAccessoryBarVisible({ isVisible: false });
      };

      setupNativeKeyboard();
      
      // Add keyboard avoidance listeners
      const hideKeyboardOnTouch = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (!target.closest('input') && !target.closest('textarea')) {
          Keyboard.hide();
        }
      };
      
      document.addEventListener('touchstart', hideKeyboardOnTouch);
      
      return () => {
        document.removeEventListener('touchstart', hideKeyboardOnTouch);
      };
    }
  }, []);

  const handleSubmit = async (values: z.infer<typeof loginSchema>) => {
    if (isNativePlatform) {
      Keyboard.hide();
    }
    
    setIsSubmitting(true);
    try {
      await signIn(values.email, values.password, values.stayLoggedIn);
    } catch (error) {
      console.error('Error during sign in:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Only redirect to garage when we have a confirmed authenticated user
  // and we're sure auth is initialized (not in loading state)
  if (user && !isLoading && authInitialized) {
    // Get the intended destination or default to /garage
    const from = location.state?.from?.pathname || "/garage";
    return <Navigate to={from} replace />;
  }

  return (
    <SafeArea all className="flex flex-col items-center justify-center min-h-screen bg-wells-slateBlue animate-fade-in">
      <div className="flex flex-col items-center mb-8">
        <Logo size="lg" withText={true} />
      </div>
      
      <div className="w-full max-w-md px-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Sign In</h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="you@example.com" 
                        {...field} 
                        className="h-11 text-base" // Larger touch target
                        autoComplete="email"
                        inputMode="email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="••••••••" 
                        {...field} 
                        className="h-11 text-base" // Larger touch target
                        autoComplete="current-password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="stayLoggedIn"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md pt-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        className="h-5 w-5" // Larger touch target
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel className="text-base">Stay logged in</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-wells-red hover:bg-wells-red/90 text-white h-12 text-base" // Larger touch target
                disabled={isSubmitting || isLoading}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          </Form>
          
          <div className="mt-4 text-center text-gray-600 dark:text-gray-300">
            Don't have an account?{' '}
            <Link to="/signup" className="text-wells-red hover:underline text-base">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </SafeArea>
  );
};

export default Login;
