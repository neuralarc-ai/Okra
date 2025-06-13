import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  console.log('PrivateRoute: Rendering. User:', user, 'Loading:', loading);

  if (loading) {
    console.log('PrivateRoute: Still loading auth state.');
    // You can render a loading spinner or a blank page here
    return <div>Loading...</div>; 
  }

  if (!user) {
    console.log('PrivateRoute: User not found, redirecting to /auth');
  }

  return user ? <Outlet /> : <Navigate to="/auth" replace />;
};

export default PrivateRoute; 