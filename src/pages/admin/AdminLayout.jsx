import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Sidebar from "../../components/admin/Sidebar";
import Topbar from "../../components/admin/Topbar";

const AdminLayout = () => {
  return (
    <Box display="flex" minHeight="100vh">
      <Sidebar />
      <Box flex={1} display="flex" flexDirection="column">
        <Topbar />
        <Box flex={1} p={3}>
          <Outlet /> {/* Render nested admin page */}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
