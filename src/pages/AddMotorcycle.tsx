
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
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
    <div className="p-4">
      <MotorcycleForm />
    </div>
  );
};

export default AddMotorcycle;
