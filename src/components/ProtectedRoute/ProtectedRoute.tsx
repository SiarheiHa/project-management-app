import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

type ProtectedRouteType = {
  isAllowed: boolean;
  redirectPath?: string;
};
const ProtectedRoute = ({ isAllowed, redirectPath = '/' }: ProtectedRouteType) => {
  if (!isAllowed) {
    return <Navigate to={redirectPath} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute;
