// src/components/BottomNav.jsx
import React, { useState, useEffect } from "react";
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Avatar,
  Box,
  Popover,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const navItems = [
  { label: "Home", icon: <HomeIcon />, path: "/" },
  { label: "Settings", icon: <SettingsIcon />, path: "/settings" },
  { label: "Premium", icon: <WorkspacePremiumIcon />, path: "/PremiumPage", premium: true },
  { label: "AI", icon: <SmartToyIcon />, path: "/aiPage", premium: true, badge: "premium" },
];

const BottomNav = () => {
  const [value, setValue] = useState(0);
  const [user, setUser] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, secondaryColor } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const filteredNavItems = navItems.filter((item) => {
    if (item.premium) return user?.plan === "premium";
    return true;
  });

  useEffect(() => {
    const currentPath = location.pathname;
    const index = filteredNavItems.findIndex((item) => item.path === currentPath);
    if (index !== -1) setValue(index);
  }, [location.pathname, user]);

  const handleNavChange = (event, newValue) => {
    if (newValue !== -1) {
      setValue(newValue);
      navigate(filteredNavItems[newValue].path);
    }
  };

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    handleMenuClose();
    navigate("/login");
  };

  const handleProfileClick = () => {
    handleMenuClose();
    navigate("/profile");
  };

  const handleSettingsClick = () => {
    handleMenuClose();
    navigate("/settings");
  };

  const handlePremiumClick = () => {
    handleMenuClose();
    navigate("/PremiumPage");
  };

  const open = Boolean(anchorEl);

  return (
    <Paper
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        boxShadow: "0px -2px 10px rgba(0,0,0,0.05)",
        bgcolor: "background.paper",
      }}
      elevation={0}
    >
      <BottomNavigation
        value={value}
        onChange={handleNavChange}
        showLabels
        sx={{
          "& .MuiBottomNavigationAction-root": {
            color: "text.secondary",
            "& svg": { color: "inherit" },
          },
          "& .Mui-selected": {
            color: secondaryColor,
            "& svg": { color: secondaryColor },
            "& .MuiBottomNavigationAction-label": {
              fontWeight: "bold",
              color: secondaryColor,
            },
          },
          "& .MuiBottomNavigationAction-label": { fontSize: "0.7rem" },
        }}
      >
        {filteredNavItems.map((item) => (
          <BottomNavigationAction
            key={item.label}
            label={item.label}
            icon={
              item.badge === "premium" && user?.plan === "premium" ? (
                <Box sx={{ position: "relative" }}>
                  {item.icon}
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: -5,
                      transform: "translate(50%, -50%)",
                      background: theme, // ✅ gradient or solid works
                      borderRadius: "50%",
                      width: 12,
                      height: 12,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.6rem", color: "white" }}>⭐</span>
                  </Box>
                </Box>
              ) : (
                item.icon
              )
            }
          />
        ))}

        {user && (
          <BottomNavigationAction
            label="Account"
            value={-1}
            onClick={handleMenuClick}
            icon={
              <Avatar
                sx={{
                  width: 24,
                  height: 24,
                  fontSize: "0.8rem",
                  background: theme, // ✅ gradient background for avatar circle
                  color: "white", // ✅ initials always white
                }}
              >
                {user?.name ? user.name[0].toUpperCase() : "U"}
              </Avatar>
            }
          />
        )}
      </BottomNavigation>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        transformOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Box sx={{ p: 1 }}>
          <MenuItem onClick={handleProfileClick}>
            <ListItemIcon>
              <AccountCircleIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Profile</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleSettingsClick}>
            <ListItemIcon>
              <SettingsIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Settings</ListItemText>
          </MenuItem>
          <MenuItem onClick={handlePremiumClick}>
            <ListItemIcon>
              <WorkspacePremiumIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Premium</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Logout</ListItemText>
          </MenuItem>
        </Box>
      </Popover>
    </Paper>
  );
};

export default BottomNav;
