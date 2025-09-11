import { useAuth } from '@/App';
import { Navigate } from 'react-router-dom';

interface ClientRouteProps {
  children: React.ReactNode;
}

const ClientRoute = ({ children }: ClientRouteProps) => {
  const { user } = useAuth();
  
  if (user?.role !== 'client') {
    return <Navigate to="/not-found" replace />;
  }
  
  return <>{children}</>;
};

export default ClientRoute;