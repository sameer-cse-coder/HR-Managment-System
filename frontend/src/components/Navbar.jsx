import { NavLink } from 'react-router-dom';
import '../styles/components/navbar.css';

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar__inner">
        <div className="navbar__brand">HRMS</div>
        <nav className="navbar__links">
          <NavLink to="/employees" className={({ isActive }) => (isActive ? 'active' : '')}>Employees</NavLink>
          <NavLink to="/departments" className={({ isActive }) => (isActive ? 'active' : '')}>Departments</NavLink>
          <NavLink to="/leaves" className={({ isActive }) => (isActive ? 'active' : '')}>Leaves</NavLink>
          <NavLink to="/attendance" className={({ isActive }) => (isActive ? 'active' : '')}>Attendance</NavLink>
        </nav>
      </div>
    </header>
  );
}
