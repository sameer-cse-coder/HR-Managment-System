import { useEffect, useState } from 'react';
import api from '../api/client';
import { listEmployees } from '../api/employees';
import '../styles/pages/leaves.css';

const emptyForm = {
  employeeId: '',
  leaveType: 'casual',
  startDate: '',
  endDate: '',
  reason: ''
};

export default function LeavesPage() {
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
      const [leavesRes, emps] = await Promise.all([
        api.get('/api/leaves'),
        listEmployees()
      ]);
      setItems(leavesRes.data);
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
      await api.post('/api/leaves', {
        ...form,
        employeeId: form.employeeId
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

  const updateStatus = async (id, status) => {
    setError('');
    try {
      await api.put(`/api/leaves/${id}`, { status });
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Update failed');
    }
  };

  const onDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this leave request?')) return;
    setError('');
    try {
      await api.delete(`/api/leaves/${id}`);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <div className="page leavesPage stack">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pageTitle">Leaves</div>
        <div className="row">
          <button type="button" onClick={startCreate}>Create Leave</button>
        </div>
      </div>

      {isFormOpen ? (
        <form className="card" onSubmit={onSubmit}>
          <div className="cardTitle">Create leave request</div>

          <div className="grid">
            <label>
              Employee
              <select value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required>
                <option value="">(select)</option>
                {employees.map((emp) => (
                  <option key={emp._id} value={emp._id}>
                    {emp.employeeId} - {emp.firstName} {emp.lastName}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Type
              <select value={form.leaveType} onChange={(e) => setForm({ ...form, leaveType: e.target.value })}>
                <option value="sick">Sick</option>
                <option value="casual">Casual</option>
                <option value="annual">Annual</option>
                <option value="unpaid">Unpaid</option>
              </select>
            </label>
            <label>
              Start date
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </label>
            <label>
              End date
              <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </label>
            <label style={{ gridColumn: '1 / -1' }}>
              Reason
              <input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
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
        <div className="cardTitle">Leave list</div>
        {loading ? <div>Loading...</div> : null}
        {!isFormOpen && error ? <div className="error">{error}</div> : null}
        <div className="table leavesTable">
          <div className="tr head">
            <div>Employee</div>
            <div>Type</div>
            <div>Dates</div>
            <div>Status</div>
            <div>Actions</div>
          </div>
          {items.map((l) => (
            <div className="tr" key={l._id}>
              <div>{l.employee ? `${l.employee.employeeId} - ${l.employee.firstName} ${l.employee.lastName}` : '-'}</div>
              <div>{l.leaveType}</div>
              <div>{String(l.startDate).slice(0, 10)} → {String(l.endDate).slice(0, 10)}</div>
              <div>{l.status}</div>
              <div className="row">
                {l.status === 'pending' ? (
                  <button type="button" className="success" onClick={() => updateStatus(l._id, 'approved')}>Approve</button>
                ) : null}
                {l.status === 'pending' ? (
                  <button type="button" className="danger" onClick={() => updateStatus(l._id, 'rejected')}>Reject</button>
                ) : null}
                <button type="button" className="danger" onClick={() => onDelete(l._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
