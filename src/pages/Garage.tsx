
import { useState, useEffect } from 'react';
import { Bike, Grid2x2, List } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import FloatingActionButton from '@/components/FloatingActionButton';
import SegmentedControl from '@/components/SegmentedControl';
import { useAuth } from '@/contexts/AuthContext';
import { useUserPreferences } from '@/contexts/UserPreferencesContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Motorcycle } from '@/types/motorcycle';
import MotorcycleCard from '@/components/motorcycle/MotorcycleCard';
import MotorcycleList from '@/components/motorcycle/MotorcycleList';

const Garage = () => {
  const [viewType, setViewType] = useState<'cards' | 'list'>('cards');
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, authInitialized } = useAuth();
  const { preferences } = useUserPreferences();
  const navigate = useNavigate();
  
  // Ensure we're authenticated when this page renders
  useEffect(() => {
    if (authInitialized && !user) {
      navigate('/login');
    }
  }, [user, authInitialized]);
  
  // Fetch motorcycles
  useEffect(() => {
    if (!user) return;
    
    const fetchMotorcycles = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('motorcycles')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        setMotorcycles(data || []);
      } catch (error) {
        console.error('Error fetching motorcycles:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMotorcycles();
  }, [user]);
  
  const handleAddMotorcycle = () => {
    navigate('/garage/add');
  };
  
  const handleMotorcycleDeleted = async () => {
    // Reload motorcycles after deletion
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('motorcycles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setMotorcycles(data || []);
    } catch (error) {
      console.error('Error reloading motorcycles:', error);
    }
  };
  
  return (
    <div className="pb-16">
      <PageHeader title="My Garage" />
      
      <div className="p-4">
        <SegmentedControl 
          options={[
            { value: 'cards', label: 'Cards', icon: <Grid2x2 className="w-4 h-4" /> },
            { value: 'list', label: 'List', icon: <List className="w-4 h-4" /> }
          ]}
          value={viewType}
          onChange={(value) => setViewType(value as 'cards' | 'list')}
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {loading ? (
          <div className="text-center">Loading motorcycles...</div>
        ) : motorcycles.length === 0 ? (
          <EmptyState
            icon={<Bike className="w-16 h-16 opacity-50" />}
            title="Your garage is empty"
            description={`Add your first motorcycle to get started (${preferences.distanceUnit})`}
          />
        ) : (
          <div className="w-full">
            {viewType === 'cards' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {motorcycles.map((motorcycle) => (
                  <MotorcycleCard 
                    key={motorcycle.id} 
                    motorcycle={motorcycle}
                    distanceUnit={preferences.distanceUnit as 'miles' | 'kilometers'} 
                  />
                ))}
              </div>
            ) : (
              <MotorcycleList 
                motorcycles={motorcycles}
                distanceUnit={preferences.distanceUnit as 'miles' | 'kilometers'} 
                onMotorcycleDeleted={handleMotorcycleDeleted}
              />
            )}
          </div>
        )}
      </div>
      
      <FloatingActionButton onClick={handleAddMotorcycle} />
    </div>
  );
};

export default Garage;
