import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

const LoginPopup = ({ open, onClose }) => {
  const navigate = useNavigate();

  const handleLogin = () => {
    onClose();
    navigate("/login");
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>🔒 Login Required</DialogTitle>
      <DialogContent>
        <Typography>
          You must be logged in to perform this action. Please log in or sign up to continue.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" color="primary" onClick={handleLogin}>
          Go to Login
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LoginPopup;
