import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";   // <-- FIXED
import type { Role } from "../utils/roles";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  role?: Role;
};

export default function ProtectedRoute({ children, role }: Props) {
  const { user, accessToken } = useSelector((state: RootState) => state.auth);

  if (!accessToken || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
