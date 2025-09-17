import axios from "axios";

const API_URL = "http://localhost:5000/api";

// ================= Helpers =================
const getUserToken = () => localStorage.getItem("token");
const getAdminToken = () => localStorage.getItem("adminToken");

// ================= User Axios Instance =================
const userApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

userApi.interceptors.request.use((config) => {
  const token = getUserToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ================= Admin Axios Instance =================
const adminApi = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

adminApi.interceptors.request.use((config) => {
  const token = getAdminToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ================= Auth APIs =================
export const signup = async (userData) => {
  const res = await userApi.post("/auth/signup", userData);
  return res.data;
};

export const login = async (userData) => {
  const res = await userApi.post("/auth/login", userData);
  return res.data;
};

// ================= Todo APIs (User) =================
export const getTodos = async () => {
  const res = await userApi.get("/todos");
  return res.data;
};

export const addTodo = async (text) => {
  const res = await userApi.post("/todos", { text });
  return res.data;
};

export const updateTodo = async (id, data) => {
  const res = await userApi.put(`/todos/${id}`, data);
  return res.data;
};

export const deleteTodo = async (id) => {
  const res = await userApi.delete(`/todos/${id}`);
  return res.data;
};

// ================= Admin APIs =================

// 🔑 Admin login
export const adminLogin = async (credentials) => {
  const res = await adminApi.post("/admin/login", credentials);
  return res.data;
};

// 👥 Get all users
export const getAllUsers = async () => {
  const res = await adminApi.get("/admin/users");
  return res.data;
};

// 👥 Change user role
export const updateUserRole = async (id, role) => {
  const res = await adminApi.patch(`/admin/user/${id}/role`, { role });
  return res.data;
};

// 📝 Get all todos
export const getAllTodos = async () => {
  const res = await adminApi.get("/admin/todos");
  return res.data;
};

// 📝 Delete any todo
export const deleteAnyTodo = async (id) => {
  const res = await adminApi.delete(`/admin/todo/${id}`);
  return res.data;
};

// 📊 Get analytics
export const getAdminStats = async () => {
  const res = await adminApi.get("/admin/stats");
  return res.data;
};

// ================= Optional: Token helpers =================
export const setAuthToken = (token) => {
  userApi.defaults.headers.Authorization = token ? `Bearer ${token}` : "";
};

export const setAdminToken = (token) => {
  adminApi.defaults.headers.Authorization = token
    ? `Bearer ${token}`
    : "";
};
