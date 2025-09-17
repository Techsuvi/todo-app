import React, { useState, useEffect } from "react";
import TodoForm from "./TodoForm";

const TodoApp = ({ user, token }) => {
  const [todos, setTodos] = useState([]);

  const addTodo = (newTodo) => setTodos((prev) => [newTodo, ...prev]);

  useEffect(() => {
    // Fetch todos from backend
    const fetchTodos = async () => {
      try {
        const res = await fetch("/api/todo", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setTodos(data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-8">
      <TodoForm user={user} token={token} addTodo={addTodo} />
      <ul className="mt-4">
        {todos.map((todo) => (
          <li key={todo._id} className="p-2 border-b flex justify-between">
            <span>
              {todo.text}{" "}
              {todo.isRecurring && (
                <span className="text-green-600">({todo.recurringInterval})</span>
              )}
              {todo.priority && <span className="ml-2 text-red-500">[{todo.priority}]</span>}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoApp;
