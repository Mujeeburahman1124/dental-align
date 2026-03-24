import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import HomePage from './pages/HomePage';
import BookingPage from './pages/BookingPage';
import DoctorsPage from './pages/DoctorsPage';
import PackagesPage from './pages/PackagesPage';
import HistoryPage from './pages/HistoryPage';
import PaymentSuccess from './pages/PaymentSuccess';
import PatientDashboard from './pages/dashboard/PatientDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import BillingPage from './pages/patient/BillingPage';
import MyAppointments from './pages/patient/MyAppointments';
import DigitalTreatmentRecord from './pages/patient/DigitalTreatmentRecord';
import PatientProfile from './pages/patient/PatientProfile';
import DentistDashboard from './pages/dentist/DentistDashboard';
import DentistTreatmentRecord from './pages/dentist/DentistTreatmentRecord';
import DentistPrescriptions from './pages/dentist/DentistPrescriptions';
import DentistCalendar from './pages/dentist/DentistCalendar';
import DentistSettings from './pages/dentist/DentistSettings';
import StaffDashboard from './pages/staff/StaffDashboard';
import StaffAppointments from './pages/staff/StaffAppointments';
import StaffPatients from './pages/staff/StaffPatients';
import StaffBilling from './pages/staff/StaffBilling';
import StaffBookAppointment from './pages/staff/StaffBookAppointment';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminBalance from './pages/admin/AdminBalance';
import ReportsAnalytics from './pages/admin/ReportsAnalytics';
import AdminUsers from './pages/admin/AdminUsers';
import AdminSettings from './pages/admin/AdminSettings';
import AdminSchedule from './pages/admin/AdminSchedule';
import AdminStaff from './pages/admin/AdminStaff';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<HomePage />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/services" element={<PackagesPage />} />
        <Route path="/about" element={<HistoryPage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />


        {/* Authentication Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Patient Routes */}
        <Route element={<ProtectedRoute allowedRoles={['patient']} />}>
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/profile" element={<PatientProfile />} />
          <Route path="/patient/billing" element={<BillingPage />} />
          <Route path="/patient/balance" element={<BillingPage />} />
          <Route path="/patient/appointments" element={<MyAppointments />} />
          <Route path="/patient/records" element={<DigitalTreatmentRecord />} />
        </Route>
        {/* Backwards-compatible legacy route */}
        <Route path="/patient-dashboard" element={<Navigate to="/patient/dashboard" replace />} />

        {/* Dentist Routes - also accessible by admin/staff for doctor selection */}
        <Route element={<ProtectedRoute allowedRoles={['dentist', 'admin', 'staff']} />}>
          <Route path="/dentist/dashboard" element={<DentistDashboard />} />
          <Route path="/dentist/schedule" element={<DentistDashboard />} />
          <Route path="/dentist/treatment-record" element={<DentistTreatmentRecord />} />
          <Route path="/dentist/prescriptions" element={<DentistPrescriptions />} />
          <Route path="/dentist/calendar" element={<DentistCalendar />} />
          <Route path="/dentist/settings" element={<DentistSettings />} />
        </Route>
        <Route path="/dentist-dashboard" element={<Navigate to="/dentist/dashboard" replace />} />

        {/* Staff Routes */}
        <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
          <Route path="/staff/dashboard" element={<StaffDashboard />} />
          <Route path="/staff/appointments" element={<StaffAppointments />} />
          <Route path="/staff/patients" element={<StaffPatients />} />
          <Route path="/staff/billing" element={<StaffBilling />} />
          <Route path="/staff/book-appointment" element={<StaffBookAppointment />} />
        </Route>
        <Route path="/staff-dashboard" element={<Navigate to="/staff/dashboard" replace />} />

        {/* Admin Routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/balance" element={<AdminBalance />} />
          <Route path="/admin/reports" element={<ReportsAnalytics />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/staff" element={<AdminStaff />} />
          <Route path="/admin/settings" element={<AdminSettings />} />
          <Route path="/admin/schedule" element={<AdminSchedule />} />
        </Route>

        {/* Catch-all route - redirect to login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
