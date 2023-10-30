import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from "./UserContext";

interface PrivateRouteProps {
    children: ReactNode;
  }
  
const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
const { user } = useUser();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;