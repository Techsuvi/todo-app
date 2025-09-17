// src/pages/App.jsx

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Chip,
  InputAdornment,
} from "@mui/material";
import {
  AddCircle,
  Edit,
  Delete,
  ArrowUpward,
  Home,
  Info,
  Settings,
  CheckBoxOutlineBlank,
  CheckBox,
  TaskAlt,
} from "@mui/icons-material";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "./context/ThemeContext";

/* ---------------- Login Popup ---------------- */
const LoginPopup = ({ open, onClose }) => {
  const navigate = useNavigate();
  const goLogin = () => {
    onClose();
    navigate("/login");
  };
  const goSignup = () => {
    onClose();
    navigate("/signup");
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>🔐 Login Required</DialogTitle>
      <DialogContent>
        <Typography>Please login or signup to manage your tasks.</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={goLogin} variant="contained" color="primary">
          Login
        </Button>
        <Button onClick={goSignup} color="secondary">
          Signup
        </Button>
      </DialogActions>
    </Dialog>
  );
};

/* ---------------- Premium Popup ---------------- */
const PremiumPopup = ({ open, onClose, onUpgrade }) => {
  const { theme } = useTheme();
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>🌟 Upgrade to Premium</DialogTitle>
      <DialogContent>
        <Typography>
          Unlock unlimited tasks, cloud sync, and extra themes. You can dismiss
          this and continue using the free tier.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Maybe Later</Button>
        <Button
          variant="contained"
          sx={{ background: theme }}
          onClick={() => {
            onUpgrade?.();
          }}
        >
          Upgrade
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const App = () => {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [showScroll, setShowScroll] = useState(false);

  // Edit dialog states
  const [openEdit, setOpenEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Popup states
  const [loginPopup, setLoginPopup] = useState(false);
  const [premiumPopup, setPremiumPopup] = useState(false);

  // Bottom nav
  const [navValue, setNavValue] = useState("home");

  const navigate = useNavigate();
  const { theme, secondaryColor } = useTheme(); // Import secondaryColor
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  /* ---------------- API Calls ---------------- */
  const API_BASE = "http://localhost:5000/api/todos";

  const fetchTodos = async () => {
    if (!token) return;
    try {
      const res = await axios.get(API_BASE, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTodos(res.data);
    } catch (err) {
      console.error("❌ Fetch todos error:", err);
      toast.error("Failed to fetch todos ❌");
    }
  };

  const addTodoApi = async (text) => {
    if (!token) return;
    try {
      const res = await axios.post(
        API_BASE,
        { text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      console.error("❌ Add todo error:", err);
      toast.error("Failed to add todo ❌");
    }
  };

  const updateTodoApi = async (id, data) => {
    if (!token) return;
    try {
      const res = await axios.put(`${API_BASE}/${id}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (err) {
      console.error("❌ Update todo error:", err);
      toast.error("Failed to update todo ❌");
    }
  };

  const deleteTodoApi = async (id) => {
    if (!token) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (err) {
      console.error("❌ Delete todo error:", err);
      toast.error("Failed to delete todo ❌");
    }
  };

  /* ---------------- Load todos on mount ---------------- */
  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  /* ---------------- Handlers ---------------- */
  const handleAdd = async () => {
    if (!token) return setLoginPopup(true);
    if (!todo.trim()) return toast.error("Task cannot be empty!");
    const newTodo = await addTodoApi(todo);
    if (newTodo) {
      setTodos([...todos, newTodo]);
      setTodo("");
      toast.success("Task added ✅");
    }
  };

  const handleDelete = async (id) => {
    if (!token) return setLoginPopup(true);
    await deleteTodoApi(id);
    setTodos(todos.filter((t) => t._id !== id));
    toast.success("Task deleted 🗑");
  };

  const handleEditOpen = (index) => {
    if (!token) return setLoginPopup(true);
    setEditIndex(index);
    setEditValue(todos[index].text);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editValue.trim()) return toast.error("Task cannot be empty!");
    const todoId = todos[editIndex]._id;
    const updatedTodo = await updateTodoApi(todoId, { text: editValue });
    if (updatedTodo) {
      const updated = [...todos];
      updated[editIndex] = updatedTodo;
      setTodos(updated);
      setOpenEdit(false);
      toast.success("Task updated ✏");
    }
  };

  const toggleComplete = async (index) => {
    if (!token) return setLoginPopup(true);
    const todoItem = todos[index];
    const updatedTodo = await updateTodoApi(todoItem._id, {
      completed: !todoItem.completed,
    });
    if (updatedTodo) {
      const updated = [...todos];
      updated[index] = updatedTodo;
      setTodos(updated);
      toast.success(
        updatedTodo.completed ? "Task completed 🎉" : "Marked incomplete ❌"
      );
    }
  };

  const handleUpgrade = () => {
    if (!user) return;
    user.plan = "premium";
    localStorage.setItem("user", JSON.stringify(user));
    toast.success("Upgraded to Premium 🎉");
    setPremiumPopup(false);
  };

  const handleDismissPremium = () => {
    setPremiumPopup(false);
    localStorage.setItem("premiumDismissed", "true");
  };

  const quickLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out");
    navigate("/login");
  };

  useEffect(() => {
    const handleScroll = () => setShowScroll(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  /* ---------------- UI ---------------- */
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Toaster position="top-center" />

      {/* Header */}
      <AppBar position="static" sx={{ background: theme }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h6">📝 TaskFlow</Typography>
            {user?.plan === "premium" && (
              <Chip
                label="⭐ Premium"
                size="small"
                sx={{ backgroundColor: secondaryColor, color: "white" }}
              />
            )}
          </Box>
          <Box>
            {token ? (
              <Button color="inherit" onClick={quickLogout}>
                Logout
              </Button>
            ) : (
              <Button color="inherit" onClick={() => navigate("/login")}>
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Main */}
      <Container sx={{ flex: 1, py: 4, pb: 10 }}>
        {/* Add Todo */}
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <TextField
                fullWidth
                label="Enter a task"
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <TaskAlt />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                sx={{ background: theme }}
                onClick={handleAdd}
                
              >
                Add
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Todo List */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Your Tasks
            </Typography>
            {todos.length === 0 ? (
              <Box
                textAlign="center"
                py={4}
                sx={{
                  color: "text.secondary",
                  border: "2px dashed",
                  borderColor: "divider",
                  borderRadius: 2,
                }}
              >
                <TaskAlt sx={{ fontSize: 40, mb: 1, color: "text.disabled" }} />
                <Typography>No tasks yet. Add one above.</Typography>
              </Box>
            ) : (
              <List>
                {todos.map((t, index) => (
                  <ListItem
                    key={t._id}
                    secondaryAction={
                      <Box>
                        <IconButton
                          onClick={() => handleEditOpen(index)}
                          color="warning"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(t._id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    }
                  >
                    <Checkbox
                      checked={t.completed}
                      onChange={() => toggleComplete(index)}
                      icon={<CheckBoxOutlineBlank />}
                      checkedIcon={<CheckBox />}
                      sx={{
                        "&.Mui-checked": {
                          color: secondaryColor, // Use secondaryColor for the icon
                        },
                      }}
                    />
                    <ListItemText
                      primary={t.text}
                      sx={{
                        textDecoration: t.completed ? "line-through" : "none",
                        color: t.completed ? "text.secondary" : "text.primary",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Premium Section */}
        {user?.plan === "premium" && (
          <Card sx={{ mt: 3 }}>
            <CardContent>
              <Typography variant="h6">🌟 Premium Dashboard</Typography>
              <Typography variant="body2" color="text.secondary">
                Welcome Premium user! Analytics, reminders & extra themes appear here.
              </Typography>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Footer */}
      <Box sx={{ position: "fixed", bottom: 0, left: 0, right: 0 }}>
        <BottomNavigation
          value={navValue}
          onChange={(e, newValue) => {
            setNavValue(newValue);
            navigate(newValue === "home" ? "/" : `/${newValue}`);
          }}
          showLabels
        >
          <BottomNavigationAction label="Home" value="home" icon={<Home />} />
          <BottomNavigationAction label="About" value="about" icon={<Info />} />
          <BottomNavigationAction
            label="Settings"
            value="settings"
            icon={<Settings />}
          />
        </BottomNavigation>
      </Box>

      {/* Scroll to Top */}
      {showScroll && (
        <Fab
          sx={{
            background: theme,
            position: "fixed",
            bottom: 80,
            right: 20,
          }}
          onClick={scrollToTop}
        >
          <ArrowUpward />
        </Fab>
      )}

      {/* Edit Todo Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Task</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            margin="dense"
            label="Update task"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)} >Cancel</Button>
          <Button
            onClick={handleEditSave}
            variant="contained"
            sx={{ background: theme }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Popups */}
      <LoginPopup open={loginPopup} onClose={() => setLoginPopup(false)} />
      <PremiumPopup
        open={premiumPopup}
        onClose={handleDismissPremium}
        onUpgrade={handleUpgrade}
      />
    </Box>
  );
};

export default App;