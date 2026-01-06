import { useEffect, useState } from 'react';
import { createDepartment, deleteDepartment, listDepartments, updateDepartment } from '../api/departments';
import '../styles/pages/departments.css';

const emptyForm = { name: '', description: '' };

export default function DepartmentsPage() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    setError('');
    try {
      const deps = await listDepartments();
      setItems(deps);
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
      if (editingId) {
        await updateDepartment(editingId, form);
      } else {
        await createDepartment(form);
      }
      setForm(emptyForm);
      setEditingId(null);
      setIsFormOpen(false);
      await refresh();
    } catch (e2) {
      setError(e2?.response?.data?.message || e2.message || 'Save failed');
    }
  };

  const startAdd = () => {
    setError('');
    setEditingId(null);
    setForm(emptyForm);
    setIsFormOpen(true);
  };

  const startEdit = (d) => {
    setEditingId(d._id);
    setForm({ name: d.name || '', description: d.description || '' });
    setIsFormOpen(true);
  };

  const onDelete = async (id) => {
    // eslint-disable-next-line no-alert
    if (!window.confirm('Delete this department?')) return;
    setError('');
    try {
      await deleteDepartment(id);
      await refresh();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || 'Delete failed');
    }
  };

  return (
    <div className="page departmentsPage stack">
      <div className="row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="pageTitle">Departments</div>
        <div className="row">
          <button type="button" onClick={startAdd}>Add Department</button>
        </div>
      </div>

      {isFormOpen ? (
        <form className="card" onSubmit={onSubmit}>
          <div className="cardTitle">{editingId ? 'Edit department' : 'Add department'}</div>

          <div className="grid">
            <label>
              Name
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </label>
            <label>
              Description
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
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
        <div className="cardTitle">Department list</div>
        {loading ? <div>Loading...</div> : null}
        <div className="table departmentsTable">
          <div className="tr head">
            <div>Name</div>
            <div>Description</div>
            <div>Actions</div>
          </div>
          {items.map((d) => (
            <div className="tr" key={d._id}>
              <div>{d.name}</div>
              <div>{d.description || '-'}</div>
              <div className="row">
                <button type="button" className="secondary" onClick={() => startEdit(d)}>Edit</button>
                <button type="button" className="danger" onClick={() => onDelete(d._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
