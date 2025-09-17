import React, { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { adminLogin } from "../services/api";
import { toast } from "react-hot-toast";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [securityKey, setSecurityKey] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin({ email, password, securityKey });
      if (res.success) {
        localStorage.setItem("adminToken", res.token);
        toast.success("Welcome Admin!");
        navigate("/admin/dashboard");
      } else {
        toast.error(res.message || "Invalid credentials");
      }
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card sx={{ width: 400, p: 3, bgcolor: "background.paper", boxShadow: 3, borderRadius: 3 }}>
  <CardContent>
    <Typography variant="h5" gutterBottom align="center">
      Admin Login
    </Typography>
    <form onSubmit={handleSubmit}>
      <TextField
        label="Email"
        fullWidth
        margin="normal"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        variant="outlined"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <TextField
        label="Security Key"
        type="password"
        fullWidth
        margin="normal"
        variant="outlined"
        value={securityKey}
        onChange={(e) => setSecurityKey(e.target.value)}
      />
      <Button type="submit" variant="contained" fullWidth sx={{ mt: 2, bgcolor: "primary.main" }}>
        Login
      </Button>
    </form>
  </CardContent>
</Card>

    </div>
  );
}
