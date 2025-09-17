import React from "react";
import { Box, List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard" },
    { name: "Users", path: "/admin/users" },
    { name: "Todos", path: "/admin/todos" },
    { name: "Analytics", path: "/admin/analytics" },
  ];

  return (
    <Box
      sx={{
        width: 240,
        bgcolor: theme.palette.background.paper,
        height: "100vh",
        borderRight: `1px solid ${theme.palette.divider}`,
        p: 2,
      }}
    >
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor:
                  location.pathname === item.path
                    ? theme.palette.action.selected
                    : "transparent",
              }}
            >
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Sidebar;
