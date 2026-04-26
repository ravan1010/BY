import { Navigate, Outlet } from "react-router-dom";
import useAdminAuth from "./authmiddleware"; 

const ProtectedUSER = () => {
  const { isAdmin, checking } = useAdminAuth();

  if (checking) return <div>Checking access...</div>;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedUSER; 
 