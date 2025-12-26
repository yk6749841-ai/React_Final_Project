import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import type { RootState } from '../../store';

interface PermissionGuardProps {
    allowedRoles: string[];
}

const PermissionGuard: React.FC<PermissionGuardProps> = ({ allowedRoles }) => {
    const user = useSelector((state: RootState) => state.auth.user);
    if (user && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }
    return <Outlet />;
};

export default PermissionGuard;