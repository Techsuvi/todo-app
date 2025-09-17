import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import App from "./App";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import PremiumPopup from "./components/PremiumPopup";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./context/ThemeContext";
import Settings from "./pages/Settings";
import BottomNav from "./components/BottomNav";
import Profile from "./pages/Profile";
import PremiumPage from "./pages/PremiumPage";
import AiPage from "./pages/AiPage";

// ✅ Admin pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout"; // Layout with sidebar + topbar
import AdminProtectedRoute from "./components/AdminProtectedRoute";
import UsersPage from "./pages/admin/UsersPage";
import TodosPage from "./pages/admin/TodosPage";
import AnalyticsPage from "./pages/admin/AnalyticsPage";

// ✅ Wrapper layout to handle showing/hiding BottomNav
const Layout = () => {
  const location = useLocation();

  // Hide BottomNav for auth + admin pages
  const hideNav = ["/login", "/signup", "/admin/login"].includes(location.pathname);

  return (
    <>
      <Routes>
        {/* ================= User Routes ================= */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <App />
              <PremiumPopup />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        {/* <Route path="/premium" element={<PremiumPage />} />
        <Route path="/ai" element={<AiPage />} /> */}
        <Route path="/premiumPage" element={<PremiumPage />} />
        <Route path="/aiPage" element={<AiPage />} />

        {/* ================= Admin Routes ================= */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/*"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index element={<UsersPage />} /> {/* default dashboard */}
          <Route path="dashboard" element={<UsersPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="todos" element={<TodosPage />} />
          <Route path="analytics" element={<AnalyticsPage />} />
        </Route>
      </Routes>

      {/* ✅ BottomNav shown on all user pages except login/signup/admin login */}
      {!hideNav && <BottomNav />}
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Toaster position="top-right" reverseOrder={false} />
        <Layout />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
