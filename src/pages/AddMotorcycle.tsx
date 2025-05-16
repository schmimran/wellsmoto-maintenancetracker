
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/PageHeader';
import MotorcycleForm from '@/components/motorcycle/MotorcycleForm';

const AddMotorcycle = () => {
  const { user, authInitialized } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (authInitialized && !user) {
      navigate('/login');
    }
  }, [user, authInitialized]);
  
  return (
    <div className="pb-16">
      <PageHeader 
        title="Add Motorcycle"
        showBackButton
        onBackButtonClick={() => navigate('/garage')}
      />
      
      <div className="p-4">
        <MotorcycleForm />
      </div>
    </div>
  );
};

export default AddMotorcycle;
