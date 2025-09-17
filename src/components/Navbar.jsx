// src/components/Navbar.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ✅ import theme context

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const { theme, darkMode, toggleDarkMode } = useTheme(); // ✅ use theme + dark mode

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav
      className="flex justify-between px-4 min-h-14 items-center"
      style={{
        backgroundColor: theme,
        color: darkMode ? "#f5f5f5" : "white", // ✅ adjust text based on dark mode
      }}
    >
      <h1
        className="cursor-pointer text-2xl font-bold"
        onClick={() => navigate("/")}
      >
        iTask
      </h1>

      <div className="flex items-center gap-4">
        {/* ✅ Premium badge if plan = premium */}
        {user?.plan === "premium" && (
          <span className="bg-yellow-400 text-black px-2 py-1 rounded-lg text-sm font-semibold">
            ⭐ Premium
          </span>
        )}

        {/* ✅ Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="px-3 py-1 rounded-lg text-sm"
          style={{
            backgroundColor: darkMode ? "#444" : "#ddd",
            color: darkMode ? "#fff" : "#000",
          }}
        >
          {darkMode ? "🌙 Dark" : "☀️ Light"}
        </button>

        {/* ✅ User info + Logout */}
        {user ? (
          <div className="flex items-center gap-3">
            <span className="italic text-sm">
              Hi, {user.name?.split(" ")[0] || "User"}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
