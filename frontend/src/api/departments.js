import api from './client';

export const listDepartments = async () => {
  const { data } = await api.get('/api/departments');
  return data;
};

export const createDepartment = async (payload) => {
  const { data } = await api.post('/api/departments', payload);
  return data;
};

export const updateDepartment = async (id, payload) => {
  const { data } = await api.put(`/api/departments/${id}`, payload);
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await api.delete(`/api/departments/${id}`);
  return data;
};
