import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Motorcycle } from '@/types/motorcycle';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { formatDistance } from '@/utils/distanceUtils';
import { Bike, FileText } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const MotorcycleDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user || !id) return;
    
    const fetchMotorcycle = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('motorcycles')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error) throw error;
        setMotorcycle(data);
      } catch (error: any) {
        console.error('Error fetching motorcycle:', error);
        toast.error('Failed to load motorcycle details');
        navigate('/garage');
      } finally {
        setLoading(false);
      }
    };
    
    fetchMotorcycle();
  }, [id, user]);
  
  if (loading) {
    return <div className="p-4 text-center">Loading motorcycle details...</div>;
  }
  
  if (!motorcycle) {
    return <div className="p-4 text-center">Motorcycle not found</div>;
  }
  
  return (
    <div className="p-4 space-y-6">
      {/* Motorcycle Image */}
      <div className="w-full aspect-video bg-muted rounded-md overflow-hidden">
        {motorcycle.image_url ? (
          <img 
            src={motorcycle.image_url} 
            alt={motorcycle.nickname}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <Bike className="h-20 w-20 text-muted-foreground" />
          </div>
        )}
      </div>
      
      {/* Motorcycle Details */}
      <Card>
        <CardContent className="p-6 space-y-4">
          <div>
            <h2 className="text-xl font-semibold">{motorcycle.year} {motorcycle.make} {motorcycle.model}</h2>
            <p className="text-muted-foreground">{motorcycle.nickname}</p>
          </div>
          
          <div className="pt-2 space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Year:</span>
              <span>{motorcycle.year}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Make:</span>
              <span>{motorcycle.make}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Model:</span>
              <span>{motorcycle.model}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-muted-foreground">Odometer:</span>
              <span>{formatDistance(motorcycle.odometer_miles, preferences.distanceUnit as 'miles' | 'kilometers')}</span>
            </div>
          </div>
          
          {/* Documents */}
          <div className="pt-4 space-y-3">
            <h3 className="font-medium">Documents</h3>
            
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Insurance:</span>
                {motorcycle.insurance_doc_url ? (
                  <a 
                    href={motorcycle.insurance_doc_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    View Document
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Not uploaded</span>
                )}
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Registration:</span>
                {motorcycle.registration_doc_url ? (
                  <a 
                    href={motorcycle.registration_doc_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    <FileText className="h-4 w-4" />
                    View Document
                  </a>
                ) : (
                  <span className="text-sm text-muted-foreground">Not uploaded</span>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MotorcycleDetail;
