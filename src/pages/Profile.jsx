import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Avatar,
  keyframes,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

// Neon pulse animation for premium users
const neonPulse = (color1, color2) => keyframes`
  0% { text-shadow: 0 0 5px ${color1}, 0 0 10px ${color2}; }
  50% { text-shadow: 0 0 15px ${color2}, 0 0 25px ${color1}; }
  100% { text-shadow: 0 0 5px ${color1}, 0 0 10px ${color2}; }
`;

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  if (!user) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        p={2}
      >
        <Typography variant="h6">⚠️ You are not logged in</Typography>
        <Button
          onClick={() => navigate("/login")}
          variant="contained"
          sx={{ mt: 2 }}
        >
          Go to Login
        </Button>
      </Box>
    );
  }

  const isPremium = user?.plan === "premium";

  const neonColor1 = theme; // Theme color
  const neonColor2 = "#ff00ff"; // Complementary neon for glow

  return (
    <Box
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{
        background: isPremium
          ? `linear-gradient(135deg, ${neonColor1}20, ${neonColor2}20)`
          : "#f5f5f5",
        p: 3,
      }}
    >
      {/* Logo Avatar */}
      <Avatar
        sx={{
          width: 120,
          height: 120,
          mb: 3,
          bgcolor: isPremium ? neonColor1 : theme,
          fontSize: 48,
          boxShadow: isPremium
            ? `0 0 20px ${neonColor1}, 0 0 40px ${neonColor2}`
            : "none",
        }}
      >
        {user.name[0].toUpperCase()}
      </Avatar>

      {/* User Name */}
      <Typography
        variant="h4"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: isPremium ? neonColor1 : "text.primary",
          animation: isPremium
            ? `${neonPulse(neonColor1, neonColor2)} 2s infinite`
            : "none",
          mb: 1,
        }}
      >
        {user.name}
      </Typography>

      {/* Email */}
      <Typography
        variant="h6"
        color={isPremium ? theme : "text.secondary"}
        gutterBottom
      >
        {user.email}
      </Typography>

      {/* Plan */}
      <Typography
        variant="h6"
        fontWeight="bold"
        gutterBottom
        sx={{
          color: isPremium ? neonColor2 : "text.primary",
          mb: 4,
        }}
      >
        Plan: {isPremium ? "Premium ✨" : "Free"}
      </Typography>

      {/* Upgrade button for free users */}
      {!isPremium && (
        <Button
          variant="contained"
          sx={{ mb: 2, background: theme, borderRadius: 2 }}
          onClick={() => navigate("/premium")}
        >
          Upgrade to Premium
        </Button>
      )}

      {/* Logout button */}
      <Button
        variant={isPremium ? "outlined" : "contained"}
        color="error"
        sx={{
          borderRadius: 2,
          border: isPremium ? `2px solid ${neonColor1}` : "none",
          color: isPremium ? neonColor1 : "#fff",
        }}
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }}
      >
        Logout
      </Button>
    </Box>
  );
};

export default AccountPage;
