// src/pages/Settings.jsx
import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  Grid,
  Avatar,
  Box,
  Tooltip,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import {
  Brush as BrushIcon,
  WbSunny as WbSunnyIcon,
  NightsStay as NightsStayIcon,
  Notifications as NotificationsIcon,
  CheckCircle as CheckCircleIcon,
  Upgrade as UpgradeIcon,
  Settings as SettingsIcon,
  DeleteForever as DeleteForeverIcon,
  Logout as LogoutIcon,
  Sort as SortIcon,
} from "@mui/icons-material";
import { useTheme } from "../context/ThemeContext";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [highlightUpgrade, setHighlightUpgrade] = useState(false);
  const [sortOption, setSortOption] = useState("creationDate");
  const [defaultView, setDefaultView] = useState("all");

  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  // Normal theme colors
  const themeColors = [
    { name: "Indigo", code: "#1e3a8a" },
    { name: "Purple", code: "#9333ea" },
    { name: "Green", code: "#16a34a" },
    { name: "Red", code: "#dc2626" },
    { name: "Orange", code: "#ea580c" },
    { name: "Teal", code: "#0d9488" },
    { name: "Pink", code: "#db2777" },
    { name: "Gray", code: "#374151" },
    { name: "Sunset", code: "linear-gradient(135deg, #f59e0b, #ef4444)" },
    { name: "Ocean", code: "linear-gradient(135deg, #06b6d4, #3b82f6)" },
    { name: "Aurora", code: "linear-gradient(135deg, #9333ea, #ec4899)" },
    { name: "Forest", code: "linear-gradient(135deg, #16a34a, #065f46)" },
    { name: "Sky", code: "linear-gradient(135deg, #60a5fa, #38bdf8)" },
  ];

  // Premium-only colors
  const premiumThemeColors = [
    { name: "Gold", code: "linear-gradient(135deg, #FFD700, #FFC107)" },
    { name: "Black & Yellow", code: "linear-gradient(135deg, #000000, #FACC15)" },
    { name: "Royal Blue", code: "#4169E1" },
    { name: "Mystic Purple", code: "linear-gradient(135deg, #7D3C98, #BB8FCE)" },
    { name: "Emerald", code: "linear-gradient(135deg, #50C878, #007F5F)" },
  { name: "Sunrise", code: "linear-gradient(135deg, #FF7E5F, #FEB47B)" },
  { name: "Deep Space", code: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)" },
  { name: "Candy Pink", code: "linear-gradient(135deg, #FF85B3, #FF4E91)" },
  ];

  const allColors = [...themeColors, ...premiumThemeColors];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const handleDeleteCompleted = () => {
    console.log("Deleting all completed tasks...");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 8 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" align="center">
        <SettingsIcon fontSize="large" sx={{ mr: 1, verticalAlign: "middle" }} />
        Settings
      </Typography>

      {/* Profile Section */}
      <Card className="glass-card" sx={{ mb: 4, textAlign: "center", py: 2 }}>
        <CardContent>
          <Avatar sx={{ bgcolor: theme, width: 80, height: 80, mx: "auto", mb: 2 }}>
            <Typography variant="h3">{user?.name?.[0] || "U"}</Typography>
          </Avatar>
          <Typography variant="h5" fontWeight="bold">{user?.name || "Guest User"}</Typography>
          <Typography variant="body1" color="text.secondary">{user?.email || "guest@example.com"}</Typography>
          <Typography
            variant="body2"
            sx={{ mt: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 0.5 }}
          >
            Current Plan:{" "}
            {user?.plan === "premium" ? (
              <Box component="span" sx={{ color: "success.main", fontWeight: "bold" }}>⭐ Premium</Box>
            ) : (
              <Box component="span" sx={{ color: "text.secondary" }}>Free</Box>
            )}
          </Typography>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {/* Theme Section */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <BrushIcon sx={{ mr: 1, color: theme }} />
                <Typography variant="h6" fontWeight="bold">App Theme</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Customize the primary color of your app.
              </Typography>

              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                {allColors.map((color) => {
                  const isPremiumColor = premiumThemeColors.some(p => p.code === color.code);
                  const isFreeUser = user?.plan !== "premium";

                  return (
                    <Tooltip
                      key={color.name}
                      title={isPremiumColor && isFreeUser ? "Premium only 🌟" : ""}
                      arrow
                      placement="top"
                      onOpen={() => { if (isPremiumColor && isFreeUser) setHighlightUpgrade(true); }}
                      onClose={() => { if (isPremiumColor && isFreeUser) setHighlightUpgrade(false); }}
                    >
                      <Box
                        onClick={() => {
                          if (isPremiumColor && isFreeUser) return;
                          setTheme(color.code);
                        }}
                        sx={{
                          width: 50,
                          height: 50,
                          borderRadius: "50%",
                          cursor: isPremiumColor && isFreeUser ? "not-allowed" : "pointer",
                          opacity: isPremiumColor && isFreeUser ? 0.5 : 1,
                          position: "relative",
                          background: color.code,
                          transition: "transform 0.2s",
                          "&:hover": { transform: isPremiumColor && isFreeUser ? "none" : "scale(1.1)" },
                          border: `2px solid ${theme === color.code ? "white" : "transparent"}`,
                          boxShadow: theme === color.code ? `0 0 0 3px ${theme}` : "none",
                        }}
                      >
                        {theme === color.code && (
                          <CheckCircleIcon sx={{ position: "absolute", top: -5, right: -5, color: "white", bgcolor: "black", borderRadius: "50%" }} />
                        )}
                        {isPremiumColor && <Typography sx={{ position: "absolute", bottom: -5, right: -5, fontSize: 12, fontWeight: "bold", color: "yellow", textShadow: "0 0 2px black" }}>⭐</Typography>}
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Upgrade Button for free users */}
              {user?.plan !== "premium" && (
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 2,
                    backgroundColor: highlightUpgrade ? "orange" : theme,
                    "&:hover": { backgroundColor: highlightUpgrade ? "darkorange" : theme },
                    transition: "0.3s",
                  }}
                >
                  Upgrade to Premium
                </Button>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Preferences Section */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <NotificationsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Preferences</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <FormControlLabel
                    control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {darkMode ? <NightsStayIcon /> : <WbSunnyIcon />}
                        <Box>
                          <Typography>Dark Mode</Typography>
                          <Typography variant="body2" color="text.secondary">Toggle between light and dark themes.</Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel
                    control={<Switch checked={notifications} onChange={() => setNotifications(!notifications)} />}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <NotificationsIcon />
                        <Box>
                          <Typography>Enable Notifications</Typography>
                          <Typography variant="body2" color="text.secondary">Receive reminders and task updates.</Typography>
                        </Box>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Task Display Settings */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <SortIcon sx={{ mr: 1 }} />
                <Typography variant="h6" fontWeight="bold">Task Display</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Sort by</InputLabel>
                <Select value={sortOption} label="Sort by" onChange={(e) => setSortOption(e.target.value)}>
                  <MenuItem value="creationDate">Creation Date</MenuItem>
                  <MenuItem value="priority">Priority</MenuItem>
                  <MenuItem value="dueDate">Due Date</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel>Default View</InputLabel>
                <Select value={defaultView} label="Default View" onChange={(e) => setDefaultView(e.target.value)}>
                  <MenuItem value="all">All Tasks</MenuItem>
                  <MenuItem value="incomplete">Incomplete Tasks</MenuItem>
                  <MenuItem value="completed">Completed Tasks</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Data & Account Management */}
        <Grid item xs={12} md={6}>
          <Card className="glass-card">
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                <DeleteForeverIcon sx={{ mr: 1, color: "error.main" }} />
                <Typography variant="h6" fontWeight="bold">Data & Account</Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <Button variant="outlined" color="error" fullWidth sx={{ mb: 2 }} onClick={handleDeleteCompleted}>
                Delete All Completed Tasks
              </Button>
              <Button variant="outlined" color="inherit" fullWidth onClick={handleLogout} startIcon={<LogoutIcon />}>
                Logout
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Settings;
