import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Plans from "./pages/Plans";
import Dashboard from "./pages/Dashboard";
import AdminSubscriptions from "./pages/AdminSubscriptions";
import ProtectedRoute from "./components/ProtectedRoute";
import { Roles } from "./utils/roles";

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Navigate to="/plans" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/subscriptions" element={
          <ProtectedRoute role={Roles.ADMIN}>
            <AdminSubscriptions />
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}