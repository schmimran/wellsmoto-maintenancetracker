
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';

const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to welcome/splash screen
    navigate('/');
  }, [navigate]);

  return <Welcome />;
};

export default Index;
