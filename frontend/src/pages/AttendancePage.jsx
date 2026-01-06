import { useEffect, useState } from 'react';
import api from '../api/client';
import { listEmployees } from '../api/employees';
import '../styles/pages/attendance.css';

const emptyForm = {
  employee: '',
  date: '',
  status: 'present',
  notes: ''
};

export default function AttendancePage() {
  const [items, setItems] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [attRes, emps] = await Promise.all([
        api.get('/api/attendance'),
        listEmployees()
      ]);
      setItems(attRes.data);
      setEmployees(emps);
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Failed to load');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post('/api/attendance', {
        ...form,
        employee: form.employee
      });
      setForm(emptyForm);
      setIsFormOpen(false);
      await refresh();
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Create failed');
    }
  };

  const startCreate = () => {
    setError('');
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const onDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this attendance record?')) return;
    setError('');
    try {
      await api.delete(`/api/attendance/${id}`);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <div className="page attendancePage stack">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pageTitle">Attendance</div>
        <div className="row">
          <button type="button" onClick={startCreate}>Create Attendance</button>
        </div>
      </div>

      {isFormOpen ? (
        <form className="card" onSubmit={onSubmit}>
          <div className="cardTitle">Mark attendance</div>

          <div className="grid">
            <label>
              Employee
              <select value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} required>
                <option value="">(select)</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Date
              <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required />
            </label>
            <label>
              Status
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="half-day">Half-day</option>
                <option value="leave">Leave</option>
              </select>
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              Notes
              <input value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            </label>
          </div>

          <div className="row">
            <button type="submit">Create</button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setForm(emptyForm);
                setIsFormOpen(false);
              }}
            >
              Cancel
            </button>
          </div>

          {error ? <div className="error">{error}</div> : null}
        </form>
      ) : null}

      <div className="card">
        <div className="cardTitle">Attendance list</div>
        {loading ? <div>Loading...</div> : null}
        {!isFormOpen && error ? <div className="error">{error}</div> : null}
        <div className="table attendanceTable">
          <div className="tr head">
            <div>Employee</div>
            <div>Date</div>
            <div>Status</div>
            <div>Notes</div>
            <div>Actions</div>
          </div>
          {items.map((a) => (
            <div className="tr" key={a._id}>
              <div>{a.employee ? `${a.employee.employeeId} - ${a.employee.firstName} ${a.employee.lastName}` : '-'}</div>
              <div>{String(a.date).slice(0, 10)}</div>
              <div>{a.status}</div>
              <div>{a.notes || '-'}</div>
              <div className="row">
                <button type="button" className="danger" onClick={() => onDelete(a._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
