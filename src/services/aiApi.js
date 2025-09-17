import axios from "axios";

// ⚠️ Make sure this URL is exactly right
const API_URL = "http://localhost:5000/api";

// Helper: get auth token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return { headers: { Authorization: `Bearer ${token}` } };
};

// 🔹 1. Send a prompt to AI (chat + todo generation)
export const getAiTodos = async (prompt) => {
  try {
    const res = await axios.post(`${API_URL}/ai/todos`, { prompt }, getAuthHeaders());
    return res.data; // { message, todos }
  } catch (err) {
    console.error("❌ getAiTodos error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 2. Save AI-generated todos to DB
export const saveAiTodos = async (todos) => {
  try {
    const res = await axios.post(`${API_URL}/ai/save`, { todos }, getAuthHeaders());
    return res.data; // { success, todos }
  } catch (err) {
    console.error("❌ saveAiTodos error:", err.response?.data || err.message);
    throw err;
  }
};

// 🔹 3. Fetch today’s todos for logged-in user
export const getTodayTodos = async () => {
  try {
    const res = await axios.get(`${API_URL}/ai/today`, getAuthHeaders());
    return res.data.todos; // [] - This is the corrected response from the server
  } catch (err) {
    console.error("❌ getTodayTodos error:", err.response?.data || err.message);
    return [];
  }
};