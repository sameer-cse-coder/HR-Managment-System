import api from './client';

export const listEmployees = async () => {
  const { data } = await api.get('/api/employees');
  return data;
};

export const getEmployee = async (id) => {
  const { data } = await api.get(`/api/employees/${id}`);
  return data;
};

export const createEmployee = async (payload) => {
  const { data } = await api.post('/api/employees', payload);
  return data;
};

export const updateEmployee = async (id, payload) => {
  const { data } = await api.put(`/api/employees/${id}`, payload);
  return data;
};

export const deleteEmployee = async (id) => {
  const { data } = await api.delete(`/api/employees/${id}`);
  return data;
};
