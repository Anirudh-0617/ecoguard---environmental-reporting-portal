
import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isAuthenticated } from '../../utils/auth';
import { UserRole } from '../../types';

interface Props {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<Props> = ({ children, allowedRoles }) => {
  const user = getCurrentUser();
  const auth = isAuthenticated();

  if (!auth || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.type)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
