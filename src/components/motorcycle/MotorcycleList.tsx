
import { useState } from 'react';
import { Motorcycle } from '@/types/motorcycle';
import { formatDistance } from '@/utils/distanceUtils';
import { Bike, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MotorcycleListProps {
  motorcycles: Motorcycle[];
  distanceUnit: 'miles' | 'kilometers';
  onMotorcycleDeleted: () => void;
}

const MotorcycleList = ({ motorcycles, distanceUnit, onMotorcycleDeleted }: MotorcycleListProps) => {
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this motorcycle?')) {
      return;
    }
    
    try {
      setDeletingId(id);
      const { error } = await supabase
        .from('motorcycles')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast.success('Motorcycle deleted successfully');
      onMotorcycleDeleted();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete motorcycle');
    } finally {
      setDeletingId(null);
    }
  };
  
  return (
    <div className="divide-y">
      {motorcycles.map((motorcycle) => (
        <div 
          key={motorcycle.id} 
          className="flex items-center py-4 gap-4 hover:bg-muted/50 px-2 rounded-md"
          onClick={() => navigate(`/garage/motorcycle/${motorcycle.id}`)}
        >
          <div className="h-16 w-16 bg-muted rounded-md overflow-hidden flex-shrink-0">
            {motorcycle.thumbnail_url ? (
              <img 
                src={motorcycle.thumbnail_url} 
                alt={motorcycle.nickname} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <Bike className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>
          
          <div className="flex-grow">
            <h3 className="font-medium">{motorcycle.nickname}</h3>
            <p className="text-sm text-muted-foreground">
              {motorcycle.year} {motorcycle.make} {motorcycle.model}
            </p>
            <p className="text-sm">
              {formatDistance(motorcycle.odometer_miles, distanceUnit)}
            </p>
          </div>
          
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/garage/edit/${motorcycle.id}`);
              }}
            >
              <Pencil className="h-4 w-4" />
              <span className="sr-only">Edit</span>
            </Button>
            
            <Button
              variant="ghost"
              size="icon"
              className="text-red-500 hover:text-red-600"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(motorcycle.id);
              }}
              disabled={deletingId === motorcycle.id}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete</span>
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MotorcycleList;
