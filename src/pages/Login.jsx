// src/pages/Login.jsx
import React, { useState } from "react";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const floatingIcons = [
  { icon: "✅", top: "10%", left: "15%", delay: 0 },
  { icon: "📝", top: "20%", right: "10%", delay: 1 },
  { icon: "📅", bottom: "15%", left: "20%", delay: 2 },
  { icon: "⏳", bottom: "20%", right: "20%", delay: 3 },
  { icon: "📋", top: "35%", left: "45%", delay: 1.5 },
];

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width:900px)");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success(`Welcome back ${data.user.name}! 🎉`);
        navigate("/");
      } else {
        toast.error(data.message || "Login failed ❌");
      }
    } catch (err) {
      toast.error("Server error, try again later!");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #6EE7B7 0%, #3B82F6 100%)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Floating Background Todo Icons */}
      {floatingIcons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ y: 0, opacity: 0.1 }}
          animate={{ y: [0, -15, 0], opacity: 0.15 }}
          transition={{
            duration: 6,
            repeat: Infinity,
            delay: item.delay,
          }}
          style={{
            position: "absolute",
            fontSize: "3rem",
            top: item.top,
            bottom: item.bottom,
            left: item.left,
            right: item.right,
            zIndex: 0,
            pointerEvents: "none",
          }}
        >
          {item.icon}
        </motion.div>
      ))}

      <Container
        maxWidth="lg"
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          zIndex: 1, // keeps mascot + form above floating icons
        }}
      >
        {/* Left Side - Mascot / Illustration */}
        {!isMobile && (
          <motion.div
            initial={{ x: -80, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
            style={{
              flex: 1,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Box textAlign="center">
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3 }}
                style={{
                  fontSize: "7rem",
                }}
              >
                ✅
              </motion.div>
              <Typography
                variant="h4"
                fontWeight="bold"
                sx={{ mt: 2, color: "white" }}
              >
                Stay Organized, Stay Productive
              </Typography>
              <Typography variant="body1" sx={{ color: "white", opacity: 0.8 }}>
                Your tasks, simplified & powered by TaskFlow.
              </Typography>
            </Box>
          </motion.div>
        )}

        {/* Right Side - Login Form */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          style={{
            flex: 1,
            background: "rgba(255, 255, 255, 0.95)",
            padding: "2.5rem",
            borderRadius: "1.5rem",
            boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
          }}
        >
          <Box textAlign="center" mb={3}>
            <TaskAltIcon color="primary" sx={{ fontSize: 70 }} />
            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{
                mt: 1,
                background: "linear-gradient(45deg,#2563EB,#16A34A)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              TaskFlow
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Log in to manage your todos ✨
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              fullWidth
              variant="outlined"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleTogglePassword} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              sx={{
                mt: 1,
                py: 1.5,
                textTransform: "none",
                borderRadius: 2,
                fontWeight: "bold",
              }}
            >
              Login
            </Button>
            <Button
              variant="text"
              color="primary"
              fullWidth
              sx={{ mt: 1, textTransform: "none" }}
              onClick={() => navigate("/signup")}
            >
               Signup
            </Button>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Login;
