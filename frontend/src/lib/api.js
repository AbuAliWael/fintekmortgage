import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
  me: () => apiClient.get('/auth/me'),
};

// Lead APIs
export const leadAPI = {
  create: (data) => apiClient.post('/leads', data),
  getAll: (params) => apiClient.get('/leads', { params }),
  getOne: (id) => apiClient.get(`/leads/${id}`),
  update: (id, data) => apiClient.patch(`/leads/${id}`, data),
  delete: (id) => apiClient.delete(`/leads/${id}`),
};

// Pipeline APIs
export const pipelineAPI = {
  create: (data) => apiClient.post('/pipeline', data),
  getAll: (params) => apiClient.get('/pipeline', { params }),
  update: (id, data) => apiClient.patch(`/pipeline/${id}`, data),
};

// Follow-up APIs
export const followUpAPI = {
  create: (data) => apiClient.post('/follow-ups', data),
  getAll: (params) => apiClient.get('/follow-ups', { params }),
  complete: (id) => apiClient.patch(`/follow-ups/${id}/complete`),
};

// Partner APIs
export const partnerAPI = {
  create: (data) => apiClient.post('/partners', data),
  getAll: (params) => apiClient.get('/partners', { params }),
};

// AI Chat APIs
export const chatAPI = {
  sendMessage: (data) => apiClient.post('/ai/chat', data),
  getHistory: (sessionId) => apiClient.get(`/ai/chat-history/${sessionId}`),
};

// Calculator APIs
export const calculatorAPI = {
  payment: (data) => apiClient.post('/calculator/payment', data),
  affordability: (params) => apiClient.post('/calculator/affordability', null, { params }),
};

// Analytics APIs
export const analyticsAPI = {
  dashboard: () => apiClient.get('/analytics/dashboard'),
};

export default apiClient;