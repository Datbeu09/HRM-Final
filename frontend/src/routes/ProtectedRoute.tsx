import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

type Props = {
  permissions?: string;
  children?: React.ReactNode; // optional để bạn vẫn dùng kiểu bọc component
};

const ProtectedRoute: React.FC<Props> = ({ permissions, children }) => {
  const { user, initialized } = useAuth();
  const token = localStorage.getItem("token");

  // ✅ nếu có logic init async thì chặn ở đây; hiện init sync nên vẫn ok
  if (!initialized) return null;

  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  if (permissions && !user.permissions?.includes(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Nếu dùng trong <Route element={<ProtectedRoute />}> thì cần Outlet
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
