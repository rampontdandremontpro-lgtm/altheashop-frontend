import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Loader from "../common/Loader";

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, authLoading } = useAuth();

  if (authLoading) {
    return <Loader text="Vérification du rôle administrateur..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/account" replace />;
  }

  return children;
}

export default AdminRoute;