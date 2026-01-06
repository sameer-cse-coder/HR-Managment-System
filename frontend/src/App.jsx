import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import EmployeesPage from './pages/EmployeesPage.jsx';
import DepartmentsPage from './pages/DepartmentsPage.jsx';
import LeavesPage from './pages/LeavesPage.jsx';
import AttendancePage from './pages/AttendancePage.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="appMain">
        <Routes>
          <Route path="/" element={<Navigate to="/employees" replace />} />
          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/leaves" element={<LeavesPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="*" element={<Navigate to="/employees" replace />} />
        </Routes>
      </main>
    </>
  );
}
