
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';
import AvatarUpload from './AvatarUpload';

const profileSchema = z.object({
  display_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
});

type EditProfileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean | ((updated: boolean) => void)) => void;
  currentProfile: {
    display_name?: string | null;
    email?: string | null;
    avatar_url?: string | null;
  };
};

const EditProfileModal = ({ open, onOpenChange, currentProfile }: EditProfileModalProps) => {
  const { updateProfile, user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(currentProfile.avatar_url || null);
  
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      display_name: currentProfile.display_name || '',
      email: currentProfile.email || user?.email || '',
    },
  });

  // Reset form values when modal opens or currentProfile changes
  useEffect(() => {
    if (open) {
      form.reset({
        display_name: currentProfile.display_name || '',
        email: currentProfile.email || user?.email || '',
      });
      setAvatarUrl(currentProfile.avatar_url || null);
    }
  }, [open, currentProfile, user?.email, form]);
  
  const handleAvatarUpload = (url: string) => {
    setAvatarUrl(url);
  };

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsSubmitting(true);
    try {
      await updateProfile({
        display_name: values.display_name,
        email: values.email,
        avatar_url: avatarUrl || undefined,
      });
      
      // Close modal and indicate successful update
      if (typeof onOpenChange === 'function') {
        onOpenChange(true); // Pass true to indicate update occurred
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (typeof onOpenChange === 'function') {
      onOpenChange(false); // Pass false to indicate no update
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">Edit Profile</DialogTitle>
        </DialogHeader>
        
        <div className="pt-4">
          <AvatarUpload 
            url={currentProfile.avatar_url || null} 
            onUpload={handleAvatarUpload}
          />
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="display_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Display Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="you@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="bg-wells-red hover:bg-wells-red/90 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditProfileModal;
