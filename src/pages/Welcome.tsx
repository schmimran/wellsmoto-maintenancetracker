
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';

const Welcome = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Auto-navigate to login after a delay
    const timer = setTimeout(() => {
      navigate('/login');
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-wells-darkBlue animate-fade-in">
      <div className="flex flex-col items-center">
        <Logo size="lg" withText={true} />
      </div>
    </div>
  );
};

export default Welcome;
