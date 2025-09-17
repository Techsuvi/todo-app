// src/services/user.js

// Get the logged-in user from localStorage
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

// Save/update user in localStorage
export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

// Clear user from localStorage (logout)
export const clearUser = () => {
  localStorage.removeItem("user");
};
