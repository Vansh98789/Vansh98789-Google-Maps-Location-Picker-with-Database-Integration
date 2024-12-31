import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const addressService = {
  getAllAddresses: () => api.get('/addresses'),
  
  addAddress: (addressData) => api.post('/addresses', addressData),
  
  updateAddress: (id, addressData) => api.put(`/addresses/${id}`, addressData),
  
  deleteAddress: (id) => api.delete(`/addresses/${id}`),
  
  toggleFavorite: (id, isFavorite) => 
    api.put(`/addresses/${id}`, { is_favorite: isFavorite })
};

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  
  register: (userData) => api.post('/auth/register', userData),
  
  logout: () => {
    localStorage.removeItem('token');
  }
};

export default api;