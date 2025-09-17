// src/components/AiChatButton.jsx
import React, { useState, useEffect } from "react";
import { Fab } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import AiChatDialog from "../pages/AiChatDialog";

const AiChatButton = ({ isPremium, todosExist }) => {
  const [open, setOpen] = useState(false);

  // Auto-open chat if no todos
  useEffect(() => {
    if (!todosExist && isPremium) setOpen(true);
  }, [todosExist, isPremium]);

  if (!isPremium) return null;

  return (
    <>
      <Fab
        color="primary"
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",   // ensure it's fixed on viewport
          bottom: 100,         // above bottom nav
          right: 20,           // right side
          zIndex: 2000,        // above everything
          background: "var(--app-theme)",
          "&:hover": { opacity: 0.85 },
        }}
      >
        <ChatIcon />
      </Fab>

      <AiChatDialog
        open={open}
        onClose={() => setOpen(false)}
        isPremium={isPremium}
      />
    </>
  );
};

export default AiChatButton;
