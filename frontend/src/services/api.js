import axios from "axios";

const API_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export const productAPI = {
  getAll: () => api.get("/products"),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post("/products", product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
};

export const orderAPI = {
  create: (order) => api.post("/orders", order),
  getOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, data) => api.put(`/orders/${id}/status`, data),
  getHistory: (id) => api.get(`/orders/${id}/history`),
  getCancelledOrders: () => api.get("/orders/cancelled"),
  // Admin APIs
  getAllOrders: () => api.get("/admin/orders"), // Admin only
};

export const authAPI = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users", userData),
  getProfile: () => api.get("/users/profile"),
  forgotPassword: (email) => api.post("/users/forgot-password", { email }),
  resetPassword: (token, password) =>
    api.post(`/users/reset-password/${token}`, { password }),
  updateProfile: (profile) => api.put(`/users/profile`, profile),
};

export const userAPI = {
  // Admin APIs
  getAllUsers: () => api.get("/admin/users"), // Admin only
  toggleBlock: (id) => api.patch(`/admin/users/${id}/block`),
  updateRole: (id, role) => api.patch(`/admin/users/${id}/role`, role),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
};

export default api;
