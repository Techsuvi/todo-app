import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Typography,
} from "@mui/material";
import { getAllTodos, deleteAnyTodo } from "../../services/api";

const TodosPage = () => {
  const [todos, setTodos] = useState([]);

  // ✅ Fetch all todos (admin)
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const data = await getAllTodos();
        setTodos(data.todos || data); // handle both {todos: []} and []
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };
    fetchTodos();
  }, []);

  // ✅ Delete todo
  const handleDelete = async (id) => {
    try {
      await deleteAnyTodo(id);
      setTodos((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <TableContainer component={Paper}>
      <Typography variant="h5" p={2}>
        Todos Management
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>User</TableCell>
            <TableCell>Text</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="center">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo._id}>
              <TableCell>{todo.user?.email || "Unknown"}</TableCell>
              <TableCell>{todo.text}</TableCell>
              <TableCell>{todo.completed ? "✅ Done" : "⏳ Pending"}</TableCell>
              <TableCell align="center">
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleDelete(todo._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TodosPage;
