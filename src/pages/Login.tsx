
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '@/components/Logo';
import ActionButton from '@/components/ActionButton';

const Login = () => {
  const navigate = useNavigate();
  
  const handleAppleSignIn = () => {
    // In a real app, this would handle Apple authentication
    console.log('Sign in with Apple clicked');
    navigate('/garage');
  };
  
  const handleGuestContinue = () => {
    console.log('Continue as guest clicked');
    navigate('/garage');
  };
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black animate-fade-in">
      <div className="flex flex-col items-center mb-12">
        <Logo size="lg" withText={true} />
      </div>
      
      <div className="w-full max-w-xs space-y-4 px-4">
        <ActionButton 
          className="w-full py-6 bg-white text-black hover:bg-gray-100 flex items-center justify-center"
          onClick={handleAppleSignIn}
        >
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701z" />
          </svg>
          Sign in with Apple
        </ActionButton>
        
        <button 
          className="w-full text-gray-400 py-3 underline"
          onClick={handleGuestContinue}
        >
          Continue as Guest
        </button>
      </div>
    </div>
  );
};

export default Login;
