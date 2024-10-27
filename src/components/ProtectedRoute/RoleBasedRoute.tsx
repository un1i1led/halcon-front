import { Navigate, Outlet, useLocation } from 'react-router-dom';
import Dashboard from '../../screens/Dashboard';
import Users from '../../screens/Users';
import Customers from '../../screens/Customers';

interface RoleBasedRouteProps {
  allowedRoles: string[];
}

export const RoleBasedRoute = ({ allowedRoles }: RoleBasedRouteProps) => {
  const location = useLocation();
  
  const getUserData = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  };

  const user = getUserData();
  const isAuthenticated = localStorage.getItem('token') || sessionStorage.getItem('token');
  
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

interface RouteConfig {
  path: string;
  element: React.ComponentType;
  roles?: string[];
}

export const privateRoutes: RouteConfig[] = [
  {
    path: '/dashboard',
    element: Dashboard,
    roles: ['admin', 'sales', 'purchasing', 'warehouse', 'route'] 
  },
  {
    path: '/users',
    element: Users,
    roles: ['admin'] 
  },
  {
    path: '/customers',
    element: Customers,
    roles: ['admin'] 
  }
];