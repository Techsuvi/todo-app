// src/services/aiChatApi.js
const API_URL = "http://localhost:5000/api/ai/chat"; // update for production

// ✅ Helper: get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

// ✅ Fetch chat history
export const getChatHistory = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to fetch chat history");
    return await res.json();
  } catch (err) {
    console.error("❌ getChatHistory error:", err);
    return [];
  }
};

// ✅ Save a chat message
export const saveChatMessage = async (message) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(message),
    });
    if (!res.ok) throw new Error("Failed to save chat message");
    return await res.json();
  } catch (err) {
    console.error("❌ saveChatMessage error:", err);
    return null;
  }
};

// ✅ Clear chat history
export const clearChatHistory = async () => {
  try {
    const res = await fetch(API_URL, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error("Failed to clear chat history");
    return await res.json();
  } catch (err) {
    console.error("❌ clearChatHistory error:", err);
    return null;
  }
};
