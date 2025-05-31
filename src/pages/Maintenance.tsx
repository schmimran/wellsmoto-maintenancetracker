
import { useState } from 'react';
import { Wrench } from 'lucide-react';
import EmptyState from '@/components/EmptyState';

const Maintenance = () => {
  const [maintenanceItems, setMaintenanceItems] = useState<any[]>([]);
  
  return (
    <div className="flex-1 flex items-center justify-center h-[80vh]">
      {maintenanceItems.length === 0 ? (
        <EmptyState
          icon={<Wrench size={64} />}
          title="No Maintenance Items"
          description="Add a motorcycle to start tracking maintenance"
        />
      ) : (
        <div className="w-full">
          {/* Maintenance items would go here */}
        </div>
      )}
    </div>
  );
};

export default Maintenance;
