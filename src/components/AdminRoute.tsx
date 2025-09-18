import { useAuth } from "@/contexts/AuthContext";

import { Navigate } from "react-router-dom";

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute = ({ children }: AdminRouteProps) => {
  const { user } = useAuth();

  if (user?.role !== "admin") {
    return <Navigate to="/not-found" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;
