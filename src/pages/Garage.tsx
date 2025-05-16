
import { useState, useEffect } from 'react';
import { Bike } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import EmptyState from '@/components/EmptyState';
import FloatingActionButton from '@/components/FloatingActionButton';
import SegmentedControl from '@/components/SegmentedControl';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Garage = () => {
  const [viewType, setViewType] = useState('cards');
  const [motorcycles, setMotorcycles] = useState<any[]>([]);
  const { user, authInitialized } = useAuth();
  const navigate = useNavigate();
  
  // Ensure we're authenticated when this page renders
  useEffect(() => {
    if (authInitialized && !user) {
      navigate('/login');
    }
  }, [user, authInitialized]);
  
  const handleAddMotorcycle = () => {
    // For now just show a toast - in a real app this would open a form
    toast.info("Motorcycle add feature coming soon!");
  };
  
  return (
    <div className="pb-16">
      <PageHeader title="My Garage" />
      
      <div className="p-4">
        <SegmentedControl 
          options={[
            { value: 'cards', label: 'Cards' },
            { value: 'list', label: 'List' }
          ]}
          value={viewType}
          onChange={setViewType}
        />
      </div>
      
      <div className="flex-1 flex items-center justify-center p-4">
        {motorcycles.length === 0 ? (
          <EmptyState
            icon={<img src="/motorcycle-icon.png" alt="Motorcycle" className="w-24 h-24 opacity-50" />}
            title="Your garage is empty"
            description="Add your first motorcycle to get started"
          />
        ) : (
          <div className="w-full">
            {/* Motorcycle list would go here */}
          </div>
        )}
      </div>
      
      <FloatingActionButton onClick={handleAddMotorcycle} />
    </div>
  );
};

export default Garage;
