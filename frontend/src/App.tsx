import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import PatientDashboard from './pages/patient/Dashboard';
import PatientFindDoctors from './pages/patient/FindDoctors';
import DoctorDashboard from './pages/doctor/Dashboard';
import AdminDashboard from './pages/admin/Dashboard';
import AdminApprovals from './pages/admin/Approvals';
import AdminPatients from './pages/admin/Patients';
import type { Role } from './types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const DashboardRouter = () => {
  const { role } = useAuth();

  if (role === 'PATIENT') {
    return (
      <Routes>
        <Route path="/" element={<PatientDashboard />} />
        <Route path="/doctors" element={<PatientFindDoctors />} />
        <Route path="/appointments" element={<PatientDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  if (role === 'DOCTOR') {
    return (
      <Routes>
        <Route path="/" element={<DoctorDashboard />} />
        <Route path="/appointments" element={<DoctorDashboard />} />
        <Route path="/prescriptions" element={<DoctorDashboard />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  if (role === 'ADMIN') {
    return (
      <Routes>
        <Route path="/" element={<AdminDashboard />} />
        <Route path="/patients" element={<AdminPatients />} />
        <Route path="/doctors" element={<AdminDashboard />} />
        <Route path="/approvals" element={<AdminApprovals />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    );
  }

  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute allowedRoles={['PATIENT', 'DOCTOR', 'ADMIN']}>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
