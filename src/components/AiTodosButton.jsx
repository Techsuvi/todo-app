import React, { useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import toast from "react-hot-toast";
import { generateAiTodos } from "../services/aiApi";

const AiTodosButton = ({ topic, days, onNewTodos }) => {
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic) {
      toast.error("Please select a topic first!");
      return;
    }

    setLoading(true);
    try {
      const todos = await generateAiTodos(topic, days);
      if (todos.length > 0) {
        onNewTodos(todos);
        toast.success("AI todos generated ✅");
      } else {
        toast.error("No todos returned from AI");
      }
    } catch (err) {
      console.error("❌ generate AI todos:", err);
      toast.error("Failed to generate AI todos ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="contained"
      color="primary"
      onClick={handleGenerate}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} color="inherit" /> : "Generate AI Todos"}
    </Button>
  );
};

export default AiTodosButton;
