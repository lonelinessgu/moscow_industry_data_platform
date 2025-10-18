import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LogoutPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      <p>Выход из аккаунта...</p>
    </div>
  );
};

export default LogoutPage;