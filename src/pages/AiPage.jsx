// src/pages/AiPage.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Box,
  Paper,
  Snackbar,
  Alert,
  Avatar,
  IconButton,
  Dialog,
  AppBar,
  Toolbar,
  Slide,
  Fab,
  Divider,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import dayjs from "dayjs";
import { jsPDF } from "jspdf";
import { getAiTodos, saveAiTodos, getTodayTodos } from "../services/aiApi";
import { useTheme } from "../context/ThemeContext";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// A small CSS snippet for the typing indicator animation
const typingIndicatorStyles = `
  .typing-dots {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .typing-dots span {
    display: block;
    width: 6px;
    height: 6px;
    background-color: #999;
    border-radius: 50%;
    animation: bounce 1.4s infinite ease-in-out;
  }
  .typing-dots span:nth-of-type(2) {
    animation-delay: 0.2s;
  }
  .typing-dots span:nth-of-type(3) {
    animation-delay: 0.4s;
  }
  @keyframes bounce {
    0%, 80%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-5px);
    }
  }
`;

const AiPage = () => {
  const { theme } = useTheme();
  const [chat, setChat] = useState([]);
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, msg: "", severity: "success" });
  const [chatOpen, setChatOpen] = useState(false);
  const chatEndRef = useRef(null);

  // Inject the CSS into the document head
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = typingIndicatorStyles;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (e) {
    user = null;
  }
  const isPremium = user?.plan === "premium";

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, loading]);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const todayTodos = await getTodayTodos();
        if (todayTodos) setTodos(todayTodos);
        if ((!todayTodos || todayTodos.length === 0) && isPremium) {
          setChatOpen(true);
        }
      } catch (err) {
        console.error("Failed to fetch today's todos:", err);
        setSnackbar({ open: true, msg: "Failed to fetch today's todos.", severity: "error" });
      }
    };
    fetchTodos();
  }, [isPremium]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input, time: dayjs().format("h:mm A") };
    setChat((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await getAiTodos(input);
      const aiMessage = { role: "assistant", content: res.message, time: dayjs().format("h:mm A") };
      setChat((prev) => [...prev, aiMessage]);
      if (res.todos) setTodos(res.todos);
    } catch (err) {
      console.error("AI error:", err);
      setChat((prev) => [
        ...prev,
        { role: "assistant", content: "⚠️ AI is not available right now.", time: dayjs().format("h:mm A") },
      ]);
    }
    setLoading(false);
  };

  const handleSaveTodos = async () => {
    if (!todos.length) return;
    setLoading(true);
    try {
      const res = await saveAiTodos(todos);
      setTodos(res.todos);
      setSnackbar({ open: true, msg: "✅ Todos saved!", severity: "success" });
    } catch (err) {
      console.error("Save error:", err);
      setSnackbar({ open: true, msg: "❌ Failed to save todos", severity: "error" });
    }
    setLoading(false);
  };

  const handleDownloadPDF = () => {
    if (!todos.length) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let y = 55;
    const lineHeight = 8;
    const checkboxSize = 5;

    const drawBorder = () => {
      doc.setLineWidth(1.2);
      doc.setDrawColor(0, 0, 0);
      doc.rect(margin / 2, margin / 2, pageWidth - margin, pageHeight - margin);
    };

    drawBorder();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text("TASK FLOW", pageWidth / 2, 28, { align: "center" });

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${dayjs().format("DD MMM YYYY, h:mm A")}`, pageWidth / 2, 36, { align: "center" });

    doc.setFont("helvetica", "bold");
    doc.setFontSize(60);
    doc.setTextColor(220, 220, 220, 0.3);
    doc.text("TaskFlow", pageWidth / 2, pageHeight / 2, { align: "center", angle: 45 });

    const textMargin = margin + checkboxSize + 4;
    const textWidth = pageWidth - textMargin - margin;

    todos.forEach((todo, i) => {
      if (y > pageHeight - 60) {
        doc.addPage();
        y = 55;
        drawBorder();
      }

      if (i % 2 === 0) {
        doc.setFillColor(240, 248, 255);
        doc.rect(margin - 2, y - 6, pageWidth - 2 * margin + 4, lineHeight + 6, "F");
      }

      doc.setDrawColor(0);
      doc.setFillColor(255, 255, 255);
      doc.rect(margin, y - checkboxSize / 2, checkboxSize, checkboxSize, "FD");

      doc.setFontSize(12);
      doc.setTextColor(0);
      const splitText = doc.splitTextToSize(todo, textWidth);
      splitText.forEach((line, index) => {
        doc.text(line, textMargin, y + index * lineHeight);
      });

      y += splitText.length * lineHeight + 6;
    });

    doc.setFont("helvetica", "italic");
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("Generated by TaskFlow", pageWidth / 2, pageHeight - 14, { align: "center" });

    doc.save("AI_Todos.pdf");
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 6 }}>
      {/* Header with improved UI */}
      <Box
        sx={{
          textAlign: "center",
          my: 4,
          p: 3,
          background: "linear-gradient(135deg, #f0f4ff, #e9f0ff)",
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        }}
      >
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            background: "linear-gradient(45deg, #5b86e5 30%, #36d1dc 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          <span role="img" aria-label="robot">🤖</span> AI Assistant
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mt: 1 }}>
          Let AI organize your day smartly ✨
        </Typography>
      </Box>

      {/* Todos Card with improved UI */}
      {todos.length > 0 && (
        <Card sx={{ mb: 3, borderRadius: 3, boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}>
          <CardContent>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              📅 Your Todos for Today
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
              {todos.map((todo, i) => (
                <ListItem
                  key={i}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    bgcolor: i % 2 === 0 ? "grey.50" : "white",
                    transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                    },
                  }}
                >
                  <IconButton size="small" sx={{ mr: 1, color: "var(--app-theme)" }}>
                    <CheckCircleIcon />
                  </IconButton>
                  <ListItemText
                    primaryTypographyProps={{
                      sx: { fontSize: "0.95rem" },
                    }}
                    primary={todo}
                  />
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                variant="outlined"
                onClick={handleSaveTodos}
                sx={{ mt: 2, borderRadius: 2, borderColor: "var(--app-theme)", color: "var(--app-theme)" }}
                disabled={loading}
              >
                Save Todos
              </Button>
              <Button
                variant="contained"
                onClick={handleDownloadPDF}
                sx={{ mt: 2, borderRadius: 2, background: "var(--app-theme)" }}
                disabled={!todos.length}
              >
                📄 Download PDF
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Floating Chat Button */}
      {isPremium && (
        <Fab
          onClick={() => setChatOpen(true)}
          sx={{
            position: "fixed",
            bottom: 24,
            right: 24,
            background: "var(--app-theme)",
            color: "white",
            "&:hover": { opacity: 0.85 },
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      {/* Chat Dialog with improved UI */}
      <Dialog fullScreen open={chatOpen} onClose={() => setChatOpen(false)} TransitionComponent={Transition}>
        <AppBar sx={{ position: "relative", background: "var(--app-theme)" }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              💬 Chat with AI
            </Typography>
            <IconButton edge="end" color="inherit" onClick={() => setChatOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        {!isPremium ? (
          <Box sx={{ p: 4, textAlign: "center", mt: 8 }}>
            <Typography variant="h5" gutterBottom>
              🚀 Upgrade to Premium
            </Typography>
            <Typography color="text.secondary">
              Unlock unlimited AI chats and advanced productivity features by upgrading to Premium.
            </Typography>
          </Box>
        ) : (
          <Box
            sx={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              p: 2,
              background: "linear-gradient(135deg, #f0f4ff 0%, #fdfbfb 100%)",
            }}
          >
            {/* Chat Area */}
            <Box sx={{ flex: 1, overflowY: "auto", mb: 2, p: 2, borderRadius: 3 }}>
              {chat.map((msg, i) => (
                <Box
                  key={i}
                  className="fade-in"
                  sx={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
                    gap: 1,
                    mb: 1.5,
                  }}
                >
                  {msg.role === "assistant" && <Avatar sx={{ bgcolor: "var(--app-theme)" }}>AI</Avatar>}
                  <Paper
                    elevation={3}
                    sx={{
                      p: 1.5,
                      maxWidth: "80%",
                      borderRadius: msg.role === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background: msg.role === "user"
                        ? "linear-gradient(90deg, #36d1dc, #5b86e5)"
                        : "rgba(255, 255, 255, 0.9)",
                      color: msg.role === "user" ? "white" : "black",
                      backdropFilter: "blur(12px)",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                    }}
                  >
                    <Typography variant="body1">{msg.content}</Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        textAlign: msg.role === "user" ? "right" : "left",
                        opacity: 0.7,
                        mt: 0.5,
                      }}
                    >
                      {msg.time}
                    </Typography>
                  </Paper>
                  {msg.role === "user" && <Avatar sx={{ bgcolor: "primary.main" }}>U</Avatar>}
                </Box>
              ))}

              {/* Typing indicator */}
              {loading && (
                <Box sx={{ display: "flex", alignItems: "center", pl: 1 }}>
                  <Avatar sx={{ width: 24, height: 24, mr: 1 }}>🤖</Avatar>
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </Box>
              )}
              <div ref={chatEndRef} />
            </Box>

            {/* Input Area */}
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", borderTop: "1px solid #ddd", pt: 1 }}>
              <TextField
                fullWidth
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask AI to create your tasks..."
                disabled={loading}
                variant="outlined"
                size="medium"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 4,
                    "&:hover fieldset": {
                      borderColor: "var(--app-theme) !important",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--app-theme)",
                    },
                  },
                }}
              />
              <IconButton
                onClick={handleSend}
                disabled={loading}
                sx={{
                  background: "var(--app-theme)",
                  color: "white",
                  width: 56,
                  height: 56,
                  "&:hover": {
                    background: "var(--app-theme)",
                    opacity: 0.9,
                    transform: "scale(1.05)",
                    transition: "0.2s",
                  },
                }}
              >
                <SendIcon />
              </IconButton>
            </Box>
          </Box>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar((s) => ({ ...s, open: false }))}>
        <Alert severity={snackbar.severity}>{snackbar.msg}</Alert>
      </Snackbar>
    </Container>
  );
};

export default AiPage;