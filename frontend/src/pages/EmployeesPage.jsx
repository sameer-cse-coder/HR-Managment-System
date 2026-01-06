import { useEffect, useMemo, useState } from 'react';
import { createEmployee, deleteEmployee, listEmployees, updateEmployee } from '../api/employees';
import { listDepartments } from '../api/departments';
import '../styles/pages/employees.css';

const POSITION_SUGGESTIONS = [
  'Software Engineer',
  'Senior Software Engineer',
  'Tech Lead',
  'Engineering Manager',
  'QA Engineer',
  'QA Lead',
  'DevOps Engineer',
  'Site Reliability Engineer (SRE)',
  'UI/UX Designer',
  'Product Manager',
  'Project Manager',
  'Scrum Master',
  'Business Analyst',
  'Data Engineer',
  'Data Scientist',
  'Support Engineer',
  'HR Specialist',
  'Finance Officer',
  'Sales Executive',
  'Marketing Specialist',
  'Intern'
];

const emptyForm = {
  email: '',
  firstName: '',
  lastName: '',
  employeeId: '',
  department: '',
  manager: '',
  position: '',
  phone: ''
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const positionSelectValue = useMemo(() => {
    if (!form.position) return '';
    if (POSITION_SUGGESTIONS.includes(form.position)) return form.position;
    return '__custom__';
  }, [form.position]);

  const managerOptions = useMemo(
    () => employees.filter((e) => e.isActive !== false),
    [employees]
  );

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const [emps, deps] = await Promise.all([listEmployees(), listDepartments()]);
      setEmployees(emps);
      setDepartments(deps);
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
      const payload = {
        ...form,
        department: form.department || null,
        manager: form.manager || null
      };

      if (editingId) {
        await updateEmployee(editingId, payload);
      } else {
        await createEmployee(payload);
      }

      setForm(emptyForm);
      setEditingId(null);
      setIsFormOpen(false);
      await refresh();
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Save failed');
    }
  };

  const startAddEmployee = () => {
    setError('');
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const startEdit = (emp) => {
    setEditingId(emp._id);
    setForm({
      email: emp.email || '',
      firstName: emp.firstName || '',
      lastName: emp.lastName || '',
      employeeId: emp.employeeId || '',
      department: emp.department?._id || '',
      manager: emp.manager?._id || '',
      position: emp.position || '',
      phone: emp.phone || ''
    });
    setIsFormOpen(true);
  };

  const onDelete = async (id) => {
    // basic confirm without extra UI
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this employee?')) return;
    setError('');
    try {
      await deleteEmployee(id);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <div className="page employeesPage stack">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pageTitle">Employees</div>
        <div className="row">
          <button type="button" onClick={startAddEmployee}>Add Employee</button>
        </div>
      </div>

      {isFormOpen ? (
        <form className="card" onSubmit={onSubmit}>
          <div className="cardTitle">{editingId ? 'Edit employee' : 'Add employee'}</div>

          <div className="grid">
            <label>
              Email
              <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            </label>
            <label>
              First name
              <input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required />
            </label>
            <label>
              Last name
              <input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required />
            </label>
            <label>
              Employee ID
              <input value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} required disabled={Boolean(editingId)} />
            </label>
            <label>
              Department
              <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}>
                <option value="">(none)</option>
                {departments.map((d) => (
                  <option key={d._id} value={d._id}>{d.name}</option>
                ))}
              </select>
            </label>
            <label>
              Manager
              <select value={form.manager} onChange={(e) => setForm({ ...form, manager: e.target.value })}>
                <option value="">(none)</option>
                {managerOptions.map((m) => (
                  <option key={m._id} value={m._id}>{m.firstName} {m.lastName}</option>
                ))}
              </select>
            </label>
            <label>
              Position
              <select
                value={positionSelectValue}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === '__custom__') {
                    setForm({ ...form, position: POSITION_SUGGESTIONS.includes(form.position) ? '' : form.position });
                    return;
                  }
                  setForm({ ...form, position: v });
                }}
              >
                <option value="">(none)</option>
                {POSITION_SUGGESTIONS.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
                <option value="__custom__">Custom…</option>
              </select>
            </label>
            {positionSelectValue === '__custom__' ? (
              <label>
                Custom position
                <input
                  value={form.position}
                  onChange={(e) => setForm({ ...form, position: e.target.value })}
                  placeholder="e.g. Frontend Engineer"
                />
              </label>
            ) : null}
            <label>
              Phone
              <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </label>
          </div>

          <div className="row">
            <button type="submit">{editingId ? 'Update' : 'Create'}</button>
            <button
              type="button"
              className="secondary"
              onClick={() => {
                setEditingId(null);
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
        <div className="cardTitle">Employee list</div>
        {loading ? <div>Loading...</div> : null}
        <div className="table employeesTable">
          <div className="tr head">
            <div>ID</div>
            <div>Name</div>
            <div>Email</div>
            <div>Department</div>
            <div>Manager</div>
            <div>Actions</div>
          </div>
          {employees.map((e) => (
            <div className="tr" key={e._id}>
              <div>{e.employeeId}</div>
              <div>{e.firstName} {e.lastName}</div>
              <div>{e.email}</div>
              <div>{e.department?.name || '-'}</div>
              <div>{e.manager ? `${e.manager.firstName} ${e.manager.lastName}` : '-'}</div>
              <div className="row">
                <button type="button" className="secondary" onClick={() => startEdit(e)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete(e._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
