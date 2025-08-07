import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Unauthorized = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(4);

  useEffect(() => {
    toast.error('Access Denied: Admin privileges required');
    
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/');
          return 0;
        }
        return prev - 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 transform transition-all animate-fadeIn">
        {/* Icon and Header */}
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 mb-8 animate-bounce">
            <svg className="h-12 w-12 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Unauthorized Access</h2>
        </div>

        {/* Message Box */}
        <div className="bg-gray-50 rounded-xl p-6 mb-6">
          <p className="text-gray-600 text-center mb-4">
            Sorry, you don't have admin privileges to access this page.
          </p>
          <p className="text-indigo-600 font-medium text-center">
            Redirecting to home page in {countdown} seconds...
          </p>
          
          {/* Progress Bar */}
          <div className="w-full h-1 bg-gray-200 rounded-full mt-4 overflow-hidden">
            <div 
              className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out"
              style={{ 
                width: `${(countdown / 3) * 100}%`,
                transition: 'width 1s linear'
              }}
            />
          </div>
        </div>

        {/* Button */}
        <button 
          onClick={() => navigate('/')}
          className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold
                   hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 
                   focus:ring-offset-2 transform transition-all duration-200 
                   hover:scale-[1.02] active:scale-[0.98] shadow-md"
        >
          Go to Home Page Now
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
