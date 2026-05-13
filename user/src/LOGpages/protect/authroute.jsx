import { Navigate, Outlet } from "react-router-dom";
import useAdminAuth from "./authmiddleware"; 

const ProtectedUSER = () => {
  const { isAdmin, checking } = useAdminAuth();

  if (checking) return  
  <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-bold animate-pulse">
          checking...
        </h1>
      </div>;

  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedUSER; 
 