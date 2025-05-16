
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Motorcycle } from '@/types/motorcycle';
import PageHeader from '@/components/PageHeader';
import MotorcycleForm from '@/components/motorcycle/MotorcycleForm';

const EditMotorcycle = () => {
  const { id } = useParams<{ id: string }>();
  const { user, authInitialized } = useAuth();
  const navigate = useNavigate();
  const [motorcycle, setMotorcycle] = useState<Motorcycle | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (authInitialized && !user) {
      navigate('/login');
      return;
    }
    
    if (!id || !user) return;
    
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
  }, [id, user, authInitialized]);
  
  if (loading) {
    return <div className="p-4 text-center">Loading motorcycle details...</div>;
  }
  
  if (!motorcycle) {
    return <div className="p-4 text-center">Motorcycle not found</div>;
  }
  
  return (
    <div className="pb-16">
      <PageHeader 
        title="Edit Motorcycle"
        showBackButton
        onBackButtonClick={() => navigate(`/garage/motorcycle/${id}`)}
      />
      
      <div className="p-4">
        <MotorcycleForm existingMotorcycle={motorcycle} />
      </div>
    </div>
  );
};

export default EditMotorcycle;
