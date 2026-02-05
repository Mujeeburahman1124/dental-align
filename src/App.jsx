import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BillingPage from './pages/patient/BillingPage';
import MyAppointments from './pages/patient/MyAppointments';
import DigitalTreatmentRecord from './pages/patient/DigitalTreatmentRecord';
import DentistDashboard from './pages/dentist/DentistDashboard';
import DentistTreatmentRecord from './pages/dentist/DentistTreatmentRecord';
import DentistPrescriptions from './pages/dentist/DentistPrescriptions';
import DentistCalendar from './pages/dentist/DentistCalendar';
import DentistSettings from './pages/dentist/DentistSettings';
import StaffDashboard from './pages/staff/StaffDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBalance from './pages/admin/AdminBalance';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />

        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/billing" element={<BillingPage />} />
          <Route path="/patient/balance" element={<BillingPage />} />
          <Route path="/patient/appointments" element={<MyAppointments />} />
          <Route path="/patient/records" element={<DigitalTreatmentRecord />} />
        </Route>
        {/* Backwards-compatible legacy route */}
        <Route path="/patient-dashboard" element={<Navigate to="/patient/dashboard" replace />} />

        {/* Dentist Routes */}
        <Route element={<ProtectedRoute allowedRoles={['dentist']} />}>
          <Route path="/dentist/dashboard" element={<DentistDashboard />} />
          <Route path="/dentist/schedule" element={<DentistDashboard />} />
          <Route path="/dentist/records" element={<DentistTreatmentRecord />} />
          <Route path="/dentist/prescriptions" element={<DentistPrescriptions />} />
          <Route path="/dentist/calendar" element={<DentistCalendar />} />
          <Route path="/dentist/settings" element={<DentistSettings />} />
        </Route>
        <Route path="/dentist-dashboard" element={<Navigate to="/dentist/dashboard" replace />} />

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
        </Route>
        <Route path="/staff-dashboard" element={<Navigate to="/staff/dashboard" replace />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/balance" element={<AdminBalance />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
        </Route>

        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
