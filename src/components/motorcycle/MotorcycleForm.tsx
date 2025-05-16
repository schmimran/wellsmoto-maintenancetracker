
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { MotorcycleFormData, Motorcycle } from '@/types/motorcycle';

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import MotorcycleImageUpload from './MotorcycleImageUpload';
import DocumentUpload from './DocumentUpload';

const currentYear = new Date().getFullYear();

const motorcycleFormSchema = z.object({
  nickname: z.string().min(1, "Nickname is required"),
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.number()
    .int()
    .min(1885, "First motorcycle was invented in 1885")
    .max(currentYear + 1, `Year cannot be greater than ${currentYear + 1}`),
  odometer_miles: z.number().positive("Odometer must be a positive number"),
});

interface MotorcycleFormProps {
  existingMotorcycle?: Motorcycle;
}

const MotorcycleForm = ({ existingMotorcycle }: MotorcycleFormProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(existingMotorcycle?.image_url || null);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(existingMotorcycle?.thumbnail_url || null);
  const [insuranceUrl, setInsuranceUrl] = useState<string | null>(existingMotorcycle?.insurance_doc_url || null);
  const [registrationUrl, setRegistrationUrl] = useState<string | null>(existingMotorcycle?.registration_doc_url || null);
  
  const isEditing = !!existingMotorcycle;
  
  const form = useForm<MotorcycleFormData>({
    resolver: zodResolver(motorcycleFormSchema),
    defaultValues: {
      nickname: existingMotorcycle?.nickname || '',
      make: existingMotorcycle?.make || '',
      model: existingMotorcycle?.model || '',
      year: existingMotorcycle?.year || currentYear,
      odometer_miles: existingMotorcycle?.odometer_miles || 0,
    },
  });
  
  const handleImageUpload = (imageUrl: string, thumbnailUrl: string) => {
    setImageUrl(imageUrl);
    setThumbnailUrl(thumbnailUrl);
  };
  
  const handleInsuranceUpload = (url: string) => {
    setInsuranceUrl(url);
  };
  
  const handleRegistrationUpload = (url: string) => {
    setRegistrationUrl(url);
  };
  
  const onSubmit = async (data: MotorcycleFormData) => {
    if (!user) {
      toast.error("You must be logged in to save a motorcycle");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const motorcycleData = {
        ...data,
        user_id: user.id,
        image_url: imageUrl,
        thumbnail_url: thumbnailUrl,
        insurance_doc_url: insuranceUrl,
        registration_doc_url: registrationUrl,
      };
      
      if (isEditing && existingMotorcycle) {
        // Update existing motorcycle
        const { error } = await supabase
          .from('motorcycles')
          .update(motorcycleData)
          .eq('id', existingMotorcycle.id);
          
        if (error) throw error;
        toast.success("Motorcycle updated successfully");
      } else {
        // Create new motorcycle
        const { error } = await supabase
          .from('motorcycles')
          .insert([motorcycleData]);
          
        if (error) throw error;
        toast.success("Motorcycle added successfully");
      }
      
      // Navigate back to garage
      navigate('/garage');
    } catch (error: any) {
      console.error('Error saving motorcycle:', error);
      toast.error(error.message || "Failed to save motorcycle");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nickname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nickname</FormLabel>
              <FormControl>
                <Input placeholder="e.g. My Street Glide" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Make</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Harley-Davidson" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. Street Glide" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year</FormLabel>
                <FormControl>
                  <Input 
                    type="number"
                    min="1885"
                    max={currentYear + 1}
                    {...field} 
                    onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="odometer_miles"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Odometer (miles)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="0"
                    step="0.1"
                    {...field} 
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {user && (
          <>
            <MotorcycleImageUpload 
              userId={user.id} 
              onUploadComplete={handleImageUpload}
              existingImageUrl={imageUrl} 
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DocumentUpload 
                userId={user.id} 
                documentType="insurance" 
                onUploadComplete={handleInsuranceUpload}
                existingUrl={insuranceUrl} 
              />
              
              <DocumentUpload 
                userId={user.id} 
                documentType="registration" 
                onUploadComplete={handleRegistrationUpload}
                existingUrl={registrationUrl} 
              />
            </div>
          </>
        )}
        
        <div className="flex justify-end space-x-4">
          <Button 
            type="button" 
            variant="outline"
            onClick={() => navigate('/garage')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : isEditing ? 'Update Motorcycle' : 'Add Motorcycle'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default MotorcycleForm;
