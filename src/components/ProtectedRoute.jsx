// src/components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setOpen(true);
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Login Required</DialogTitle>
        <DialogContent>
          You must login to access your To-Do List.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => navigate("/login")}>Go to Login</Button>
        </DialogActions>
      </Dialog>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;
