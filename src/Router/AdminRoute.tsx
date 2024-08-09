import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';

interface AdminRouteProps {
  element: React.ReactElement;

  userRoles: string[];
}

const AdminRoute: React.FC<AdminRouteProps> = ({
  element,
  userRoles,
  ...rest
}) => {
  console.log(userRoles);
  if (!userRoles.includes('admin')) {
    return <Navigate to="/not-authorized" />;
  }
  return element;
};

export default AdminRoute;
