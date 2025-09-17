import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";
import UsersPage from "./UsersPage";
import TodosPage from "./TodosPage";
import AnalyticsPage from "./AnalyticsPage";

const AdminDashboard = () => {
  const theme = useTheme(); // get current theme colors

  return (
    <Box display="flex" bgcolor={theme.palette.background.default} minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />
        <Box p={3} bgcolor={theme.palette.background.paper} flex={1}>
          <Routes>
            <Route path="/" element={<Navigate to="users" />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="todos" element={<TodosPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
